// Whoever asked for less motion (prefers-reduced-motion) sees everything still. In the header, the
// brush stroke under the links appears at once instead of painting itself.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** How long the brush stroke under the header's first link takes to paint itself. */
async function brushDuration(page: Page) {
	const link = page.getByRole('banner').getByRole('navigation').getByRole('link').first();
	return link.evaluate((a) => getComputedStyle(a, '::after').transitionDuration);
}

inEachBuild(() => {
	test('/: the brush stroke under the links paints itself, unless less motion is asked', async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto('/');
		expect(await brushDuration(page)).toBe('0.35s');

		await page.emulateMedia({ reducedMotion: 'reduce' });
		expect(await brushDuration(page)).toBe('0s');
	});
});
