// The page of Resident Evil: the four episodes as covers that open each reel on Instagram, the
// text beside them, the credits, and the invitation to the profile's behind the scenes.
import { expect, test, type Page } from '@playwright/test';
import { openExisting } from './pages';

const PAGE = '/resident-evil/';
const INSTAGRAM_PROFILE = 'https://www.instagram.com/droumond_productions';
const REELS = [
	'https://www.instagram.com/reel/DeXEyA6saok/',
	'https://www.instagram.com/reel/DezdFUHsaEK/',
	'https://www.instagram.com/reel/DfILJSmsRWk/',
	'https://www.instagram.com/reel/Dfh50ywMd3c/',
];
const NOTICE = 'Os episódios abrem no Instagram, num separador novo.';

/** What the page shows in each language. The English texts are provisional. */
const RESIDENT_EVIL = [
	{
		path: '/resident-evil/',
		description:
			'Minissérie de terror em cinco episódios, filmada na vertical e publicada no Instagram.',
		snapshot: `
			- main:
			  - heading "Resident Evil" [level=1]
			  - paragraph: Minissérie · Terror · 5 episódios · O 5.º em breve
			  - region "Episódios":
			    - heading "Episódios" [level=2]
			    - list:
			      - listitem:
			        - link "Episódio 1":
			          - /url: ${REELS[0]}
			      - listitem:
			        - link "Episódio 2":
			          - /url: ${REELS[1]}
			      - listitem:
			        - link "Episódio 3":
			          - /url: ${REELS[2]}
			      - listitem:
			        - link "Episódio 4":
			          - /url: ${REELS[3]}
			    - paragraph: ${NOTICE}
			    - paragraph:
			      - emphasis: Resident Evil
			      - text: /^é uma minissérie de terror/
			    - paragraph: O primeiro abre de noite, numa estrada da Marinha Grande.
			    - term: Realização
			    - definition: Carlos Droumond
			    - term: Produção
			    - definition: Droumond Productions
			    - paragraph:
			      - strong: Quer ver mais?
			      - text: Os bastidores de
			      - emphasis: Resident Evil
			      - text: estão no nosso Instagram.
			    - link "Ver no Instagram":
			      - /url: ${INSTAGRAM_PROFILE}
			    - paragraph: "5.º episódio: em breve, no Instagram."
		`,
	},
	{
		path: '/en/resident-evil/',
		description: 'A five-episode horror mini-series, shot vertically and published on Instagram.',
		snapshot: `
			- main:
			  - heading "Resident Evil" [level=1]
			  - paragraph: Mini-series · Horror · 5 episodes · The 5th coming soon
			  - region "Episodes":
			    - heading "Episodes" [level=2]
			    - list:
			      - listitem:
			        - link "Episode 1":
			          - /url: ${REELS[0]}
			      - listitem:
			        - link "Episode 2":
			          - /url: ${REELS[1]}
			      - listitem:
			        - link "Episode 3":
			          - /url: ${REELS[2]}
			      - listitem:
			        - link "Episode 4":
			          - /url: ${REELS[3]}
			    - paragraph: The episodes open on Instagram, in a new tab.
			    - paragraph:
			      - emphasis: Resident Evil
			      - text: /^is a horror mini-series/
			    - paragraph: The first one opens at night, on a road in Marinha Grande.
			    - term: Director
			    - definition: Carlos Droumond
			    - term: Production
			    - definition: Droumond Productions
			    - paragraph:
			      - strong: Want to see more?
			      - text: Behind-the-scenes footage of
			      - emphasis: Resident Evil
			      - text: is on our Instagram.
			    - link "View on Instagram":
			      - /url: ${INSTAGRAM_PROFILE}
			    - paragraph: "Episode 5: coming soon, on Instagram."
		`,
	},
];

for (const expected of RESIDENT_EVIL) {
	test(`${expected.path}: the title, the small line, the four episodes, the text, the credits, the links`, async ({
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

const episodes = (page: Page) => page.getByRole('main').getByRole('listitem').getByRole('link');
const covers = (page: Page) => page.getByRole('main').getByRole('listitem').locator('img');

// The behaviour, checked on the Portuguese page.
test(`${PAGE}: each episode opens its reel on Instagram in a new tab, and says so`, async ({
	page,
}) => {
	await page.goto(PAGE);
	await expect(episodes(page)).toHaveCount(REELS.length);
	for (const [index, reel] of REELS.entries()) {
		const episode = episodes(page).nth(index);
		await expect(episode).toHaveAttribute('href', reel);
		await expect(episode).toHaveAttribute('target', '_blank');
		await expect(episode).toHaveAttribute('rel', 'noopener');
		await expect(episode).toHaveAccessibleDescription(NOTICE);
	}
});

test(`${PAGE}: the covers come from the site, and nothing from another site and no video is asked`, async ({
	page,
	baseURL,
}) => {
	const otherSites: string[] = [];
	const videos: string[] = [];
	page.on('request', (request) => {
		const url = new URL(request.url());
		if (url.origin !== baseURL) otherSites.push(request.url());
		if (url.pathname.endsWith('.mp4')) videos.push(request.url());
	});
	await page.goto(PAGE);
	await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
	await page.waitForLoadState('networkidle');
	await expect(covers(page)).toHaveCount(REELS.length);
	for (const cover of await covers(page).all()) {
		await expect(cover).toHaveAttribute('alt', '');
		const { origin, ratio } = await cover.evaluate((image: HTMLImageElement) => ({
			origin: image.complete && image.naturalWidth > 0 ? new URL(image.currentSrc).origin : '',
			ratio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
		}));
		expect(origin).toBe(baseURL);
		expect(ratio).toBeCloseTo(9 / 16, 1);
	}
	await expect(page.locator('main video')).toHaveCount(0);
	expect(videos).toEqual([]);
	expect(otherSites).toEqual([]);
});

test(`${PAGE}: "Ver no Instagram" opens the profile in a new tab`, async ({ page }) => {
	await page.goto(PAGE);
	const link = page.getByRole('link', { name: 'Ver no Instagram', exact: true });
	await expect(link).toHaveAttribute('href', INSTAGRAM_PROFILE);
	await expect(link).toHaveAttribute('target', '_blank');
	await expect(link).toHaveAttribute('rel', 'noopener');
});

test.describe('on a desktop (1440 px)', () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test(`${PAGE}: the episodes two by two on the left, the text on the right`, async ({ page }) => {
		const { coverBoxes, credits, overflow } = await openBoxes(page);
		expectTwoByTwo(coverBoxes);
		expect(credits.x).toBeGreaterThan(coverBoxes[1].x + coverBoxes[1].width);
		expect(overflow).toBe(0);
	});
});

test.describe('on a phone (390 px)', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test(`${PAGE}: the episodes two by two, the text below`, async ({ page }) => {
		const { coverBoxes, credits, overflow } = await openBoxes(page);
		expectTwoByTwo(coverBoxes);
		expect(credits.y).toBeGreaterThan(coverBoxes[3].y + coverBoxes[3].height);
		expect(overflow).toBe(0);
	});
});

type Box = { x: number; y: number; width: number; height: number };

/** Opens the Portuguese page and gives the covers' boxes, the credits' box and the sideways scroll. */
async function openBoxes(page: Page) {
	await page.goto(PAGE);
	const coverBoxes: Box[] = [];
	for (const cover of await covers(page).all()) {
		const box = await cover.boundingBox();
		if (box) coverBoxes.push(box);
	}
	const credits = await page.getByRole('main').locator('dl').boundingBox();
	if (coverBoxes.length !== REELS.length || !credits) {
		throw new Error('The covers or the credits are not displayed');
	}
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	return { coverBoxes, credits, overflow };
}

/** Two covers per row, the same size: 1 and 2 side by side, 3 and 4 below them. */
function expectTwoByTwo(boxes: Box[]) {
	const [first, second, third, fourth] = boxes;
	for (const box of boxes) expect(box.width).toBeCloseTo(first.width, 0);
	expect(second.y).toBeCloseTo(first.y, 0);
	expect(second.x).toBeGreaterThan(first.x + first.width);
	expect(third.x).toBeCloseTo(first.x, 0);
	expect(third.y).toBeGreaterThan(first.y + first.height);
	expect(fourth.x).toBeCloseTo(second.x, 0);
	expect(fourth.y).toBeCloseTo(third.y, 0);
}
