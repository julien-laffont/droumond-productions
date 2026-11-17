// The placeholders of the Privacy Policy's Markdown (src/content/privacy/), filled from
// src/config/site.ts so the email and the legal data live in one place: {email} becomes a mailto
// link, and {legal.<key>} the value of that key of LEGAL ({legal.nipc}, {legal.firm}…).
import { CONTACT_EMAIL, LEGAL } from '../config/site';

const PLACEHOLDER = /\{([a-z]+(?:\.[a-z]+)?)\}/gi;

/** The rendered policy with its placeholders filled. An unknown one throws, so the build fails. */
export function withValues(html: string): string {
	return html.replace(PLACEHOLDER, (placeholder, name: string) => {
		const value = valueOf(name);
		if (value === undefined) {
			throw new Error(
				`Unknown placeholder ${placeholder} in the Privacy Policy: see src/lib/privacy.ts.`,
			);
		}
		return value;
	});
}

/** A placeholder's value, as HTML. */
function valueOf(name: string): string | undefined {
	if (name === 'email') {
		const email = escapeHtml(CONTACT_EMAIL);
		return `<a href="mailto:${email}">${email}</a>`;
	}
	const [group, key] = name.split('.');
	if (group === 'legal' && key && Object.hasOwn(LEGAL, key)) {
		return escapeHtml(LEGAL[key as keyof typeof LEGAL]);
	}
	return undefined;
}

function escapeHtml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}
