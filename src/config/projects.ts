// The Projects shown on the home page (#14), in order: the first one takes two thirds of the row.
// To add or change one, edit this list; its image goes in src/assets/projects/.
// Every text has both languages; the English lines and links are reviewed (#18).
import type { ImageMetadata } from 'astro';
import efectoPlacebo from '../assets/projects/efecto-placebo.jpg';
import miniSerie from '../assets/projects/mini-serie.jpg';
import { SOCIAL, type Language } from './site';

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
	image: ImageMetadata;
	alt: Text;
	/** `wide`: 16:9, two thirds of the row. `tall`: 4:5, one third (square on phones). */
	shape: 'wide' | 'tall';
	/**
	 * Where the image leads. A YouTube video only loads on click, from youtube-nocookie.com (#3);
	 * any other link (never an embed) needs its label, read only by screen readers.
	 */
	link: { youtube: string } | { url: string; label: Text };
}

export const PROJECTS: Project[] = [
	{
		// Spelt as on the teaser's thumbnail, and a mini-series like it says (Julien, #18).
		title: { pt: 'Efecto Placebo', en: 'Efecto Placebo' },
		type: { pt: 'Minissérie', en: 'Mini-series' },
		genre: { pt: 'Suspense', en: 'Thriller' },
		status: { pt: 'Em gravação', en: 'In production' },
		// PROVISIONAL: the YouTube thumbnail, cropped; a clean frame of the teaser comes in #18.
		image: efectoPlacebo,
		alt: {
			pt: 'Três personagens de Efecto Placebo, vistas de baixo através de uma teia de cordas.',
			en: 'Three characters from Efecto Placebo, seen from below through a web of ropes.',
		},
		shape: 'wide',
		link: { youtube: 'Y785Re6Cyvk' },
	},
	{
		// The image is cropped above the poster's title, so no text sits over it.
		title: { pt: 'Resident Evil', en: 'Resident Evil' },
		type: { pt: 'Minissérie', en: 'Mini-series' },
		genre: { pt: 'Terror', en: 'Horror' },
		// Five episodes, the last one filmed but not released yet (Julien, #18).
		status: { pt: '5 episódios', en: '5 episodes' },
		image: miniSerie,
		alt: {
			pt: 'Cartaz de Resident Evil: dois olhos brancos a brilhar no escuro.',
			en: 'The Resident Evil poster: two white eyes glowing in the dark.',
		},
		shape: 'tall',
		link: { url: SOCIAL.instagram, label: { pt: 'Ver no Instagram', en: 'View on Instagram' } },
	},
];
