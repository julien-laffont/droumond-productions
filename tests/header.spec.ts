// The header, the same on every page: the symbol, the sections, the language menu and Contacto.
import { expect, test } from '@playwright/test';
import { inEachBuild, languageOf, pagesOf } from './pages';

/** What the header holds in each language. The English texts are provisional (#18). */
const EXPECTED = {
	pt: {
		symbol: { name: 'Droumond Productions, início', href: '/' },
		nav: 'Principal',
		links: [
			{ name: 'Projetos', href: '/#projetos' },
			{ name: 'Sobre', href: '/#sobre' },
			{ name: 'Equipa', href: '/#equipa' },
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
			{ name: 'Team', href: '/en/#team' },
			{ name: 'Filming', href: '/en/filming/' },
		],
		contact: { name: 'Contact', href: '/en/#contact' },
	},
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
			).toHaveAttribute('href', expected.contact.href);
		});
	}
});
