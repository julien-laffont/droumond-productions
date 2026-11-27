// The two languages: European Portuguese at /, English at /en/.
import { expect, test, type Page } from '@playwright/test';
import { SITE } from '../src/config/site';
import { openExisting } from './pages';

/** Each page in both languages: the language button and the hreflang links pair them. */
const PAIRS = [
	{ pt: '/', en: '/en/' },
	{ pt: '/filmagens/', en: '/en/filming/' },
	{ pt: '/efecto-placebo/', en: '/en/efecto-placebo/' },
	{ pt: '/resident-evil/', en: '/en/resident-evil/' },
	{ pt: '/politica-de-privacidade/', en: '/en/privacy-policy/' },
];

/** The language button on each page: the current language, then the link to the other one. */
const SWITCHER = PAIRS.flatMap(({ pt, en }) => [
	{
		path: pt,
		name: 'PT, língua: Português',
		other: { text: 'English', href: en, lang: 'en', hreflang: 'en' },
	},
	{
		path: en,
		name: 'EN, language: English',
		other: { text: 'Português', href: pt, lang: 'pt-PT', hreflang: 'pt' },
	},
]);

test('the home page at / is in European Portuguese', async ({ page }) => {
	await openExisting(page, '/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
});

test('the home page at /en/ is in English', async ({ page }) => {
	await openExisting(page, '/en/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const { pt, en } of PAIRS) {
	for (const path of [pt, en]) {
		test(`${path} declares both versions with absolute addresses`, async ({ page }) => {
			await openExisting(page, path);
			expect(await alternates(page)).toEqual({ pt: `${SITE}${pt}`, en: `${SITE}${en}` });
		});
	}
}

for (const s of SWITCHER) {
	test(`${s.path}: the language button names the language and leads to the same page in ${s.other.text}`, async ({
		page,
	}) => {
		await openExisting(page, s.path);
		const button = languageButton(page);
		await expect(button).toHaveAccessibleName(s.name);
		await button.click();
		const link = page.getByRole('banner').getByRole('link', { name: s.other.text });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', s.other.href);
		await expect(link).toHaveAttribute('lang', s.other.lang);
		await expect(link).toHaveAttribute('hreflang', s.other.hreflang);
	});
}

/** The header's language button: a <summary> that shows the language's code, "PT" or "EN". */
function languageButton(page: Page) {
	return page.getByRole('banner').locator('summary', { hasText: /^(PT|EN)$/ });
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
