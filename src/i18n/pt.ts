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
	projects: {
		title: 'Projetos',
		watchTeaser: 'Ver o teaser',
		/** Under the teaser's image, before the click (#3); the Privacy Policy link follows it. */
		notice:
			'Ao clicar, o vídeo é carregado do YouTube: a Google recebe o seu endereço IP e pode guardar dados no seu dispositivo.',
		privacy: 'Política de Privacidade',
		/** The player's name for screen readers, after the Project's title. */
		player: 'teaser no YouTube',
	},
	home: {
		title: 'Droumond Productions',
		description: 'Droumond Productions, produtora audiovisual portuguesa. Site em construção.',
		placeholder: 'Site em construção.',
	},
};

export type Dictionary = typeof pt;
