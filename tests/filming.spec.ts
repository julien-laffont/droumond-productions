// The Filming service (#16): the band on the home page, right before Contacto, and the page it
// leads to. Both sit on a clapperboard, whose fields are decorative.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { openExisting } from './pages';

/** The example on the filming page: Blanco y Negro, Carlos Droumond's music video. */
const EXAMPLE = {
	link: 'Blanco y Negro',
	url: 'https://www.youtube.com/watch?v=7VFBRzF9ni8',
	codes: ['▸ 01 · Blanco y Negro', '01A'],
};

const FILMING = [
	{
		home: '/',
		page: '/filmagens/',
		contact: 'contacto',
		label: 'Serviço de filmagens',
		title: 'Quer a Droumond Productions para gravação?',
		line: 'Vídeos para artistas e projetos de cinema, filmados com a equipa e o material das nossas séries.',
		button: 'Ver o serviço',
		text: 'Filmamos videoclipes e outros vídeos para artistas, e projetos de cinema, na região de Leiria, com a equipa e o material com que fazemos as nossas séries. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		pageTitle: 'Serviço de filmagens · Droumond Productions',
		description:
			'Serviço de filmagens da Droumond Productions em Leiria: vídeos para artistas e projetos de cinema.',
		fields: [
			['Prod.', 'Droumond Productions'],
			['Cena', '01'],
			['Take', '01'],
			['Data', '26.02.2026'],
		],
		example: {
			title: 'Exemplo',
			note: 'Videoclipe do Carlos Droumond. Abre no YouTube, num separador novo.',
		},
	},
	{
		home: '/en/',
		page: '/en/filming/',
		contact: 'contact',
		label: 'Filming service',
		title: 'Want Droumond Productions on your shoot?',
		line: 'Videos for artists and film projects, shot with the same crew and equipment as our series.',
		button: 'About the service',
		text: 'We shoot music videos and other videos for artists, and film projects, in the Leiria region, with the same crew and equipment we use for our series. Tell us what you want to film, where and when, and we will tell you what we can do.',
		pageTitle: 'Filming service · Droumond Productions',
		description:
			"Droumond Productions' filming service in Leiria: videos for artists and film projects.",
		fields: [
			['Prod.', 'Droumond Productions'],
			['Scene', '01'],
			['Take', '01'],
			['Date', '26.02.2026'],
		],
		example: {
			title: 'Example',
			note: 'Music video by Carlos Droumond. Opens on YouTube, in a new tab.',
		},
	},
	{
		home: '/es/',
		page: '/es/rodajes/',
		contact: 'contacto',
		label: 'Servicio de rodaje',
		title: '¿Quiere a Droumond Productions en su rodaje?',
		line: 'Publicidad, vídeos de marca y videoclips, rodados con el equipo y el material de nuestras series.',
		button: 'Ver el servicio',
		text: 'Rodamos publicidad, vídeos de marca y videoclips en la región de Leiria, con el mismo equipo y el mismo material con que hacemos nuestras series. Díganos qué quiere grabar, dónde y cuándo, y le contestaremos con lo que podemos hacer.',
		pageTitle: 'Servicio de rodaje · Droumond Productions',
		description:
			'Servicio de rodaje de Droumond Productions en Leiria: publicidad, vídeos de marca y videoclips.',
		fields: [
			['Prod.', 'Droumond Productions'],
			['Escena', '01'],
			['Toma', '01'],
			['Fecha', '26.02.2026'],
		],
	},
	{
		home: '/fr/',
		page: '/fr/tournages/',
		contact: 'contact',
		label: 'Service de tournage',
		title: 'Vous voulez Droumond Productions sur votre tournage\u00a0?',
		line: 'Publicités, vidéos de marque et clips musicaux, tournés avec l’équipe et le matériel de nos séries.',
		button: 'Voir le service',
		text: 'Nous tournons des publicités, des vidéos de marque et des clips musicaux dans la région de Leiria, avec l’équipe et le matériel de nos séries. Dites-nous ce que vous voulez filmer, où et quand, et nous vous dirons ce que nous pouvons faire.',
		pageTitle: 'Service de tournage · Droumond Productions',
		description:
			'Le service de tournage de Droumond Productions à Leiria\u00a0: publicités, vidéos de marque et clips musicaux.',
		fields: [
			['Prod.', 'Droumond Productions'],
			['Scène', '01'],
			['Prise', '01'],
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

/** The example under the filming page's clapperboard, by its title. */
const exampleSection = (page: Page, title: string) =>
	page.getByRole('main').getByRole('region', { name: title, exact: true });

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

	test(`${expected.page}: a clapperboard opens the page, with the label, the title, the text and its fields`, async ({
		page,
	}) => {
		await openExisting(page, expected.page);
		const top = pageTop(page);
		await expect(top.getByRole('heading', { level: 1 })).toHaveText(expected.title);
		expect(await readText(top)).toContain(
			[expected.label, expected.title, expected.text, ...expected.fields.flat()]
				.join(' ')
				.replace(/\s+/g, ' ')
				.toLowerCase(),
		);
		await expectSlateFields(top, expected.fields);
	});

	test(`${expected.page}: under the clapperboard, an example opens Blanco y Negro on YouTube in a new tab, and says so`, async ({
		page,
	}) => {
		await openExisting(page, expected.page);
		const example = exampleSection(page, expected.example.title);
		await expect(example).toMatchAriaSnapshot(`
			- region "${expected.example.title}":
			  - heading "${expected.example.title}" [level=2]
			  - link "${EXAMPLE.link}":
			    - /url: ${EXAMPLE.url}
			  - paragraph: ${expected.example.note}
		`);
		const link = example.getByRole('link', { name: EXAMPLE.link, exact: true });
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener');
		await expect(link).toHaveAccessibleDescription(expected.example.note);
		// Between the clapperboard and Contacto.
		expect(
			await example.evaluate((section) => [
				section.previousElementSibling?.querySelector('h1') != null,
				section.nextElementSibling?.id,
			]),
		).toEqual([true, expected.contact]);
	});

	test(`${expected.page}: the example's cover is on film, with its edge codes hidden from screen readers`, async ({
		page,
	}) => {
		await openExisting(page, expected.page);
		const example = exampleSection(page, expected.example.title);
		await expect(example.locator('img')).toHaveAttribute('alt', '');
		for (const text of EXAMPLE.codes) {
			const code = example.getByText(text, { exact: true });
			await expect(code).toBeVisible();
			expect(await code.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
		}
	});

	test(`${expected.page}: the cover comes from the site, and nothing from another site`, async ({
		page,
		baseURL,
	}) => {
		const otherSites: string[] = [];
		page.on('request', (request) => {
			if (new URL(request.url()).origin !== baseURL) otherSites.push(request.url());
		});
		await openExisting(page, expected.page);
		const cover = exampleSection(page, expected.example.title).locator('img');
		await cover.scrollIntoViewIfNeeded();
		await expect
			.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
			.toBe(true);
		const source = await cover.evaluate((img: HTMLImageElement) => img.currentSrc);
		expect(new URL(source).origin).toBe(baseURL);
		expect(((await cover.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
		await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
		await page.waitForLoadState('networkidle');
		expect(otherSites).toEqual([]);
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

		test('/filmagens/: the example is as wide as the clapperboard, its cover whole', async ({
			page,
		}) => {
			await openExisting(page, '/filmagens/');
			const slate = (await pageTop(page).locator('.slate').boundingBox())!;
			const section = exampleSection(page, FILMING[0].example.title);
			const box = (await section.getByRole('link').boundingBox())!;
			expect(Math.abs(box.x - slate.x)).toBeLessThan(1);
			expect(Math.abs(box.width - slate.width)).toBeLessThan(1);
			// The frame keeps the picture's shape: nothing is cut off.
			const shapes = await section
				.locator('img')
				.evaluate((img: HTMLImageElement) => [
					img.naturalWidth / img.naturalHeight,
					img.clientWidth / img.clientHeight,
				]);
			expect(shapes[1]).toBeCloseTo(shapes[0], 1);
		});

		test('/filmagens/: the open arm stays under the header', async ({ page }) => {
			await openExisting(page, '/filmagens/');
			const header = (await page.getByRole('banner').boundingBox())!;
			const arm = (await pageTop(page).locator('.arm').boundingBox())!.y;
			expect(arm - (header.y + header.height)).toBeGreaterThanOrEqual(4);
		});
	});
}
