// The Equipa section of the home page (#15): a card per person (photo in 4:5, name, role), from
// src/config/team.ts. 5 per row on a desktop, 3 on a tablet, and on a phone a row that slides
// sideways, out to the screen's edges. Until Julien says who appears (#18), the Characters of the
// Instagram profile stand in for the team, under a visible tag.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. The Characters and texts are provisional (#18). */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'equipa',
		heading: 'Equipa',
		tag: 'Provisório: personagens no lugar da equipa',
		roles: [
			'Personagem · Efeito Placebo',
			'Personagem · Efeito Placebo',
			'Personagem · Efeito Placebo',
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
		roles: [
			'Character · Efeito Placebo',
			'Character · Efeito Placebo',
			'Character · Efeito Placebo',
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

		test(`${home.path}: the header's links lead to Sobre and to Equipa`, async ({ page }) => {
			await page.setViewportSize({ width: 1440, height: 900 });
			await page.goto(home.path);
			const nav = page.getByRole('banner').getByRole('navigation');
			for (const link of await nav.getByRole('link').all()) {
				const anchor = new URL((await link.getAttribute('href')) ?? '', 'http://x').hash;
				if (!anchor) continue;
				await link.click();
				await expect(page.locator(anchor)).toBeInViewport();
			}
			expect(page.url()).toContain(`#${home.anchor}`);
		});
	}
});

/** Each portrait's box, in the list's order. */
async function portraits(page: Page) {
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

inEachBuild(() => {
	for (const screen of [
		{ name: 'desktop', width: 1440, height: 900, rows: [5] },
		{ name: 'tablet', width: 900, height: 1000, rows: [3, 2] },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			test(`/: the five portraits in rows of ${screen.rows.join(' + ')}, all the same size, in 4:5`, async ({
				page,
			}) => {
				const boxes = await portraits(page);
				expect(rowSizes(boxes)).toEqual(screen.rows);
				for (const box of boxes) {
					expect(box.width).toBeCloseTo(boxes[0].width, 0);
					expect(box.width / box.height).toBeCloseTo(4 / 5, 1);
				}
				expect(await pageOverflow(page)).toBe(0);
			});
		});
	}

	test.describe('on a phone (390 px)', () => {
		test.use({ viewport: { width: 390, height: 844 } });

		/** The sliding row: the list of people, named after the section. */
		const row = (page: Page): Locator =>
			page.locator('section#equipa').getByRole('list', { name: 'Equipa' });

		test('/: one row that slides sideways, out to the screen edges, the page itself never', async ({
			page,
		}) => {
			const boxes = await portraits(page);
			expect(rowSizes(boxes)).toEqual([5]);
			// The first portrait on the 16 px margin, the second cut by the screen's edge.
			expect(boxes[0].x).toBeCloseTo(16, 0);
			expect(boxes[1].x).toBeLessThan(390);
			expect(boxes[1].x + boxes[1].width).toBeGreaterThan(390);
			for (const box of boxes) expect(box.width / box.height).toBeCloseTo(4 / 5, 1);

			const list = await row(page).boundingBox();
			expect(list?.x).toBe(0);
			expect(list?.width).toBe(390);
			expect(await pageOverflow(page)).toBe(0);
		});

		test('/: the row slides with the keyboard', async ({ page }) => {
			await page.goto('/');
			const list = row(page);
			await list.focus();
			await expect(list).toBeFocused();
			await page.keyboard.press('ArrowRight');
			await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
		});
	});
});
