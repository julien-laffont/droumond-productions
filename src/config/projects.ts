// The Projects shown on the home page, in order, on the reel between its leader and tail.
// To add or change one, edit this list; its excerpt and poster go in src/assets/projects/.
// Every text has both languages; the English lines and links are reviewed (#18).
import type { ImageMetadata } from 'astro';
import efectoPlaceboPoster from '../assets/projects/efecto-placebo.jpg';
import efectoPlacebo from '../assets/projects/efecto-placebo.mp4';
import residentEvilPoster from '../assets/projects/resident-evil.jpg';
import residentEvil from '../assets/projects/resident-evil.mp4';
import type { PageId } from '../lib/paths';
import type { Language } from './site';

/** A text in each language. */
type Text = Record<Language, string>;

export interface Project {
	title: Text;
	/** The small line under the title: type · genre · status. */
	type: Text;
	genre: Text;
	status: Text;
	/** An optional sentence in small type, only if Julien writes one (#18). */
	sentence?: Text;
	/** The excerpt that loops in the frame: H.264 without sound, under 1.5 MB, 8 to 15 s. */
	video: string;
	/** The excerpt's first frame, at the same crop: shown until it plays, and instead of it. */
	poster: ImageMetadata;
	alt: Text;
	/** `wide`: the teaser's picture (~2.36:1). `tall`: 9:16. The frame takes the poster's ratio. */
	shape: 'wide' | 'tall';
	/**
	 * The Project's own page, in the same tab, with → after the label; or another site, in a new
	 * tab, with ↗. The arrows are hidden from screen readers.
	 */
	link: { page: PageId; label: Text } | { url: string; label: Text };
}

export const PROJECTS: Project[] = [
	{
		// Spelt as on the teaser's thumbnail, and a mini-series like it says (Julien, #18).
		title: { pt: 'Efecto Placebo', en: 'Efecto Placebo' },
		type: { pt: 'Minissérie', en: 'Mini-series' },
		genre: { pt: 'Suspense', en: 'Thriller' },
		status: { pt: 'Em gravação', en: 'In production' },
		// From the teaser, without its letterbox.
		video: efectoPlacebo,
		poster: efectoPlaceboPoster,
		alt: {
			pt: 'Efecto Placebo: um homem de óculos escuros atrás de uma fita da polícia, num jardim.',
			en: 'Efecto Placebo: a man in sunglasses behind police tape, in a park.',
		},
		shape: 'wide',
		link: { page: 'efectoPlacebo', label: { pt: 'Ver o projeto', en: 'View the project' } },
	},
	{
		title: { pt: 'Resident Evil', en: 'Resident Evil' },
		type: { pt: 'Minissérie', en: 'Mini-series' },
		genre: { pt: 'Terror', en: 'Horror' },
		// Five episodes, the last one filmed but not released yet (Julien, #18).
		status: { pt: '5 episódios', en: '5 episodes' },
		// From the first episode.
		video: residentEvil,
		poster: residentEvilPoster,
		alt: {
			pt: 'Resident Evil: dois olhos brancos a brilhar no escuro, atrás de uma figura agachada na estrada.',
			en: 'Resident Evil: two white eyes glowing in the dark, behind a figure crouching on the road.',
		},
		shape: 'tall',
		link: { page: 'residentEvil', label: { pt: 'Ver o projeto', en: 'View the project' } },
	},
];
