// The build the suite and Lighthouse check, and the pages it generated.
import { existsSync, globSync } from 'node:fs';

/** The build folder, made by `npm run build`. */
export const DIST = 'dist';
/**
 * The port where `astro preview` serves the build during the tests. Not 4331 or 4332, which
 * Julien's landing page uses: with both projects open, the suite would test the wrong site.
 */
export const PORT = 4341;

/** Every HTML page of the build: `index.html` → `/`, `en/index.html` → `/en/`. */
export function builtPages(): string[] {
	if (!existsSync(DIST)) throw new Error(`Missing folder ${DIST}. Run "npm run build" first.`);
	return pagesIn(DIST);
}

/** Every HTML page of a folder, as if it were a build. */
export function pagesIn(folder: string): string[] {
	return globSync('**/*.html', { cwd: folder })
		.map((file) => `/${file.replace(/(^|\/)index\.html$/, '$1')}`)
		.sort();
}
