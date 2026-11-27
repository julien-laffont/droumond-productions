// The interface texts in French, addressing the reader as vous. A no-break space (U+00A0) comes
// before : ; ? ! and inside « », so the mark never starts a line.
import type { Dictionary } from './pt';

export const fr: Dictionary = {
	header: {
		home: 'Droumond Productions, accueil',
		nav: 'Principal',
		projects: 'Projets',
		about: 'À propos',
		cast: 'Distribution',
		filming: 'Tournages',
		contact: 'Contact',
		menu: 'Menu',
		language: 'langue',
	},
	footer: {
		legal: {
			firm: 'Dénomination sociale',
			companyType: 'Forme juridique',
			registeredOffice: 'Siège social',
			registry: 'Registre du commerce',
			nipc: 'Numéro fiscal (NIPC)',
			shareCapital: 'Capital social',
		},
		privacy: 'Politique de confidentialité',
		founded: 'Depuis 2026',
		reelEnd: 'Fin de la bobine',
		disputes: {
			before: 'En cas de litige de consommation, vous pouvez vous adresser au',
			more: 'Plus d’informations sur le',
		},
	},
	projects: {
		title: 'Projets',
		hint: { scroll: 'Faites défiler pour avancer la pellicule →', swipe: 'Glissez sur le côté →' },
		reel: 'Bobine 01',
		end: 'Fin',
		pause: 'Mettre les vidéos en pause',
		resume: 'Reprendre les vidéos',
	},
	about: {
		title: 'À propos',
		founders: 'Cofondateurs',
	},
	cast: {
		title: 'Distribution',
		sheet: 'Planche contact · Bobine 02',
		pause: 'Mettre la distribution en pause',
		resume: 'Reprendre la distribution',
	},
	crew: {
		title: 'Équipe',
	},
	hero: {
		code: '35 mm · Droumond 2026 · Leiria · Bobine 01',
		words: ['Séries', 'Thriller', 'Horreur', 'Tournages'],
		line: 'Société de production audiovisuelle',
		pause: 'Mettre la pellicule en pause',
		resume: 'Reprendre la pellicule',
	},
	contact: {
		title: 'Contact',
		line: 'Pour un projet, un tournage ou une question, écrivez-nous.',
		privacyBefore: 'Les données que vous nous envoyez sont traitées conformément à la',
		privacy: 'Politique de confidentialité',
	},
	filming: {
		label: 'Service de tournage',
		title: 'Vous voulez Droumond Productions sur votre tournage ?',
		line: 'Vidéos pour artistes et projets de cinéma, tournés avec l’équipe et le matériel de nos séries.',
		button: 'Voir le service',
		text: 'Nous tournons des clips musicaux et d’autres vidéos pour des artistes, ainsi que des projets de cinéma, dans la région de Leiria, avec l’équipe et le matériel de nos séries. Dites-nous ce que vous voulez filmer, où et quand, et nous vous dirons ce que nous pouvons faire.',
		slate: { production: 'Prod.', scene: 'Scène', take: 'Prise', date: 'Date' },
		subject: 'Service de tournage',
		pageTitle: 'Service de tournage · Droumond Productions',
		description:
			'Le service de tournage de Droumond Productions à Leiria : vidéos pour artistes et projets de cinéma.',
		example: {
			title: 'Exemple',
			note: 'Clip musical de Carlos Droumond. S’ouvre sur YouTube, dans un nouvel onglet.',
		},
	},
	efectoPlacebo: {
		code: '35 mm · Efecto Placebo · Leiria',
		pause: 'Mettre la vidéo en pause',
		resume: 'Reprendre la vidéo',
		fullTeaser: 'Voir le teaser complet',
		synopsis: 'Synopsis',
		characters: 'Personnages',
	},
	residentEvil: {
		code: '35 mm · Resident Evil · Marinha Grande',
		episodes: 'Épisodes',
		episode: 'Épisode',
		opensOnInstagram: 'Les épisodes s’ouvrent sur Instagram, dans un nouvel onglet.',
		comingSoon: 'Épisode 5 : bientôt, sur Instagram.',
	},
	instagram: {
		line: 'Épisodes, coulisses et ce que nous tournons en ce moment.',
		follow: 'Suivre sur Instagram',
		residentEvil: {
			lead: 'Envie d’en voir plus ?',
			before: 'Les coulisses de',
			after: 'sont sur notre Instagram.',
			button: 'Voir sur Instagram',
		},
		efectoPlacebo: 'Suivez le tournage sur Instagram',
		filming: 'Découvrez notre travail sur Instagram',
	},
	home: {
		title: 'Droumond Productions',
		description:
			'Droumond Productions, société de production audiovisuelle basée à Leiria : séries de fiction, vidéos pour artistes et projets de cinéma.',
	},
};
