// The Sobre section of the home page (#15): small text on the left, a wide image on the right (the
// Projects grid in reverse), in one column below 960 px. Its text comes from src/content/about/.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. The texts are provisional (#18). */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'sobre',
		heading: 'Sobre',
		text: 'A Droumond Productions é uma produtora audiovisual portuguesa.',
		alt: 'Um homem de casaco escuro, sentado à porta de um prédio antigo, numa rua de calçada, ao lado de uma mota.',
	},
	{
		path: '/en/',
		english: true,
		anchor: 'about',
		heading: 'About',
		text: 'Droumond Productions is a Portuguese audiovisual production company.',
		alt: 'A man in a dark coat, sitting in the doorway of an old building on a cobbled street, next to a motorbike.',
	},
];

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Sobre shows its title, the text with the series named, and the image`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			await expect(section.getByRole('heading', { level: 2 })).toHaveText(home.heading);
			await expect(section.getByText(home.text)).toBeVisible();
			await expect(section.locator('em')).toHaveText('Efeito Placebo');

			const image = section.getByRole('img', { name: home.alt, exact: true });
			await expect(image).toBeVisible();
			const src = await image.evaluate((img: HTMLImageElement) => img.src);
			expect(new URL(src).origin).toBe(baseURL);
			expect(((await image.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
		});
	}
});

/** Opens the Portuguese home page and gives the boxes of the Sobre text and image. */
async function openAboutBoxes(page: Page) {
	await page.goto('/');
	const section = page.locator('section#sobre');
	const text = await section.locator('p').first().boundingBox();
	const image = await section.getByRole('img').boundingBox();
	if (!text || !image) throw new Error('The Sobre text or image is not displayed');
	const width = page.viewportSize()?.width ?? 0;
	return { text, image, width };
}

inEachBuild(() => {
	test.describe('on a desktop (1440 px)', () => {
		test.use({ viewport: { width: 1440, height: 900 } });

		test('/: the text on the left, the image on the right in 16:9, two thirds of the row', async ({
			page,
		}) => {
			const { text, image, width } = await openAboutBoxes(page);
			expect(image.x).toBeGreaterThan(text.x + text.width);
			expect(image.width / image.height).toBeCloseTo(16 / 9, 1);
			// 40 px margins and a 20 px gap: the image takes two thirds of the rest.
			expect(image.width).toBeCloseTo(((width - 80 - 20) * 2) / 3, 0);
		});
	});

	for (const screen of [
		{ name: 'tablet', width: 900, height: 1000 },
		{ name: 'phone', width: 390, height: 844 },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			test('/: one column, the text above the image, the image in 16:9', async ({ page }) => {
				const { text, image } = await openAboutBoxes(page);
				expect(image.y).toBeGreaterThan(text.y + text.height);
				expect(image.x).toBeCloseTo(text.x, 0);
				expect(image.width / image.height).toBeCloseTo(16 / 9, 1);
			});
		});
	}
});
