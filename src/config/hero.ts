// The photos of the strip that runs across the first screen (#37), in order, after the title card
// with the logo symbol. To change one, edit this list. Until Carlos's originals replace them (#41),
// they are the photos of the sections below, in the files those sections already use.
import type { ImageMetadata } from 'astro';
import sobre from '../assets/about/sobre.jpg';
import efectoPlacebo from '../assets/projects/efecto-placebo.jpg';
import miniSerie from '../assets/projects/mini-serie.jpg';
import equipa1 from '../assets/team/equipa-1.jpg';
import equipa2 from '../assets/team/equipa-2.jpg';
import equipa3 from '../assets/team/equipa-3.jpg';
import equipa4 from '../assets/team/equipa-4.jpg';
import { IMAGE_FILES, type ImageFiles } from './image-files';

export interface StripPhoto {
	image: ImageMetadata;
	/** The files to use: the recipe of the section that shows the same photo. */
	files: ImageFiles;
	/** The part of the photo the 3:2 frame keeps (CSS object-position); the centre by default. */
	focus?: string;
}

export const STRIP_PHOTOS: StripPhoto[] = [
	{ image: efectoPlacebo, files: IMAGE_FILES.project.wide },
	{ image: equipa1, files: IMAGE_FILES.team, focus: '50% 28%' },
	// The two eyes, low in the poster.
	{ image: miniSerie, files: IMAGE_FILES.project.tall, focus: '50% 75%' },
	{ image: sobre, files: IMAGE_FILES.about },
	{ image: equipa2, files: IMAGE_FILES.team, focus: '50% 30%' },
	{ image: equipa4, files: IMAGE_FILES.team, focus: '50% 30%' },
	{ image: equipa3, files: IMAGE_FILES.team, focus: '50% 26%' },
];
