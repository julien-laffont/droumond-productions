// The rule of the Equipa grid (#15): with any number of people, never one alone on a row, and
// rows as even as possible (the fewest rows, then the fullest last row). At most 5 per row on a
// desktop and 3 on a tablet; past that only when no count up to the maximum avoids a lone person.
import { expect, test } from '@playwright/test';
import { teamColumns } from '../src/lib/team-grid';

/** The rows a grid of `columns` makes with `count` people: 7 in 4 columns → [4, 3]. */
function rows(count: number, columns: number): number[] {
	const sizes = [];
	for (let left = count; left > 0; left -= columns) sizes.push(Math.min(left, columns));
	return sizes;
}

test('on a desktop, up to 5 per row, in rows as even as possible', () => {
	const examples = {
		1: [1],
		2: [2],
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
		expect(rows(Number(count), teamColumns(Number(count), 5)), `${count} people`).toEqual(expected);
	}
});

test('on a tablet, up to 3 per row; 7 people make 4 + 3, since 3 or 2 per row leave one alone', () => {
	const examples = {
		3: [3],
		4: [2, 2],
		5: [3, 2],
		6: [3, 3],
		7: [4, 3],
		8: [3, 3, 2],
	};
	for (const [count, expected] of Object.entries(examples)) {
		expect(rows(Number(count), teamColumns(Number(count), 3)), `${count} people`).toEqual(expected);
	}
});

test('from 2 to 30 people, no row ever holds one person alone', () => {
	for (const max of [5, 3]) {
		for (let count = 2; count <= 30; count++) {
			expect(rows(count, teamColumns(count, max)), `${count} people, max ${max}`).not.toContain(1);
		}
	}
});
