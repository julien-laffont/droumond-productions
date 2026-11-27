// The discreet reveal of the sections while scrolling (.reveal, #12): what is on screen when the
// page opens shows at once, never fading in (it would slow the first paint, LCP); what is below
// waits faded until it comes into view. Without JavaScript or with less motion, everything shows.
import { expect, test, type Page } from '@playwright/test';

const SCREENS = [
	{ name: 'phone', width: 390, height: 600 },
	{ name: 'desktop', width: 1440, height: 900 },
];

/** Each item that reveals itself, with whether it was on screen when the page opened. */
async function revealItems(page: Page) {
	const items = page.locator('.reveal');
	await expect(items.first()).toBeAttached();
	const onScreen = await items.evaluateAll((elements) =>
		elements.map((element) => element.getBoundingClientRect().top < window.innerHeight),
	);
	return (await items.all()).map((item, index) => ({ item, onScreen: onScreen[index] }));
}

const opacity = (element: Element) => getComputedStyle(element).opacity;

for (const screen of SCREENS) {
	test.describe(`on a ${screen.name} (${screen.width} px)`, () => {
		test.use({ viewport: { width: screen.width, height: screen.height } });

		test('/: what is on screen shows at once; the rest fades in when it comes into view', async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto('/');
			const items = await revealItems(page);
			for (const { item, onScreen } of items) {
				if (onScreen) {
					expect(await item.evaluate(opacity)).toBe('1');
					expect(await item.evaluate((element) => element.getAnimations().length)).toBe(0);
				} else {
					expect(Number(await item.evaluate(opacity))).toBeLessThan(1);
				}
			}
			// Only once each is checked: items side by side come into view together.
			for (const { item } of items.filter(({ onScreen }) => !onScreen)) {
				await item.scrollIntoViewIfNeeded();
				await expect.poll(() => item.evaluate(opacity)).toBe('1');
			}
		});

		test('/: with less motion, everything shows at once', async ({ page }) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.goto('/');
			for (const { item } of await revealItems(page)) {
				expect(await item.evaluate(opacity)).toBe('1');
			}
		});

		test.describe('without JavaScript', () => {
			test.use({ javaScriptEnabled: false });

			test('/: everything shows at once', async ({ page }) => {
				await page.goto('/');
				for (const { item } of await revealItems(page)) {
					expect(await item.evaluate(opacity)).toBe('1');
				}
			});
		});
	});
}

test('/: on a phone, some items start below the screen, so the fade is checked', async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 600 });
	await page.goto('/');
	const cases = (await revealItems(page)).map(({ onScreen }) => onScreen);
	expect(cases).toContain(false);
});
