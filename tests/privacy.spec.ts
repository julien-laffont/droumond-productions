// The Privacy Policy (#17): every point of GDPR art. 13 (#3, #7), in both languages, reviewed by
// Julien (#18).
import { expect, test, type Page } from '@playwright/test';
import { CONTACT_EMAIL, LEGAL } from '../src/config/site';
import { openExisting } from './pages';

/** What the policy holds in each language. The English texts are reviewed. */
const POLICIES = [
	{
		path: '/politica-de-privacidade/',
		english: false,
		title: 'Política de Privacidade',
		sections: [
			'Quem somos',
			'O que este site não faz',
			'Emails recebidos',
			'Registos do servidor',
			'Os seus direitos',
			'Queixa à CNPD',
			'Alterações a esta política',
		],
	},
	{
		path: '/en/privacy-policy/',
		english: true,
		title: 'Privacy Policy',
		sections: [
			'Who we are',
			'What this site does not do',
			'Emails we receive',
			'Server logs',
			'Your rights',
			'Complaint to the CNPD',
			'Changes to this policy',
		],
	},
];

for (const policy of POLICIES) {
	test(`${policy.path}: the policy has its title and every section, with nothing left to fill`, async ({
		page,
	}) => {
		await openExisting(page, policy.path);
		const main = page.getByRole('main');
		await expect(main.getByRole('heading', { level: 1 })).toHaveText(policy.title);
		await expect(main.getByRole('heading', { level: 2 })).toHaveText(policy.sections);
		expect(await main.innerText()).not.toMatch(/por preencher|provis[óo]rio|provisional/i);
	});

	test(`${policy.path}: the policy names the company and its email from the configuration`, async ({
		page,
	}) => {
		await openExisting(page, policy.path);
		const main = page.getByRole('main');
		const email = main.getByRole('link', { name: CONTACT_EMAIL, exact: true });
		await expect(email.first()).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
		const controller = main.getByRole('list').first();
		for (const value of [LEGAL.firm, LEGAL.companyType, LEGAL.registeredOffice, LEGAL.nipc]) {
			await expect(controller).toContainText(value);
		}
		expect(await main.innerText()).not.toMatch(/\{[a-z.]+\}/i);
	});

	if (policy.english) {
		test(`${policy.path}: the Portuguese names are marked as Portuguese, for screen readers`, async ({
			page,
		}) => {
			await openExisting(page, policy.path);
			const portuguese = await page.getByRole('main').locator('[lang="pt-PT"]').allInnerTexts();
			expect(portuguese).toEqual(
				expect.arrayContaining([
					LEGAL.firm,
					LEGAL.companyType,
					LEGAL.registeredOffice,
					'Comissão Nacional de Proteção de Dados',
				]),
			);
		});
	}
}
