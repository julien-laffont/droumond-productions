// The image files in the repo, before the build: no photo larger than the site needs, and nothing
// the camera wrote in them (EXIF, XMP and IPTC hold the place, GPS included, and the device).
import { globSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import sharp from 'sharp';

const IMAGES = globSync('{src/assets,public}/**/*').filter((file) =>
	/\.(jpe?g|png|webp|avif)$/i.test(file),
);

/** The long side of a prepared photo: enough for any width Astro generates from it. */
const MAX_SIDE = 2400;

test('there are images to check', () => {
	expect(IMAGES.length).toBeGreaterThan(0);
});

test(`no image is larger than ${MAX_SIDE} px on its long side`, async () => {
	for (const file of IMAGES) {
		const { width = 0, height = 0 } = await sharp(file).metadata();
		expect(Math.max(width, height), file).toBeLessThanOrEqual(MAX_SIDE);
	}
});

test('no image carries EXIF, XMP or IPTC metadata', async () => {
	for (const file of IMAGES) {
		const { exif, xmp, iptc } = await sharp(file).metadata();
		expect({ file, exif: Boolean(exif), xmp: Boolean(xmp), iptc: Boolean(iptc) }).toEqual({
			file,
			exif: false,
			xmp: false,
			iptc: false,
		});
	}
});
