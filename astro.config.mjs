// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://docs.astro.build/en/reference/configuration-reference/
// No `output` option: Astro builds a static site by default, plain HTML files in dist/.
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
});
