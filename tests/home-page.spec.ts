import { expect, test } from '@playwright/test';

test('the home page is in European Portuguese', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
});
