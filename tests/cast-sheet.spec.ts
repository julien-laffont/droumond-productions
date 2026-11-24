// Each frame of the Elenco contact sheet, for any number of people: its edge codes and the pencil
// ring drawn around the person.
import { expect, test } from '@playwright/test';
import { PENCIL_RINGS, sheetFrame } from '../src/lib/cast-sheet';

/** The frames of a sheet of `count` people, in order. */
const framesOf = (count: number) => Array.from({ length: count }, (_, index) => sheetFrame(index));

test('with 3 people: frames 31 to 33, the reel name on every other top code', () => {
	expect(framesOf(3).map(({ top, bottom }) => [top, bottom])).toEqual([
		['Droumond ▸ 31', '31A'],
		['▸ 32', '32A'],
		['Droumond ▸ 33', '33A'],
	]);
	expect(framesOf(3).map(({ ring }) => ring)).toEqual(PENCIL_RINGS.slice(0, 3));
});

test('with 7 people: frames 31 to 37, the rings in turn, never the same twice side by side', () => {
	const frames = framesOf(7);
	expect(frames.map(({ bottom }) => bottom)).toEqual([
		'31A',
		'32A',
		'33A',
		'34A',
		'35A',
		'36A',
		'37A',
	]);
	expect(frames[6].top).toBe('Droumond ▸ 37');
	expect(frames.map(({ ring }) => ring)).toEqual([
		...PENCIL_RINGS,
		PENCIL_RINGS[0],
		PENCIL_RINGS[1],
	]);
	for (let index = 1; index < frames.length; index++) {
		expect(frames[index].ring).not.toBe(frames[index - 1].ring);
	}
});

test('five different rings, each one SVG path', () => {
	expect(new Set(PENCIL_RINGS).size).toBe(5);
	for (const ring of PENCIL_RINGS) expect(ring).toMatch(/^M[\d .CL]+$/);
});
