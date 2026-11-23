// The home page's first screen, its film strip, and the page's description.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild, pagesOf } from './pages';

/** What the first screen shows in each language. */
const HOMES = [
	{
		path: '/',
		english: false,
		code: '35 mm · Droumond 2026 · Leiria · Rolo 01',
		words: 'Séries · Suspense · Terror · Filmagens',
		cue: { name: 'Projetos', href: '#projetos' },
		toggle: { pause: 'Pausar fita', resume: 'Retomar fita' },
		description:
			'Droumond Productions, produtora audiovisual de Leiria: séries de ficção, publicidade, vídeos para marcas e videoclipes.',
		snapshot: `
			- region "Droumond Productions":
			  - heading "Droumond Productions" [level=1]
			  - paragraph: Produtora audiovisual
			  - button "Pausar fita"
			  - link "Projetos"
		`,
	},
	{
		path: '/en/',
		english: true,
		code: '35 mm · Droumond 2026 · Leiria · Reel 01',
		words: 'Series · Thriller · Horror · Filming',
		cue: { name: 'Projects', href: '#projects' },
		toggle: { pause: 'Pause film', resume: 'Resume film' },
		description:
			'Droumond Productions, an audiovisual production company based in Leiria: fiction series, commercials, brand videos and music videos.',
		snapshot: `
			- region "Droumond Productions":
			  - heading "Droumond Productions" [level=1]
			  - paragraph: Audiovisual production company
			  - button "Pause film"
			  - link "Projects"
		`,
	},
];

/** The top edge code of each frame: the title card, then the 7 photos. */
const FRAME_CODES = [
	'Droumond 2026 ▸ 14',
	'▸ 15',
	'Droumond 2026 ▸ 16',
	'▸ 17',
	'Droumond 2026 ▸ 18',
	'▸ 19',
	'Droumond 2026 ▸ 20',
	'▸ 21',
];

const SCREENS = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 },
];

// Exact: the filming band's title also holds the name ("Quer a Droumond Productions para gravação?").
const firstScreen = (page: Page) =>
	page.getByRole('region', { name: 'Droumond Productions', exact: true });

/**
 * How far the strip moves in half a second, in pixels (0 when still). Waits first for any pending
 * pause or play, which Chromium applies only on the next frame.
 */
async function travel(page: Page) {
	await page.evaluate(() =>
		Promise.allSettled(document.getAnimations().map((animation) => animation.ready)),
	);
	const frame = firstScreen(page).getByText(FRAME_CODES[0], { exact: true }).first();
	const start = (await frame.boundingBox())!.x;
	await page.waitForTimeout(500);
	return start - (await frame.boundingBox())!.x;
}

/** Scrolls halfway down the page, far below the first screen. */
const scrollToMiddle = (page: Page) =>
	page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));

/** The length of each endless animation of the strip, in milliseconds. */
const loops = (page: Page) =>
	firstScreen(page)
		.locator('[data-strip]')
		.evaluate((strip) =>
			strip
				.getAnimations()
				.map((animation) => animation.effect!.getTiming())
				.filter((timing) => timing.iterations === Infinity)
				.map((timing) => timing.duration),
		);

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: the first screen shows the name as the only h1, the line and the cue`, async ({
			page,
		}) => {
			await page.goto(home.path);
			await expect(firstScreen(page)).toMatchAriaSnapshot(home.snapshot);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
		});

		test(`${home.path}: a strip of film crosses the first screen, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			// The title card and the 7 photos, then the same again: the loop has no seam.
			const codes = firstScreen(page).getByText(/▸ \d\d$/);
			await expect(codes).toHaveText([...FRAME_CODES, ...FRAME_CODES]);
			const photos = firstScreen(page).locator('img');
			await expect(photos).toHaveCount(14);
			await expect
				.poll(() =>
					photos.evaluateAll((imgs) =>
						imgs.every(
							(img) =>
								(img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0,
						),
					),
				)
				.toBe(true);
			const sources = await photos.evaluateAll((imgs) =>
				imgs.map((img) => new URL((img as HTMLImageElement).currentSrc).pathname),
			);
			expect(new Set(sources).size).toBe(7);
			expect(sources.slice(7)).toEqual(sources.slice(0, 7));
			for (const frame of [...(await codes.all()), ...(await photos.all())]) {
				expect(await frame.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(
					true,
				);
			}
		});

		test(`${home.path}: the strip runs in a 64 s loop until its button pauses it`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto(home.path);
			await expect.poll(() => travel(page)).toBeGreaterThan(5);
			expect(await loops(page)).toEqual([64_000]);

			await firstScreen(page).getByRole('button', { name: home.toggle.pause }).click();
			const resume = firstScreen(page).getByRole('button', { name: home.toggle.resume });
			await expect(resume).toBeVisible();
			expect(await travel(page)).toBe(0);

			await resume.click();
			await expect(
				firstScreen(page).getByRole('button', { name: home.toggle.pause }),
			).toBeVisible();
			await expect.poll(() => travel(page)).toBeGreaterThan(5);
		});

		test(`${home.path}: the strip rests while it is off screen, and a pause by hand stays`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto(home.path);
			await expect.poll(() => travel(page)).toBeGreaterThan(5);
			await scrollToMiddle(page);
			await expect.poll(() => travel(page)).toBe(0);
			await page.evaluate(() => window.scrollTo(0, 0));
			await expect.poll(() => travel(page)).toBeGreaterThan(5);

			await firstScreen(page).getByRole('button', { name: home.toggle.pause }).click();
			await scrollToMiddle(page);
			await page.evaluate(() => window.scrollTo(0, 0));
			await expect(
				firstScreen(page).getByRole('button', { name: home.toggle.resume }),
			).toBeVisible();
			expect(await travel(page)).toBe(0);
		});

		test(`${home.path}: with less motion the strip stands still, without its button`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.goto(home.path);
			expect(await travel(page)).toBe(0);
			await expect(firstScreen(page).getByRole('button')).toHaveCount(0);

			// Also when the preference changes with the page open.
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await expect(
				firstScreen(page).getByRole('button', { name: home.toggle.pause }),
			).toBeVisible();
			await expect.poll(() => travel(page)).toBeGreaterThan(5);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect(firstScreen(page).getByRole('button')).toHaveCount(0);
			expect(await travel(page)).toBe(0);
		});

		test.describe('without JavaScript', () => {
			test.use({ javaScriptEnabled: false });

			test(`${home.path}: the strip stands still, since nothing could pause it`, async ({
				page,
			}) => {
				await page.emulateMedia({ reducedMotion: 'no-preference' });
				await page.goto(home.path);
				expect(await travel(page)).toBe(0);
				await expect(firstScreen(page).getByRole('button')).toHaveCount(0);
			});
		});

		test(`${home.path}: the code line and the words show, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			for (const text of [home.code, home.words]) {
				const line = firstScreen(page).getByText(text, { exact: true });
				await expect(line).toBeVisible();
				expect(await line.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
			}
		});

		test(`${home.path}: the page's description says what the company is and makes`, async ({
			page,
		}) => {
			await page.goto(home.path);
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				'content',
				home.description,
			);
		});

		// Carlos's request (#37): the name lets the background show through a little, at 85 %.
		test(`${home.path}: the title is slightly transparent`, async ({ page }) => {
			await page.goto(home.path);
			const color = await page
				.getByRole('heading', { level: 1 })
				.evaluate((h1) => getComputedStyle(h1).color);
			// The alpha is the last number of rgba(…, 0.85), oklab(… / 0.85) or color(srgb … / 0.85);
			// a colour without one is opaque.
			const alpha = /^rgba|\//.test(color) ? Number(color.match(/([\d.]+)\)$/)?.[1]) : 1;
			expect(alpha, color).toBeCloseTo(0.85, 2);
		});

		test(`${home.path}: the cue leads to Projects`, async ({ page }) => {
			await page.goto(home.path);
			const cue = firstScreen(page).getByRole('link', { name: home.cue.name });
			await expect(cue).toHaveAttribute('href', home.cue.href);
			await cue.click();
			await expect(page.locator(home.cue.href)).toBeInViewport();
		});

		test(`${home.path}: no background video any more`, async ({ page }) => {
			await page.goto(home.path);
			await expect(firstScreen(page).locator('video')).toHaveCount(0);
		});

		for (const screen of SCREENS) {
			test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
				test.use({ viewport: { width: screen.width, height: screen.height } });

				test(`${home.path}: the strip's button has its room from the start, so nothing moves when it shows`, async ({
					page,
				}) => {
					await page.emulateMedia({ reducedMotion: 'no-preference' });
					await page.goto(home.path);
					await expect(
						firstScreen(page).getByRole('button', { name: home.toggle.pause }),
					).toBeVisible();
					const projects = page.locator(home.cue.href);
					const withButton = (await projects.boundingBox())!.y;
					// With reduced motion the button never shows, as before the script runs.
					await page.emulateMedia({ reducedMotion: 'reduce' });
					await expect(firstScreen(page).getByRole('button')).toHaveCount(0);
					expect((await projects.boundingBox())!.y).toBe(withButton);
				});

				test(`${home.path}: the first screen fits the screen, under the header`, async ({
					page,
				}) => {
					await page.goto(home.path);
					const section = await firstScreen(page).boundingBox();
					expect(section!.y + section!.height).toBeLessThanOrEqual(screen.height);
				});
			});
		}
	}

	test('the first screen only exists on the home page', async ({ page }) => {
		for (const path of pagesOf(build).filter((p) => p !== '/' && p !== '/en/')) {
			await page.goto(path);
			await expect(firstScreen(page), path).toHaveCount(0);
		}
	});
});
