// The Filming service (#16): the band on the home page, right before Contacto, and the page it
// leads to. The texts are provisional until #18.
import { expect, test } from '@playwright/test';
import { inEachBuild, languageOf, openExisting } from './pages';

const FILMING = [
	{
		home: '/',
		page: '/filmagens/',
		contact: 'contacto',
		label: 'Serviço de filmagens',
		title: 'Quer a Droumond Productions para gravação?',
		line: 'Levamos a nossa equipa e o nosso material de produção às suas filmagens.',
		button: 'Ver o serviço',
		text: 'Levamos a equipa e o material com que fazemos as nossas séries às suas filmagens. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		pageTitle: 'Serviço de filmagens · Droumond Productions',
	},
	{
		home: '/en/',
		page: '/en/filming/',
		contact: 'contact',
		label: 'Filming service',
		title: 'Want Droumond Productions on your shoot?',
		line: 'We bring our crew and our production equipment to your shoot.',
		button: 'See the service',
		text: 'We bring the crew and the equipment we make our series with to your shoot. Tell us what you want to film, where and when, and we will reply with what we can do.',
		pageTitle: 'Filming service · Droumond Productions',
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
			const main = page.getByRole('main');
			await expect(main).toContainText(expected.label);
			await expect(main.getByRole('heading', { level: 1 })).toHaveText(expected.title);
			await expect(main).toContainText(expected.text);
			await expect(main.locator(':scope > :last-child')).toHaveAttribute('id', expected.contact);
		});
	}
});
