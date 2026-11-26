// The first screen strip's photos, in order.
import type { ImageMetadata } from 'astro';
import dsc07395 from '../assets/cast/dsc07395.jpg';
import mg1914 from '../assets/cast/mg-1914.jpg';
import mg1947 from '../assets/cast/mg-1947.jpg';
import miguel from '../assets/cast/miguel-figueiredo.jpg';
import efectoPlacebo from '../assets/projects/efecto-placebo.jpg';
import residentEvil from '../assets/projects/resident-evil.jpg';
import carlos from '../assets/team/carlos-droumond.jpg';
import julien from '../assets/team/julien-laffont.jpg';
import { IMAGE_FILES, type ImageFiles } from './image-files';

export interface StripPhoto {
	image: ImageMetadata;
	/** The recipe of the section showing the same photo, so both share files. */
	files: ImageFiles;
	/** What the 3:2 frame keeps (object-position); centred by default. */
	focus?: string;
}

export const STRIP_PHOTOS: StripPhoto[] = [
	{ image: dsc07395, files: IMAGE_FILES.portrait, focus: '50% 35%' },
	{ image: efectoPlacebo, files: IMAGE_FILES.project.wide },
	{ image: miguel, files: IMAGE_FILES.portrait, focus: '50% 35%' },
	// The eyes and the figure under them.
	{ image: residentEvil, files: IMAGE_FILES.project.tall, focus: '50% 40%' },
	{ image: carlos, files: IMAGE_FILES.portrait, focus: '50% 15%' },
	{ image: mg1947, files: IMAGE_FILES.portrait, focus: '50% 45%' },
	{ image: mg1914, files: IMAGE_FILES.portrait, focus: '50% 25%' },
	{ image: julien, files: IMAGE_FILES.portrait, focus: '50% 26%' },
];
