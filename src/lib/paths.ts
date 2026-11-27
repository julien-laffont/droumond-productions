// The address of each page and section in each language. Addresses and anchors are translated
// (#6), so the same page cannot be found by swapping the prefix: these tables pair them.
import type { Language } from '../config/site';

/** Each page's address in each language. The file in src/localized-pages/ must match. */
export const PAGES = {
	home: { pt: '/', en: '/en/', es: '/es/', fr: '/fr/' },
	/** The Filming service page (#16). */
	filming: { pt: '/filmagens/', en: '/en/filming/', es: '/es/rodajes/', fr: '/fr/tournages/' },
	/** The page of the Project Efecto Placebo, whose title is never translated. */
	efectoPlacebo: {
		pt: '/efecto-placebo/',
		en: '/en/efecto-placebo/',
		es: '/es/efecto-placebo/',
		fr: '/fr/efecto-placebo/',
	},
	/** The page of the Project Resident Evil, whose title is never translated. */
	residentEvil: {
		pt: '/resident-evil/',
		en: '/en/resident-evil/',
		es: '/es/resident-evil/',
		fr: '/fr/resident-evil/',
	},
	/** The Privacy Policy, made in #17. */
	privacy: {
		pt: '/politica-de-privacidade/',
		en: '/en/privacy-policy/',
		es: '/es/politica-de-privacidad/',
		fr: '/fr/politique-de-confidentialite/',
	},
} satisfies Record<string, Record<Language, string>>;

export type PageId = keyof typeof PAGES;

/** The anchors of the home page's sections, in each language. Contacto's is also the filming page's. */
const SECTIONS = {
	projects: { pt: 'projetos', en: 'projects', es: 'proyectos', fr: 'projets' },
	about: { pt: 'sobre', en: 'about', es: 'nosotros', fr: 'a-propos' },
	cast: { pt: 'elenco', en: 'cast', es: 'reparto', fr: 'distribution' },
	crew: { pt: 'equipa', en: 'crew', es: 'equipo', fr: 'equipe' },
	contact: { pt: 'contacto', en: 'contact', es: 'contacto', fr: 'contact' },
} satisfies Record<string, Record<Language, string>>;

export type SectionId = keyof typeof SECTIONS;

/** A section's anchor, its `id`: `projetos`, `projects`. */
export function sectionAnchor(section: SectionId, language: Language): string {
	return SECTIONS[section][language];
}

/**
 * A home page section, from any page: `/#projetos`, `/en/#projects`. On the home page itself the
 * browser only scrolls, without reloading.
 */
export function sectionPath(section: SectionId, language: Language): string {
	return `${PAGES.home[language]}#${sectionAnchor(section, language)}`;
}

/**
 * Where the header's Contacto leads: on the filming page, its own Contacto block (#7); everywhere
 * else, the home page's.
 */
export function contactPath(page: PageId | undefined, language: Language): string {
	return page === 'filming'
		? `${PAGES.filming[language]}#${sectionAnchor('contact', language)}`
		: sectionPath('contact', language);
}
