// The Lighthouse checker, on a test site with pages that fail each blocking target.
// Runs the real Lighthouse, one run per page: if a Lighthouse update changes the
// report and a target stops firing, these tests turn red.
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { expect, test } from '@playwright/test';
import { pagesIn } from '../pages';
import { checkSite } from './check';

// Each test analyzes its pages with Lighthouse, one at a time.
test.describe.configure({ timeout: 120_000 });

interface TestPageOptions {
	noindex?: boolean;
	head?: string;
	body?: string;
}

/** A page that meets every blocking target, unless the options break it. */
function testPage({ noindex = false, head = '', body = '' }: TestPageOptions = {}) {
	return `<!doctype html>
<html lang="pt-PT">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Página de teste</title>
		<meta name="description" content="Uma página de teste para o verificador Lighthouse." />
		${noindex ? '<meta name="robots" content="noindex" />' : ''}
		${head}
	</head>
	<body>
		<main>
			<h1>Página de teste</h1>
			${body}
		</main>
	</body>
</html>`;
}

/** Writes the test site into the test's output folder and returns the folder. */
function createSite(files: Record<string, string | Buffer>) {
	const folder = test.info().outputPath('site');
	for (const [path, content] of Object.entries(files)) {
		mkdirSync(dirname(join(folder, path)), { recursive: true });
		writeFileSync(join(folder, path), content);
	}
	return folder;
}

/**
 * Text that compression barely shrinks: `kb` KB of random bytes, in base64.
 * Compressed, it stays at about `kb` KB.
 */
function randomText(kb: number) {
	return randomBytes(kb * 1024).toString('base64');
}

/**
 * A media file of `mb` MB that Chromium plays, so downloads whole: random sound, in WAV, which
 * compression barely shrinks.
 */
function noise(mb: number) {
	const data = randomBytes(Math.round(mb * 1024 * 1024));
	const header = Buffer.alloc(44);
	header.write('RIFF', 0);
	header.writeUInt32LE(36 + data.length, 4);
	header.write('WAVEfmt ', 8);
	header.writeUInt32LE(16, 16); // format chunk size
	header.writeUInt16LE(1, 20); // PCM
	header.writeUInt16LE(2, 22); // stereo
	header.writeUInt32LE(48_000, 24); // samples per second
	header.writeUInt32LE(48_000 * 4, 28); // bytes per second
	header.writeUInt16LE(4, 32); // bytes per sample frame
	header.writeUInt16LE(16, 34); // bits per sample
	header.write('data', 36);
	header.writeUInt32LE(data.length, 40);
	return Buffer.concat([header, data]);
}

/** Analyzes every page of the site, one run each, and returns the failures of each page. */
async function failuresByPage(folder: string) {
	const analyses = await checkSite({ dist: folder, pages: pagesIn(folder), runs: 1 });
	return Object.fromEntries(analyses.map((a) => [a.path, a.failures]));
}

test('SEO requires indexable pages', async () => {
	const folder = createSite({
		'indexable/index.html': testPage(),
		'blocked/index.html': testPage({ noindex: true }),
	});
	expect(await failuresByPage(folder)).toEqual({
		'/blocked/': ['SEO: Page is blocked from indexing'],
		'/indexable/': [],
	});
});

test('compressed JS stays within 75 KB', async () => {
	const folder = createSite({
		'js/index.html': testPage({ body: '<script src="/data.js"></script>' }),
		'data.js': `window.data = '${randomText(100)}';`,
	});
	expect(await failuresByPage(folder)).toEqual({
		'/js/': [expect.stringMatching(/^JS weighs \d+\.\d KB, max 75\.0 KB$/)],
	});
});

test('compressed page stays within 400 KB', async () => {
	const folder = createSite({
		'heavy/index.html': testPage({ head: '<link rel="stylesheet" href="/styles.css" />' }),
		'styles.css': `/* ${randomText(420)} */`,
	});
	expect(await failuresByPage(folder)).toEqual({
		'/heavy/': [expect.stringMatching(/^page weighs \d+\.\d KB, max 400\.0 KB$/)],
	});
});

test('each video weighs apart from the page, within 1.5 MB', async () => {
	// Two under the limit: more than 400 KB, and more than 1.5 MB together.
	const player = (src: string) =>
		`<video src="${src}" muted autoplay loop playsinline width="320" height="180"></video>`;
	const folder = createSite({
		'two-videos/index.html': testPage({ body: player('/a.wav') + player('/b.wav') }),
		'heavy-video/index.html': testPage({ body: player('/c.wav') }),
		'a.wav': noise(1),
		'b.wav': noise(1),
		'c.wav': noise(1.6),
	});
	expect(await failuresByPage(folder)).toEqual({
		'/heavy-video/': [expect.stringMatching(/^video \/c\.wav weighs 1\.6 MB, max 1\.5 MB$/)],
		'/two-videos/': [],
	});
});

test('loads at most 3 fonts, all woff2', async () => {
	// Each font styles visible text, so that the browser fetches it.
	const styles = ['a.woff2', 'b.woff2', 'c.woff2', 'd.ttf']
		.map(
			(font, i) =>
				`@font-face { font-family: f${i}; src: url(/${font}); } .f${i} { font-family: f${i}; }`,
		)
		.join('\n');
	const folder = createSite({
		'fonts/index.html': testPage({
			head: `<style>${styles}</style>`,
			body: '<p class="f0">Um</p><p class="f1">Dois</p><p class="f2">Três</p><p class="f3">Quatro</p>',
		}),
		'a.woff2': randomText(1),
		'b.woff2': randomText(1),
		'c.woff2': randomText(1),
		'd.ttf': randomText(1),
	});
	expect(await failuresByPage(folder)).toEqual({
		'/fonts/': ['4 fonts, max 3', 'font not in woff2: /d.ttf'],
	});
});

test('makes no requests to other domains', async () => {
	// The .invalid domain never exists: the request fails at once, but is still recorded.
	const folder = createSite({
		'external/index.html': testPage({
			body: '<img src="https://other-domain.invalid/image.png" alt="" width="10" height="10" />',
		}),
	});
	expect(await failuresByPage(folder)).toEqual({
		'/external/': ['request to another domain: https://other-domain.invalid/image.png'],
	});
});
