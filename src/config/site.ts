// The site's settings in one place: the contact email, the company's legal data and social
// profiles, the address, the languages and which of them this build publishes.

/**
 * The contact email: the footer, the Contacto block and the Privacy Policy all read it here, so
 * changing this line changes it on the whole site. For now Carlos's gmail (#4, #7); the Privacy
 * Policy's entry on received emails names Google as recipient while it is a gmail.
 */
export const CONTACT_EMAIL = 'carlosdroumondwen@gmail.com';

/**
 * The company's legal identification, shown in the footer (CSC, art. 171.º; #3), from the company
 * card (#18). Only the labels are translated. The registry names no conservatória (Julien's
 * choice): the registration number is the NIPC.
 */
export const LEGAL = {
	firm: 'Droumond & Laffont - Produções, Lda',
	companyType: 'Sociedade por quotas',
	registeredOffice: 'Rua António Campos, Lote 1, 1A, 2410-369 Leiria',
	registry: 'Registo Comercial, matrícula n.º 519294700',
	nipc: '519294700',
	shareCapital: '100 €',
};

/**
 * The consumer arbitration centre for the company's seat (CNIACC covers the whole Leiria district),
 * named in the footer because the company also works for consumers (Lei 144/2015, art. 18.º; #3).
 * If the seat moves, check the centre again: https://www.cniacc.pt/pt/abrangencia-territorial
 */
export const CONSUMER_ARBITRATION = {
	name: 'CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo',
	url: 'https://www.cniacc.pt',
};

/** The company's profiles: links only, never embeds (#3). */
export const SOCIAL = {
	youtube: 'https://www.youtube.com/@DroumondProductions',
	instagram: 'https://www.instagram.com/droumond_productions',
};

/**
 * The site's address, without a final slash. The hreflang links use it (only when English is
 * published), and the Publishing confirmation (`npm run confirm`) checks the site there.
 */
export const SITE = 'https://droumondproductions.com';

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** The start of each language's addresses. Portuguese, the default language, sits at `/`. */
export const PREFIXES: Record<Language, string> = { pt: '/', en: '/en/' };

/** The value of `<html lang>` in each language. */
export const HTML_CODES: Record<Language, string> = { pt: 'pt-PT', en: 'en' };

/** Each language's name, written in that language, as the language button shows it. */
export const LANGUAGE_NAMES: Record<Language, string> = { pt: 'Português', en: 'English' };

/** English is only published once its texts are translated (#18): then this becomes `true`. */
const ENGLISH_PUBLISHED = false;

/**
 * The languages this build generates: only they get pages. The test build (`ENGLISH=1`, see
 * `npm run build:english`) adds English, to check now what only exists with both languages.
 */
export const PUBLISHED_LANGUAGES: readonly Language[] =
	ENGLISH_PUBLISHED || process.env.ENGLISH === '1' ? LANGUAGES : ['pt'];
