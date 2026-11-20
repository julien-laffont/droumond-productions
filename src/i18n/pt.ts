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
			registry: 'Registo comercial',
			nipc: 'NIPC',
			shareCapital: 'Capital social',
		},
		privacy: 'Política de Privacidade',
		/** Under the company's name: the year it was founded (26/02/2026, company card). */
		founded: 'Desde 2026',
		/**
		 * The consumer arbitration line (Lei 144/2015, art. 18.º): the centre's name and site follow
		 * `before`, the Portal do Consumidor and its site follow `more`.
		 */
		disputes: {
			before: 'Em caso de litígio de consumo, pode recorrer ao',
			more: 'Mais informações no',
		},
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
	/** The Sobre section of the home page (#15); its text is in src/content/about/. */
	about: {
		title: 'Sobre',
	},
	/** The Equipa section of the home page (#15); the people are in src/config/team.ts. */
	team: {
		title: 'Equipa',
		/** Next to the title while Characters stand in for the team (TEAM_IS_PROVISIONAL). */
		provisional: 'Provisório: personagens no lugar da equipa',
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
	/** The Filming service (#16): the home page's band and the filming page. Texts of #18. */
	filming: {
		label: 'Serviço de filmagens',
		/** Julien's sentence: the band's title and the filming page's heading. */
		title: 'Quer a Droumond Productions para gravação?',
		/** The band's sentence. */
		line: 'Publicidade, vídeos para marcas e videoclipes, filmados com a equipa e o material das nossas séries.',
		/** The band's button, to the filming page. */
		button: 'Ver o serviço',
		/** The filming page's short text: what the service is and who it is for. */
		text: 'Filmamos publicidade, vídeos para marcas e videoclipes na região de Leiria, com a equipa e o material com que fazemos as nossas séries. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		/** The subject of the email written from the filming page (#7). */
		subject: 'Serviço de filmagens',
		/** The filming page's <title> and description. */
		pageTitle: 'Serviço de filmagens · Droumond Productions',
		description:
			'Serviço de filmagens da Droumond Productions em Leiria: publicidade, vídeos para marcas e videoclipes.',
	},
	home: {
		title: 'Droumond Productions',
		description:
			'Droumond Productions, produtora audiovisual de Leiria: séries de ficção, publicidade, vídeos para marcas e videoclipes.',
	},
};

export type Dictionary = typeof pt;
