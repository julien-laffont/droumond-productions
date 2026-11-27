// The header, the same on every page: the symbol, the timecode, the sections, the language menu,
// Instagram, YouTube and Contacto.
import { expect, test, type Page } from '@playwright/test';
import { languageOf, builtPages } from './pages';

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

/** The company's profiles, as icons between the language button and Contacto. */
const PROFILES = [
	{ name: 'Instagram', href: 'https://www.instagram.com/droumond_productions' },
	{ name: 'YouTube', href: 'https://www.youtube.com/@DroumondProductions' },
];

const PAPER = 'rgb(236, 229, 216)';
const AMBER = 'rgb(232, 164, 58)';

/** On the filming page, Contacto leads to the page's own block (#7). */
const OWN_CONTACT: Record<string, string> = {
	'/filmagens/': '/filmagens/#contacto',
	'/en/filming/': '/en/filming/#contact',
};

for (const path of builtPages()) {
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

	test(`${path}: Instagram and YouTube open in a new tab, as icons after the sections and the language, before Contacto`, async ({
		page,
	}) => {
		await page.goto(path);
		const header = page.getByRole('banner');
		const sections = header.getByRole('navigation', { name: expected.nav }).getByRole('link');
		const order = [sections.last()];
		const language = header.locator('summary', { hasText: /^[A-Z]{2}$/ });
		if (await language.count()) order.push(language);
		for (const { name, href } of PROFILES) {
			const link = header.getByRole('link', { name, exact: true });
			await expect(link).toHaveAttribute('href', href);
			await expect(link).toHaveAttribute('target', '_blank');
			await expect(link).toHaveAttribute('rel', 'noopener');
			// An icon only, hidden from screen readers: the link's name says where it goes.
			await expect(link.locator('svg')).toBeVisible();
			await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true');
			await expect(link).toHaveText('');
			const box = await link.boundingBox();
			expect(box?.width, `${name}: touch width`).toBeGreaterThanOrEqual(40);
			expect(box?.height, `${name}: touch height`).toBeGreaterThanOrEqual(40);
			order.push(link);
		}
		order.push(header.getByRole('link', { name: expected.contact.name, exact: true }));
		const lefts = [];
		for (const item of order) lefts.push((await item.boundingBox())?.x ?? NaN);
		expect(lefts).toEqual([...lefts].sort((a, b) => a - b));
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

// The brands ask for their logo in one colour and unaltered: on hover only the amber line appears.
test('/: on hover, an amber line appears under each profile icon, whose colour stays', async ({
	page,
}) => {
	await page.goto('/');
	for (const { name } of PROFILES) {
		const link = page.getByRole('banner').getByRole('link', { name, exact: true });
		const icon = link.locator('svg');
		const line = link.locator('span');
		await expect(icon).toHaveCSS('color', PAPER);
		await expect(line).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
		await link.hover();
		await expect(line).toHaveCSS('border-bottom-color', AMBER);
		await expect(icon).toHaveCSS('color', PAPER);
		await expect(icon).toHaveAttribute('fill', 'currentColor');
	}
});

// On the narrowest phones, the bar still holds everything side by side: the symbol, the timecode,
// the language, Instagram and the menu (YouTube and Contacto are inside the menu).
test.describe('on a small phone (360 px)', () => {
	test.use({ viewport: { width: 360, height: 740 } });

	for (const path of ['/', '/en/']) {
		test(`${path}: the bar's items fit side by side, without overlapping`, async ({ page }) => {
			await page.goto(path);
			const header = page.getByRole('banner');
			const items = [
				header.getByRole('link', { name: EXPECTED[languageOf(path)].symbol.name }),
				timecode(page),
				header.locator('summary', { hasText: /^[A-Z]{2}$/ }),
				header.getByRole('link', { name: 'Instagram', exact: true }),
				header.locator('summary', { hasText: 'Menu' }),
			];
			let right = 0;
			for (const item of items) {
				await expect(item).toBeVisible();
				const box = (await item.boundingBox())!;
				expect(box.x).toBeGreaterThanOrEqual(right);
				right = box.x + box.width;
			}
			expect(right).toBeLessThanOrEqual(360);
			await expect(header.getByRole('link', { name: 'YouTube', exact: true })).toBeHidden();
		});
	}
});

for (const path of builtPages().filter((p) => p === '/' || p === '/en/')) {
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
