// The two builds the suite checks, and the pages each one generated.
import { existsSync, globSync } from 'node:fs';
import { test } from '@playwright/test';
import type { Language } from '../src/config/site';

// Ports 4341 and 4342, not 4331 or 4332, which Julien's landing page uses: with both projects
// open, the suite would test the wrong site.

/** The published build (`npm run build`), the only one Lighthouse checks. */
const PUBLISHED = {
	name: 'published',
	dist: 'dist',
	port: 4341,
	command: 'npm run build',
	english: false,
} as const;

/** A test build with English (`npm run build:english`): checks now what only exists with it. */
const WITH_ENGLISH = {
	name: 'english',
	dist: 'dist-en',
	port: 4342,
	command: 'npm run build:english',
	english: true,
} as const;

export const BUILDS = [PUBLISHED, WITH_ENGLISH];

export type Build = (typeof BUILDS)[number];

/** The published build's folder, the one Lighthouse checks. */
export const DIST = PUBLISHED.dist;

/** Declares the tests once per build, each against its own server. */
export function inEachBuild(tests: (build: Build) => void) {
	for (const build of BUILDS) {
		test.describe(`build ${build.name}`, () => {
			test.use({ baseURL: `http://localhost:${build.port}` });
			tests(build);
		});
	}
}

/** Every HTML page of a build: `index.html` → `/`, `en/index.html` → `/en/`. */
export function pagesOf(build: Build): string[] {
	if (!existsSync(build.dist)) {
		throw new Error(`Missing folder ${build.dist}. Run "${build.command}" first.`);
	}
	return pagesIn(build.dist);
}

/** Every HTML page of the published build. */
export function builtPages(): string[] {
	return pagesOf(PUBLISHED);
}

/** A page's language, from its address: English under /en/, Portuguese everywhere else. */
export function languageOf(path: string): Language {
	return path.startsWith('/en/') ? 'en' : 'pt';
}

/** Every HTML page of a folder, as if it were a build. */
export function pagesIn(folder: string): string[] {
	return globSync('**/*.html', { cwd: folder })
		.map((file) => `/${file.replace(/(^|\/)index\.html$/, '$1')}`)
		.sort();
}
