// The Contacto block (#7, #16): the address in large type is the email link, with no separate
// button, and the Privacy Policy line under it. Only the filming page's fills in a subject (the
// footer's email, always blank, is checked in footer.spec.ts). The header's Contacto leads to the
// block of the page itself.
import { expect, test } from '@playwright/test';
import { CONTACT_EMAIL } from '../src/config/site';
import { languageOf, openExisting } from './pages';

/** What the Contacto block holds in each language. */
const BLOCK = {
	pt: {
		anchor: 'contacto',
		title: 'Contacto',
		privacy: {
			line: 'Os dados que nos enviar são tratados de acordo com a Política de Privacidade.',
			name: 'Política de Privacidade',
			href: '/politica-de-privacidade/',
		},
	},
	en: {
		anchor: 'contact',
		title: 'Contact',
		privacy: {
			line: 'The data you send us is handled according to the Privacy Policy.',
			name: 'Privacy Policy',
			href: '/en/privacy-policy/',
		},
	},
};

/** The pages with a Contacto block, and where its email link leads. */
const PAGES_WITH_BLOCK = [
	{ path: '/', href: `mailto:${CONTACT_EMAIL}` },
	{ path: '/en/', href: `mailto:${CONTACT_EMAIL}` },
	{ path: '/filmagens/', href: `mailto:${CONTACT_EMAIL}?subject=Servi%C3%A7o%20de%20filmagens` },
	{ path: '/en/filming/', href: `mailto:${CONTACT_EMAIL}?subject=Filming%20service` },
];

const blocks = PAGES_WITH_BLOCK.map((page) => ({ ...page, ...BLOCK[languageOf(page.path)] }));

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
	test(`${block.path}: the header's Contacto leads to the block of this page`, async ({ page }) => {
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

// From 360 to 390 px the address does not fit on one line: it breaks before the @, and the part
// from the @ fits just under the width.
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
