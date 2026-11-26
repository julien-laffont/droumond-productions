// The first screen strip's photos, in order.
import type { ImageMetadata } from 'astro';
import anaIsabel from '../assets/cast/ana-isabel.jpg';
import goncalo from '../assets/cast/goncalo-espirito-santo.jpg';
import mariaInacio from '../assets/cast/maria-inacio.jpg';
import mariaInes from '../assets/cast/maria-ines-cabral.jpg';
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
	{ image: anaIsabel, files: IMAGE_FILES.portrait, focus: '50% 35%' },
	{ image: efectoPlacebo, files: IMAGE_FILES.project.wide },
	{ image: goncalo, files: IMAGE_FILES.portrait, focus: '50% 35%' },
	// The eyes and the figure under them.
	{ image: residentEvil, files: IMAGE_FILES.project.tall, focus: '50% 40%' },
	{ image: carlos, files: IMAGE_FILES.portrait, focus: '50% 15%' },
	{ image: mariaInacio, files: IMAGE_FILES.portrait, focus: '50% 45%' },
	{ image: mariaInes, files: IMAGE_FILES.portrait, focus: '50% 25%' },
	{ image: julien, files: IMAGE_FILES.portrait, focus: '50% 26%' },
];

/** A photo's width in its 3:2 frame, for `sizes`. The heights match --frame-height in Hero.astro. */
export const stripSizes = ({ width, height }: ImageMetadata) => {
	const ratio = Math.max(width / height, 3 / 2).toFixed(3);
	return `(max-width: 700px) calc(${ratio} * clamp(120px, 26vh, 240px)), calc(${ratio} * clamp(120px, 28vh, 300px))`;
};

/** The strip's `sizes` for a photo it shows too, so a section picks the file already loaded. */
export const sizesOnStrip = (image: ImageMetadata) =>
	STRIP_PHOTOS.some((photo) => photo.image.src === image.src) ? stripSizes(image) : undefined;
