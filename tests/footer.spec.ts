// The footer, on every page: the tail of the reel (#36), then the legal identification, the founding
// year, the email, the Privacy Policy, YouTube, Instagram, the Livro de Reclamações and the consumer
// arbitration centre (#3, #6, #18).
import { expect, test } from '@playwright/test';
import { CONTACT_EMAIL } from '../src/config/site';
import { languageOf, builtPages } from './pages';

/** What the footer holds in each language. */
const EXPECTED = {
	pt: {
		legal: ['Firma', 'Tipo de sociedade', 'Sede', 'Registo comercial', 'NIPC', 'Capital social'],
		privacy: { name: 'Política de Privacidade', href: '/politica-de-privacidade/' },
		founded: 'Desde 2026',
		reelEnd: 'Fim da bobina',
		disputes:
			'Em caso de litígio de consumo, pode recorrer ao CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (www.cniacc.pt). Mais informações no Portal do Consumidor (www.consumidor.gov.pt).',
	},
	en: {
		legal: [
			'Company name',
			'Legal form',
			'Registered office',
			'Commercial register',
			'Tax number (NIPC)',
			'Share capital',
		],
		privacy: { name: 'Privacy Policy', href: '/en/privacy-policy/' },
		founded: 'Est. 2026',
		reelEnd: 'End of reel',
		disputes:
			'In the event of a consumer dispute, you can turn to CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (www.cniacc.pt). For more information, see the Portal do Consumidor (www.consumidor.gov.pt).',
	},
	es: {
		legal: [
			'Razón social',
			'Forma jurídica',
			'Domicilio social',
			'Registro mercantil',
			'Número fiscal (NIPC)',
			'Capital social',
		],
		privacy: { name: 'Política de privacidad', href: '/es/politica-de-privacidad/' },
		founded: 'Desde 2026',
		reelEnd: 'Fin de la bobina',
		disputes:
			'En caso de litigio de consumo, puede acudir al CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (www.cniacc.pt). Más información en el Portal do Consumidor (www.consumidor.gov.pt).',
	},
	fr: {
		legal: [
			'Dénomination sociale',
			'Forme juridique',
			'Siège social',
			'Registre du commerce',
			'Numéro fiscal (NIPC)',
			'Capital social',
		],
		privacy: { name: 'Politique de confidentialité', href: '/fr/politique-de-confidentialite/' },
		founded: 'Depuis 2026',
		reelEnd: 'Fin de la bobine',
		disputes:
			'En cas de litige de consommation, vous pouvez vous adresser au CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (www.cniacc.pt). Plus d’informations sur le Portal do Consumidor (www.consumidor.gov.pt).',
	},
};

/** The company's legal data, from the company card (#18): only the labels are translated. */
const LEGAL_VALUES = [
	'Droumond & Laffont - Produções, Lda',
	'Sociedade por quotas',
	'Rua António Campos, Lote 1, 1A, 2410-369 Leiria',
	'Matrícula n.º 519294700',
	'519294700',
	'100 €',
];

for (const path of builtPages()) {
	const expected = EXPECTED[languageOf(path)];

	test(`${path}: the reel ends above the footer ("${expected.reelEnd}"), hidden from screen readers`, async ({
		page,
	}) => {
		await page.goto(path);
		const tail = page.getByText(expected.reelEnd, { exact: true });
		await expect(tail).toBeVisible();
		expect(await tail.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
		// The film's edge codes, in amber, as on the rest of the reel.
		await expect(page.getByText('48A', { exact: true })).toBeVisible();
		const [tailBox, legalBox] = [
			await tail.boundingBox(),
			await page.getByRole('contentinfo').locator('dl').boundingBox(),
		];
		expect(tailBox!.y + tailBox!.height).toBeLessThan(legalBox!.y);
	});

	test(`${path}: the footer identifies the company with its legal data, in Portuguese`, async ({
		page,
	}) => {
		await page.goto(path);
		const legal = page.getByRole('contentinfo').locator('dl');
		await expect(legal.locator('dt')).toHaveText(expected.legal);
		const values = legal.locator('dd');
		await expect(values).toHaveText(LEGAL_VALUES);
		for (const value of await values.all()) await expect(value).toHaveAttribute('lang', 'pt-PT');
	});

	test(`${path}: the founding year sits under the company's name`, async ({ page }) => {
		await page.goto(path);
		const footer = page.getByRole('contentinfo');
		const name = footer.getByText('Droumond Productions', { exact: true });
		const founded = footer.getByText(expected.founded, { exact: true });
		await expect(founded).toBeVisible();
		// Both boxes in the same frame: under load the page can still move between two reads.
		const gap = await founded.evaluate(
			(year, nameElement) =>
				year.getBoundingClientRect().top - nameElement!.getBoundingClientRect().bottom,
			await name.elementHandle(),
		);
		expect(gap).toBeGreaterThan(-1);
	});

	test(`${path}: the footer names the consumer arbitration centre and its site, below the rest`, async ({
		page,
	}) => {
		await page.goto(path);
		const footer = page.getByRole('contentinfo');
		const disputes = footer.getByText(expected.disputes, { exact: true });
		await expect(disputes).toBeVisible();
		// The Portuguese names keep their language for screen readers.
		for (const name of [
			'CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo',
			'Portal do Consumidor',
		]) {
			await expect(disputes.getByText(name, { exact: true })).toHaveAttribute('lang', 'pt-PT');
		}
		for (const [name, href] of [
			['www.cniacc.pt', 'https://www.cniacc.pt'],
			['www.consumidor.gov.pt', 'https://www.consumidor.gov.pt'],
		]) {
			const link = disputes.getByRole('link', { name, exact: true });
			await expect(link).toHaveAttribute('href', href);
			await expect(link).toHaveAttribute('target', '_blank');
		}
		// A line of its own under the footer's columns.
		const icon = footer.getByRole('img', { name: 'Livro de Reclamações' });
		const [iconBox, legalBox, disputesBox] = [
			await icon.boundingBox(),
			await footer.locator('dl').boundingBox(),
			await disputes.boundingBox(),
		];
		expect(disputesBox!.y).toBeGreaterThan(
			Math.max(iconBox!.y + iconBox!.height, legalBox!.y + legalBox!.height),
		);
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
		const link = page.getByRole('contentinfo').getByRole('link', { name: 'Livro de Reclamações' });
		await expect(link).toHaveAttribute('href', 'https://www.livroreclamacoes.pt/inicio');
		const icon = link.getByRole('img', { name: 'Livro de Reclamações' });
		await expect(icon).toBeVisible();
		expect(await icon.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
	});
}
