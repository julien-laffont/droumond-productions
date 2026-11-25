// The frames of the Elenco contact sheet, for any number of people: each person's edge codes and
// the grease-pencil ring drawn around them.

/**
 * Hand-drawn rings, rectangles and ovals, in a 75 × 100 box: the shape of the frame they are
 * stretched over, so the stroke keeps an even width. Each ends a little past its start.
 */
export const PENCIL_RINGS = [
	'M4.5 9 C21 5 46.5 4 71.25 7 C72 35 72.75 70 70.5 94 C49.5 97 25.5 96 3.75 93 C2.25 66 3 34 5.25 4 L10.5 2',
	'M39 4 C61.5 3 72.75 22 72 50 C71.25 80 57 97 36 96 C15 95 2.25 78 3 49 C3.75 22 16.5 4 42 6 L48.75 10',
	'M3 6 C26.25 3 52.5 6 72 4 C70.5 30 71.25 66 72.75 95 C52.5 93 22.5 96 2.25 97 C4.5 70 1.5 32 3.75 9 L6.75 12',
	'M36 3 C60 4 72 24 71.25 52 C70.5 81 55.5 97 35.25 97 C14.25 96 3 76 3.75 47 C4.5 20 18 5 40.5 5 L45 8',
	'M6 5 C27 7 49.5 3 70.5 6 C72.75 38 71.25 68 72 93 C51 97 27 94 4.5 96 C2.25 68 4.5 36 3 8 L9 4',
];

/** The sheet's first frame number on the reel. */
const FIRST_FRAME = 31;

/** The edge codes and the ring of the person at `index` (from 0); the rings take turns. */
export function sheetFrame(index: number) {
	const number = FIRST_FRAME + index;
	return {
		top: index % 2 ? `▸ ${number}` : `Droumond ▸ ${number}`,
		bottom: `${number}A`,
		ring: PENCIL_RINGS[index % PENCIL_RINGS.length],
	};
}
