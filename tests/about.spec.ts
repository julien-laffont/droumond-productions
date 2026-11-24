// The Sobre section of the home page: small text on the left, the team on the right, one frame of
// film per person, side by side; one column below 960 px.
import { expect, test, type Page } from '@playwright/test';
import { inEachBuild } from './pages';

const NAMES = ['Carlos Droumond', 'Julien Laffont'];

/** What the section shows in each language. */
const HOMES = [
	{
		path: '/',
		english: false,
		anchor: 'sobre',
		heading: 'Sobre',
		text: 'A Droumond Productions é uma produtora audiovisual de Leiria, fundada em 2026.',
		roles: ['Cofundador · Ator', 'Cofundador · Ator'],
		alts: [
			'Carlos Droumond, de casaco castanho e camisola preta, encostado a um vidro que o reflete, numa rua de calçada.',
			'Julien Laffont, de óculos escuros e casaco de cabedal.',
		],
	},
	{
		path: '/en/',
		english: true,
		anchor: 'about',
		heading: 'About',
		text: 'Droumond Productions is an audiovisual production company based in Leiria, founded in 2026.',
		roles: ['Co-founder · Actor', 'Co-founder · Actor'],
		alts: [
			'Carlos Droumond, in a brown jacket and a black top, leaning on a glass wall that reflects him, on a cobbled street.',
			'Julien Laffont, in sunglasses and a leather jacket.',
		],
	},
];

/** The top and bottom edge codes of each frame. */
const FRAME_CODES = ['Droumond 2026 ▸ 27', '27A', '▸ 28', '28A'];

/** The amber of the edge codes (#e8a43a). */
const AMBER = 'rgb(232, 164, 58)';

inEachBuild((build) => {
	for (const home of HOMES.filter((h) => build.english || !h.english)) {
		test(`${home.path}: Sobre shows its title and the text with the Projects named`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			await expect(section.getByRole('heading', { level: 2 })).toHaveText(home.heading);
			await expect(section.getByText(home.text)).toBeVisible();
			// The Projects' names in amber, upright.
			const names = section.locator('em');
			await expect(names).toHaveText(['Efecto Placebo', 'Resident Evil']);
			for (const name of await names.all()) {
				await expect(name).toHaveCSS('color', AMBER);
				await expect(name).toHaveCSS('font-style', 'normal');
			}
		});

		test(`${home.path}: Sobre shows the team, each with photo, name and role`, async ({
			page,
			baseURL,
		}) => {
			await page.goto(home.path);
			const people = page.locator(`section#${home.anchor}`).getByRole('listitem');
			await expect(people).toHaveCount(NAMES.length);
			for (const [index, person] of (await people.all()).entries()) {
				await expect(person.getByRole('heading', { level: 3 })).toHaveText(NAMES[index]);
				await expect(person.getByRole('paragraph')).toHaveText(home.roles[index]);
				// The photo says what it shows, comes from the site itself, in several sizes.
				const photo = person.getByRole('img', { name: home.alts[index], exact: true });
				await expect(photo).toBeVisible();
				const src = await photo.evaluate((img: HTMLImageElement) => img.src);
				expect(new URL(src).origin).toBe(baseURL);
				expect(((await photo.getAttribute('srcset')) ?? '').split(',').length).toBeGreaterThan(1);
			}
		});

		test(`${home.path}: Sobre's frames have their edge codes, hidden from screen readers`, async ({
			page,
		}) => {
			await page.goto(home.path);
			const section = page.locator(`section#${home.anchor}`);
			for (const text of FRAME_CODES) {
				const code = section.getByText(text, { exact: true });
				await expect(code).toBeVisible();
				expect(await code.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
			}
		});
	}
});

/** Opens the Portuguese home page and gives the boxes of the Sobre text, team and photos. */
async function openAboutBoxes(page: Page) {
	await page.goto('/');
	const section = page.locator('section#sobre');
	const text = await section.locator('p').first().boundingBox();
	const team = await section.getByRole('list').boundingBox();
	const photos = [];
	for (const photo of await section.getByRole('img').all()) photos.push(await photo.boundingBox());
	if (!text || !team || photos.length !== 2 || !photos[0] || !photos[1]) {
		throw new Error('The Sobre text or team is not displayed');
	}
	const width = page.viewportSize()?.width ?? 0;
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	return { text, team, photos: [photos[0], photos[1]], width, overflow };
}

/** Two photos the same size, in 4:5, side by side, only their films' 12 px sides between them. */
function expectSideBySide([first, second]: {
	x: number;
	y: number;
	width: number;
	height: number;
}[]) {
	expect(second.width).toBeCloseTo(first.width, 0);
	expect(second.y).toBeCloseTo(first.y, 0);
	expect(second.x - (first.x + first.width)).toBeCloseTo(24, 0);
	for (const photo of [first, second]) expect(photo.width / photo.height).toBeCloseTo(4 / 5, 1);
}

inEachBuild(() => {
	test.describe('on a desktop (1440 px)', () => {
		test.use({ viewport: { width: 1440, height: 900 } });

		test('/: the text on the left, the team on the right, in 1 : 1.7, two 4:5 frames on film', async ({
			page,
		}) => {
			const { text, team, photos, width } = await openAboutBoxes(page);
			expect(team.x).toBeGreaterThan(text.x + text.width);
			// 40 px margins and a 72 px gap: the team takes 1.7 parts of the rest.
			expect(team.width).toBeCloseTo(((width - 80 - 72) * 1.7) / 2.7, 0);
			// The films: 12 px on each side of each photo, the band of sprocket holes above it.
			expect(photos[0].x - team.x).toBeCloseTo(12, 0);
			expect(photos[0].y - team.y).toBeCloseTo(38, 0);
			expectSideBySide(photos);
		});
	});

	for (const screen of [
		{ name: 'tablet', width: 900, height: 1000 },
		{ name: 'phone', width: 390, height: 844 },
	]) {
		test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
			test.use({ viewport: { width: screen.width, height: screen.height } });

			test('/: one column, the text above the team, the two frames side by side', async ({
				page,
			}) => {
				const { text, team, photos, overflow } = await openAboutBoxes(page);
				expect(team.y).toBeGreaterThan(text.y + text.height);
				expect(team.x).toBeCloseTo(text.x, 0);
				expectSideBySide(photos);
				expect(overflow).toBe(0);
			});
		});
	}
});
