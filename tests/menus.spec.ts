// The header's two menus (the phone menu and the language menu): they open without JavaScript;
// with it, they also close when a link is tapped, when the other one opens, or with Escape.
// Up to 520 px, as in Película, Contacto leaves the header's bar for the end of the menu.
import { expect, test, type Page } from '@playwright/test';
import { PREFIXES } from '../src/config/site';
import { languageOf, builtPages } from './pages';

const PHONE = { width: 390, height: 844 };
const TABLET = { width: 700, height: 900 };

/** The phone menu's texts, Contacto's anchor and the filming page, in each language. */
const MENUS = {
	pt: {
		button: 'Menu',
		nav: 'Principal',
		contact: 'Contacto',
		anchor: 'contacto',
		filming: '/filmagens/',
	},
	en: {
		button: 'Menu',
		nav: 'Main',
		contact: 'Contact',
		anchor: 'contact',
		filming: '/en/filming/',
	},
	es: {
		button: 'Menú',
		nav: 'Principal',
		contact: 'Contacto',
		anchor: 'contacto',
		filming: '/es/rodajes/',
	},
	fr: {
		button: 'Menu',
		nav: 'Principal',
		contact: 'Contact',
		anchor: 'contact',
		filming: '/fr/tournages/',
	},
};

/** Where the header's Contacto leads: the page's own block on the filming page (#7). */
function contactHref(path: string) {
	const language = languageOf(path);
	const { anchor, filming } = MENUS[language];
	return path === filming ? `${path}#${anchor}` : `${PREFIXES[language]}#${anchor}`;
}

/** The phone menu's button and its links, in the page's language. */
function phoneMenu(page: Page, path: string) {
	const texts = MENUS[languageOf(path)];
	const header = page.getByRole('banner');
	const contactName = texts.contact;
	return {
		button: header.locator('summary', { hasText: texts.button }),
		links: header.getByRole('navigation', { name: texts.nav }).getByRole('link'),
		/** Every visible Contacto link of the header: the bar's, or the menu's when it is open. */
		contact: header.getByRole('link', { name: contactName, exact: true }),
		contactName,
	};
}

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test.describe('on a phone', () => {
		test.use({ viewport: PHONE });

		for (const path of builtPages()) {
			test(`${path}: Contacto leaves the bar; the menu opens with the four links, then Contacto`, async ({
				page,
			}) => {
				await page.goto(path);
				const menu = phoneMenu(page, path);
				await expect(menu.contact).toHaveCount(0);
				await expect(menu.links).toHaveCount(0);
				await menu.button.click();
				await expect(menu.links).toHaveCount(5);
				for (const link of await menu.links.all()) await expect(link).toBeVisible();
				await expect(menu.links.last()).toHaveText(menu.contactName);
				await expect(menu.links.last()).toHaveAttribute('href', contactHref(path));
				await expect(menu.contact).toHaveCount(1);
			});
		}
	});

	test.describe('on a tablet', () => {
		test.use({ viewport: TABLET });

		for (const path of builtPages()) {
			test(`${path}: Contacto stays in the bar; the menu holds the four links`, async ({
				page,
			}) => {
				await page.goto(path);
				const menu = phoneMenu(page, path);
				await expect(menu.contact).toBeVisible();
				await menu.button.click();
				await expect(menu.links).toHaveCount(4);
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
		await expect(menu.links).toHaveCount(5);
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
		await expect(menu.links).toHaveCount(5);
		await expect(english).toBeHidden();
	});
});
