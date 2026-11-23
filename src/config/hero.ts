// The first screen strip's photos, in order, after the title card.
import type { ImageMetadata } from 'astro';
import sobre from '../assets/about/sobre.jpg';
import efectoPlacebo from '../assets/projects/efecto-placebo.jpg';
import residentEvil from '../assets/projects/resident-evil.jpg';
import equipa1 from '../assets/team/equipa-1.jpg';
import equipa2 from '../assets/team/equipa-2.jpg';
import equipa3 from '../assets/team/equipa-3.jpg';
import equipa4 from '../assets/team/equipa-4.jpg';
import { IMAGE_FILES, type ImageFiles } from './image-files';

export interface StripPhoto {
	image: ImageMetadata;
	/** The recipe of the section showing the same photo, so both share files. */
	files: ImageFiles;
	/** What the 3:2 frame keeps (object-position); centred by default. */
	focus?: string;
}

export const STRIP_PHOTOS: StripPhoto[] = [
	{ image: efectoPlacebo, files: IMAGE_FILES.project.wide },
	{ image: equipa1, files: IMAGE_FILES.team, focus: '50% 28%' },
	// The eyes and the figure under them.
	{ image: residentEvil, files: IMAGE_FILES.project.tall, focus: '50% 40%' },
	{ image: sobre, files: IMAGE_FILES.about },
	{ image: equipa2, files: IMAGE_FILES.team, focus: '50% 30%' },
	{ image: equipa4, files: IMAGE_FILES.team, focus: '50% 30%' },
	{ image: equipa3, files: IMAGE_FILES.team, focus: '50% 26%' },
];
