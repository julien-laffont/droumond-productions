// The placeholders of the Privacy Policy's Markdown: they take their values from
// src/config/site.ts, so the email and the legal data live in one place.
import { expect, test } from '@playwright/test';
import { CONTACT_EMAIL, LEGAL } from '../src/config/site';
import { withValues } from '../src/lib/privacy';

test('{email} becomes a mailto link to the configured address', () => {
	expect(withValues('<p>Escreva para {email}.</p>')).toBe(
		`<p>Escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>`,
	);
});

test('{legal.…} becomes the configured legal data', () => {
	expect(withValues('<li>NIPC: {legal.nipc}</li>')).toBe(`<li>NIPC: ${LEGAL.nipc}</li>`);
});

test('an unknown placeholder fails, so the build fails instead of showing it', () => {
	expect(() => withValues('<p>{legal.vat}</p>')).toThrow('{legal.vat}');
});
