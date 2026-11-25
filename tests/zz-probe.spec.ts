// Temporary probe: fails on purpose so the CI log shows each timeline.
import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 }, baseURL: 'http://localhost:4341' });

async function record(page: Page) {
	await page.addInitScript(() => {
		const log: string[] = [];
		const t0 = performance.now();
		const note = (what: string) =>
			log.push(`${(performance.now() - t0).toFixed(0)}ms ${what} y=${Math.round(scrollY)}`);
		Object.assign(window, { probeLog: log, probeNote: note });
		document.addEventListener('DOMContentLoaded', () => note('DOMContentLoaded'));
		addEventListener('load', () => {
			note('load');
			requestAnimationFrame(() => note('rAF after load'));
		});
		document.fonts.ready.then(() => note('fonts ready'));
		addEventListener('scroll', () => note('scroll'), { capture: true, passive: true });
		new MutationObserver((records) => {
			for (const r of records) {
				const el = r.target as HTMLElement;
				if (el.tagName !== 'VIDEO') continue;
				if (r.attributeName === 'src')
					note(`video src ${el.getAttribute('src')?.split('/').pop()}`);
			}
		}).observe(document, { subtree: true, attributes: true, attributeFilter: ['src'] });
		document.addEventListener(
			'play',
			(e) => note(`play ${(e.target as HTMLVideoElement).dataset.src?.split('/').pop()}`),
			true,
		);
		document.addEventListener(
			'pause',
			(e) => note(`pause ${(e.target as HTMLVideoElement).dataset.src?.split('/').pop()}`),
			true,
		);
	});
}
const log = (page: Page) =>
	page.evaluate(() => (window as unknown as { probeLog: string[] }).probeLog.join('\n'));
const note = (page: Page, what: string) =>
	page.evaluate(
		(what) => (window as unknown as { probeNote: (w: string) => void }).probeNote(what),
		what,
	);
const playing = (page: Page) =>
	page
		.locator('section#projetos video')
		.evaluateAll((all: HTMLVideoElement[]) =>
			all.map((video) => !!video.getAttribute('src') && !video.paused),
		);

test('probe /#contacto', async ({ page }) => {
	await record(page);
	await page.goto('/#contacto');
	await page.waitForLoadState('networkidle');
	await note(page, 'networkidle');
	expect(await log(page)).toBe('');
});

test('probe /#projetos, then the footer', async ({ page }) => {
	await record(page);
	await page.goto('/#projetos');
	await expect.poll(() => playing(page)).toEqual([true, false]);
	await note(page, 'playing [true,false]');
	await expect(page.locator('section#projetos video').first()).toBeVisible();
	await note(page, 'video visible');
	const box = (selector: string) => page.locator(selector).first().boundingBox();
	const separate = `video ${JSON.stringify(await box('section#projetos video'))} img ${JSON.stringify(await box('section#projetos .frame img'))}`;
	await note(page, `boxes apart: ${separate}`);
	const together = await page
		.locator('section#projetos video')
		.first()
		.evaluate((video) =>
			[video, video.parentElement!.querySelector('img')!].map(
				(e) => Math.round(e.getBoundingClientRect().y * 100) / 100,
			),
		);
	await note(page, `boxes at once (video y, img y): ${JSON.stringify(together)}`);
	await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
	await note(page, 'toFooter done');
	for (let i = 0; i < 12; i++) {
		await page.waitForTimeout(250);
		await note(page, `playing=${JSON.stringify(await playing(page))}`);
	}
	expect(await log(page)).toBe('');
});
