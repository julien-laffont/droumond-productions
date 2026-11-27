// The invitations to the Instagram profile: a text-only band on the home page, right after
// Projects, and a link on the filming page's clapperboard. Resident Evil's and Efecto Placebo's are
// checked with the rest of their pages.
import { expect, test, type Page } from '@playwright/test';
import { openExisting } from './pages';

const PROFILE = 'https://www.instagram.com/droumond_productions';
const HANDLE = '@droumond_productions';

const BAND = [
	{
		path: '/',
		projects: 'projetos',
		snapshot: `
			- region "${HANDLE}":
			  - paragraph: Instagram
			  - heading "${HANDLE}" [level=2]
			  - paragraph: Episódios, bastidores e o que estamos a gravar agora.
			  - link "Seguir no Instagram":
			    - /url: ${PROFILE}
		`,
	},
	{
		path: '/en/',
		projects: 'projects',
		snapshot: `
			- region "${HANDLE}":
			  - paragraph: Instagram
			  - heading "${HANDLE}" [level=2]
			  - paragraph: Episodes, behind the scenes and what we are filming right now.
			  - link "Follow on Instagram":
			    - /url: ${PROFILE}
		`,
	},
	{
		path: '/es/',
		projects: 'proyectos',
		snapshot: `
			- region "${HANDLE}":
			  - paragraph: Instagram
			  - heading "${HANDLE}" [level=2]
			  - paragraph: Episodios, bastidores y lo que estamos grabando ahora.
			  - link "Seguir en Instagram":
			    - /url: ${PROFILE}
		`,
	},
	{
		path: '/fr/',
		projects: 'projets',
		snapshot: `
			- region "${HANDLE}":
			  - paragraph: Instagram
			  - heading "${HANDLE}" [level=2]
			  - paragraph: Épisodes, coulisses et ce que nous tournons en ce moment.
			  - link "Suivre sur Instagram":
			    - /url: ${PROFILE}
		`,
	},
];

const FILMING = [
	{ path: '/filmagens/', link: 'Veja o nosso trabalho no Instagram' },
	{ path: '/en/filming/', link: 'See our work on Instagram' },
	{ path: '/es/rodajes/', link: 'Vea nuestro trabajo en Instagram' },
	{ path: '/fr/tournages/', link: 'Découvrez notre travail sur Instagram' },
];

const band = (page: Page) => page.getByRole('region', { name: HANDLE, exact: true });

for (const expected of BAND) {
	test(`${expected.path}: right after Projects, a band with the profile's name, a sentence and a button`, async ({
		page,
	}) => {
		await openExisting(page, expected.path);
		await expect(band(page)).toMatchAriaSnapshot(expected.snapshot);
		// The section before it: Projects' script sits in between.
		const previous = await band(page).evaluate((section) => {
			const sections = [...section.parentElement!.querySelectorAll(':scope > section')];
			return sections[sections.indexOf(section) - 1]?.id;
		});
		expect(previous).toBe(expected.projects);
		const button = band(page).getByRole('link');
		await expect(button).toHaveAttribute('target', '_blank');
		await expect(button).toHaveAttribute('rel', 'noopener');
		// Only text: the home page is near its weight limit.
		await expect(band(page).locator('img, picture, video, svg')).toHaveCount(0);
	});
}

/** The boxes of the band's name and sentence, on the Portuguese home page. */
async function bandBoxes(page: Page) {
	await page.goto('/');
	const name = await band(page).getByRole('heading').boundingBox();
	const sentence = await band(page)
		.getByText(/^Episódios/)
		.boundingBox();
	if (!name || !sentence) throw new Error("The band's name or sentence is not displayed");
	return { name, sentence };
}

test.describe('on a desktop (1440 px)', () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test('/: the band in two columns, the name on the left, the sentence and button on the right', async ({
		page,
	}) => {
		const { name, sentence } = await bandBoxes(page);
		expect(sentence.x).toBeGreaterThan(name.x + name.width);
	});
});

test.describe('on a phone (390 px)', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('/: the band in one column, the sentence under the name', async ({ page }) => {
		const { name, sentence } = await bandBoxes(page);
		expect(sentence.y).toBeGreaterThanOrEqual(name.y + name.height);
	});
});

for (const expected of FILMING) {
	test(`${expected.path}: the clapperboard links to the Instagram profile, in a new tab`, async ({
		page,
	}) => {
		await openExisting(page, expected.path);
		const clapperboard = page.getByRole('main').locator(':scope > :first-child');
		const link = clapperboard.getByRole('link', { name: expected.link, exact: true });
		await expect(link).toHaveAttribute('href', PROFILE);
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener');
	});
}
