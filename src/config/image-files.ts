// The files Astro makes of each section's photos: their widths, and their quality when it is not
// the default. The first screen's strip (#37) asks for a photo with its section's recipe, so both
// use the same files and the strip adds almost nothing to the page's weight: it only picks the
// width its frame needs.
import type { Project } from './projects';

/** A recipe: the widths Astro makes of an image, and its quality when it is not the default. */
export type ImageFiles = { widths: number[]; quality?: number };

export const IMAGE_FILES = {
	/** A Project's image (#14): `wide` is 16:9, two thirds of the row; `tall` is 4:5. */
	project: {
		wide: { widths: [480, 720, 1080] },
		tall: { widths: [312, 624] },
	},
	/** Sobre's image (#15), 16:9. */
	about: { widths: [480, 720, 1080], quality: 70 },
	/** A Team member's photo (#15), 4:5. */
	team: { widths: [320, 480, 640], quality: 70 },
} satisfies {
	project: Record<Project['shape'], ImageFiles>;
	about: ImageFiles;
	team: ImageFiles;
};
