// The header's two menus (the phone menu and the language menu): they open without JavaScript;
// with it, they also close when a link is tapped, when the other one opens, or with Escape.
// Up to 520 px, YouTube and Contacto leave the header's bar for the end of the menu; Instagram
// stays in the bar.
import { expect, test, type Page } from '@playwright/test';
import { languageOf, builtPages } from './pages';

const PHONE = { width: 390, height: 844 };
const YOUTUBE = 'https://www.youtube.com/@DroumondProductions';
const TABLET = { width: 700, height: 900 };

/** Where the header's Contacto leads: the page's own block on the filming page (#7). */
function contactHref(path: string) {
	if (path === '/filmagens/' || path === '/en/filming/') return `${path}#${contactAnchor(path)}`;
	return `${languageOf(path) === 'en' ? '/en/' : '/'}#${contactAnchor(path)}`;
}
const contactAnchor = (path: string) => (languageOf(path) === 'en' ? 'contact' : 'contacto');

/** The phone menu's button and its links, in the page's language. */
function phoneMenu(page: Page, path: string) {
	const english = languageOf(path) === 'en';
	const header = page.getByRole('banner');
	const contactName = english ? 'Contact' : 'Contacto';
	return {
		button: header.locator('summary', { hasText: 'Menu' }),
		links: header
			.getByRole('navigation', { name: english ? 'Main' : 'Principal' })
			.getByRole('link'),
		/** Every visible Contacto link of the header: the bar's, or the menu's when it is open. */
		contact: header.getByRole('link', { name: contactName, exact: true }),
		contactName,
		instagram: header.getByRole('link', { name: 'Instagram', exact: true }),
		/** Every visible YouTube link of the header, like `contact`. */
		youtube: header.getByRole('link', { name: 'YouTube', exact: true }),
	};
}

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test.describe('on a phone', () => {
		test.use({ viewport: PHONE });

		for (const path of builtPages()) {
			test(`${path}: Instagram stays in the bar; the menu opens with the four links, YouTube, then Contacto`, async ({
				page,
			}) => {
				await page.goto(path);
				const menu = phoneMenu(page, path);
				await expect(menu.instagram).toBeVisible();
				await expect(menu.youtube).toHaveCount(0);
				await expect(menu.contact).toHaveCount(0);
				await expect(menu.links).toHaveCount(0);
				await menu.button.click();
				await expect(menu.links).toHaveCount(6);
				for (const link of await menu.links.all()) await expect(link).toBeVisible();
				const youtube = menu.links.nth(4);
				await expect(youtube).toHaveAccessibleName('YouTube');
				await expect(youtube).toHaveAttribute('href', YOUTUBE);
				await expect(youtube).toHaveAttribute('target', '_blank');
				await expect(youtube).toHaveAttribute('rel', 'noopener');
				await expect(menu.youtube).toHaveCount(1);
				await expect(menu.links.last()).toHaveText(menu.contactName);
				await expect(menu.links.last()).toHaveAttribute('href', contactHref(path));
				await expect(menu.contact).toHaveCount(1);
			});
		}
	});

	test.describe('on a tablet', () => {
		test.use({ viewport: TABLET });

		for (const path of builtPages()) {
			test(`${path}: Instagram, YouTube and Contacto stay in the bar; the menu holds the four links`, async ({
				page,
			}) => {
				await page.goto(path);
				const menu = phoneMenu(page, path);
				await expect(menu.instagram).toBeVisible();
				await expect(menu.youtube).toBeVisible();
				await expect(menu.contact).toBeVisible();
				await menu.button.click();
				await expect(menu.links).toHaveCount(4);
				await expect(menu.youtube).toHaveCount(1);
				await expect(menu.contact).toHaveCount(1);
			});
		}
	});

	test('/: the language menu opens', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('banner').locator('summary', { hasText: /^PT$/ }).click();
		await expect(page.getByRole('banner').getByRole('link', { name: 'English' })).toBeVisible();
	});
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
		await expect(menu.links).toHaveCount(6);
		await page.keyboard.press('Escape');
		await expect(menu.links).toHaveCount(0);
		await expect(menu.button).toBeFocused();
	});

	test('/: opening one menu closes the other, so they never cover each other', async ({ page }) => {
		await page.goto('/');
		const menu = phoneMenu(page, '/');
		const english = page.getByRole('banner').getByRole('link', { name: 'English' });
		await page.getByRole('banner').locator('summary', { hasText: /^PT$/ }).click();
		await expect(english).toBeVisible();
		await menu.button.click();
		await expect(menu.links).toHaveCount(6);
		await expect(english).toBeHidden();
	});
});
