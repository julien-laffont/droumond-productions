// The Equipa section of the home page: a grid of src/config/crew.ts, each person's photo with the
// name and the role under it.
import { expect, test } from '@playwright/test';

const NAMES = [
	'Carlos Droumond',
	'Julien Laffont',
	'Gonçalo Espirito Santo',
	'Isabel Rodríguez',
	'Maria Pendeirada',
	'Sara Lucas',
	'Natan',
	'Lada São Miguel',
];

/** What the section shows in each language. */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'equipa',
		heading: 'Equipa',
		roles: [
			'Realizador · Produtor · Ator',
			'Gerente · Ator · Direção de atores',
			'Ator · Guionista',
			'Atriz · Figurinista',
			'Atriz · Assistente de direção dos atores',
			'Atriz · Assistente de direção dos atores',
			'Assistente de realizador',
			'Assistente de realizador',
		],
	},
	{
		path: '/en/',
		english: true,
		anchor: 'crew',
		heading: 'Crew',
		roles: [
			'Director · Producer · Actor',
			'Managing director · Actor · Director of actors',
			'Actor · Screenwriter',
			'Actress · Costume designer',
			'Actress · Assistant director of actors',
			'Actress · Assistant director of actors',
			'Assistant director',
			'Assistant director',
		],
	},
];

for (const home of HOMES) {
	test(`${home.path}: Equipa shows each person's photo, name and role, below the Elenco`, async ({
		page,
		baseURL,
	}) => {
		await page.goto(home.path);
		const section = page.locator(`section#${home.anchor}`);
		await expect(section.getByRole('heading', { level: 2 })).toHaveText(home.heading);

		const people = section.getByRole('listitem');
		await expect(people).toHaveCount(NAMES.length);
		await expect(section.getByRole('heading', { level: 3 })).toHaveText(NAMES);
		for (const [index, person] of (await people.all()).entries()) {
			await expect(person.getByRole('paragraph')).toHaveText(home.roles[index]);
			// Every photo says what it shows, comes from the site itself, in several sizes.
			const photo = person.getByRole('img');
			expect((await photo.getAttribute('alt'))?.trim(), NAMES[index]).toBeTruthy();
			const src = await photo.evaluate((img: HTMLImageElement) => img.src);
			expect(new URL(src).origin).toBe(baseURL);
			expect(((await photo.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
		}

		// The section comes after the Elenco.
		const sections = await page
			.locator('main > section')
			.evaluateAll((els) => els.map((e) => e.id));
		const cast = home.english ? 'cast' : 'elenco';
		expect(sections.indexOf(home.anchor)).toBe(sections.indexOf(cast) + 1);
	});

	test(`${home.path}: Equipa is a grid, never a carousel`, async ({ page }) => {
		for (const [width, columns] of [
			[1280, 4],
			[390, 2],
		]) {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(home.path);
			const list = page.locator(`section#${home.anchor} ul`);
			const tops = await list
				.getByRole('listitem')
				.evaluateAll((els) =>
					els.map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY)),
				);
			expect(new Set(tops).size, `${width}px`).toBe(NAMES.length / columns);
			expect(await list.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
		}
	});
}
