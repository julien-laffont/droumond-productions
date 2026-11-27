// The site's settings in one place: the contact email, the company's legal data and social
// profiles, the address and the languages.

/**
 * The contact email: the footer, the Contacto block and the Privacy Policy all read it here, so
 * changing this line changes it on the whole site. The domain's address since #18, maybe not the
 * final one. Its mailbox is on Google Workspace (the domain's MX is Google), so the Privacy
 * Policy's entry on received emails names Google as recipient: check it if the mailbox moves.
 */
export const CONTACT_EMAIL = 'contact@droumondproductions.com';

/**
 * The company's legal identification, shown in the footer (CSC, art. 171.º; #3), from the company
 * card (#18). Only the labels are translated. The registry names no conservatória (Julien's
 * choice): the registration number in the commercial registry is the NIPC.
 */
export const LEGAL = {
	firm: 'Droumond & Laffont - Produções, Lda',
	companyType: 'Sociedade por quotas',
	registeredOffice: 'Rua António Campos, Lote 1, 1A, 2410-369 Leiria',
	registry: 'Matrícula n.º 519294700',
	nipc: '519294700',
	shareCapital: '100 €',
};

/**
 * The consumer arbitration centre for the company's seat (CNIACC covers the whole Leiria district),
 * named in the footer because the company also works for consumers (Lei 144/2015, art. 18.º; #3, #18).
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

/** Efecto Placebo's full teaser on YouTube: only ever a link, never a player. */
export const EFECTO_PLACEBO_TEASER = 'https://www.youtube.com/watch?v=Y785Re6Cyvk';

/** Blanco y Negro, Carlos Droumond's music video: the filming page's example, only ever a link. */
export const BLANCO_Y_NEGRO_VIDEO = 'https://www.youtube.com/watch?v=7VFBRzF9ni8';

/** Resident Evil's episodes on Instagram, in order: links only, never embeds. */
export const RESIDENT_EVIL_EPISODES = [
	'https://www.instagram.com/reel/DeXEyA6saok/',
	'https://www.instagram.com/reel/DezdFUHsaEK/',
	'https://www.instagram.com/reel/DfILJSmsRWk/',
	'https://www.instagram.com/reel/Dfh50ywMd3c/',
];

/**
 * The site's address, without a final slash. The hreflang links use it, and the Publishing
 * confirmation (`npm run confirm`) checks the site there.
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
