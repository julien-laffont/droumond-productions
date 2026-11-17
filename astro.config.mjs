// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import localizedPages from './src/integrations/localized-pages';

// https://docs.astro.build/en/reference/configuration-reference/
// No `output` option: Astro builds a static site by default, plain HTML files in dist/.
// Every address ends in a slash (/filmagens/), as Apache serves a folder's index.html.
export default defineConfig({
	trailingSlash: 'always',
	integrations: [localizedPages()],

	// The site's only font, self-hosted (no Google Fonts, for the GDPR): Archivo, variable in
	// weight and width, latin subset, licence next to it. Astro creates the fallback font with
	// size-adjust, so the text does not jump when Archivo arrives.
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Archivo',
			cssVariable: '--font-archivo',
			fallbacks: ['Arial', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/archivo.woff2'],
						weight: '100 900',
						stretch: '62% 125%',
						style: 'normal',
					},
				],
			},
		},
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
