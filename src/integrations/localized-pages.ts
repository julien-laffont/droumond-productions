// Creates the routes for the thin pages in src/localized-pages/<language>/, only for the published
// languages (as in Julien's landing page). Portuguese, the default language, has no prefix:
//   src/localized-pages/pt/index.astro → /
//   src/localized-pages/en/index.astro → /en/
//   src/localized-pages/en/filming.astro → /en/filming/
// Astro always generates every file in src/pages/, so pages with a language cannot live there.
// A new page only shows up in `npm run dev` after restarting it.
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { PREFIXES, PUBLISHED_LANGUAGES } from '../config/site';

export default function localizedPages(): AstroIntegration {
	return {
		name: 'localized-pages',
		hooks: {
			'astro:config:setup': ({ config, injectRoute }) => {
				const pagesDir = fileURLToPath(new URL('src/localized-pages/', config.root));
				for (const language of PUBLISHED_LANGUAGES) {
					for (const file of globSync('**/*.astro', { cwd: `${pagesDir}${language}` })) {
						const page = file.replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
						injectRoute({
							pattern: `${PREFIXES[language]}${page}`,
							entrypoint: `${pagesDir}${language}/${file}`,
						});
					}
				}
			},
		},
	};
}
