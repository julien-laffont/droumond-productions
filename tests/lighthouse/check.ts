// Lighthouse, in mobile mode, on the pages of a build. Adapted from Julien's landing page.
// Reports which blocking targets each page fails, and measures the others.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { preview } from 'astro';
import lighthouse, { generateReport, type Result } from 'lighthouse';

/** 1 KB = 1024 bytes, as in Lighthouse budgets. */
const KB = 1024;
const MB = 1024 * KB;
/** The page without its videos, which have their own limit. */
const MAX_PAGE_SIZE = 450 * KB;
/** Each video, such as the excerpts of Projects. */
const MAX_VIDEO_SIZE = 1.5 * MB;
const MAX_JS_SIZE = 75 * KB;
/** Película's three (#36): Bebas Neue, Space Mono 400 and 700. */
const MAX_FONTS = 3;

/** A target that varies from run to run: shown in the summary, as a median. It never blocks. */
export interface Target {
	name: string;
	threshold: string;
	/** When missed, it also shows as a warning in the job. */
	warns: boolean;
	value: (lhr: Result) => number | null;
	passes: (value: number) => boolean;
	format: (value: number) => string;
}

const categoryScore = (category: string) => (lhr: Result) => {
	const score = lhr.categories[category]?.score;
	return score == null ? null : Math.round(score * 100);
};
const metric = (audit: string) => (lhr: Result) => lhr.audits[audit]?.numericValue ?? null;

/** The performance score. It also picks the median run, the one in the report. */
const PERFORMANCE: Target = {
	name: 'Performance',
	threshold: '≥ 90',
	warns: true,
	value: categoryScore('performance'),
	passes: (v) => v >= 90,
	format: (v) => `${v}`,
};

export const TARGETS: Target[] = [
	PERFORMANCE,
	{
		name: 'LCP',
		threshold: '≤ 2.5 s',
		warns: true,
		value: metric('largest-contentful-paint'),
		passes: (ms) => ms <= 2500,
		format: (ms) => `${formatNumber(ms / 1000, 1)} s`,
	},
	{
		name: 'TBT',
		threshold: '≤ 200 ms',
		warns: true,
		value: metric('total-blocking-time'),
		passes: (ms) => ms <= 200,
		format: (ms) => `${formatNumber(ms, 0)} ms`,
	},
	// The next three only show in the summary: axe already checks accessibility in the suite.
	{
		name: 'CLS',
		threshold: '≤ 0.1',
		warns: false,
		value: metric('cumulative-layout-shift'),
		passes: (v) => v <= 0.1,
		format: (v) => formatNumber(v, 2),
	},
	{
		name: 'Accessibility',
		threshold: '100',
		warns: false,
		value: categoryScore('accessibility'),
		passes: (v) => v === 100,
		format: (v) => `${v}`,
	},
	{
		name: 'Best practices',
		threshold: '100',
		warns: false,
		value: categoryScore('best-practices'),
		passes: (v) => v === 100,
		format: (v) => `${v}`,
	},
];

export interface Options {
	/** The build folder, served as on the hosting. */
	dist: string;
	/** The paths of the pages to analyze, such as `/`. */
	pages: string[];
	/** How many times Lighthouse analyzes each page. The medians come from these runs. */
	runs: number;
	/** The folder that holds the HTML report of each page's median run. */
	reportsDir?: string;
	/** Receives one line per run, to show progress. */
	progress?: (line: string) => void;
}

export interface Analysis {
	path: string;
	/** The blocking targets that some run failed. */
	failures: string[];
	/** The median of each target, in `TARGETS` order, or null if Lighthouse did not measure it. */
	medians: (number | null)[];
}

export async function checkSite(options: Options): Promise<Analysis[]> {
	const server = await preview({
		outDir: options.dist,
		server: { port: 0 },
		logLevel: 'error',
	});
	const chromiumPort = await freePort();
	// Playwright's Chromium, the same one the tests use, in new headless mode.
	const browser = await chromium.launch({
		channel: 'chromium',
		args: [`--remote-debugging-port=${chromiumPort}`],
	});
	if (options.reportsDir) mkdirSync(options.reportsDir, { recursive: true });

	const analyses: Analysis[] = [];
	try {
		for (const path of options.pages) {
			const url = `http://localhost:${server.port}${path}`;
			const runs: Result[] = [];
			for (let n = 1; n <= options.runs; n++) {
				options.progress?.(`${options.dist}${path}: run ${n} of ${options.runs}`);
				const result = await lighthouse(url, {
					port: chromiumPort,
					logLevel: 'error',
					onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
				});
				if (!result) throw new Error(`Lighthouse returned no result for ${path}.`);
				runs.push(result.lhr);
			}

			const failures = new Set(runs.flatMap(failuresOf));
			const medians = TARGETS.map((target) => median(runs.map(target.value)));
			analyses.push({ path, failures: [...failures], medians });

			if (options.reportsDir) {
				const medianPerformance = medians[TARGETS.indexOf(PERFORMANCE)];
				const medianRun =
					runs.find((lhr) => PERFORMANCE.value(lhr) === medianPerformance) ?? runs[0];
				writeFileSync(
					join(options.reportsDir, `${reportName(path)}.html`),
					generateReport(medianRun, 'html'),
				);
			}
		}
	} finally {
		await browser.close();
		await server.stop();
	}
	return analyses;
}

/** The blocking targets that this run failed. */
function failuresOf(lhr: Result): string[] {
	if (lhr.runtimeError) {
		return [`Lighthouse could not analyze the page: ${lhr.runtimeError.message}`];
	}
	const failures = seoFailures(lhr);
	const allRequests = networkRequests(lhr);
	const isVideo = (r: NetworkRequest) => r.resourceType === 'Media';
	const pageSize = totalSize(allRequests.filter((r) => !isVideo(r)));
	if (pageSize > MAX_PAGE_SIZE) {
		failures.push(`page weighs ${kb(pageSize)}, max ${kb(MAX_PAGE_SIZE)}`);
	}
	// A video can arrive in several requests (ranges): its weight is their sum.
	const videos = Map.groupBy(allRequests.filter(isVideo), (r) => r.url);
	for (const [url, requests] of videos) {
		const size = totalSize(requests);
		if (size > MAX_VIDEO_SIZE) {
			failures.push(`video ${new URL(url).pathname} weighs ${mb(size)}, max ${mb(MAX_VIDEO_SIZE)}`);
		}
	}
	// Only counts JS from .js files. JS written inside the HTML only counts toward the page weight.
	const js = totalSize(allRequests.filter((r) => r.resourceType === 'Script'));
	if (js > MAX_JS_SIZE) failures.push(`JS weighs ${kb(js)}, max ${kb(MAX_JS_SIZE)}`);

	const fonts = allRequests.filter((r) => r.resourceType === 'Font');
	if (fonts.length > MAX_FONTS) {
		failures.push(`${fonts.length} fonts, max ${MAX_FONTS}`);
	}
	for (const { url } of fonts) {
		const { pathname } = new URL(url);
		if (!pathname.endsWith('.woff2')) failures.push(`font not in woff2: ${pathname}`);
	}

	const pageOrigin = new URL(lhr.requestedUrl!).origin;
	for (const { url } of allRequests) {
		const { protocol, origin } = new URL(url);
		if (/^(http|ws)s?:$/.test(protocol) && origin !== pageOrigin) {
			failures.push(`request to another domain: ${url}`);
		}
	}
	return failures;
}

interface NetworkRequest {
	url: string;
	resourceType?: string;
	transferSize?: number;
}

/** The requests of the first load, with their transferred (compressed) size. */
function networkRequests(lhr: Result): NetworkRequest[] {
	const details = lhr.audits['network-requests']?.details;
	return details?.type === 'table' ? (details.items as unknown as NetworkRequest[]) : [];
}

function totalSize(requests: NetworkRequest[]) {
	return requests.reduce((total, r) => total + (r.transferSize ?? 0), 0);
}

/** SEO at 100: every SEO audit that counts toward the score passes. */
function seoFailures(lhr: Result): string[] {
	return lhr.categories.seo.auditRefs
		.filter((ref) => ref.weight > 0)
		.map((ref) => lhr.audits[ref.id])
		.filter((audit) => audit.score !== null && audit.score < 1)
		.map((audit) => `SEO: ${audit.title}`);
}

/** The median of the measured values. With an even count, the mean of the middle two. */
function median(values: (number | null)[]): number | null {
	const measured = values.filter((v) => v !== null).sort((a, b) => a - b);
	if (!measured.length) return null;
	const middle = Math.floor(measured.length / 2);
	return measured.length % 2 ? measured[middle] : (measured[middle - 1] + measured[middle]) / 2;
}

/** A number with `decimals` decimal places and no grouping: `formatNumber(2.5, 1)` → `2.5`. */
function formatNumber(value: number, decimals: number) {
	return value.toLocaleString('en', {
		useGrouping: false,
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}

function kb(bytes: number) {
	return `${formatNumber(bytes / KB, 1)} KB`;
}

function mb(bytes: number) {
	return `${formatNumber(bytes / MB, 1)} MB`;
}

/** The report name of a page: `/en/` → `en`, `/` → `index`, `/404.html` → `404`. */
function reportName(path: string) {
	return path.replace(/^\/|\/$|\.html$/g, '').replaceAll('/', '-') || 'index';
}

/** A free port, chosen by the OS, for Lighthouse to talk to Chromium. */
async function freePort(): Promise<number> {
	const server = createServer().listen(0);
	await new Promise((ready) => server.once('listening', ready));
	const { port } = server.address() as { port: number };
	await new Promise((closed) => server.close(closed));
	return port;
}
