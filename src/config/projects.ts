// The Projects shown on the home page (#14), in order: the first one takes two thirds of the row.
// To add or change one, edit this list; its image goes in src/assets/projects/.
// Every text has both languages; the English ones are provisional until #18.
import type { ImageMetadata } from 'astro';
import efeitoPlacebo from '../assets/projects/efeito-placebo.jpg';
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
	 * any other link (never an embed) needs its label.
	 */
	link: { youtube: string } | { url: string; label: Text };
}

export const PROJECTS: Project[] = [
	{
		title: { pt: 'Efeito Placebo', en: 'Efeito Placebo' },
		type: { pt: 'Série', en: 'Series' },
		genre: { pt: 'Suspense', en: 'Thriller' },
		status: { pt: 'Em gravação', en: 'In production' },
		// PROVISIONAL: the YouTube thumbnail, cropped; a clean frame of the teaser comes in #18.
		image: efeitoPlacebo,
		alt: {
			pt: 'Três personagens de Efeito Placebo, vistas de baixo através de uma teia de cordas.',
			en: 'Three characters from Efeito Placebo, seen from below through a web of ropes.',
		},
		shape: 'wide',
		link: { youtube: 'Y785Re6Cyvk' },
	},
	{
		// PROVISIONAL title: the name "Resident Evil" waits for Julien (#18), so the image is
		// cropped above the poster's title.
		title: { pt: 'Mini-série do Instagram', en: 'Instagram mini-series' },
		type: { pt: 'Mini-série', en: 'Mini-series' },
		genre: { pt: 'Terror', en: 'Horror' },
		status: { pt: '4 episódios', en: '4 episodes' },
		image: miniSerie,
		alt: {
			pt: 'Cartaz da mini-série: dois olhos brancos a brilhar no escuro.',
			en: 'The mini-series poster: two white eyes glowing in the dark.',
		},
		shape: 'tall',
		link: { url: SOCIAL.instagram, label: { pt: 'Ver no Instagram', en: 'See on Instagram' } },
	},
];
