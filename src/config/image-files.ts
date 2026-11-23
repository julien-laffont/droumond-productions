// The image files Astro generates for each section. The first screen's strip reuses these recipes,
// so it shares their files instead of adding new ones.
import type { Project } from './projects';

/** The widths to generate, and the quality when not the default. */
export type ImageFiles = { widths: number[]; quality?: number };

export const IMAGE_FILES = {
	/** `wide` is 16:9, `tall` 4:5. */
	project: {
		wide: { widths: [480, 720, 1080] },
		tall: { widths: [312, 624] },
	},
	about: { widths: [480, 720, 1080], quality: 70 },
	team: { widths: [320, 480, 640], quality: 70 },
} satisfies {
	project: Record<Project['shape'], ImageFiles>;
	about: ImageFiles;
	team: ImageFiles;
};
