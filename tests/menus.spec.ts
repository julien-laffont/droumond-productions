// The header's two menus (the phone menu and the language menu): they open without JavaScript;
// with it, they also close when a link is tapped, when the other one opens, or with Escape.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild, languageOf, pagesOf } from './pages';

const PHONE = { width: 390, height: 844 };

/** The phone menu's button and its links, in the page's language. */
function phoneMenu(page: Page, path: string) {
	const english = languageOf(path) === 'en';
	const header = page.getByRole('banner');
	return {
		button: header.locator('summary', { hasText: 'Menu' }),
		links: header
			.getByRole('navigation', { name: english ? 'Main' : 'Principal' })
			.getByRole('link'),
		contact: header.getByRole('link', { name: english ? 'Contact' : 'Contacto', exact: true }),
	};
}

inEachBuild((build) => {
	test.describe('without JavaScript', () => {
		test.use({ javaScriptEnabled: false });

		test.describe('on a phone', () => {
			test.use({ viewport: PHONE });

			for (const path of pagesOf(build)) {
				test(`${path}: the menu opens and shows the four links; Contact stays visible`, async ({
					page,
				}) => {
					await page.goto(path);
					const menu = phoneMenu(page, path);
					await expect(menu.contact).toBeVisible();
					await expect(menu.links).toHaveCount(0);
					await menu.button.click();
					await expect(menu.links).toHaveCount(4);
					for (const link of await menu.links.all()) await expect(link).toBeVisible();
				});
			}
		});

		if (build.english) {
			test('/: the language menu opens', async ({ page }) => {
				await page.goto('/');
				await page.getByRole('banner').locator('summary', { hasText: /^PT$/ }).click();
				await expect(page.getByRole('banner').getByRole('link', { name: 'English' })).toBeVisible();
			});
		}
	});

	test.describe('on a phone, with JavaScript', () => {
		test.use({ viewport: PHONE });

		test('/: the menu closes when a link is tapped', async ({ page }) => {
			await page.goto('/');
			const menu = phoneMenu(page, '/');
			await menu.button.click();
			await menu.links.first().click();
			await expect(menu.links).toHaveCount(0);
			await expect(page).toHaveURL(/\/#projetos$/);
		});

		test('/: Escape closes the menu and gives the focus back to its button', async ({ page }) => {
			await page.goto('/');
			const menu = phoneMenu(page, '/');
			await menu.button.click();
			await expect(menu.links).toHaveCount(4);
			await page.keyboard.press('Escape');
			await expect(menu.links).toHaveCount(0);
			await expect(menu.button).toBeFocused();
		});

		if (build.english) {
			test('/: opening one menu closes the other, so they never cover each other', async ({
				page,
			}) => {
				await page.goto('/');
				const menu = phoneMenu(page, '/');
				const english = page.getByRole('banner').getByRole('link', { name: 'English' });
				await page.getByRole('banner').locator('summary', { hasText: /^PT$/ }).click();
				await expect(english).toBeVisible();
				await menu.button.click();
				await expect(menu.links).toHaveCount(4);
				await expect(english).toBeHidden();
			});
		}
	});
});
