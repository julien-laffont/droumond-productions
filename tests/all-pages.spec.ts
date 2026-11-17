// The checks that apply to every page of the build.
// A new page is included automatically, because the list comes from the build folder.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

const WCAG_LEVELS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

for (const path of builtPages()) {
	test(`${path}: axe finds no A or AA violations`, async ({ page }) => {
		await page.goto(path);
		const { violations } = await new AxeBuilder({ page }).withTags(WCAG_LEVELS).analyze();
		const failures = violations.map(
			(v) => `${v.id}: ${v.nodes.map((node) => node.target.join(' ')).join(' | ')}`,
		);
		expect(failures).toEqual([]);
	});
}
