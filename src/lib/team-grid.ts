// The rule of the Equipa grid (#15), so that adding or removing a person in src/config/team.ts
// never breaks it: never one person alone on a row, and rows as even as possible.

/** The rows a grid of `columns` makes with `count` people, and the size of its last row. */
function shape(count: number, columns: number) {
	const rows = Math.ceil(count / columns);
	return { rows, last: count - (rows - 1) * columns };
}

/**
 * How many people per row, for `count` people (at least 1) and at most `max` per row: the fewest
 * rows, then the fullest last row, never a last row of one. 6 people, max 5 → 3 (3 + 3). Only when
 * no count up to `max` avoids a lone person does it go past `max`, as little as it can: 7 people,
 * max 3 → 4 (4 + 3).
 */
export function teamColumns(count: number, max: number): number {
	if (count <= max) return count;
	let best: number | undefined;
	for (let columns = max; columns >= 2; columns--) {
		const { rows, last } = shape(count, columns);
		if (last === 1) continue;
		// Going down, the same number of rows always leaves a fuller last row.
		if (best === undefined || rows <= shape(count, best).rows) best = columns;
	}
	if (best !== undefined) return best;
	let columns = max + 1;
	while (shape(count, columns).last === 1) columns++;
	return columns;
}
