// The Privacy Policy (#17), in Markdown, one file per language: src/content/privacy/<language>.md
// (id `pt`, `en`), so Julien can edit the text without touching code. The email and the company's
// legal data come from src/config/site.ts through placeholders such as {email} (see src/lib/privacy.ts).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const privacy = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/privacy' }),
	schema: z.object({
		/** The page's title, as its <h1> and in the browser tab. */
		title: z.string().trim().min(1),
		description: z.string().trim().min(1),
	}),
});

// The Sobre section's text, one file per language: src/content/about/<language>.md, the Markdown's
// body (_Efecto Placebo_ in italics shows in amber). The team beside it is in src/config/team.ts.
const about = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/about' }),
});

export const collections = { privacy, about };
