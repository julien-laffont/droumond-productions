// The first screen of the home page (#13): the background video, the logo symbol revealed by a
// brush mask, the name and the words that pass under it until "Produtora audiovisual" stays.
// Whoever asked for less motion sees it still: the still frame, the logo drawn, the final line.
// Also the home page's description, for search engines (#18).
import { expect, test, type Locator, type Page, type Request } from '@playwright/test';
import { inEachBuild, pagesOf } from './pages';

/** What the first screen shows in each language. The English texts are provisional (#18). */
const HOMES = [
	{
		path: '/',
		english: false,
		logo: 'Logótipo da Droumond Productions',
		words: ['Séries', 'Suspense', 'Terror', 'Filmagens'],
		pause: 'Pausar vídeo',
		cue: { name: 'Projetos', href: '#projetos' },
		description:
			'Droumond Productions, produtora audiovisual de Leiria: séries de ficção, publicidade, vídeos para marcas e videoclipes.',
		snapshot: `
			- region "Droumond Productions":
			  - img "Logótipo da Droumond Productions"
			  - heading "Droumond Productions" [level=1]
			  - paragraph: Produtora audiovisual
			  - link "Projetos"
			  - button "Pausar vídeo" [pressed=false]
		`,
	},
	{
		path: '/en/',
		english: true,
		logo: 'Droumond Productions logo',
		words: ['Series', 'Thriller', 'Horror', 'Filming'],
		pause: 'Pause video',
		cue: { name: 'Projects', href: '#projects' },
		description:
			'Droumond Productions, an audiovisual production company from Leiria: fiction series, advertising, brand videos and music videos.',
		snapshot: `
			- region "Droumond Productions":
			  - img "Droumond Productions logo"
			  - heading "Droumond Productions" [level=1]
			  - paragraph: Audiovisual production company
			  - link "Projects"
			  - button "Pause video" [pressed=false]
		`,
	},
];

const SCREENS = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 },
];

// Exact: the filming band's title also holds the name ("Quer a Droumond Productions para gravação?").
const firstScreen = (page: Page) =>
	page.getByRole('region', { name: 'Droumond Productions', exact: true });

/** The still frame behind the video: the first screen's only <img>. */
const stillFrame = (page: Page) => firstScreen(page).locator('img');

/** Waits until the video plays: not paused, and its time moves. */
async function expectPlaying(video: Locator) {
	await expect
		.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0))
		.toBe(true);
}

const isVideo = (request: Request) =>
	request.resourceType() === 'media' || new URL(request.url()).pathname.endsWith('.mp4');

/** Records the addresses of the videos the page requests. */
function recordVideoRequests(page: Page) {
	const videos: string[] = [];
	page.on('request', (request) => {
		if (isVideo(request)) videos.push(request.url());
	});
	return videos;
}

/** The passing words, one locator each (the aria snapshot checks screen readers skip them). */
const passingWords = (page: Page, words: string[]) =>
	words.map((word) => firstScreen(page).getByText(word, { exact: true }));

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: the first screen shows the logo, the name as the only h1 and the final line`, async ({
			page,
		}) => {
			await page.goto(home.path);
			await expect(firstScreen(page)).toMatchAriaSnapshot(home.snapshot);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
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

		test(`${home.path}: the background video comes from the site, muted, looping and playing`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const video = firstScreen(page).locator('video');
			await expectPlaying(video);
			const { src, muted, loop, autoplay, playsInline, poster } = await video.evaluate(
				(v: HTMLVideoElement) => ({
					src: v.currentSrc,
					muted: v.muted,
					loop: v.loop,
					autoplay: v.autoplay,
					playsInline: v.playsInline,
					poster: v.poster,
				}),
			);
			expect(new URL(src).origin).toBe(baseURL);
			expect(new URL(src).pathname).toMatch(/\.mp4$/);
			expect({ muted, loop, autoplay, playsInline }).toEqual({
				muted: true,
				loop: true,
				autoplay: true,
				playsInline: true,
			});
			// The still frame shows behind the video until it plays, and is its poster.
			const still = stillFrame(page);
			await expect(still).toBeVisible();
			expect(await still.evaluate((img: HTMLImageElement) => img.currentSrc)).toBe(poster);
		});

		test(`${home.path}: the video only loads once the page has, so it never delays the still frame (LCP)`, async ({
			page,
		}) => {
			const events: string[] = [];
			page.on('load', () => events.push('page loaded'));
			page.on('request', (request) => {
				if (isVideo(request)) events.push('video requested');
			});
			await page.goto(home.path);
			await expectPlaying(firstScreen(page).locator('video'));
			expect(events.slice(0, 2)).toEqual(['page loaded', 'video requested']);
		});

		test(`${home.path}: the button pauses and resumes the video, keeping its name`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const video = firstScreen(page).locator('video');
			const button = firstScreen(page).getByRole('button', { name: home.pause });
			await expectPlaying(video);

			await button.click();
			await expect(button).toHaveAttribute('aria-pressed', 'true');
			expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);

			await button.click();
			await expect(button).toHaveAttribute('aria-pressed', 'false');
			await expectPlaying(video);
		});

		test(`${home.path}: the logo draws itself and the words pass, ending on the final line`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto(home.path);
			const screen = firstScreen(page);
			// Jumps to the end of the animations that end (the grain flickers forever).
			const finished = await screen.evaluate((section) => {
				const animations = section
					.getAnimations({ subtree: true })
					.filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
				for (const animation of animations) animation.finish();
				return animations.length;
			});
			expect(finished).toBeGreaterThan(0);
			for (const word of passingWords(page, home.words))
				await expect(word).toHaveCSS('opacity', '0');
			await expect(screen.getByRole('paragraph')).toHaveCSS('opacity', '1');
			await expect(screen.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1');
		});

		test(`${home.path}: with less motion, no video, the logo drawn and only the final line`, async ({
			page,
		}) => {
			const videos = recordVideoRequests(page);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.goto(home.path);
			const screen = firstScreen(page);
			await expect(stillFrame(page)).toBeVisible();
			await expect(screen.locator('video')).toBeHidden();
			await expect(screen.getByRole('button', { name: home.pause })).toBeHidden();
			for (const word of passingWords(page, home.words)) await expect(word).toBeHidden();
			await expect(screen.getByRole('paragraph')).toBeVisible();
			await expect(screen.getByRole('paragraph')).toHaveCSS('opacity', '1');
			// Nothing moves, so the logo is already drawn.
			expect(await screen.evaluate((s) => s.getAnimations({ subtree: true }).length)).toBe(0);
			await page.waitForLoadState('networkidle');
			expect(videos).toEqual([]);
		});

		test(`${home.path}: the cue leads to Projects`, async ({ page }) => {
			await page.goto(home.path);
			const cue = firstScreen(page).getByRole('link', { name: home.cue.name });
			await expect(cue).toHaveAttribute('href', home.cue.href);
			await cue.click();
			await expect(page.locator(home.cue.href)).toBeInViewport();
		});

		for (const screen of SCREENS) {
			test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
				test.use({ viewport: { width: screen.width, height: screen.height } });

				test(`${home.path}: the logo sits at the exact centre of the first screen`, async ({
					page,
				}) => {
					await page.goto(home.path);
					const section = await firstScreen(page).boundingBox();
					const logo = await firstScreen(page).getByRole('img', { name: home.logo }).boundingBox();
					if (!section || !logo) throw new Error('The first screen or its logo has no box.');
					expect(Math.abs(logo.x + logo.width / 2 - (section.x + section.width / 2))).toBeLessThan(
						1,
					);
					expect(
						Math.abs(logo.y + logo.height / 2 - (section.y + section.height / 2)),
					).toBeLessThan(1);
					// The first screen fits the screen, under the header.
					expect(section.y + section.height).toBeLessThanOrEqual(screen.height);
				});
			});
		}

		test.describe('without JavaScript', () => {
			test.use({ javaScriptEnabled: false });

			test(`${home.path}: the still frame stays, without the video, which could not be paused`, async ({
				page,
			}) => {
				const videos = recordVideoRequests(page);
				await page.goto(home.path);
				const screen = firstScreen(page);
				await expect(stillFrame(page)).toBeVisible();
				await expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
				await expect(screen.getByRole('button', { name: home.pause })).toBeHidden();
				await page.waitForLoadState('networkidle');
				expect(videos).toEqual([]);
			});
		});
	}

	test('the first screen only exists on the home page', async ({ page }) => {
		for (const path of pagesOf(build).filter((p) => p !== '/' && p !== '/en/')) {
			await page.goto(path);
			await expect(page.locator('video'), path).toHaveCount(0);
			await expect(firstScreen(page), path).toHaveCount(0);
		}
	});
});
