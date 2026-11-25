// The rule of the Elenco grid, so that adding or removing a person in src/config/cast.ts
// never breaks it: never one person alone on a row, rows as even as possible, and portraits that
// keep their size whatever the number of people.

/** How many rows a grid of `columns` makes with `count` people, and how many sit on the last. */
function rowsOf(count: number, columns: number) {
	const rows = Math.ceil(count / columns);
	return { rows, last: count - (rows - 1) * columns };
}

/** How many people per row, for `count` people (at least 1) and at most `max` per row. */
function columnsFor(count: number, max: number): number {
	if (count <= max) return count;
	let best: number | undefined;
	for (let columns = max; columns >= 2; columns--) {
		const { rows, last } = rowsOf(count, columns);
		if (last === 1) continue;
		// Going down, the same number of rows always leaves a fuller last row.
		if (best === undefined || rows <= rowsOf(count, best).rows) best = columns;
	}
	if (best !== undefined) return best;
	let columns = max + 1;
	while (rowsOf(count, columns).last === 1) columns++;
	return columns;
}

/**
 * The grid for `count` people (at least 1) and at most `max` per row:
 * - `columns`: how many per row. The fewest rows, then the fullest last row, never a last row of
 *   one: 6 people, max 5 → 3 (3 + 3). Only when no count up to `max` avoids a lone person does it
 *   go past `max`, as little as it can: 7 people, max 3 → 4 (4 + 3).
 * - `slots`: how many parts a row is divided into; a portrait takes one. It stays `max` when a row
 *   holds fewer, so 2 people on a desktop keep the size of 5, aligned left.
 */
export function castGrid(count: number, max: number): { columns: number; slots: number } {
	const columns = columnsFor(count, max);
	return { columns, slots: Math.max(columns, max) };
}
