// The page of Efecto Placebo: a hosted excerpt of the teaser, muted and looping, the link to the
// full teaser on YouTube and the one to Instagram, the synopsis next to the poster, the credits and
// the Characters.
import { expect, test, type Page } from '@playwright/test';
import { openExisting } from './pages';

const PAGE = '/efecto-placebo/';
const TEASER_ON_YOUTUBE = 'https://www.youtube.com/watch?v=Y785Re6Cyvk';
const INSTAGRAM_PROFILE = 'https://www.instagram.com/droumond_productions';

/** What the page shows in each language. The English texts are provisional. */
const EFECTO_PLACEBO = [
	{
		path: '/efecto-placebo/',
		pageTitle: 'Efecto Placebo · Droumond Productions',
		description:
			'Quando o músico Carlos Droumond desaparece, o melhor amigo, Julien, mente à polícia sobre o caderno que ele lhe deixou: partituras que nunca deviam ser tocadas.',
		snapshot: `
			- main:
			  - heading "Efecto Placebo" [level=1]
			  - paragraph: Minissérie · Suspense · 7 episódios · Em gravação
			  - 'img "Efecto Placebo: uma fita da polícia sobre um chão de terra e raízes, onde uma mão agarra um ramo."'
			  - button "Pausar vídeo"
			  - link "Ver o teaser completo"
			  - link "Acompanhe a gravação no Instagram"
			  - region "Sinopse":
			    - heading "Sinopse" [level=2]
			    - img /^Cartaz de Efecto Placebo/
			    - paragraph: /^Leiria acorda com a notícia/
			    - paragraph: /aquilo em que escolhemos acreditar\\.$/
			    - term: Realização
			    - definition: Carlos Droumond
			    - term: Produção
			    - definition: Droumond Productions
			  - region "Personagens":
			    - heading "Personagens" [level=2]
			    - list:
			      - listitem:
			        - heading "Carlos Droumond" [level=3]
			        - paragraph: Músico panamiano radicado em Portugal, intenso e obcecado pela sua arte. O seu desaparecimento põe tudo em marcha.
			      - listitem:
			        - heading "Julien Laffont" [level=3]
			        - paragraph: Melhor amigo de Carlos, francês e metódico. Vê padrões onde os outros veem acaso e não aceita o silêncio como resposta.
			      - listitem:
			        - heading "Inara Pereira" [level=3]
			        - paragraph: Amiga de Carlos, quase uma irmã. Frontal, impulsiva e marcada por uma perda antiga, não desiste dele.
			      - listitem:
			        - heading "Miguel Figueiredo" [level=3]
			        - paragraph: Inspetor da Polícia Judiciária responsável pelo caso. Exigente consigo próprio, desconfia de Julien desde o início.
			      - listitem:
			        - heading "Ana Simões" [level=3]
			        - paragraph: Inspetora da Polícia Judiciária e parceira de Miguel. Empática, lê as pessoas como poucos e leva os casos para casa.
			      - listitem:
			        - heading "Marta Ferreira" [level=3]
			        - paragraph: Jornalista de televisão que acompanha o caso. Para ela, «não» nunca é resposta.
			      - listitem:
			        - heading "Rita Santos" [level=3]
			        - paragraph: Estudante de música em Coimbra que ensaiava com Carlos. Sabe mais sobre as partituras do que diz.
			      - listitem:
			        - heading "Sara Ribeiro" [level=3]
			        - paragraph: Namorada de Julien, luminosa e cheia de energia. Regressa de França quando Carlos desaparece.
			      - listitem:
			        - heading "Sónia Costa" [level=3]
			        - paragraph: Ex-jornalista que entrevistou Carlos nas semanas antes do desaparecimento. Calma, simpática, difícil de ler.
			      - listitem:
			        - heading "Filipa Gonçalves" [level=3]
			        - paragraph: Namorada de Carlos há cinco anos. Entre os dois, o amor e o desgaste andam lado a lado.
			      - listitem:
			        - heading "Raul de Valverde" [level=3]
			        - paragraph: Agente da Polícia Judiciária, o mais novo da equipa. Ansioso por mostrar o que vale, às vezes fala demais.
			      - listitem:
			        - heading "Bruno Moreira" [level=3]
			        - paragraph: Chefe da Polícia Judiciária de Leiria e antigo paraquedista. Lidera pela exigência, sem elogios fáceis.
		`,
	},
	{
		path: '/en/efecto-placebo/',
		pageTitle: 'Efecto Placebo · Droumond Productions',
		description:
			'When musician Carlos Droumond vanishes, his best friend Julien lies to the police about the notebook Carlos left him: music that was never meant to be played.',
		snapshot: `
			- main:
			  - heading "Efecto Placebo" [level=1]
			  - paragraph: Mini-series · Thriller · 7 episodes · In production
			  - 'img "Efecto Placebo: police tape over a floor of earth and roots, where a hand grips a branch."'
			  - button "Pause video"
			  - link "Watch the full teaser"
			  - link "Follow the shoot on Instagram"
			  - region "Synopsis":
			    - heading "Synopsis" [level=2]
			    - img /^Efecto Placebo poster/
			    - paragraph: /^Leiria wakes up to the news/
			    - paragraph: /what we choose to believe\\.$/
			    - term: Director
			    - definition: Carlos Droumond
			    - term: Production
			    - definition: Droumond Productions
			  - region "Characters":
			    - heading "Characters" [level=2]
			    - list:
			      - listitem:
			        - heading "Carlos Droumond" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Julien Laffont" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Inara Pereira" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Miguel Figueiredo" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Ana Simões" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Marta Ferreira" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Rita Santos" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Sara Ribeiro" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Sónia Costa" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Filipa Gonçalves" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Raul de Valverde" [level=3]
			        - paragraph
			      - listitem:
			        - heading "Bruno Moreira" [level=3]
			        - paragraph
		`,
	},
];

for (const expected of EFECTO_PLACEBO) {
	test(`${expected.path}: the title, the small line, the excerpt, the synopsis with the poster and credits, the Characters`, async ({
		page,
	}) => {
		await openExisting(page, expected.path);
		await expect(page).toHaveTitle(expected.pageTitle);
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			expected.description,
		);
		await expect(page.getByRole('main')).toMatchAriaSnapshot(expected.snapshot);
	});
}

const excerpt = (page: Page) => page.locator('main video');
const firstFrame = (page: Page) => page.getByRole('main').getByRole('img').first();
const pauseButton = (page: Page) => page.getByRole('button', { name: 'Pausar vídeo' });

/** Whether the excerpt is playing: asked to play and not paused since (it may be waiting for data). */
const playing = (page: Page) =>
	excerpt(page).evaluate((video: HTMLVideoElement) => !!video.getAttribute('src') && !video.paused);

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
test.describe('the excerpt', () => {
	test(`${PAGE}: waits for the page to load, then plays muted, looping and inline, from the site, over its first frame`, async ({
		page,
		baseURL,
		browserName,
	}) => {
		// Notes the page's state when a script gives the video its source.
		await page.addInitScript(() => {
			const states: string[] = [];
			Object.assign(window, { sourceStates: states });
			new MutationObserver(() => states.push(document.readyState)).observe(document, {
				subtree: true,
				attributeFilter: ['src'],
			});
		});
		await page.goto(PAGE);
		await expect.poll(() => playing(page)).toBe(true);
		const states = await page.evaluate(
			() => (window as unknown as { sourceStates: string[] }).sourceStates,
		);
		expect(states).toEqual(['complete']);

		await expect(excerpt(page)).toBeVisible();
		const video = await excerpt(page).evaluate((video: HTMLVideoElement) => ({
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
		expect(await excerpt(page).boundingBox()).toEqual(await firstFrame(page).boundingBox());
		// Its frames pass. Not checked in WebKit: on Linux its player sometimes stalls under load.
		if (browserName === 'chromium') {
			const time = () => excerpt(page).evaluate((video: HTMLVideoElement) => video.currentTime);
			const start = await time();
			await expect.poll(time).toBeGreaterThan(start + 0.5);
		}
	});

	test(`${PAGE}: the first frame comes from the site itself, in several sizes`, async ({
		page,
		baseURL,
	}) => {
		await page.goto(PAGE);
		const src = await firstFrame(page).evaluate((img: HTMLImageElement) => img.currentSrc);
		expect(new URL(src).origin).toBe(baseURL);
		const srcset = (await firstFrame(page).getAttribute('srcset')) ?? '';
		expect(srcset.split(',').length, srcset).toBeGreaterThan(1);
	});

	test(`${PAGE}: "Pausar vídeo" stops the excerpt until "Retomar vídeo"`, async ({ page }) => {
		await page.goto(PAGE);
		await expect.poll(() => playing(page)).toBe(true);

		await pauseButton(page).click();
		await expect.poll(() => playing(page)).toBe(false);
		await page.waitForTimeout(300);
		expect(await playing(page)).toBe(false);

		await page.getByRole('button', { name: 'Retomar vídeo' }).click();
		await expect.poll(() => playing(page)).toBe(true);
	});

	test.describe('with less motion', () => {
		test(`${PAGE}: only the first frame: no excerpt loads, no button`, async ({ page }) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			const videos = recordVideos(page);
			await page.goto(PAGE);
			await expect(firstFrame(page)).toBeVisible();
			await expect(page.getByRole('main').getByRole('button')).toBeHidden();
			await page.waitForLoadState('networkidle');
			expect(videos).toEqual([]);
			await expect(excerpt(page)).toBeHidden();
		});

		test(`${PAGE}: asked with the page open, the excerpt stops and its first frame returns`, async ({
			page,
		}) => {
			await page.goto(PAGE);
			await expect.poll(() => playing(page)).toBe(true);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect.poll(() => playing(page)).toBe(false);
			await expect(excerpt(page)).toBeHidden();
			await expect(firstFrame(page)).toBeVisible();
			await expect(page.getByRole('main').getByRole('button')).toBeHidden();
		});
	});
});

test(`${PAGE}: asks nothing of another site, excerpt included`, async ({ page, baseURL }) => {
	const otherSites: string[] = [];
	page.on('request', (request) => {
		if (new URL(request.url()).origin !== baseURL) otherSites.push(request.url());
	});
	const videos = recordVideos(page);
	await page.goto(PAGE);
	await expect.poll(() => videos.length).toBe(1);
	await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
	await page.waitForLoadState('networkidle');
	expect(otherSites).toEqual([]);
});

test(`${PAGE}: "Ver o teaser completo" opens the teaser on YouTube in a new tab`, async ({
	page,
}) => {
	await page.goto(PAGE);
	const link = page.getByRole('link', { name: 'Ver o teaser completo', exact: true });
	await expect(link).toHaveAttribute('href', TEASER_ON_YOUTUBE);
	await expect(link).toHaveAttribute('target', '_blank');
	await expect(link).toHaveAttribute('rel', 'noopener');
});

test(`${PAGE}: "Acompanhe a gravação no Instagram" opens the profile in a new tab, right after the teaser's link`, async ({
	page,
}) => {
	await page.goto(PAGE);
	const teaser = page.getByRole('link', { name: 'Ver o teaser completo', exact: true });
	const link = page.getByRole('link', { name: 'Acompanhe a gravação no Instagram', exact: true });
	await expect(link).toHaveAttribute('href', INSTAGRAM_PROFILE);
	await expect(link).toHaveAttribute('target', '_blank');
	await expect(link).toHaveAttribute('rel', 'noopener');
	const [teaserBox, linkBox] = [await teaser.boundingBox(), await link.boundingBox()];
	expect(linkBox!.y).toBeCloseTo(teaserBox!.y, 0);
	expect(linkBox!.x).toBeGreaterThan(teaserBox!.x + teaserBox!.width);
});
