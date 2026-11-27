// Whoever asked for less motion (prefers-reduced-motion) sees everything still: on hover, the
// header's links turn amber at once instead of fading, and the amber line under the Contacto
// address appears at once instead of growing. The timecode's stillness is in header.spec.
import { expect, test, type Page } from '@playwright/test';

/** How long the hover takes on the header's first link and on the Contacto address. */
async function hoverDurations(page: Page) {
	const link = page.getByRole('banner').getByRole('navigation').getByRole('link').first();
	const email = page
		.getByRole('region', { name: 'Contacto', exact: true })
		.getByRole('link')
		.first();
	return {
		link: await link.evaluate((a) => getComputedStyle(a).transitionDuration),
		email: await email.evaluate((a) => getComputedStyle(a).transitionDuration),
	};
}

test('/: the hover effects are gradual, unless less motion is asked', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/');
	expect(await hoverDurations(page)).toEqual({ link: '0.2s, 0.2s', email: '0.4s' });

	await page.emulateMedia({ reducedMotion: 'reduce' });
	expect(await hoverDurations(page)).toEqual({ link: '0s', email: '0s' });
});
