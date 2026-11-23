// The address of each page and section in each language. Addresses and anchors are translated
// (#6), so the same page cannot be found by swapping the prefix: these tables pair them.
import type { Language } from '../config/site';

/** Each page's address in each language. The file in src/localized-pages/ must match. */
export const PAGES = {
	home: { pt: '/', en: '/en/' },
	/** The Filming service page (#16). */
	filming: { pt: '/filmagens/', en: '/en/filming/' },
	/** The Privacy Policy, made in #17. */
	privacy: { pt: '/politica-de-privacidade/', en: '/en/privacy-policy/' },
} satisfies Record<string, Record<Language, string>>;

export type PageId = keyof typeof PAGES;

/** The anchors of the home page's sections, in each language. Contacto's is also the filming page's. */
const SECTIONS = {
	projects: { pt: 'projetos', en: 'projects' },
	about: { pt: 'sobre', en: 'about' },
	team: { pt: 'equipa', en: 'team' },
	contact: { pt: 'contacto', en: 'contact' },
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
