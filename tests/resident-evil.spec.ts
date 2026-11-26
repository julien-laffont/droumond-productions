// The page of Resident Evil: the first episode hosted on the site, loaded only when played, the
// text beside it, the credits, and the link to the other episodes on Instagram.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild, languageOf, openExisting } from './pages';

const PAGE = '/resident-evil/';
const INSTAGRAM_PROFILE = 'https://www.instagram.com/droumond_productions';

/** What the page shows in each language. The English texts are provisional. */
const RESIDENT_EVIL = [
	{
		path: '/resident-evil/',
		description:
			'Minissérie de terror em cinco episódios, filmada na vertical e publicada no Instagram. Veja aqui o primeiro episódio.',
		snapshot: `
			- main:
			  - heading "Resident Evil" [level=1]
			  - paragraph: Minissérie · Terror · 5 episódios · O 5.º em breve
			  - region "Episódios":
			    - heading "Episódios" [level=2]
			    - figure "Episódio 1"
			    - paragraph:
			      - emphasis: Resident Evil
			      - text: /^é uma minissérie de terror/
			    - paragraph: /os restantes estão no nosso Instagram\\.$/
			    - term: Realização
			    - definition: Carlos Droumond
			    - term: Produção
			    - definition: Droumond Productions
			    - link "Ver mais episódios no Instagram":
			      - /url: https://www.instagram.com/droumond_productions
			    - paragraph: "5.º episódio: em breve"
		`,
	},
	{
		path: '/en/resident-evil/',
		description:
			'A five-episode horror mini-series, shot vertically and published on Instagram. Watch the first episode here.',
		snapshot: `
			- main:
			  - heading "Resident Evil" [level=1]
			  - paragraph: Mini-series · Horror · 5 episodes · The 5th coming soon
			  - region "Episodes":
			    - heading "Episodes" [level=2]
			    - figure "Episode 1"
			    - paragraph:
			      - emphasis: Resident Evil
			      - text: /^is a horror mini-series/
			    - paragraph: /the rest are on our Instagram\\.$/
			    - term: Director
			    - definition: Carlos Droumond
			    - term: Production
			    - definition: Droumond Productions
			    - link "See more episodes on Instagram":
			      - /url: https://www.instagram.com/droumond_productions
			    - paragraph: "Episode 5: coming soon"
		`,
	},
];

inEachBuild((build) => {
	for (const expected of RESIDENT_EVIL.filter(
		({ path }) => build.english || languageOf(path) === 'pt',
	)) {
		test(`${expected.path}: the title, the small line, the first episode, the text, the credits, the links`, async ({
			page,
		}) => {
			await openExisting(page, expected.path);
			await expect(page).toHaveTitle('Resident Evil · Droumond Productions');
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				'content',
				expected.description,
			);
			await expect(page.getByRole('main')).toMatchAriaSnapshot(expected.snapshot);
		});
	}
});

const episode = (page: Page) => page.locator('main video');

/** The videos the page has asked for, by file name. */
function recordVideos(page: Page) {
	const videos: string[] = [];
	page.on('request', (request) => {
		const name = new URL(request.url()).pathname.split('/').pop()!;
		if (name.endsWith('.mp4') && !videos.includes(name)) videos.push(name);
	});
	return videos;
}

// The behaviour, checked on the Portuguese page.
inEachBuild(() => {
	test(`${PAGE}: the episode has controls and a still from the site, and waits for a click`, async ({
		page,
		baseURL,
		browserName,
	}) => {
		const videos = recordVideos(page);
		await page.goto(PAGE);
		await expect(episode(page)).toBeVisible();
		const video = await episode(page).evaluate((video: HTMLVideoElement) => ({
			controls: video.controls,
			inline: video.playsInline,
			autoplay: video.autoplay,
			preload: video.preload,
			poster: new URL(video.poster).origin,
			ratio: video.getBoundingClientRect().width / video.getBoundingClientRect().height,
		}));
		expect(video).toMatchObject({
			controls: true,
			inline: true,
			autoplay: false,
			preload: 'none',
			poster: baseURL,
		});
		expect(video.ratio).toBeCloseTo(9 / 16, 1);
		await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
		await page.waitForLoadState('networkidle');
		// WebKit fetches the file's start on its own, whatever `preload` says.
		if (browserName === 'chromium') expect(videos).toEqual([]);
	});

	test(`${PAGE}: played, the episode comes from the site and nothing from another site is asked`, async ({
		page,
		baseURL,
	}) => {
		const otherSites: string[] = [];
		page.on('request', (request) => {
			if (new URL(request.url()).origin !== baseURL) otherSites.push(request.url());
		});
		await page.goto(PAGE);
		await episode(page).evaluate((video: HTMLVideoElement) => {
			video.muted = true;
			return video.play();
		});
		await expect
			.poll(() => episode(page).evaluate((video: HTMLVideoElement) => video.currentTime))
			.toBeGreaterThan(0);
		const origin = await episode(page).evaluate(
			(video: HTMLVideoElement) => new URL(video.currentSrc).origin,
		);
		expect(origin).toBe(baseURL);
		expect(otherSites).toEqual([]);
	});

	test(`${PAGE}: "Ver mais episódios no Instagram" opens the profile in a new tab`, async ({
		page,
	}) => {
		await page.goto(PAGE);
		const link = page.getByRole('link', { name: 'Ver mais episódios no Instagram', exact: true });
		await expect(link).toHaveAttribute('href', INSTAGRAM_PROFILE);
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener');
	});
});
