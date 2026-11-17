// Lighthouse in mobile mode on every page of the build, as in CI.
// 3 runs per page: the blocking targets block if any run fails them; the others show as medians.
// The summary goes to the job (or to the terminal). The HTML reports go to lighthouse-report/.
import { appendFileSync, rmSync } from 'node:fs';
import { DIST, builtPages } from '../pages.ts';
import { TARGETS, checkSite, type Analysis } from './check.ts';

const RUNS = 3;
const REPORTS_DIR = 'lighthouse-report';
const ON_GITHUB = process.env.GITHUB_ACTIONS === 'true';

/** On GitHub, a job annotation besides the summary. Elsewhere, the terminal summary is enough. */
function annotate(level: 'error' | 'warning', text: string) {
	if (ON_GITHUB) console.log(`::${level}::${text}`);
}

function summary(analyses: Analysis[]): string[] {
	const lines = [`## Lighthouse in mobile mode: \`${DIST}\``, '', '### Blocking targets', ''];
	const withFailures = analyses.filter((a) => a.failures.length);
	for (const { path, failures } of withFailures) {
		for (const failure of failures) {
			lines.push(`- \`${path}\`: ${failure}`);
			annotate('error', `Lighthouse ${path}: ${failure}`);
		}
	}
	if (!withFailures.length) {
		const passing = analyses.length === 1 ? 'The page passes' : `All ${analyses.length} pages pass`;
		lines.push(`${passing} the SEO, weight, font and request checks.`);
	}

	lines.push(
		'',
		'### Performance (warning only)',
		'',
		`Median of ${RUNS} runs. Values outside the target are in bold.`,
		'',
		`| Page | ${TARGETS.map((t) => `${t.name} (${t.threshold})`).join(' | ')} |`,
		`| --- | ${TARGETS.map(() => '---:').join(' | ')} |`,
	);
	for (const { path, medians } of analyses) {
		const cells = TARGETS.map((target, i) => {
			const value = medians[i];
			if (value === null) return '—';
			if (target.passes(value)) return target.format(value);
			if (target.warns) {
				annotate(
					'warning',
					`Lighthouse ${path}: ${target.name} ${target.format(value)}, target ${target.threshold}`,
				);
			}
			return `**${target.format(value)}**`;
		});
		lines.push(`| \`${path}\` | ${cells.join(' | ')} |`);
	}
	return lines;
}

rmSync(REPORTS_DIR, { recursive: true, force: true });
const analyses = await checkSite({
	dist: DIST,
	pages: builtPages(),
	runs: RUNS,
	reportsDir: REPORTS_DIR,
	progress: console.log,
});

const text = `${summary(analyses).join('\n')}\n`;
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
else console.log(`\n${text}`);

if (analyses.some((a) => a.failures.length)) {
	console.error(
		`Some blocking Lighthouse targets are not met. See the summary and ${REPORTS_DIR}/.`,
	);
	process.exitCode = 1;
}
