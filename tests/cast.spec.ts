// The Elenco section of the home page: a film strip of every actor that runs by itself, each person
// on a frame of film ringed in grease pencil, shown by name alone.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

/** What the section shows in each language. */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'elenco',
		heading: 'Elenco',
		sheet: 'Folha de contactos · Rolo 02',
		toggle: { pause: 'Pausar elenco', resume: 'Retomar elenco' },
	},
	{
		path: '/en/',
		english: true,
		anchor: 'cast',
		heading: 'Cast',
		sheet: 'Contact sheet · Reel 02',
		toggle: { pause: 'Pause cast', resume: 'Resume cast' },
	},
];

/** Every actor except Carlos and Julien, who are in Sobre. */
const NAMES = [
	'Gonçalo Espírito Santo',
	'Maria Inácio',
	'Ana Isabel',
	'Maria Inês Cabral',
	'Flávio Vicente',
	'Bernardo Delgado',
	'Isabel Frazão',
	'Kimberly Araújo',
	'Maria Silva',
	'Mateus Silva',
	'Marisa Tomas',
	'Isabel Rodríguez',
	'Sara Lucas',
	'Maria Pendeirada',
];

/** The top edge code of each person's frame: frames 31 on, the reel's name on every other one. */
const FRAME_CODES = NAMES.map((_, index) =>
	index % 2 ? `▸ ${31 + index}` : `Droumond ▸ ${31 + index}`,
);

/** The strip crosses its own length in 6 s per person. */
const LOOP_MS = NAMES.length * 6000;

/** The grease pencil (#d63a2f). */
const GREASE = 'rgb(214, 58, 47)';

/** Whether a decoration is hidden from screen readers. */
const isHidden = (decoration: Locator) =>
	decoration.evaluate((el) => el.closest('[aria-hidden="true"]') !== null);

const section = (page: Page, anchor: string) => page.locator(`section#${anchor}`);

/**
 * How far the strip moves in half a second, in pixels (0 when still). Waits first for any pending
 * pause or play, which Chromium applies only on the next frame.
 */
async function travel(page: Page, anchor: string) {
	await page.evaluate(() =>
		Promise.allSettled(document.getAnimations().map((animation) => animation.ready)),
	);
	const name = section(page, anchor).getByRole('heading', { level: 3 }).first();
	const start = (await name.boundingBox())!.x;
	await page.waitForTimeout(500);
	return start - (await name.boundingBox())!.x;
}

/** Brings the section into view, where the strip runs. */
const showSection = (page: Page, anchor: string) =>
	section(page, anchor).evaluate((el) => el.scrollIntoView());

/** The length of each endless animation of the strip, in milliseconds. */
const loops = (page: Page, anchor: string) =>
	section(page, anchor)
		.locator('.track')
		.evaluate((track) =>
			track
				.getAnimations()
				.map((animation) => animation.effect!.getTiming())
				.filter((timing) => timing.iterations === Infinity)
				.map((timing) => timing.duration),
		);

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Elenco shows each actor's photo and name, no role, nothing provisional`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const cast = section(page, home.anchor);
			await expect(cast.getByRole('heading', { level: 2 })).toHaveText(home.heading);
			await expect(cast.getByText(/Provisório|Provisional|Personagem|Character/)).toHaveCount(0);

			const people = cast.getByRole('listitem');
			await expect(people).toHaveCount(NAMES.length);
			await expect(cast.getByRole('heading', { level: 3 })).toHaveText(NAMES);
			await expect(cast.getByRole('paragraph')).toHaveCount(0);
			for (const [index, person] of (await people.all()).entries()) {
				// Every photo says what it shows, comes from the site itself, in several sizes.
				const photo = person.getByRole('img');
				expect((await photo.getAttribute('alt'))?.trim(), NAMES[index]).toBeTruthy();
				const src = await photo.evaluate((img: HTMLImageElement) => img.src);
				expect(new URL(src).origin).toBe(baseURL);
				expect(((await photo.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
			}
		});

		test(`${home.path}: the frames run twice, the second time hidden, so the loop has no seam`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const cast = section(page, home.anchor);
			const sheet = cast.getByText(home.sheet, { exact: true });
			await expect(sheet).toBeVisible();
			expect(await isHidden(sheet)).toBe(true);

			const codes = cast.getByText(/▸ \d\d$/);
			await expect(codes).toHaveText([...FRAME_CODES, ...FRAME_CODES]);
			for (const code of await codes.all()) expect(await isHidden(code)).toBe(true);

			const photos = cast.locator('img');
			await expect(photos).toHaveCount(NAMES.length * 2);
			const sources = await photos.evaluateAll((imgs) =>
				imgs.map((img) => (img as HTMLImageElement).src),
			);
			expect(sources.slice(NAMES.length)).toEqual(sources.slice(0, NAMES.length));
			for (const copy of (await photos.all()).slice(NAMES.length)) {
				expect(await isHidden(copy)).toBe(true);
				expect(await copy.getAttribute('alt')).toBe('');
			}
			await expect(cast.locator('ul[inert]')).toHaveCount(1);
		});

		test(`${home.path}: each person is ringed in pencil, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			for (const person of await section(page, home.anchor).getByRole('listitem').all()) {
				const ring = person.locator('svg');
				await expect(ring).toHaveCount(1);
				expect(await isHidden(ring)).toBe(true);
				await expect(ring.locator('path')).toHaveCSS('stroke', GREASE);
			}
		});

		test(`${home.path}: the strip runs in a loop of 6 s per person until its button pauses it`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto(home.path);
			await showSection(page, home.anchor);
			await expect.poll(() => travel(page, home.anchor)).toBeGreaterThan(5);
			expect(await loops(page, home.anchor)).toEqual([LOOP_MS]);

			const cast = section(page, home.anchor);
			await cast.getByRole('button', { name: home.toggle.pause }).click();
			const resume = cast.getByRole('button', { name: home.toggle.resume });
			await expect(resume).toBeVisible();
			expect(await travel(page, home.anchor)).toBe(0);

			await resume.click();
			await expect(cast.getByRole('button', { name: home.toggle.pause })).toBeVisible();
			await expect.poll(() => travel(page, home.anchor)).toBeGreaterThan(5);
		});

		test(`${home.path}: the strip rests while it is off screen, and a pause by hand stays`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto(home.path);
			await showSection(page, home.anchor);
			await expect.poll(() => travel(page, home.anchor)).toBeGreaterThan(5);
			await page.evaluate(() => window.scrollTo(0, 0));
			await expect.poll(() => travel(page, home.anchor)).toBe(0);
			await showSection(page, home.anchor);
			await expect.poll(() => travel(page, home.anchor)).toBeGreaterThan(5);

			const cast = section(page, home.anchor);
			await cast.getByRole('button', { name: home.toggle.pause }).click();
			await page.evaluate(() => window.scrollTo(0, 0));
			await showSection(page, home.anchor);
			await expect(cast.getByRole('button', { name: home.toggle.resume })).toBeVisible();
			expect(await travel(page, home.anchor)).toBe(0);
		});

		test(`${home.path}: with less motion the strip stands still and scrolls by hand, without its button`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.goto(home.path);
			await showSection(page, home.anchor);
			const cast = section(page, home.anchor);
			expect(await travel(page, home.anchor)).toBe(0);
			await expect(cast.getByRole('button')).toHaveCount(0);
			await expect(cast.locator('ul[inert]')).toBeHidden();

			// Everyone is reachable: the strip is focusable and slides with the keyboard's arrows.
			const view = cast.getByRole('group', { name: home.heading });
			await view.focus();
			await expect(view).toBeFocused();
			await page.keyboard.press('ArrowRight');
			await expect.poll(() => view.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

			// Also when the preference changes with the page open.
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await expect(cast.getByRole('button', { name: home.toggle.pause })).toBeVisible();
			await expect.poll(() => travel(page, home.anchor)).toBeGreaterThan(5);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect(cast.getByRole('button')).toHaveCount(0);
			expect(await travel(page, home.anchor)).toBe(0);
		});

		test.describe('without JavaScript', () => {
			test.use({ javaScriptEnabled: false });

			test(`${home.path}: the strip stands still and scrolls by hand, since nothing could pause it`, async ({
				page,
			}) => {
				await page.emulateMedia({ reducedMotion: 'no-preference' });
				await page.goto(home.path);
				await showSection(page, home.anchor);
				const cast = section(page, home.anchor);
				expect(await travel(page, home.anchor)).toBe(0);
				await expect(cast.getByRole('button')).toHaveCount(0);
				await expect(cast.getByRole('group', { name: home.heading })).toHaveAttribute(
					'tabindex',
					'0',
				);
				await expect(cast.getByRole('listitem')).toHaveCount(NAMES.length);
			});
		});
	}
});

/** The page's horizontal scroll, which must stay 0. */
const pageOverflow = (page: Page) =>
	page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** The first person's pencil ring. */
const firstRing = (page: Page) => page.locator('section#elenco li svg path').first();

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
	const ring = page.locator('section#elenco li svg').first();
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
		// Less motion: nothing moves or fades in while the pixels are compared.
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('section#elenco li').first().scrollIntoViewIfNeeded();
		for (const share of [0.05, 0.5, 0.95]) {
			expect(await paintsAt(page, share), `at ${share * 100}% of the ring`).toBe(true);
		}
	});

	for (const screen of [
		{ name: 'phone', width: 390, height: 844, card: 220 },
		{ name: 'tablet', width: 900, height: 1000, card: 220 },
		{ name: 'desktop', width: 1440, height: 900, card: 1440 * 0.19 },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			test('/: one row of 4:5 portraits the same size, the films touching, out to the screen edges', async ({
				page,
			}) => {
				await page.emulateMedia({ reducedMotion: 'reduce' });
				await page.goto('/');
				const boxes = [];
				for (const photo of await page.locator('section#elenco ul:not([inert]) img').all()) {
					boxes.push((await photo.boundingBox())!);
				}
				expect(boxes).toHaveLength(NAMES.length);
				for (const box of boxes) {
					expect(box.y).toBeCloseTo(boxes[0].y, 0);
					// A card is 19 % of the screen between 220 and 300 px, less the film's 7 px a side.
					expect(box.width).toBeCloseTo(Math.min(Math.max(screen.card, 220), 300) - 14, 0);
					expect(box.width / box.height).toBeCloseTo(4 / 5, 1);
				}
				// Side by side, only the film's 7 px on each side between two photos.
				expect(boxes[1].x - (boxes[0].x + boxes[0].width)).toBeCloseTo(14, 0);

				const view = await page
					.locator('section#elenco')
					.getByRole('group', { name: 'Elenco' })
					.boundingBox();
				expect(view?.x).toBe(0);
				expect(view?.width).toBe(screen.width);
				expect(await pageOverflow(page)).toBe(0);
			});

			test('/: running, the page itself never scrolls sideways', async ({ page }) => {
				await page.emulateMedia({ reducedMotion: 'no-preference' });
				await page.goto('/');
				await showSection(page, 'elenco');
				expect(await pageOverflow(page)).toBe(0);
			});
		});
	}

	test('/: the pencil ring stays drawn, and is drawn again in 0.7 s on hover', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto('/');
		await showSection(page, 'elenco');
		// A moving frame cannot be hovered: stop the strip first.
		await page.getByRole('button', { name: 'Pausar elenco' }).click();
		await expect(firstRing(page)).toHaveCSS('stroke-dashoffset', '0px');
		expect(await ringAnimationDurations(page)).toEqual([]);

		await page.locator('section#elenco li').first().hover({ force: true });
		expect(await ringAnimationDurations(page)).toEqual([700]);
	});

	test('/: with less motion, the pencil ring stays whole and still on hover', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('section#elenco li').first().hover();
		expect(await ringAnimationDurations(page)).toEqual([]);
		await expect(firstRing(page)).toHaveCSS('stroke-dashoffset', '0px');
	});
});
