// The Filming service (#16): the band on the home page, right before Contacto, and the page it
// leads to. The texts are Julien's and Nal's, in both languages (#18). Both sit on a
// clapperboard, whose fields are decorative.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { openExisting } from './pages';

const FILMING = [
	{
		home: '/',
		page: '/filmagens/',
		contact: 'contacto',
		instagram: 'Veja o nosso trabalho no Instagram',
		label: 'Serviço de filmagens',
		title: 'Quer a Droumond Productions para gravação?',
		line: 'Publicidade, vídeos para marcas e videoclipes, filmados com a equipa e o material das nossas séries.',
		button: 'Ver o serviço',
		text: 'Filmamos publicidade, vídeos para marcas e videoclipes na região de Leiria, com a equipa e o material com que fazemos as nossas séries. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		pageTitle: 'Serviço de filmagens · Droumond Productions',
		description:
			'Serviço de filmagens da Droumond Productions em Leiria: publicidade, vídeos para marcas e videoclipes.',
		fields: [
			['Prod.', 'Droumond Productions'],
			['Cena', '01'],
			['Take', '01'],
			['Data', '26.02.2026'],
		],
	},
	{
		home: '/en/',
		page: '/en/filming/',
		contact: 'contact',
		instagram: 'See our work on Instagram',
		label: 'Filming service',
		title: 'Want Droumond Productions on your shoot?',
		line: 'Commercials, brand videos and music videos, shot with the same crew and equipment as our series.',
		button: 'About the service',
		text: 'We shoot commercials, brand videos and music videos in the Leiria region, with the same crew and equipment we use for our series. Tell us what you want to film, where and when, and we will tell you what we can do.',
		pageTitle: 'Filming service · Droumond Productions',
		description:
			"Droumond Productions' filming service in Leiria: commercials, brand videos and music videos.",
		fields: [
			['Prod.', 'Droumond Productions'],
			['Scene', '01'],
			['Take', '01'],
			['Date', '26.02.2026'],
		],
	},
];

/** The text a visitor reads in a block, in order, whatever its case and line breaks. */
const readText = async (block: Locator) =>
	(await block.innerText()).replace(/\s+/g, ' ').toLowerCase();

/** The filming band of the Portuguese home page. */
const filmingBand = (page: Page) =>
	page.getByRole('region', { name: FILMING[0].title, exact: true });

/** The top of the filming page: the clapperboard. */
const pageTop = (page: Page) => page.getByRole('main').locator(':scope > :first-child');

/** The length, in milliseconds, of each animation running on the clapperboard's arm. */
const armAnimationDurations = (block: Locator) =>
	block
		.locator('.arm')
		.evaluate((arm) =>
			arm.getAnimations().map((animation) => animation.effect!.getTiming().duration),
		);

/** The clapperboard's fields show each label with its value, and screen readers skip them. */
async function expectSlateFields(slate: Locator, fields: string[][]) {
	expect(await readText(slate)).toContain(fields.flat().join(' ').toLowerCase());
	for (const text of fields.flat()) {
		const field = slate.getByText(text, { exact: true }).first();
		await expect(field).toBeVisible();
		expect(await field.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
	}
}

for (const expected of FILMING) {
	test(`${expected.home}: the filming band, right before Contacto, leads to the filming page`, async ({
		page,
	}) => {
		await openExisting(page, expected.home);
		const band = page.getByRole('region', { name: expected.title, exact: true });
		await expect(band).toContainText(expected.label);
		await expect(band).toContainText(expected.line);
		await expect(band.getByRole('link', { name: expected.button, exact: true })).toHaveAttribute(
			'href',
			expected.page,
		);
		expect(await band.evaluate((section) => section.nextElementSibling?.id)).toBe(expected.contact);
		await band.getByRole('link', { name: expected.button, exact: true }).click();
		await expect(page).toHaveURL((url) => url.pathname === expected.page);
	});

	test(`${expected.home}: the filming band's clapperboard has its decorative fields`, async ({
		page,
	}) => {
		await openExisting(page, expected.home);
		await expectSlateFields(
			page.getByRole('region', { name: expected.title, exact: true }),
			expected.fields,
		);
	});

	test(`${expected.page}: the label, Julien's sentence as the title, the short text, then Contacto`, async ({
		page,
	}) => {
		await openExisting(page, expected.page);
		await expect(page).toHaveTitle(expected.pageTitle);
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			expected.description,
		);
		const main = page.getByRole('main');
		await expect(main).toContainText(expected.label);
		await expect(main.getByRole('heading', { level: 1 })).toHaveText(expected.title);
		await expect(main).toContainText(expected.text);
		await expect(main.locator(':scope > :last-child')).toHaveAttribute('id', expected.contact);
	});

	test(`${expected.page}: a clapperboard opens the page, with the label, the title, the text, the Instagram link and its fields`, async ({
		page,
	}) => {
		await openExisting(page, expected.page);
		const top = pageTop(page);
		await expect(top.getByRole('heading', { level: 1 })).toHaveText(expected.title);
		expect(await readText(top)).toContain(
			[
				expected.label,
				expected.title,
				expected.text,
				`${expected.instagram} ↗`,
				...expected.fields.flat(),
			]
				.join(' ')
				.toLowerCase(),
		);
		await expectSlateFields(top, expected.fields);
	});
}

test('/: the clapperboard claps in 0.5 s on hover, and when its button gets the focus', async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await openExisting(page, '/');
	const band = filmingBand(page);
	expect(await armAnimationDurations(band)).toEqual([]);

	await band.getByRole('heading').hover();
	expect(await armAnimationDurations(band)).toEqual([500]);

	await page.mouse.move(0, 0);
	expect(await armAnimationDurations(band)).toEqual([]);
	await band.getByRole('link').focus();
	expect(await armAnimationDurations(band)).toEqual([500]);
});

test('/filmagens/: the clapperboard claps in 0.5 s on hover', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await openExisting(page, '/filmagens/');
	const top = pageTop(page);
	await top.getByRole('heading', { level: 1 }).hover();
	expect(await armAnimationDurations(top)).toEqual([500]);
});

test('/: with less motion, the clapperboard never claps', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await openExisting(page, '/');
	const band = filmingBand(page);
	await band.getByRole('heading').hover();
	expect(await armAnimationDurations(band)).toEqual([]);
	await band.getByRole('link').focus();
	expect(await armAnimationDurations(band)).toEqual([]);
});

// The open arm rises with the clapperboard's width: on any screen it stays under the band's
// line (home page) and under the header (filming page), with a gap.
for (const width of [390, 768, 1024, 1440]) {
	test.describe(`on a ${width} px screen`, () => {
		test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });

		test("/: the open arm stays under the band's line", async ({ page }) => {
			await openExisting(page, '/');
			const band = filmingBand(page);
			await band.scrollIntoViewIfNeeded();
			const line = (await band.boundingBox())!.y;
			const arm = (await band.locator('.arm').boundingBox())!.y;
			expect(arm - line).toBeGreaterThanOrEqual(4);
		});

		test('/filmagens/: the open arm stays under the header', async ({ page }) => {
			await openExisting(page, '/filmagens/');
			const header = (await page.getByRole('banner').boundingBox())!;
			const arm = (await pageTop(page).locator('.arm').boundingBox())!.y;
			expect(arm - (header.y + header.height)).toBeGreaterThanOrEqual(4);
		});
	});
}
