// The Filming service (#16): the band on the home page, right before Contacto, and the page it
// leads to. The texts are Julien's and Nal's, in both languages (#18).
import { expect, test } from '@playwright/test';
import { inEachBuild, languageOf, openExisting } from './pages';

const FILMING = [
	{
		home: '/',
		page: '/filmagens/',
		contact: 'contacto',
		label: 'Serviço de filmagens',
		title: 'Quer a Droumond Productions para gravação?',
		line: 'Publicidade, vídeos para marcas e videoclipes, filmados com a equipa e o material das nossas séries.',
		button: 'Ver o serviço',
		text: 'Filmamos publicidade, vídeos para marcas e videoclipes na região de Leiria, com a equipa e o material com que fazemos as nossas séries. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		pageTitle: 'Serviço de filmagens · Droumond Productions',
		description:
			'Serviço de filmagens da Droumond Productions em Leiria: publicidade, vídeos para marcas e videoclipes.',
	},
	{
		home: '/en/',
		page: '/en/filming/',
		contact: 'contact',
		label: 'Filming service',
		title: 'Want Droumond Productions on your shoot?',
		line: 'Commercials, brand videos and music videos, shot with the same crew and equipment as our series.',
		button: 'About the service',
		text: 'We shoot commercials, brand videos and music videos in the Leiria region, with the same crew and equipment we use for our series. Tell us what you want to film, where and when, and we will tell you what we can do.',
		pageTitle: 'Filming service · Droumond Productions',
		description:
			"Droumond Productions' filming service in Leiria: commercials, brand videos and music videos.",
	},
];

inEachBuild((build) => {
	const filming = FILMING.filter(({ home }) => build.english || languageOf(home) === 'pt');

	for (const expected of filming) {
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
			expect(await band.evaluate((section) => section.nextElementSibling?.id)).toBe(
				expected.contact,
			);
			await band.getByRole('link', { name: expected.button, exact: true }).click();
			await expect(page).toHaveURL((url) => url.pathname === expected.page);
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
	}
});
