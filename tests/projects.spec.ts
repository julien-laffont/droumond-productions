// The Projects section of the home page (#14): the two Projects in a 2:1 grid, and the teaser of
// Efeito Placebo, which only loads from YouTube after a click (#3).
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. The English texts are provisional (#18). */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'projetos',
		heading: 'Projetos',
		titles: ['Efeito Placebo', 'Mini-série do Instagram'],
		lines: ['Série · Suspense · Em gravação', 'Mini-série · Terror · 4 episódios'],
		teaser: 'Ver o teaser',
		instagram: 'Ver no Instagram',
		notice:
			'Ao clicar, o vídeo é carregado do YouTube: a Google recebe o seu endereço IP e pode guardar dados no seu dispositivo. Política de Privacidade',
		privacy: 'Política de Privacidade',
		privacySection: {
			path: '/politica-de-privacidade/#teaser-do-youtube',
			heading: 'Teaser do YouTube',
		},
	},
	{
		path: '/en/',
		english: true,
		anchor: 'projects',
		heading: 'Projects',
		titles: ['Efeito Placebo', 'Instagram mini-series'],
		lines: ['Series · Thriller · In production', 'Mini-series · Horror · 4 episodes'],
		teaser: 'Watch the teaser',
		instagram: 'See on Instagram',
		notice:
			'When you click, the video loads from YouTube: Google receives your IP address and may store data on your device. Privacy Policy',
		privacy: 'Privacy Policy',
		privacySection: {
			path: '/en/privacy-policy/#the-youtube-teaser',
			heading: 'The YouTube teaser',
		},
	},
];

const INSTAGRAM_PROFILE = 'https://www.instagram.com/droumond_productions';
const TEASER_ON_YOUTUBE = 'https://www.youtube.com/watch?v=Y785Re6Cyvk';
const TEASER_PLAYER = 'https://www.youtube-nocookie.com/embed/Y785Re6Cyvk?autoplay=1';

/**
 * Records every request the page makes to another site, and answers YouTube's player with an
 * empty page, so the tests never reach Google.
 */
async function recordOtherSites(page: Page, baseURL: string | undefined) {
	const requests: string[] = [];
	page.on('request', (request) => {
		if (new URL(request.url()).origin !== baseURL) requests.push(request.url());
	});
	await page.route('https://www.youtube-nocookie.com/**', (route) =>
		route.fulfill({ contentType: 'text/html', body: '<title>Player</title>' }),
	);
	return requests;
}

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Projects shows both Projects, each with its title and line`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			await expect(section.getByRole('heading', { level: 2 })).toHaveText(home.heading);
			await expect(section.getByRole('heading', { level: 3 })).toHaveText(home.titles);
			for (const line of home.lines) await expect(section.getByText(line)).toBeVisible();
		});

		test(`${home.path}: the name "Resident Evil" appears nowhere until Julien confirms it`, async ({
			page,
		}) => {
			await page.goto(home.path);
			expect(await page.content()).not.toMatch(/resident\s*evil/i);
		});

		test(`${home.path}: the images come from the site itself, in several sizes`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const images = page.locator(`section#${home.anchor} img`);
			await expect(images).toHaveCount(2);
			for (const image of await images.all()) {
				const src = await image.evaluate((img: HTMLImageElement) => img.src);
				expect(new URL(src).origin).toBe(baseURL);
				const srcset = (await image.getAttribute('srcset')) ?? '';
				expect(srcset.split(',').length, srcset).toBeGreaterThan(1);
			}
		});

		test(`${home.path}: the mini-series leads to the Instagram profile, in a new tab`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const link = page
				.locator(`section#${home.anchor}`)
				.getByRole('link', { name: home.instagram });
			await expect(link).toHaveAttribute('href', INSTAGRAM_PROFILE);
			await expect(link).toHaveAttribute('target', '_blank');
		});

		test(`${home.path}: no label is drawn over the images: the image itself is the link`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			for (const name of [home.teaser, home.instagram]) {
				// The link keeps saying what it does to screen readers, without showing it.
				const label = section.getByRole('link', { name }).getByText(name);
				const box = await label.boundingBox();
				expect(box && box.width * box.height, name).toBeLessThanOrEqual(1);
			}
		});

		test(`${home.path}: a notice under the teaser says what the click does and leads to the policy`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			const teaser = section.getByRole('link', { name: home.teaser });
			await expect(teaser).toHaveAccessibleDescription(home.notice);
			const notice = section.getByText(home.notice);
			await expect(notice).toBeVisible();

			await notice.getByRole('link', { name: home.privacy }).click();
			await expect(page).toHaveURL(home.privacySection.path);
			await expect(
				page.getByRole('heading', { name: home.privacySection.heading }),
			).toBeInViewport();
		});

		test(`${home.path}: nothing is asked of another site until the teaser is clicked`, async ({
			page,
			baseURL,
		}) => {
			const requests = await recordOtherSites(page, baseURL);
			await page.goto(home.path);
			// Down to the footer, so every lazy image loads.
			await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
			await page.waitForLoadState('networkidle');
			expect(requests).toEqual([]);

			await page.getByRole('link', { name: home.teaser }).click();
			await expect.poll(() => requests).toContain(TEASER_PLAYER);
		});

		test(`${home.path}: a click on the teaser plays it in place, from youtube-nocookie.com`, async ({
			page,
			baseURL,
		}) => {
			await recordOtherSites(page, baseURL);
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			const teaser = section.getByRole('link', { name: home.teaser });
			await teaser.click();

			const player = section.locator('iframe');
			await expect(player).toHaveAttribute('src', TEASER_PLAYER);
			await expect(player).toHaveAttribute('title', /^Efeito Placebo, /);
			await expect(player).toBeFocused();
			await expect(teaser).toHaveCount(0);
			expect(page.context().pages()).toHaveLength(1);
		});

		test(`${home.path}: the teaser plays with the keyboard too`, async ({ page, baseURL }) => {
			await recordOtherSites(page, baseURL);
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			await section.getByRole('link', { name: home.teaser }).focus();
			await page.keyboard.press('Enter');
			const player = section.locator('iframe');
			await expect(player).toHaveAttribute('src', TEASER_PLAYER);
			await expect(player).toBeFocused();
		});

		test.describe('without JavaScript', () => {
			test.use({ javaScriptEnabled: false });

			test(`${home.path}: the teaser is a link to YouTube, in a new tab`, async ({ page }) => {
				await page.goto(home.path);
				const teaser = page
					.locator(`section#${home.anchor}`)
					.getByRole('link', { name: home.teaser });
				await expect(teaser).toHaveAttribute('href', TEASER_ON_YOUTUBE);
				await expect(teaser).toHaveAttribute('target', '_blank');
			});
		});
	}
});

/** The box of each Project's image, in the section's order. */
async function imageBoxes(page: Page) {
	const boxes = [];
	for (const image of await page.locator('section#projetos img').all()) {
		const box = await image.boundingBox();
		if (!box) throw new Error('A Project image is not displayed');
		boxes.push(box);
	}
	return boxes;
}

inEachBuild(() => {
	test.describe('on a desktop (1440 px)', () => {
		test.use({ viewport: { width: 1440, height: 900 } });

		test('/: the teaser takes two thirds of the row in 16:9, the mini-series one third in 4:5', async ({
			page,
		}) => {
			await page.goto('/');
			const [teaser, miniSeries] = await imageBoxes(page);
			expect(teaser.y).toBeCloseTo(miniSeries.y, 0);
			expect(teaser.width / miniSeries.width).toBeCloseTo(2, 1);
			expect(teaser.width / teaser.height).toBeCloseTo(16 / 9, 1);
			expect(miniSeries.width / miniSeries.height).toBeCloseTo(4 / 5, 1);
		});
	});

	test.describe('on a phone (390 px)', () => {
		test.use({ viewport: { width: 390, height: 844 } });

		test('/: one column, the teaser in 16:9, the mini-series square', async ({ page }) => {
			await page.goto('/');
			const [teaser, miniSeries] = await imageBoxes(page);
			expect(miniSeries.y).toBeGreaterThan(teaser.y + teaser.height);
			expect(miniSeries.width).toBeCloseTo(teaser.width, 0);
			expect(teaser.width / teaser.height).toBeCloseTo(16 / 9, 1);
			expect(miniSeries.width / miniSeries.height).toBeCloseTo(1, 1);
		});
	});
});
