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

	// The fonts of Película (#36), self-hosted (no Google Fonts, for the GDPR), licences next to
	// them: Big Shoulders Display for names and titles (variable in weight), Space Mono 400 and 700
	// for everything else. Astro creates each fallback font with size-adjust, so the text does not
	// jump when the font arrives.
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Big Shoulders Display',
			cssVariable: '--font-big-shoulders',
			fallbacks: ['Arial Narrow', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/big-shoulders-display.woff2'],
						weight: '100 900',
						style: 'normal',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Space Mono',
			cssVariable: '--font-space-mono',
			fallbacks: ['Courier New', 'monospace'],
			options: {
				variants: [
					{ src: ['./src/assets/fonts/space-mono.woff2'], weight: '400', style: 'normal' },
					{ src: ['./src/assets/fonts/space-mono-bold.woff2'], weight: '700', style: 'normal' },
				],
			},
		},
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
