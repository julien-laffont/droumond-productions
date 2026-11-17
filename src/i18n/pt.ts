// The interface texts in European Portuguese. The English dictionary has the same keys.
// The final menu texts are Julien's (#18).
export const pt = {
	header: {
		/** The symbol's name, for screen readers: it leads to the home page. */
		home: 'Droumond Productions, início',
		nav: 'Principal',
		projects: 'Projetos',
		about: 'Sobre',
		team: 'Equipa',
		filming: 'Filmagens',
		contact: 'Contacto',
		menu: 'Menu',
		/** Read after the language code by screen readers: "PT, língua: Português". */
		language: 'língua',
	},
	footer: {
		/** The labels of the company's legal identification (the values are in src/config/site.ts). */
		legal: {
			firm: 'Firma',
			companyType: 'Tipo de sociedade',
			registeredOffice: 'Sede',
			registry: 'Conservatória e matrícula',
			nipc: 'NIPC',
			shareCapital: 'Capital social',
		},
		privacy: 'Política de Privacidade',
	},
	home: {
		title: 'Droumond Productions',
		description: 'Droumond Productions, produtora audiovisual portuguesa. Site em construção.',
		placeholder: 'Site em construção.',
	},
};

export type Dictionary = typeof pt;
