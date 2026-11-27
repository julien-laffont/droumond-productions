// The interface texts in European Portuguese. The English dictionary has the same keys.
// The final menu texts are Julien's (#18).
export const pt = {
	header: {
		/** The symbol's name, for screen readers: it leads to the home page. */
		home: 'Droumond Productions, início',
		nav: 'Principal',
		projects: 'Projetos',
		about: 'Sobre',
		cast: 'Elenco',
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
		/** The tail of the reel above the footer (#36): decorative, hidden from screen readers. */
		reelEnd: 'Fim da bobina',
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
		/** Decorative: how the reel moves, on a desktop (scroll) and elsewhere (swipe). */
		hint: { scroll: 'Role para avançar a fita →', swipe: 'Deslize para o lado →' },
		/** Decorative: the reel's name, by the bar and on the leader and the tail. */
		reel: 'Rolo 01',
		/** Decorative: the tail's word. */
		end: 'Fim',
		pause: 'Pausar vídeos',
		resume: 'Retomar vídeos',
	},
	/** The Sobre section of the home page; its text is in src/content/about/, the team in src/config/team.ts. */
	about: {
		title: 'Sobre',
		/** Above the team's photos; also the name of their list. */
		founders: 'Cofundadores',
	},
	/** The Elenco section of the home page; the people are in src/config/cast.ts. */
	cast: {
		title: 'Elenco',
		/** Above the contact sheet, printed as on the film: decorative, hidden from screen readers. */
		sheet: 'Folha de contactos · Rolo 02',
		pause: 'Pausar elenco',
		resume: 'Retomar elenco',
	},
	/** The Equipa section of the home page; the people are in src/config/crew.ts. */
	crew: {
		title: 'Equipa',
	},
	/** The first screen of the home page (#13). */
	hero: {
		/** The code line above the name, printed as on the film (#36): decorative, hidden from screen readers. */
		code: '35 mm · Droumond 2026 · Leiria · Rolo 01',
		/** The words under the name, in one line: decorative, hidden from screen readers. */
		words: ['Séries', 'Suspense', 'Terror', 'Filmagens'],
		/** The line under the name: the real text. */
		line: 'Produtora audiovisual',
		/** The strip's button, before and after pausing. */
		pause: 'Pausar fita',
		resume: 'Retomar fita',
	},
	/** The Contacto block, on the home page and on the filming page (#7, #16). */
	contact: {
		title: 'Contacto',
		line: 'Para um projeto, uma filmagem ou uma pergunta, escreva-nos.',
		/** The line under the address: the Privacy Policy link and a full stop follow it. */
		privacyBefore: 'Os dados que nos enviar são tratados de acordo com a',
		privacy: 'Política de Privacidade',
	},
	/** The Filming service (#16): the home page's band and the filming page. The texts are Julien's and Nal's (#18). */
	filming: {
		label: 'Serviço de filmagens',
		/** Julien's sentence: the band's title and the filming page's heading. */
		title: 'Quer a Droumond Productions para gravação?',
		/** The band's sentence. */
		line: 'Vídeos para artistas e projetos de cinema, filmados com a equipa e o material das nossas séries.',
		/** The band's button, to the filming page. */
		button: 'Ver o serviço',
		/** The filming page's short text: what the service is and who it is for. */
		text: 'Filmamos videoclipes e outros vídeos para artistas, e projetos de cinema, na região de Leiria, com a equipa e o material com que fazemos as nossas séries. Diga-nos o que quer gravar, onde e quando, e respondemos com o que podemos fazer.',
		/** The labels of the clapperboard's fields: decorative, hidden from screen readers. */
		slate: { production: 'Prod.', scene: 'Cena', take: 'Take', date: 'Data' },
		/** The subject of the email written from the filming page (#7). */
		subject: 'Serviço de filmagens',
		/** The filming page's <title> and description. */
		pageTitle: 'Serviço de filmagens · Droumond Productions',
		description:
			'Serviço de filmagens da Droumond Productions em Leiria: vídeos para artistas e projetos de cinema.',
		/** The example under the filming page's clapperboard: its title, and the line under its link. */
		example: {
			title: 'Exemplo',
			note: 'Videoclipe do Carlos Droumond. Abre no YouTube, num separador novo.',
		},
	},
	/** The page of Efecto Placebo; its texts are in src/content/efecto-placebo/. */
	efectoPlacebo: {
		/** Decorative: the code line above the title, printed as on the film. */
		code: '35 mm · Efecto Placebo · Leiria',
		pause: 'Pausar vídeo',
		resume: 'Retomar vídeo',
		fullTeaser: 'Ver o teaser completo',
		synopsis: 'Sinopse',
		characters: 'Personagens',
	},
	/** The page of Resident Evil; its texts are in src/content/resident-evil/. */
	residentEvil: {
		/** Decorative: the code line above the title, printed as on the film. */
		code: '35 mm · Resident Evil · Marinha Grande',
		episodes: 'Episódios',
		/** Followed by the episode's number. */
		episode: 'Episódio',
		opensOnInstagram: 'Os episódios abrem no Instagram, num separador novo.',
		/** Under the invitation to Instagram, at the end of the page. */
		comingSoon: '5.º episódio: em breve, no Instagram.',
	},
	/** The invitations to the Instagram profile, on the home page and three other pages. */
	instagram: {
		/** The home page's band, under the profile's name: the sentence and the button. */
		line: 'Episódios, bastidores e o que estamos a gravar agora.',
		follow: 'Seguir no Instagram',
		/** At the end of Resident Evil's page. The title goes between `before` and `after`. */
		residentEvil: {
			lead: 'Quer ver mais?',
			before: 'Os bastidores de',
			after: 'estão no nosso Instagram.',
			button: 'Ver no Instagram',
		},
		/** Beside Efecto Placebo's full teaser. */
		efectoPlacebo: 'Acompanhe a gravação no Instagram',
		/** On the filming page's clapperboard. */
		filming: 'Veja o nosso trabalho no Instagram',
	},
	home: {
		title: 'Droumond Productions',
		description:
			'Droumond Productions, produtora audiovisual de Leiria: séries de ficção, vídeos para artistas e projetos de cinema.',
	},
};

export type Dictionary = typeof pt;
