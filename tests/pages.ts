// The build the suite checks, and the pages it generated.
import { existsSync, globSync } from 'node:fs';
import { expect, type Page } from '@playwright/test';
import type { Language } from '../src/config/site';

/** The build's folder (`npm run build`): the suite, Lighthouse and Publishing all use it. */
export const DIST = 'dist';

/** The port the suite serves the build on: not 4331 or 4332, which Julien's landing page uses. */
export const PORT = 4341;

/** Every HTML page of the build: `index.html` → `/`, `en/index.html` → `/en/`. */
export function builtPages(): string[] {
	if (!existsSync(DIST)) {
		throw new Error(`Missing folder ${DIST}. Run "npm run build" first.`);
	}
	return pagesIn(DIST);
}

/** A page's language, from its address: /en/, /es/, /fr/, and Portuguese everywhere else. */
export function languageOf(path: string): Language {
	return (path.match(/^\/(en|es|fr)\//)?.[1] as Language | undefined) ?? 'pt';
}

/** Opens a page and fails if it does not exist: astro preview answers a missing one with its own 404 page. */
export async function openExisting(page: Page, path: string) {
	const response = await page.goto(path);
	expect(response?.status(), `status of ${path}`).toBe(200);
}

/** Every HTML page of a folder, as if it were a build. */
export function pagesIn(folder: string): string[] {
	return globSync('**/*.html', { cwd: folder })
		.map((file) => `/${file.replace(/(^|\/)index\.html$/, '$1')}`)
		.sort();
}
