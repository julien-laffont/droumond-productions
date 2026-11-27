// The contact email lives in one constant (#7): changing it in src/config/site.ts changes it on
// the whole site. The pages only show that address, and no other source file repeats it.
import { readFileSync, globSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { CONTACT_EMAIL } from '../src/config/site';
import { builtPages } from './pages';

for (const path of builtPages()) {
	test(`${path}: every email link and every address shown is the configured one`, async ({
		page,
	}) => {
		await page.goto(path);
		const mailtos = await page
			.locator('a[href^="mailto:"]')
			.evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
		expect(mailtos.length).toBeGreaterThan(0);
		// The filming page adds a subject (#16): only the address before it counts.
		expect(mailtos.map((href) => href.slice('mailto:'.length).split('?')[0])).toEqual(
			mailtos.map(() => CONTACT_EMAIL),
		);
		// An address ends with a letter, never with the full stop of the sentence around it.
		const shown = (await page.locator('body').innerText()).match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g);
		expect(new Set(shown)).toEqual(new Set([CONTACT_EMAIL]));
	});
}

test('no source file repeats the address, apart from the configuration', () => {
	const files = globSync('src/**/*', { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => `${entry.parentPath}/${entry.name}`)
		.filter((file) => readFileSync(file, 'latin1').includes(CONTACT_EMAIL));
	expect(files).toEqual(['src/config/site.ts']);
});
