// The 404 page (#17): an address that does not exist answers 404 with one sentence in each
// language, each leading to the home page in its language.
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { DIST } from './pages';

/** The sentences after the Portuguese heading, each in its language, with its home page link. */
const OTHERS = [
	{ lang: 'en', text: 'This page does not exist.', link: 'Go back to the home page', href: '/en/' },
	{
		lang: 'es',
		text: 'Esta página no existe.',
		link: 'Volver a la página de inicio',
		href: '/es/',
	},
	{
		lang: 'fr',
		text: 'Cette page n’existe pas.',
		link: 'Revenir à la page d’accueil',
		href: '/fr/',
	},
];

test('an unknown address answers 404 with a sentence in each language', async ({ page }) => {
	const response = await page.goto('/nao-existe/');
	expect(response?.status()).toBe(404);
	const main = page.getByRole('main');
	await expect(main.getByRole('heading', { level: 1 })).toHaveText('Esta página não existe.');
	await expect(main.getByRole('link', { name: 'Voltar à página inicial' })).toHaveAttribute(
		'href',
		'/',
	);
	for (const other of OTHERS) {
		const sentence = main.getByText(other.text, { exact: true });
		await expect(sentence).toBeVisible();
		// The language of the text: the nearest lang attribute, on the sentence or around it.
		expect(await sentence.evaluate((el) => el.closest('[lang]')?.getAttribute('lang'))).toBe(
			other.lang,
		);
		await expect(main.getByRole('link', { name: other.link })).toHaveAttribute('href', other.href);
	}
});

test('the 404 page has the header, without a language button', async ({ page }) => {
	await page.goto('/nao-existe/');
	const header = page.getByRole('banner');
	await expect(header.getByRole('link', { name: 'Contacto', exact: true })).toBeVisible();
	await expect(header.locator('summary', { hasText: /^(PT|EN|ES|FR)$/ })).toHaveCount(0);
});

test('the host (Apache) answers unknown addresses and folders without a page with the 404 page', () => {
	const htaccess = readFileSync(`${DIST}/.htaccess`, 'utf8');
	expect(htaccess).toMatch(/^ErrorDocument 404 \/404\.html$/m);
	// A folder without index.html (/_astro/) gives the 404, not a file list or a 403.
	expect(htaccess).toMatch(/^RewriteCond %\{REQUEST_FILENAME\}\/index\.html !-f$/m);
	expect(htaccess).toMatch(/^RewriteRule \^ - \[R=404,L\]$/m);
});
