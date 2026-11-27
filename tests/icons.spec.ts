// The site's icon (the logo symbol), in the browser tab and on a phone's home screen.
import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

for (const path of builtPages()) {
	test(`${path}: the browser tab and the home screen find the site's icon`, async ({
		page,
		request,
	}) => {
		await page.goto(path);
		for (const rel of ['icon', 'apple-touch-icon']) {
			const href = await page.locator(`head link[rel="${rel}"]`).getAttribute('href');
			const response = await request.get(href!);
			expect(response.status(), `${rel}: ${href}`).toBe(200);
			expect(response.headers()['content-type'], `${rel}: ${href}`).toMatch(/^image\//);
		}
	});
}
