// The checks that apply to every page of both builds.
// A new page is included automatically, because the list comes from the build folder.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { builtPages } from './pages';

const WCAG_LEVELS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

/**
 * Brings the page to rest, as people read it: each section that fades in has come into view, and
 * the animations that end (the first screen's) are over. Before that, axe would flag the texts
 * still faded and skip the ones not yet shown.
 */
async function atRest(page: Page) {
	for (const item of await page.locator('.reveal').all()) {
		await item.scrollIntoViewIfNeeded();
		await expect(item).toHaveCSS('opacity', '1');
	}
	await page.evaluate(() => {
		for (const animation of document.getAnimations()) {
			if (animation.effect?.getComputedTiming().endTime !== Infinity) animation.finish();
		}
	});
}

for (const path of builtPages()) {
	test(`${path}: axe finds no A or AA violations`, async ({ page }) => {
		await page.goto(path);
		await atRest(page);
		const { violations } = await new AxeBuilder({ page }).withTags(WCAG_LEVELS).analyze();
		const failures = violations.map(
			(v) => `${v.id}: ${v.nodes.map((node) => node.target.join(' ')).join(' | ')}`,
		);
		expect(failures).toEqual([]);
	});

	// The Publishing confirmation (tests/publish/) compares it with the commit it published.
	test(`${path}: names the commit it was built from`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('meta[name="commit"]')).toHaveAttribute('content', /^[0-9a-f]{40}$/);
	});
}
