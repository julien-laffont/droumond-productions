// The Equipa section of the home page: a contact sheet of src/config/team.ts, each person on a
// frame of film ringed in grease pencil, laid out by src/lib/team-grid.ts.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. The Characters and texts are provisional. */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'equipa',
		heading: 'Equipa',
		tag: 'Provisório: personagens no lugar da equipa',
		sheet: 'Folha de contactos · Rolo 02',
		roles: [
			'Personagem · Efecto Placebo',
			'Personagem · Efecto Placebo',
			'Personagem · Efecto Placebo',
			'Personagem',
			'Personagem',
		],
	},
	{
		path: '/en/',
		english: true,
		anchor: 'team',
		heading: 'Team',
		tag: 'Provisional: characters in place of the team',
		sheet: 'Contact sheet · Reel 02',
		roles: [
			'Character · Efecto Placebo',
			'Character · Efecto Placebo',
			'Character · Efecto Placebo',
			'Character',
			'Character',
		],
	},
];

const NAMES = [
	'Raul de Valverde',
	'Miguel Figueredo',
	'Julien Laffont',
	'Bruno Moreira',
	'Nome por confirmar',
];

/** The top edge code of each person's frame. */
const FRAME_CODES = ['Droumond ▸ 31', '▸ 32', 'Droumond ▸ 33', '▸ 34', 'Droumond ▸ 35'];

/** The grease pencil (#d63a2f). */
const GREASE = 'rgb(214, 58, 47)';

/** Whether a decoration is hidden from screen readers. */
const isHidden = (decoration: Locator) =>
	decoration.evaluate((el) => el.closest('[aria-hidden="true"]') !== null);

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Equipa shows the provisional tag and each person's photo, name and role`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			await expect(section.getByRole('heading', { level: 2 })).toHaveText(home.heading);
			await expect(section.getByText(home.tag)).toBeVisible();

			const people = section.getByRole('listitem');
			await expect(people).toHaveCount(NAMES.length);
			await expect(section.getByRole('heading', { level: 3 })).toHaveText(NAMES);
			for (const [index, person] of (await people.all()).entries()) {
				await expect(person.getByRole('paragraph')).toHaveText(home.roles[index]);
				// Every photo says what it shows, comes from the site itself, in several sizes.
				const photo = person.getByRole('img');
				expect((await photo.getAttribute('alt'))?.trim(), NAMES[index]).toBeTruthy();
				const src = await photo.evaluate((img: HTMLImageElement) => img.src);
				expect(new URL(src).origin).toBe(baseURL);
				expect(((await photo.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
			}
		});

		test(`${home.path}: Equipa is a contact sheet, each person ringed in pencil, all hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			const sheet = section.getByText(home.sheet, { exact: true });
			await expect(sheet).toBeVisible();
			expect(await isHidden(sheet)).toBe(true);

			const codes = section.getByText(/▸ \d\d$/);
			await expect(codes).toHaveText(FRAME_CODES);
			for (const code of await codes.all()) expect(await isHidden(code)).toBe(true);

			for (const person of await section.getByRole('listitem').all()) {
				const ring = person.locator('svg');
				await expect(ring).toHaveCount(1);
				expect(await isHidden(ring)).toBe(true);
				await expect(ring.locator('path')).toHaveCSS('stroke', GREASE);
			}
		});
	}
});

/** Opens the Portuguese home page and gives each portrait's box, in the list's order. */
async function openPortraits(page: Page) {
	await page.goto('/');
	const boxes = [];
	for (const photo of await page.locator('section#equipa img').all()) {
		const box = await photo.boundingBox();
		if (!box) throw new Error('A portrait is not displayed');
		boxes.push(box);
	}
	return boxes;
}

/** How many portraits share each row, top to bottom: [3, 2]. */
function rowSizes(boxes: { y: number }[]): number[] {
	const rows = new Map<number, number>();
	for (const { y } of boxes) rows.set(Math.round(y), (rows.get(Math.round(y)) ?? 0) + 1);
	return [...rows.values()];
}

/** The page's horizontal scroll, which must stay 0. */
const pageOverflow = (page: Page) =>
	page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** The first person's pencil ring. */
const firstRing = (page: Page) => page.locator('section#equipa li svg path').first();

/** The length, in milliseconds, of each animation running on the first person's pencil ring. */
const ringAnimationDurations = (page: Page) =>
	firstRing(page).evaluate((path) =>
		path.getAnimations().map((animation) => animation.effect!.getTiming().duration),
	);

/**
 * Whether the first person's pencil ring paints the point at `share` of its length: the pixels
 * there change when the ring is hidden.
 */
async function paintsAt(page: Page, share: number) {
	const ring = page.locator('section#equipa li svg').first();
	const point = await ring.locator('path').evaluate((path: SVGPathElement, share) => {
		const along = path.getPointAtLength(path.getTotalLength() * share);
		const onScreen = new DOMPoint(along.x, along.y).matrixTransform(path.getScreenCTM()!);
		return { x: onScreen.x, y: onScreen.y };
	}, share);
	const clip = { x: point.x - 2, y: point.y - 2, width: 4, height: 4 };
	const shown = await page.screenshot({ clip });
	await ring.evaluate((svg) => (svg.style.visibility = 'hidden'));
	const hidden = await page.screenshot({ clip });
	await ring.evaluate((svg) => (svg.style.visibility = ''));
	return !shown.equals(hidden);
}

inEachBuild(() => {
	test('/: the pencil ring is whole, from its start to its end', async ({ page }) => {
		// Less motion: nothing fades in while the pixels are compared.
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('section#equipa li').first().scrollIntoViewIfNeeded();
		for (const share of [0.05, 0.5, 0.95]) {
			expect(await paintsAt(page, share), `at ${share * 100}% of the ring`).toBe(true);
		}
	});

	for (const screen of [
		{ name: 'desktop', width: 1440, height: 900, rows: [5] },
		{ name: 'tablet', width: 900, height: 1000, rows: [3, 2] },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			test(`/: the five portraits in rows of ${screen.rows.join(' + ')}, the same size, in 4:5, the films touching`, async ({
				page,
			}) => {
				const boxes = await openPortraits(page);
				expect(rowSizes(boxes)).toEqual(screen.rows);
				for (const box of boxes) {
					expect(box.width).toBeCloseTo(boxes[0].width, 0);
					expect(box.width / box.height).toBeCloseTo(4 / 5, 1);
				}
				// Side by side, only the film's 7 px on each side between two photos.
				expect(boxes[1].x - (boxes[0].x + boxes[0].width)).toBeCloseTo(14, 0);
				expect(await pageOverflow(page)).toBe(0);
			});
		});
	}

	for (const screen of [
		{ name: 'phone', width: 390, height: 844, gutter: 16 },
		{ name: 'small tablet', width: 680, height: 900, gutter: 680 * 0.03 },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			/** The sliding strip: the list of people, named after the section. */
			const strip = (page: Page): Locator =>
				page.locator('section#equipa').getByRole('list', { name: 'Equipa' });

			test('/: one strip that slides sideways, out to the screen edges, the page itself never', async ({
				page,
			}) => {
				const boxes = await openPortraits(page);
				expect(rowSizes(boxes)).toEqual([5]);
				// The first photo on the margin, inside its film; the second cut by the screen's edge.
				expect(boxes[0].x).toBeCloseTo(screen.gutter + 7, 0);
				expect(boxes[1].x).toBeLessThan(screen.width);
				expect(boxes[1].x + boxes[1].width).toBeGreaterThan(screen.width);
				for (const box of boxes) expect(box.width / box.height).toBeCloseTo(4 / 5, 1);

				const list = await strip(page).boundingBox();
				expect(list?.x).toBe(0);
				expect(list?.width).toBe(screen.width);
				expect(await pageOverflow(page)).toBe(0);
			});

			test('/: the strip slides with the keyboard', async ({ page }) => {
				await page.goto('/');
				const list = strip(page);
				await list.focus();
				await expect(list).toBeFocused();
				await page.keyboard.press('ArrowRight');
				await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
			});
		});
	}

	test('/: the pencil ring stays drawn, and is drawn again in 0.7 s on hover', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto('/');
		await expect(firstRing(page)).toHaveCSS('stroke-dashoffset', '0px');
		expect(await ringAnimationDurations(page)).toEqual([]);

		await page.locator('section#equipa li').first().hover();
		expect(await ringAnimationDurations(page)).toEqual([700]);
	});

	test('/: with less motion, the pencil ring stays whole and still on hover', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('section#equipa li').first().hover();
		expect(await ringAnimationDurations(page)).toEqual([]);
		await expect(firstRing(page)).toHaveCSS('stroke-dashoffset', '0px');
	});
});
