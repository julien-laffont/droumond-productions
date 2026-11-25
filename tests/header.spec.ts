// The header, the same on every page: the symbol, the timecode, the sections, the language menu
// and Contacto.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild, languageOf, pagesOf } from './pages';

/** The timecode (HH:MM:SS:FF): decorative, so only found by its text. */
const timecode = (page: Page) =>
	page.getByRole('banner').getByText(/^\d\d:\d\d:\d\d:\d\d$/, { exact: true });

/** Scrolls to the end of the page and waits for the scroll to settle. */
async function scrollToEnd(page: Page) {
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight,
			),
		)
		.toBe(true);
}

/** What the header holds in each language. The English texts are reviewed (#18). */
const EXPECTED = {
	pt: {
		symbol: { name: 'Droumond Productions, início', href: '/' },
		nav: 'Principal',
		links: [
			{ name: 'Projetos', href: '/#projetos' },
			{ name: 'Sobre', href: '/#sobre' },
			{ name: 'Elenco', href: '/#elenco' },
			{ name: 'Filmagens', href: '/filmagens/' },
		],
		contact: { name: 'Contacto', href: '/#contacto' },
	},
	en: {
		symbol: { name: 'Droumond Productions, home', href: '/en/' },
		nav: 'Main',
		links: [
			{ name: 'Projects', href: '/en/#projects' },
			{ name: 'About', href: '/en/#about' },
			{ name: 'Cast', href: '/en/#cast' },
			{ name: 'Filming', href: '/en/filming/' },
		],
		contact: { name: 'Contact', href: '/en/#contact' },
	},
};

/** On the filming page, Contacto leads to the page's own block (#7). */
const OWN_CONTACT: Record<string, string> = {
	'/filmagens/': '/filmagens/#contacto',
	'/en/filming/': '/en/filming/#contact',
};

inEachBuild((build) => {
	for (const path of pagesOf(build)) {
		const expected = EXPECTED[languageOf(path)];

		test(`${path}: the header links to the home page, its sections, the filming page and Contacto`, async ({
			page,
		}) => {
			await page.goto(path);
			const header = page.getByRole('banner');
			await expect(header.getByRole('link', { name: expected.symbol.name })).toHaveAttribute(
				'href',
				expected.symbol.href,
			);
			const links = header.getByRole('navigation', { name: expected.nav }).getByRole('link');
			await expect(links).toHaveText(expected.links.map((l) => l.name));
			for (const [i, { href }] of expected.links.entries()) {
				await expect(links.nth(i)).toHaveAttribute('href', href);
			}
			await expect(
				header.getByRole('link', { name: expected.contact.name, exact: true }),
			).toHaveAttribute('href', OWN_CONTACT[path] ?? expected.contact.href);
		});

		test(`${path}: the timecode starts at 00:00:00:00, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(path);
			const code = timecode(page);
			await expect(code).toHaveText('00:00:00:00');
			await expect(code).toBeVisible();
			expect(
				await code.evaluate((el) => el.closest('[aria-hidden="true"]') !== null),
				'inside aria-hidden',
			).toBe(true);
		});
	}

	// The whole page is a 4-minute reel at 25 frames per second: the scroll runs it.
	test('/: the timecode runs with the scroll, to 00:04:00:00 at the end of the page', async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto('/');
		await scrollToEnd(page);
		await expect(timecode(page)).toHaveText('00:04:00:00');
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(timecode(page)).toHaveText('00:00:00:00');
	});

	test('/: with less motion, the timecode stays still', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await scrollToEnd(page);
		// Gives a running timecode the time to show the end of the reel.
		await page.evaluate(
			() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))),
		);
		await expect(timecode(page)).toHaveText('00:00:00:00');
	});

	for (const path of pagesOf(build).filter((p) => p === '/' || p === '/en/')) {
		const expected = EXPECTED[languageOf(path)];

		test(`${path}: each section link of the header scrolls to its section`, async ({ page }) => {
			await page.goto(path);
			const nav = page.getByRole('banner').getByRole('navigation', { name: expected.nav });
			for (const { name, href } of expected.links.filter((l) => l.href.includes('#'))) {
				await nav.getByRole('link', { name, exact: true }).click();
				await expect(page.locator(`#${href.split('#')[1]}`)).toBeInViewport();
			}
		});
	}
});
