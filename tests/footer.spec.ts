// The footer, on every page: the legal identification, the email, the Privacy Policy, YouTube,
// Instagram and the Livro de Reclamações (#3, #6).
import { expect, test } from '@playwright/test';
import { CONTACT_EMAIL } from '../src/config/site';
import { inEachBuild, languageOf, pagesOf } from './pages';

/** What the footer holds in each language. The English texts are provisional (#18). */
const EXPECTED = {
	pt: {
		legal: [
			'Firma',
			'Tipo de sociedade',
			'Sede',
			'Conservatória e matrícula',
			'NIPC',
			'Capital social',
		],
		privacy: { name: 'Política de Privacidade', href: '/politica-de-privacidade/' },
	},
	en: {
		legal: [
			'Company name',
			'Company type',
			'Registered office',
			'Registry office and number',
			'Tax number (NIPC)',
			'Share capital',
		],
		privacy: { name: 'Privacy Policy', href: '/en/privacy-policy/' },
	},
};

inEachBuild((build) => {
	for (const path of pagesOf(build)) {
		const expected = EXPECTED[languageOf(path)];

		test(`${path}: the footer identifies the company, with placeholders until Julien sends the data`, async ({
			page,
		}) => {
			await page.goto(path);
			const legal = page.getByRole('contentinfo').locator('dl');
			await expect(legal.locator('dt')).toHaveText(expected.legal);
			await expect(legal.locator('dd')).toHaveText(Array(6).fill('Por preencher'));
		});

		test(`${path}: the footer's Privacy Policy link leads to the policy`, async ({ page }) => {
			await page.goto(path);
			await page
				.getByRole('contentinfo')
				.getByRole('link', { name: expected.privacy.name, exact: true })
				.click();
			await expect(page).toHaveURL(new RegExp(`${expected.privacy.href}$`));
			await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveText(
				expected.privacy.name,
			);
		});

		test(`${path}: the footer links to the email, the Privacy Policy, YouTube and Instagram`, async ({
			page,
		}) => {
			await page.goto(path);
			const footer = page.getByRole('contentinfo');
			const links = [
				{ name: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
				expected.privacy,
				{ name: 'YouTube', href: 'https://www.youtube.com/@DroumondProductions' },
				{ name: 'Instagram', href: 'https://www.instagram.com/droumond_productions' },
			];
			for (const { name, href } of links) {
				await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
			}
		});

		test(`${path}: the official Livro de Reclamações icon links to the platform`, async ({
			page,
		}) => {
			await page.goto(path);
			const link = page
				.getByRole('contentinfo')
				.getByRole('link', { name: 'Livro de Reclamações' });
			await expect(link).toHaveAttribute('href', 'https://www.livroreclamacoes.pt/inicio');
			const icon = link.getByRole('img', { name: 'Livro de Reclamações' });
			await expect(icon).toBeVisible();
			expect(await icon.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
		});
	}
});
