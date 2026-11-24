// The rule of the Elenco grid: with any number of people, never one alone on a row, and
// rows as even as possible (the fewest rows, then the fullest last row). At most 5 per row on a
// desktop and 3 on a tablet; past that only when no count up to the maximum avoids a lone person.
// A portrait keeps its size (one slot of the maximum) whatever the number of people.
import { expect, test } from '@playwright/test';
import { castGrid } from '../src/lib/cast-grid';

/** The rows a grid of `columns` makes with `count` people: 7 in 4 columns → [4, 3]. */
function rows(count: number, columns: number): number[] {
	const sizes = [];
	for (let left = count; left > 0; left -= columns) sizes.push(Math.min(left, columns));
	return sizes;
}

/** The rows of the grid the rule gives for `count` people and at most `max` per row. */
const rowsFor = (count: number, max: number) => rows(count, castGrid(count, max).columns);

test('on a desktop, up to 5 per row, in rows as even as possible', () => {
	const examples = {
		1: [1],
		2: [2],
		3: [3],
		5: [5],
		6: [3, 3],
		7: [4, 3],
		8: [4, 4],
		9: [5, 4],
		10: [5, 5],
		11: [4, 4, 3],
		16: [4, 4, 4, 4],
	};
	for (const [count, expected] of Object.entries(examples)) {
		expect(rowsFor(Number(count), 5), `${count} people`).toEqual(expected);
	}
});

test('on a tablet, up to 3 per row; 7 and 13 people go past it, since 3 or 2 per row leave one alone', () => {
	const examples = {
		3: [3],
		4: [2, 2],
		5: [3, 2],
		6: [3, 3],
		7: [4, 3],
		8: [3, 3, 2],
		13: [5, 5, 3],
	};
	for (const [count, expected] of Object.entries(examples)) {
		expect(rowsFor(Number(count), 3), `${count} people`).toEqual(expected);
	}
});

test('from 2 to 30 people, no row ever holds one person alone', () => {
	for (const max of [5, 3]) {
		for (let count = 2; count <= 30; count++) {
			expect(rowsFor(count, max), `${count} people, max ${max}`).not.toContain(1);
		}
	}
});

test('a portrait keeps the size of one of the maximum slots, smaller only past the maximum', () => {
	// 2 people on a desktop: two fifths of the row, aligned left.
	expect(castGrid(2, 5)).toEqual({ columns: 2, slots: 5 });
	expect(castGrid(6, 5)).toEqual({ columns: 3, slots: 5 });
	expect(castGrid(5, 3)).toEqual({ columns: 3, slots: 3 });
	// 7 people on a tablet: 4 per row, each a quarter of the row.
	expect(castGrid(7, 3)).toEqual({ columns: 4, slots: 4 });
});
