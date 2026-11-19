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
	/** The first screen of the home page (#13). */
	hero: {
		/** The symbol's name for screen readers. */
		logo: 'Logótipo da Droumond Productions',
		/** The words that pass one at a time under the name, hidden from screen readers. */
		words: ['Séries', 'Suspense', 'Terror', 'Filmagens'],
		/** The line that stays under the name: the real text. */
		line: 'Produtora audiovisual',
		/** The button that pauses the background video. Its name never changes: pressed means paused. */
		pause: 'Pausar vídeo',
	},
	/** The Contacto block, on the home page and on the filming page (#7, #16). */
	contact: {
		title: 'Contacto',
		line: 'Para um projeto, uma filmagem ou uma pergunta, escreva-nos.',
		/** The line under the address: the Privacy Policy link and a full stop follow it. */
		privacyBefore: 'Os dados que nos enviar são tratados de acordo com a',
		privacy: 'Política de Privacidade',
	},
	/** The Filming service (#16): the home page's band and the filming page. Provisional until #18. */
	filming: {
		label: 'Serviço de filmagens',
		/** Julien's sentence: the band's title and the filming page's heading. */
		title: 'Quer a Droumond Productions para gravação?',
		/** The band's sentence. */
		line: 'Levamos a nossa equipa e o nosso material de produção às suas filmagens.',
		/** The band's button, to the filming page. */
		button: 'Ver o serviço',
		/** The filming page's short text: what the service is and who it is for. */
		text: 'Levamos a equipa e o material com que fazemos as nossas séries às suas filmagens. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		/** The subject of the email written from the filming page (#7). */
		subject: 'Serviço de filmagens',
		/** The filming page's <title> and description. */
		pageTitle: 'Serviço de filmagens · Droumond Productions',
		description: 'Serviço de filmagens da Droumond Productions, produtora audiovisual portuguesa.',
	},
	home: {
		title: 'Droumond Productions',
		description: 'Droumond Productions, produtora audiovisual portuguesa. Site em construção.',
	},
};

export type Dictionary = typeof pt;
