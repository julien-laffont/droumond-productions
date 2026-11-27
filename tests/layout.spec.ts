// Every page fits the screen's width, on a phone (390 px) and on a desktop (1440 px), menus open
// or closed: no horizontal scroll.
import { expect, test, type Page } from '@playwright/test';
import { builtPages } from './pages';

const SCREENS = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 },
];

async function horizontalOverflow(page: Page) {
	return page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
}

for (const screen of SCREENS) {
	test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
		test.use({ viewport: { width: screen.width, height: screen.height } });

		for (const path of builtPages()) {
			test(`${path} has no horizontal scroll, with the header's menus closed or open`, async ({
				page,
			}) => {
				await page.goto(path);
				expect(await horizontalOverflow(page)).toBe(0);
				for (const summary of await page.getByRole('banner').locator('summary').all()) {
					if (await summary.isVisible()) await summary.click();
				}
				expect(await horizontalOverflow(page)).toBe(0);
			});
		}
	});
}
