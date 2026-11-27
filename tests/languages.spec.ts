// The four languages: European Portuguese at /, English at /en/, Spanish at /es/, French at /fr/.
import { expect, test, type Page } from '@playwright/test';
import { LANGUAGES, SITE, type Language } from '../src/config/site';
import { openExisting } from './pages';

/** Each page's address in every language: the language button and the hreflang links pair them. */
const VERSIONS: Record<Language, string>[] = [
	{ pt: '/', en: '/en/', es: '/es/', fr: '/fr/' },
	{ pt: '/filmagens/', en: '/en/filming/', es: '/es/rodajes/', fr: '/fr/tournages/' },
	{
		pt: '/efecto-placebo/',
		en: '/en/efecto-placebo/',
		es: '/es/efecto-placebo/',
		fr: '/fr/efecto-placebo/',
	},
	{
		pt: '/resident-evil/',
		en: '/en/resident-evil/',
		es: '/es/resident-evil/',
		fr: '/fr/resident-evil/',
	},
	{
		pt: '/politica-de-privacidade/',
		en: '/en/privacy-policy/',
		es: '/es/politica-de-privacidad/',
		fr: '/fr/politique-de-confidentialite/',
	},
];

/** Each language's `<html lang>`, its language button's name, and its name in the menu. */
const TEXTS: Record<Language, { lang: string; button: string; name: string }> = {
	pt: { lang: 'pt-PT', button: 'PT, língua: Português', name: 'Português' },
	en: { lang: 'en', button: 'EN, language: English', name: 'English' },
	es: { lang: 'es', button: 'ES, idioma: Español', name: 'Español' },
	fr: { lang: 'fr', button: 'FR, langue: Français', name: 'Français' },
};

for (const language of LANGUAGES) {
	const home = VERSIONS[0][language];
	test(`the home page at ${home} is in ${TEXTS[language].name}`, async ({ page }) => {
		await openExisting(page, home);
		await expect(page.locator('html')).toHaveAttribute('lang', TEXTS[language].lang);
	});
}

for (const versions of VERSIONS) {
	const expected = Object.fromEntries(LANGUAGES.map((l) => [l, `${SITE}${versions[l]}`]));

	for (const language of LANGUAGES) {
		const path = versions[language];

		test(`${path} declares its four versions with absolute addresses`, async ({ page }) => {
			await openExisting(page, path);
			expect(await alternates(page)).toEqual(expected);
		});

		test(`${path}: the language button names the language and leads to the same page in the other three`, async ({
			page,
		}) => {
			await openExisting(page, path);
			const button = languageButton(page);
			await expect(button).toHaveAccessibleName(TEXTS[language].button);
			await button.click();
			const others = LANGUAGES.filter((l) => l !== language);
			// The button's <details>, which holds the links.
			const links = button.locator('xpath=..').getByRole('link');
			await expect(links).toHaveText(others.map((l) => TEXTS[l].name));
			for (const [index, other] of others.entries()) {
				const link = links.nth(index);
				await expect(link).toBeVisible();
				await expect(link).toHaveAttribute('href', versions[other]);
				await expect(link).toHaveAttribute('lang', TEXTS[other].lang);
				await expect(link).toHaveAttribute('hreflang', other);
			}
		});
	}
}

/** The header's language button: a <summary> that shows the language's code, such as "PT". */
function languageButton(page: Page) {
	return page.getByRole('banner').locator('summary', { hasText: /^(PT|EN|ES|FR)$/ });
}

/** The page's hreflang links, as { language: address }. */
async function alternates(page: Page) {
	const links = await page
		.locator('link[rel="alternate"][hreflang]')
		.evaluateAll((elements) =>
			elements.map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]),
		);
	return Object.fromEntries(links);
}
