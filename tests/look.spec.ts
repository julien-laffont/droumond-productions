// The Película base (#36), on every page of both builds: one dark world, names in Big Shoulders
// Display and the rest in Space Mono, both hosted on the site itself. Nothing of the old visual
// (#12) stays: no Archivo, no light canvas, no brush stroke.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild, pagesOf } from './pages';

/** The page's background (#0c0b09), as browsers report it. */
const BACKGROUND = 'rgb(12, 11, 9)';
/** The old light canvas (#dbcdc6), which no element may paint any more. */
const OLD_CANVAS = 'rgb(219, 205, 198)';

/** The WCAG contrast ratio of two colours given as `rgb(r, g, b)`. */
function contrast(a: string, b: string) {
	const luminance = (color: string) => {
		const [r, g, b] = color
			.match(/\d+(\.\d+)?/g)!
			.slice(0, 3)
			.map((v) => {
				const c = Number(v) / 255;
				return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
			});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (high + 0.05) / (low + 0.05);
}

/** Everything the old visual left in the page: Archivo, the canvas colour, the brush stroke. */
async function oldVisual(page: Page) {
	return page.evaluate((canvas) => {
		const found = new Set<string>();
		for (const element of document.querySelectorAll('*')) {
			for (const pseudo of [null, '::before', '::after']) {
				const style = getComputedStyle(element, pseudo);
				const where = `${element.tagName.toLowerCase()}${pseudo ?? ''}`;
				if (style.fontFamily.includes('Archivo')) found.add(`Archivo on ${where}`);
				if (style.backgroundColor === canvas || style.backgroundImage.includes(canvas)) {
					found.add(`canvas on ${where}`);
				}
				const mask = `${style.maskImage} ${style.getPropertyValue('-webkit-mask-image')}`;
				if (mask.includes('brush')) found.add(`brush stroke on ${where}`);
			}
		}
		return [...found];
	}, OLD_CANVAS);
}

inEachBuild((build) => {
	for (const path of pagesOf(build)) {
		test(`${path}: one dark world, with the text at 16:1 and the secondary text at 7.3:1`, async ({
			page,
		}) => {
			await page.goto(path);
			const colors = await page.evaluate(() => {
				const footer = document.querySelector('footer')!;
				return {
					background: getComputedStyle(document.body).backgroundColor,
					text: getComputedStyle(document.body).color,
					secondary: getComputedStyle(footer).color,
				};
			});
			expect(colors.background).toBe(BACKGROUND);
			// The ratios of the prototype, rounded as it states them.
			expect(contrast(colors.text, colors.background)).toBeCloseTo(16, 0);
			expect(contrast(colors.secondary, colors.background)).toBeCloseTo(7.3, 1);
		});

		test(`${path}: names in Big Shoulders Display, the rest in Space Mono, nothing of the old visual`, async ({
			page,
		}) => {
			await page.goto(path);
			const fonts = await page.evaluate(() => ({
				body: getComputedStyle(document.body).fontFamily,
				title: getComputedStyle(document.querySelector('h1')!).fontFamily,
			}));
			// Astro adds a suffix to each family's name, so only the start is fixed.
			expect(fonts.body).toMatch(/^"?Space Mono/);
			// The home page draws its name as SVG instead (hero.spec.ts).
			if (path !== '/' && path !== '/en/') {
				expect(fonts.title).toMatch(/^"?Big Shoulders Display/);
			}
			expect(await oldVisual(page)).toEqual([]);
		});

		test(`${path}: the fonts come from the site, in woff2, and nothing from another domain`, async ({
			page,
			baseURL,
		}) => {
			const elsewhere: string[] = [];
			const fonts: string[] = [];
			page.on('request', (request) => {
				const url = new URL(request.url());
				if (url.origin !== baseURL) elsewhere.push(request.url());
				else if (request.resourceType() === 'font') fonts.push(url.pathname);
			});
			await page.goto(path, { waitUntil: 'networkidle' });
			expect(elsewhere).toEqual([]);
			expect(fonts.length).toBeGreaterThanOrEqual(2);
			for (const font of fonts) expect(font).toMatch(/\.woff2$/);
		});
	}
});
