// The confirmation after each Publishing: the published site is this build.
// Runs with `npm run confirm`, after `npm run build`, against SITE (or PUBLISHED_URL).
import { expect, test } from '@playwright/test';
import { commit } from '../../src/lib/commit';
import { builtPages, openExisting } from '../pages';

for (const path of builtPages()) {
	test(`${path} answers 200 with this build's commit`, async ({ page }) => {
		await openExisting(page, path);
		await expect(page.locator('meta[name="commit"]')).toHaveAttribute('content', commit);
	});
}

// An address with no page: .htaccess answers with the 404 page.
test('a missing address answers 404', async ({ request }) => {
	expect((await request.get('/nao-existe/', { maxRedirects: 0 })).status()).toBe(404);
});

test('HTTP redirects to HTTPS with a 301', async ({ request, baseURL }) => {
	const url = new URL('/', baseURL);
	url.protocol = 'http:';
	const response = await request.get(url.href, { maxRedirects: 0 });
	url.protocol = 'https:';
	expect(response.status()).toBe(301);
	expect(response.headers()['location']).toBe(url.href);
});
