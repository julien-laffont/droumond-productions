// The Sobre section of the home page: small text on the left, one frame enlarged on a piece of film
// on the right, in one column below 960 px. Its text comes from src/content/about/.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'sobre',
		heading: 'Sobre',
		text: 'A Droumond Productions é uma produtora audiovisual de Leiria, fundada em 2026.',
		alt: 'Um homem de casaco escuro, sentado à porta de um prédio antigo, numa rua de calçada, ao lado de uma mota.',
		caption: ['Fot. 27', 'Leiria'],
	},
	{
		path: '/en/',
		english: true,
		anchor: 'about',
		heading: 'About',
		text: 'Droumond Productions is an audiovisual production company based in Leiria, founded in 2026.',
		alt: 'A man in a dark coat, sitting in the doorway of an old building on a cobbled street, next to a motorbike.',
		caption: ['Frame 27', 'Leiria'],
	},
];

/** The amber of the edge codes (#e8a43a). */
const AMBER = 'rgb(232, 164, 58)';

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Sobre shows its title, the text with the Projects named, and the image`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			await expect(section.getByRole('heading', { level: 2 })).toHaveText(home.heading);
			await expect(section.getByText(home.text)).toBeVisible();
			// The Projects' names in amber, upright.
			const names = section.locator('em');
			await expect(names).toHaveText(['Efecto Placebo', 'Resident Evil']);
			for (const name of await names.all()) {
				await expect(name).toHaveCSS('color', AMBER);
				await expect(name).toHaveCSS('font-style', 'normal');
			}

			const image = section.getByRole('img', { name: home.alt, exact: true });
			await expect(image).toBeVisible();
			const src = await image.evaluate((img: HTMLImageElement) => img.src);
			expect(new URL(src).origin).toBe(baseURL);
			expect(((await image.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
		});

		test(`${home.path}: Sobre's frame has its edge codes and caption, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const figure = page.locator(`section#${home.anchor} figure`);
			const codes = [
				figure.getByText('Droumond 2026 ▸ 27', { exact: true }),
				figure.getByText('27A', { exact: true }),
				...home.caption.map((text) => figure.getByText(text, { exact: true })),
			];
			for (const code of codes) {
				await expect(code).toBeVisible();
				expect(await code.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
			}
		});
	}
});

/** Opens the Portuguese home page and gives the boxes of the Sobre text, figure and image. */
async function openAboutBoxes(page: Page) {
	await page.goto('/');
	const section = page.locator('section#sobre');
	const text = await section.locator('p').first().boundingBox();
	const figure = await section.locator('figure').boundingBox();
	const image = await section.getByRole('img').boundingBox();
	if (!text || !figure || !image) throw new Error('The Sobre text or frame is not displayed');
	const width = page.viewportSize()?.width ?? 0;
	return { text, figure, image, width };
}

inEachBuild(() => {
	test.describe('on a desktop (1440 px)', () => {
		test.use({ viewport: { width: 1440, height: 900 } });

		test('/: the text on the left, the frame on the right, in 1 : 1.7, the photo in 16:9 on film', async ({
			page,
		}) => {
			const { text, figure, image, width } = await openAboutBoxes(page);
			expect(figure.x).toBeGreaterThan(text.x + text.width);
			// 40 px margins and a 72 px gap: the frame takes 1.7 parts of the rest.
			expect(figure.width).toBeCloseTo(((width - 80 - 72) * 1.7) / 2.7, 0);
			// The film: 12 px on each side of the photo, the band of sprocket holes above it.
			expect(image.width).toBeCloseTo(figure.width - 24, 0);
			expect(image.y - figure.y).toBeCloseTo(38, 0);
			expect(image.width / image.height).toBeCloseTo(16 / 9, 1);
		});
	});

	for (const screen of [
		{ name: 'tablet', width: 900, height: 1000 },
		{ name: 'phone', width: 390, height: 844 },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			test('/: one column, the text above the frame, the photo in 16:9', async ({ page }) => {
				const { text, figure, image } = await openAboutBoxes(page);
				expect(figure.y).toBeGreaterThan(text.y + text.height);
				expect(figure.x).toBeCloseTo(text.x, 0);
				expect(image.width / image.height).toBeCloseTo(16 / 9, 1);
			});
		});
	}
});
