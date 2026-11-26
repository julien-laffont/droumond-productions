// Projects, a reel of film driven by the scroll on a desktop and swiped elsewhere: each excerpt
// loops muted in its frame, hosted on the site, and nothing comes from another site. Efecto
// Placebo and Resident Evil each lead to their own page.
import { globSync, statSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. The reel's English is provisional. */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'projetos',
		pause: 'Pausar vídeos',
		resume: 'Retomar vídeos',
		links: [
			{ name: 'Ver o projeto', href: '/efecto-placebo/' },
			{ name: 'Ver o projeto', href: '/resident-evil/' },
		],
		snapshot: `
			- region "Projetos":
			  - heading "Projetos" [level=2]
			  - button "Pausar vídeos"
			  - list:
			    - /children: equal
			    - listitem:
			      - 'img "Efecto Placebo: um homem de óculos escuros atrás de uma fita da polícia, num jardim."'
			      - heading "Efecto Placebo" [level=3]
			      - paragraph: Minissérie · Suspense · Em gravação
			      - link "Ver o projeto"
			    - listitem:
			      - 'img "Resident Evil: dois olhos brancos a brilhar no escuro, atrás de uma figura agachada na estrada."'
			      - heading "Resident Evil" [level=3]
			      - paragraph: Minissérie · Terror · 5 episódios
			      - link "Ver o projeto"
		`,
	},
	{
		path: '/en/',
		english: true,
		anchor: 'projects',
		pause: 'Pause videos',
		resume: 'Resume videos',
		links: [
			{ name: 'View the project', href: '/en/efecto-placebo/' },
			{ name: 'View the project', href: '/en/resident-evil/' },
		],
		snapshot: `
			- region "Projects":
			  - heading "Projects" [level=2]
			  - button "Pause videos"
			  - list:
			    - /children: equal
			    - listitem:
			      - 'img "Efecto Placebo: a man in sunglasses behind police tape, in a park."'
			      - heading "Efecto Placebo" [level=3]
			      - paragraph: Mini-series · Thriller · In production
			      - link "View the project"
			    - listitem:
			      - 'img "Resident Evil: two white eyes glowing in the dark, behind a figure crouching on the road."'
			      - heading "Resident Evil" [level=3]
			      - paragraph: Mini-series · Horror · 5 episodes
			      - link "View the project"
		`,
	},
];

/** The Portuguese home page, where the behaviour is checked once per screen. */
const HOME = HOMES[0];

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

/** The teaser's picture without its letterbox (2048×868), and the episodes' 9:16. */
const TEASER_RATIO = 2048 / 868;
const EPISODE_RATIO = 9 / 16;

const reel = (page: Page) => page.locator(`section#${HOME.anchor}`);

/** The two Projects' videos and posters, in order: Efecto Placebo, Resident Evil. */
const videos = (page: Page) => reel(page).locator('video');
const posters = (page: Page) => reel(page).getByRole('img');

/** Waits until the reel has followed a scroll and the reveal has ended (the loops never end). */
const settle = (page: Page) =>
	page.evaluate(async () => {
		await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
		const ending = document
			.getAnimations()
			.filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity);
		await Promise.all(ending.map((animation) => animation.finished));
	});

/**
 * Scrolls the page to a point of the reel: 0 pins it at its start, 1 at its end. On a desktop,
 * that point is how far the strip has travelled.
 */
async function scrubTo(page: Page, progress: number) {
	await page.evaluate((progress) => {
		const section = document
			.querySelector<HTMLElement>('section[id] [data-reel-strip]')!
			.closest('section')!;
		const header = document.querySelector('header')!.offsetHeight;
		const travel = section.offsetHeight - (window.innerHeight - header);
		const top = section.getBoundingClientRect().top + window.scrollY;
		window.scrollTo(0, Math.floor(top - header + progress * travel));
	}, progress);
	await settle(page);
}

/** Swipes the reel's window to a point: 0 at its start, 1 at its end. */
async function swipeTo(page: Page, progress: number) {
	await reel(page)
		.locator('[data-reel-window]')
		.evaluate((window, progress) => {
			window.scrollLeft = progress * (window.scrollWidth - window.clientWidth);
		}, progress);
	await settle(page);
}

/** Swipes the reel's window until a Project's cell starts at the side margin. */
async function swipeToProject(page: Page, index: number) {
	await posters(page)
		.nth(index)
		.evaluate((poster) =>
			poster.closest('li')!.scrollIntoView({ inline: 'start', block: 'nearest' }),
		);
	await settle(page);
}

/** The box of each poster, in order. */
async function posterBoxes(page: Page) {
	const boxes = [];
	for (const poster of await posters(page).all()) {
		const box = await poster.boundingBox();
		if (!box) throw new Error('A Project poster is not displayed');
		boxes.push(box);
	}
	return boxes;
}

/**
 * Whether each Project's video is playing, in order: asked to play and not paused since (it may
 * be waiting for data). That frames really pass is checked once, on the first excerpt.
 */
const playing = (page: Page) =>
	videos(page).evaluateAll((all: HTMLVideoElement[]) =>
		all.map((video) => !!video.getAttribute('src') && !video.paused),
	);

/** The excerpts the page has asked for, once each (a video may come in several ranges), by name. */
function recordExcerpts(page: Page) {
	const excerpts: string[] = [];
	page.on('request', (request) => {
		const name = new URL(request.url()).pathname.split('/').pop()!;
		const excerpt = name.split('.')[0];
		if (name.endsWith('.mp4') && !excerpts.includes(excerpt)) excerpts.push(excerpt);
	});
	return excerpts;
}

/** Whether the leader's sweep is turning. */
const sweepTurns = (page: Page) =>
	reel(page)
		.locator('.sweep')
		.evaluate(async (sweep) => {
			const animations = sweep.getAnimations();
			// A pause or a play only takes effect on the next frame.
			await Promise.all(animations.map((animation) => animation.ready));
			return animations.some((animation) => animation.playState === 'running');
		});

const toFooter = (page: Page) => page.getByRole('contentinfo').scrollIntoViewIfNeeded();

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Projects shows both Projects, with their posters and links; the leader and tail are only decoration`, async ({
			page,
		}) => {
			await page.goto(home.path);
			await expect(page.locator(`section#${home.anchor}`)).toMatchAriaSnapshot(home.snapshot);
		});

		test(`${home.path}: each Project's link opens its page in the same tab`, async ({ page }) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			for (const [index, { name, href }] of home.links.entries()) {
				const link = section.getByRole('link', { name, exact: true }).nth(index);
				await expect(link).toBeVisible();
				await expect(link).toHaveAttribute('href', href);
				await expect(link).not.toHaveAttribute('target');
			}
		});

		for (const [index, title] of ['Efecto Placebo', 'Resident Evil'].entries()) {
			test(`${home.path}: a click on ${title}'s frame opens its page in the same tab`, async ({
				page,
			}) => {
				const toPage = home.links[index];
				// Clicked where a visitor sees the frame: the link covers the whole cell.
				await page.goto(home.path);
				await scrubTo(page, index);
				const frame = await page
					.locator(`section#${home.anchor}`)
					.getByRole('img')
					.nth(index)
					.boundingBox();
				if (!frame) throw new Error(`${title}'s frame is not displayed`);
				await page.mouse.click(frame.x + frame.width / 2, frame.y + frame.height / 2);
				await expect(page).toHaveURL(toPage.href);
				await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
			});

			test(`${home.path}: Enter on ${title}'s link opens its page in the same tab`, async ({
				page,
			}) => {
				const toPage = home.links[index];
				await page.goto(home.path);
				await page.getByRole('link', { name: toPage.name, exact: true }).nth(index).focus();
				await page.keyboard.press('Enter');
				await expect(page).toHaveURL(toPage.href);
			});
		}

		test(`${home.path}: the pause button says what it does, in the page's language`, async ({
			page,
		}) => {
			await page.goto(`${home.path}#${home.anchor}`);
			const button = page.locator(`section#${home.anchor}`).getByRole('button');
			await expect(button).toHaveText(home.pause);
			await button.click();
			await expect(button).toHaveText(home.resume);
		});
	}

	test('every excerpt in the build weighs less than 1.5 MB', () => {
		const excerpts = globSync(`${build.dist}/_astro/*.mp4`);
		expect(excerpts.length).toBeGreaterThan(0);
		for (const excerpt of excerpts) {
			expect(statSync(excerpt).size, excerpt).toBeLessThan(1.5 * 1024 * 1024);
		}
	});

	test('/: the posters come from the site itself, in several sizes', async ({ page, baseURL }) => {
		await page.goto('/');
		await expect(posters(page)).toHaveCount(2);
		for (const poster of await posters(page).all()) {
			const src = await poster.evaluate((img: HTMLImageElement) => img.currentSrc);
			expect(new URL(src).origin).toBe(baseURL);
			const srcset = (await poster.getAttribute('srcset')) ?? '';
			expect(srcset.split(',').length, srcset).toBeGreaterThan(1);
		}
	});

	test('/: the page asks nothing of another site, excerpts included', async ({ page, baseURL }) => {
		const otherSites: string[] = [];
		page.on('request', (request) => {
			if (new URL(request.url()).origin !== baseURL) otherSites.push(request.url());
		});
		const excerpts = recordExcerpts(page);
		await page.goto('/');
		for (const progress of [0, 0.5, 1]) await scrubTo(page, progress);
		await expect.poll(() => excerpts.sort()).toEqual(['efecto-placebo', 'resident-evil']);
		await toFooter(page);
		await page.waitForLoadState('networkidle');
		expect(otherSites).toEqual([]);
	});

	test.describe('on a desktop', () => {
		test.use({ viewport: DESKTOP });

		test('/: the frames keep the shape of their film, at one height, and fit the screen', async ({
			page,
		}) => {
			await page.goto('/');
			await scrubTo(page, 0);
			const [teaser, episode] = await posterBoxes(page);
			expect(teaser.width / teaser.height).toBeCloseTo(TEASER_RATIO, 1);
			expect(episode.width / episode.height).toBeCloseTo(EPISODE_RATIO, 2);
			expect(teaser.height).toBeCloseTo(episode.height, 0);
			expect(teaser.y).toBeCloseTo(episode.y, 0);
			// The heading, the whole height of the frame and its link, on the screen at once.
			await expect(reel(page).getByRole('heading', { level: 2 })).toBeInViewport();
			expect(teaser.y).toBeGreaterThanOrEqual(64);
			expect(teaser.y + teaser.height).toBeLessThanOrEqual(DESKTOP.height);
			await expect(reel(page).getByRole('link').first()).toBeInViewport({ ratio: 1 });
		});

		test('/: the scroll drives the reel sideways, pinned under the header, and fills the bar', async ({
			page,
		}) => {
			await page.goto('/');
			const heading = reel(page).getByRole('heading', { level: 2 });
			const tail = reel(page).getByText('Fim', { exact: true });
			const bar = reel(page).locator('[data-reel-bar]');
			const track = (await bar.locator('..').boundingBox())!;

			await scrubTo(page, 0);
			const [start] = await posterBoxes(page);
			expect((await bar.boundingBox())!.width).toBeCloseTo(0, 0);
			await expect(tail).not.toBeInViewport();

			await scrubTo(page, 0.25);
			const top = (await heading.boundingBox())!.y;
			await scrubTo(page, 1);
			const [end] = await posterBoxes(page);
			expect(end.x).toBeLessThan(start.x - 300);
			expect((await heading.boundingBox())!.y).toBeCloseTo(top, 0);
			expect((await bar.boundingBox())!.width).toBeCloseTo(track.width, 0);
			await expect(tail).toBeInViewport();
		});

		test('/: an excerpt loads only when its frame comes near', async ({ page }) => {
			const excerpts = recordExcerpts(page);
			await page.goto('/#contacto');
			await page.waitForLoadState('networkidle');
			expect(excerpts).toEqual([]);

			await scrubTo(page, 0);
			await expect.poll(() => excerpts).toEqual(['efecto-placebo']);
			await scrubTo(page, 1);
			await expect.poll(() => excerpts).toEqual(['efecto-placebo', 'resident-evil']);
		});

		test('/: opened at the reel, the excerpt still waits for the page to load', async ({
			page,
		}) => {
			// Notes the page's state each time a script gives a video its source.
			await page.addInitScript(() => {
				const states: string[] = [];
				Object.assign(window, { sourceStates: states });
				new MutationObserver(() => states.push(document.readyState)).observe(document, {
					subtree: true,
					attributeFilter: ['src'],
				});
			});
			await page.goto('/#projetos');
			await expect.poll(() => playing(page)).toEqual([true, false]);
			const states = await page.evaluate(
				() => (window as unknown as { sourceStates: string[] }).sourceStates,
			);
			expect(states).toEqual(['complete']);
		});

		test('/: an excerpt plays muted, looping and inline, from the site, over its poster', async ({
			page,
			baseURL,
			browserName,
		}) => {
			await page.goto('/#projetos');
			await expect.poll(() => playing(page)).toEqual([true, false]);
			const teaser = videos(page).first();
			await expect(teaser).toBeVisible();
			const video = await teaser.evaluate((video: HTMLVideoElement) => ({
				origin: new URL(video.currentSrc).origin,
				muted: video.muted,
				loop: video.loop,
				inline: video.playsInline,
				hidden: video.getAttribute('aria-hidden'),
			}));
			expect(video).toEqual({
				origin: baseURL,
				muted: true,
				loop: true,
				inline: true,
				hidden: 'true',
			});
			// Exactly over the poster, both measured at once: the page may still be moving.
			const [over, under] = await teaser.evaluate((video) =>
				[video, video.parentElement!.querySelector('img')!].map((element) =>
					element.getBoundingClientRect().toJSON(),
				),
			);
			expect(over).toEqual(under);
			// Its frames pass. Not checked in WebKit: on Linux its player (GStreamer) sometimes stalls
			// under load; Safari plays with another one.
			if (browserName === 'chromium') {
				const time = () => teaser.evaluate((video: HTMLVideoElement) => video.currentTime);
				const start = await time();
				await expect.poll(time).toBeGreaterThan(start + 0.5);
			}
		});

		test('/: off screen an excerpt pauses; back on screen it plays again', async ({ page }) => {
			await page.goto('/#projetos');
			await expect.poll(() => playing(page)).toEqual([true, false]);
			await toFooter(page);
			await expect.poll(() => playing(page)).toEqual([false, false]);
			await scrubTo(page, 0);
			await expect.poll(() => playing(page)).toEqual([true, false]);
		});

		test('/: "Pausar vídeos" stops the excerpts and the leader until "Retomar vídeos", even off screen', async ({
			page,
		}) => {
			await page.goto('/#projetos');
			await expect.poll(() => playing(page)).toEqual([true, false]);
			expect(await sweepTurns(page)).toBe(true);
			const button = reel(page).getByRole('button', { name: HOME.pause });

			await button.click();
			await expect.poll(() => playing(page)).toEqual([false, false]);
			expect(await sweepTurns(page)).toBe(false);
			await toFooter(page);
			await scrubTo(page, 0);
			await page.waitForTimeout(300);
			expect(await playing(page)).toEqual([false, false]);

			await reel(page).getByRole('button', { name: HOME.resume }).click();
			await expect.poll(() => playing(page)).toEqual([true, false]);
			expect(await sweepTurns(page)).toBe(true);
		});

		test('/: each link, focused, brings its frame into view', async ({ page }) => {
			await page.goto('/');
			await scrubTo(page, 0);
			for (const [index, { name }] of HOME.links.entries()) {
				await reel(page).getByRole('link', { name, exact: true }).nth(index).focus();
				await settle(page);
				await expect(posters(page).nth(index)).toBeInViewport({ ratio: 1 });
			}
		});
	});

	test.describe('on a phone', () => {
		test.use({ viewport: PHONE });

		test('/: the frames keep their shape, at one height, none wider than the screen', async ({
			page,
		}) => {
			await page.goto('/');
			const [teaser, episode] = await posterBoxes(page);
			expect(teaser.width / teaser.height).toBeCloseTo(TEASER_RATIO, 1);
			expect(episode.width / episode.height).toBeCloseTo(EPISODE_RATIO, 2);
			expect(teaser.height).toBeCloseTo(episode.height, 0);
			// The frame and its film fit between the side margins (to the sub-pixel).
			expect(teaser.width + 16).toBeLessThanOrEqual(PHONE.width - 2 * 16 + 0.5);
		});

		test("/: the leader's label fits on one line, inside its frame", async ({ page }) => {
			await page.goto('/#projetos');
			const leader = reel(page).locator('li').first();
			const frame = (await leader.locator('.frame').boundingBox())!;
			const label = (await leader.locator('.slug-text').boundingBox())!;
			expect(label.height).toBeLessThan(20);
			expect(label.width).toBeLessThanOrEqual(frame.width);
		});

		test('/: the reel swipes sideways and fills the bar', async ({ page }) => {
			await page.goto('/#projetos');
			const tail = reel(page).getByText('Fim', { exact: true });
			const bar = reel(page).locator('[data-reel-bar]');
			const track = (await bar.locator('..').boundingBox())!;
			await expect(tail).not.toBeInViewport();
			expect((await bar.boundingBox())!.width).toBeCloseTo(0, 0);

			await swipeTo(page, 1);
			await expect(tail).toBeInViewport();
			expect((await bar.boundingBox())!.width).toBeCloseTo(track.width, 0);
		});

		test('/: the excerpts play too, each as its frame comes into view', async ({ page }) => {
			const excerpts = recordExcerpts(page);
			await page.goto('/#projetos');
			await expect.poll(() => playing(page)).toEqual([true, false]);
			expect(excerpts).toEqual(['efecto-placebo']);
			// The first frame may still show a sliver, and keep playing.
			await swipeToProject(page, 1);
			await expect.poll(async () => (await playing(page))[1]).toBe(true);
		});

		test('/: each link, focused, brings its frame into view', async ({ page }) => {
			await page.goto('/#projetos');
			for (const [index, { name }] of HOME.links.entries()) {
				await reel(page).getByRole('link', { name, exact: true }).nth(index).focus();
				await settle(page);
				await expect(posters(page).nth(index)).toBeInViewport({ ratio: 1 });
			}
		});
	});

	test.describe("on a phone like Lighthouse's (412 px, 1.75×)", () => {
		test.use({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75 });

		test("/: the first screen's strip and Projects show the same poster files", async ({
			page,
		}) => {
			await page.goto('/');
			const strip = page.locator('[data-strip] img');
			for (const poster of await posters(page).all()) {
				const src = await poster.evaluate((img: HTMLImageElement) => img.currentSrc);
				const name = new URL(src).pathname.split('/').pop()!.split('.')[0];
				const sources = await strip.evaluateAll((all: HTMLImageElement[]) =>
					all.map((img) => img.currentSrc),
				);
				const inStrip = sources.filter((source) => source.includes(`/${name}.`));
				expect(inStrip.length, name).toBeGreaterThan(0);
				expect(new Set(inStrip), name).toEqual(new Set([src]));
			}
		});
	});

	test.describe('with less motion', () => {
		test.use({ viewport: DESKTOP });

		test('/: only the posters: no excerpt loads, no button, the leader and the reel stay still', async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			const excerpts = recordExcerpts(page);
			await page.goto('/#projetos');
			await expect(posters(page).first()).toBeVisible();
			await expect(reel(page).getByRole('button')).toBeHidden();
			expect(await sweepTurns(page)).toBe(false);
			// The reel swipes instead of following the scroll.
			const window = reel(page).locator('[data-reel-window]');
			expect(await window.evaluate((w) => getComputedStyle(w).overflowX)).toBe('auto');

			await swipeTo(page, 1);
			await toFooter(page);
			await page.waitForLoadState('networkidle');
			expect(excerpts).toEqual([]);
			await expect(videos(page).first()).toBeHidden();
		});

		test('/: asked with the page open, the excerpts stop and the posters return', async ({
			page,
		}) => {
			await page.goto('/#projetos');
			await expect.poll(() => playing(page)).toEqual([true, false]);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect.poll(() => playing(page)).toEqual([false, false]);
			await expect(videos(page).first()).toBeHidden();
			await expect(posters(page).first()).toBeVisible();
			await expect(reel(page).getByRole('button')).toBeHidden();
		});
	});

	test.describe('without JavaScript', () => {
		test.use({ javaScriptEnabled: false, viewport: DESKTOP });

		test('/: only the posters and the links: no excerpt, no button, the leader still', async ({
			page,
		}) => {
			const excerpts = recordExcerpts(page);
			await page.goto('/#projetos');
			await expect(posters(page)).toHaveCount(2);
			await expect(posters(page).first()).toBeVisible();
			await expect(videos(page).first()).toBeHidden();
			await expect(reel(page).getByRole('button')).toBeHidden();
			expect(await sweepTurns(page)).toBe(false);
			for (const [index, { name, href }] of HOME.links.entries()) {
				await expect(
					reel(page).getByRole('link', { name, exact: true }).nth(index),
				).toHaveAttribute('href', href);
			}
			// Swiped by hand: without JavaScript the page runs no frame callbacks to settle on.
			await reel(page)
				.locator('[data-reel-window]')
				.evaluate((window) => (window.scrollLeft = window.scrollWidth));
			await page.waitForLoadState('networkidle');
			expect(excerpts).toEqual([]);
		});
	});
});
