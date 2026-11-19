// The Contacto block (#7, #16): the address in large type is the email link, with no separate
// button, and the Privacy Policy line under it. Only the filming page's fills in a subject; the
// footer's email always opens blank. The header's Contacto leads to the block of the page itself.
import { expect, test } from '@playwright/test';
import { CONTACT_EMAIL } from '../src/config/site';
import { inEachBuild, languageOf, openExisting, pagesOf } from './pages';

/** The pages with a Contacto block, what the block holds and where its email link leads. */
const BLOCKS = [
	{
		path: '/',
		anchor: 'contacto',
		title: 'Contacto',
		href: `mailto:${CONTACT_EMAIL}`,
		privacy: {
			line: 'Os dados que nos enviar são tratados de acordo com a Política de Privacidade.',
			name: 'Política de Privacidade',
			href: '/politica-de-privacidade/',
		},
	},
	{
		path: '/en/',
		anchor: 'contact',
		title: 'Contact',
		href: `mailto:${CONTACT_EMAIL}`,
		privacy: {
			line: 'The data you send us is handled according to the Privacy Policy.',
			name: 'Privacy Policy',
			href: '/en/privacy-policy/',
		},
	},
	{
		path: '/filmagens/',
		anchor: 'contacto',
		title: 'Contacto',
		href: `mailto:${CONTACT_EMAIL}?subject=Servi%C3%A7o%20de%20filmagens`,
		privacy: {
			line: 'Os dados que nos enviar são tratados de acordo com a Política de Privacidade.',
			name: 'Política de Privacidade',
			href: '/politica-de-privacidade/',
		},
	},
	{
		path: '/en/filming/',
		anchor: 'contact',
		title: 'Contact',
		href: `mailto:${CONTACT_EMAIL}?subject=Filming%20service`,
		privacy: {
			line: 'The data you send us is handled according to the Privacy Policy.',
			name: 'Privacy Policy',
			href: '/en/privacy-policy/',
		},
	},
];

inEachBuild((build) => {
	const blocks = BLOCKS.filter(({ path }) => build.english || languageOf(path) === 'pt');

	for (const block of blocks) {
		test(`${block.path}: the Contacto block shows the address as its email link, then the Privacy Policy line`, async ({
			page,
		}) => {
			await openExisting(page, block.path);
			const section = page.getByRole('region', { name: block.title, exact: true });
			await expect(section).toHaveAttribute('id', block.anchor);
			const email = section.getByRole('link', { name: CONTACT_EMAIL, exact: true });
			await expect(email).toHaveText(CONTACT_EMAIL);
			await expect(email).toHaveAttribute('href', block.href);
			await expect(section).toContainText(block.privacy.line);
			await expect(section.getByRole('link', { name: block.privacy.name })).toHaveAttribute(
				'href',
				block.privacy.href,
			);
		});
	}

	for (const block of blocks) {
		test(`${block.path}: the header's Contacto leads to the block of this page`, async ({
			page,
		}) => {
			await openExisting(page, block.path);
			await page.getByRole('banner').getByRole('link', { name: block.title, exact: true }).click();
			await expect(page).toHaveURL(
				(url) => url.pathname === block.path && url.hash === `#${block.anchor}`,
			);
			await expect(page.getByRole('region', { name: block.title, exact: true })).toBeInViewport();
		});
	}

	for (const block of blocks) {
		test(`${block.path}: dragging over part of the address selects all of it, to copy it`, async ({
			page,
		}) => {
			await openExisting(page, block.path);
			const email = page
				.getByRole('region', { name: block.title, exact: true })
				.getByRole('link', { name: CONTACT_EMAIL, exact: true });
			// hover() waits until the block has finished coming into view.
			await email.hover({ position: { x: 4, y: 10 } });
			const box = (await email.boundingBox())!;
			await page.mouse.down();
			await page.mouse.move(box.x + box.width / 2, box.y + 10, { steps: 5 });
			await page.mouse.up();
			expect(await page.evaluate(() => getSelection()?.toString())).toBe(CONTACT_EMAIL);
		});
	}

	// At 360 px the address no longer fits on one line; at 375 px it fits just under the width, where
	// the brush stroke under it would reach past the screen.
	for (const width of [360, 375, 390]) {
		test.describe(`on a ${width} px phone`, () => {
			test.use({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });

			test('/: the address only breaks before the @, and focusing it scrolls nothing sideways', async ({
				page,
			}) => {
				await openExisting(page, '/');
				const email = page
					.getByRole('region', { name: 'Contacto', exact: true })
					.getByRole('link', { name: CONTACT_EMAIL, exact: true });
				const lines = await email.evaluate((link) => {
					// The line of each character, by its top edge.
					const tops: number[] = [];
					const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
					for (let node = walker.nextNode(); node; node = walker.nextNode()) {
						for (let i = 0; i < node.textContent!.length; i++) {
							const range = document.createRange();
							range.setStart(node, i);
							range.setEnd(node, i + 1);
							tops.push(Math.round(range.getBoundingClientRect().top));
						}
					}
					return tops;
				});
				const at = CONTACT_EMAIL.indexOf('@');
				expect(new Set(lines.slice(0, at)).size, 'lines before the @').toBe(1);
				expect(new Set(lines.slice(at)).size, 'lines from the @').toBe(1);

				await email.focus();
				expect(await email.evaluate((link) => link.matches(':focus-visible'))).toBe(true);
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
					),
				).toBe(0);
			});
		});
	}

	for (const path of pagesOf(build)) {
		test(`${path}: the footer's email opens blank`, async ({ page }) => {
			await page.goto(path);
			await expect(page.getByRole('contentinfo').locator('a[href^="mailto:"]')).toHaveAttribute(
				'href',
				`mailto:${CONTACT_EMAIL}`,
			);
		});
	}
});
