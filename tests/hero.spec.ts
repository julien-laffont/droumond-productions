// The first screen of the home page, as in Película (#36): a decorative code line, the name as
// the only h1, "Produtora audiovisual", the words (decorative) and the cue to Projects. The running
// strip and the title in Shree Devanagari 714 come with #37. Also the home page's description, for
// search engines (#18).
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild, pagesOf } from './pages';

/** What the first screen shows in each language. Its English texts are provisional until #37; the
 * description is reviewed (#18). */
const HOMES = [
	{
		path: '/',
		english: false,
		code: '35 mm · Droumond 2026 · Leiria · Rolo 01',
		words: 'Séries · Suspense · Terror · Filmagens',
		cue: { name: 'Projetos', href: '#projetos' },
		description:
			'Droumond Productions, produtora audiovisual de Leiria: séries de ficção, publicidade, vídeos para marcas e videoclipes.',
		snapshot: `
			- region "Droumond Productions":
			  - heading "Droumond Productions" [level=1]
			  - paragraph: Produtora audiovisual
			  - link "Projetos"
		`,
	},
	{
		path: '/en/',
		english: true,
		code: '35 mm · Droumond 2026 · Leiria · Reel 01',
		words: 'Series · Thriller · Horror · Filming',
		cue: { name: 'Projects', href: '#projects' },
		description:
			'Droumond Productions, an audiovisual production company based in Leiria: fiction series, commercials, brand videos and music videos.',
		snapshot: `
			- region "Droumond Productions":
			  - heading "Droumond Productions" [level=1]
			  - paragraph: Audiovisual production company
			  - link "Projects"
		`,
	},
];

const SCREENS = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 },
];

// Exact: the filming band's title also holds the name ("Quer a Droumond Productions para gravação?").
const firstScreen = (page: Page) =>
	page.getByRole('region', { name: 'Droumond Productions', exact: true });

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: the first screen shows the name as the only h1, the line and the cue`, async ({
			page,
		}) => {
			await page.goto(home.path);
			await expect(firstScreen(page)).toMatchAriaSnapshot(home.snapshot);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
		});

		test(`${home.path}: the code line and the words show, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			for (const text of [home.code, home.words]) {
				const line = firstScreen(page).getByText(text, { exact: true });
				await expect(line).toBeVisible();
				expect(await line.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
			}
		});

		test(`${home.path}: the page's description says what the company is and makes`, async ({
			page,
		}) => {
			await page.goto(home.path);
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				'content',
				home.description,
			);
		});

		// Carlos's request (#37): the name lets the background show through a little, at 85 %.
		test(`${home.path}: the title is slightly transparent`, async ({ page }) => {
			await page.goto(home.path);
			const color = await page
				.getByRole('heading', { level: 1 })
				.evaluate((h1) => getComputedStyle(h1).color);
			// The alpha is the last number of rgba(…, 0.85), oklab(… / 0.85) or color(srgb … / 0.85);
			// a colour without one is opaque.
			const alpha = /^rgba|\//.test(color) ? Number(color.match(/([\d.]+)\)$/)?.[1]) : 1;
			expect(alpha, color).toBeCloseTo(0.85, 2);
		});

		test(`${home.path}: the cue leads to Projects`, async ({ page }) => {
			await page.goto(home.path);
			const cue = firstScreen(page).getByRole('link', { name: home.cue.name });
			await expect(cue).toHaveAttribute('href', home.cue.href);
			await cue.click();
			await expect(page.locator(home.cue.href)).toBeInViewport();
		});

		test(`${home.path}: no background video any more, so none is requested`, async ({ page }) => {
			const videos: string[] = [];
			page.on('request', (request) => {
				if (request.resourceType() === 'media' || request.url().endsWith('.mp4')) {
					videos.push(request.url());
				}
			});
			await page.goto(home.path, { waitUntil: 'networkidle' });
			await expect(page.locator('video')).toHaveCount(0);
			expect(videos).toEqual([]);
		});

		for (const screen of SCREENS) {
			test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
				test.use({ viewport: { width: screen.width, height: screen.height } });

				test(`${home.path}: the first screen fits the screen, under the header`, async ({
					page,
				}) => {
					await page.goto(home.path);
					const section = await firstScreen(page).boundingBox();
					expect(section!.y + section!.height).toBeLessThanOrEqual(screen.height);
				});
			});
		}
	}

	test('the first screen only exists on the home page', async ({ page }) => {
		for (const path of pagesOf(build).filter((p) => p !== '/' && p !== '/en/')) {
			await page.goto(path);
			await expect(firstScreen(page), path).toHaveCount(0);
		}
	});
});
