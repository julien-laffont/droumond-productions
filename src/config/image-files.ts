// The image files Astro generates for each section. The first screen's strip reuses these recipes,
// so it shares their files instead of adding new ones.
import type { Project } from './projects';

/** The widths to generate, and the quality when not the default. */
export type ImageFiles = { widths: number[]; quality?: number };

export const IMAGE_FILES = {
	/**
	 * The posters: `wide` is the teaser's ~2.36:1, `tall` 9:16. Few widths, so that on a phone the
	 * strip and Projects pick the same file, whatever their frame sizes.
	 */
	project: {
		wide: { widths: [1080, 2048], quality: 70 },
		tall: { widths: [624, 1080], quality: 70 },
	},
	/** A series' poster on its page, 2:3. */
	seriesPoster: { widths: [360, 540, 800], quality: 70 },
	/** The 9:16 covers of Resident Evil's episodes, 540 px wide at most. */
	episodeCover: { widths: [320, 540], quality: 70 },
	/** The cover of the filming page's example, 1264 × 566: as wide as its source at most. */
	videoCover: { widths: [640, 1264], quality: 70 },
	/** The 4:5 portraits of the team (Sobre) and of the Elenco. */
	portrait: { widths: [320, 480, 640], quality: 55 },
} satisfies {
	project: Record<Project['shape'], ImageFiles>;
	seriesPoster: ImageFiles;
	episodeCover: ImageFiles;
	videoCover: ImageFiles;
	portrait: ImageFiles;
};
