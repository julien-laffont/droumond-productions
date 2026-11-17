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

export const collections = { privacy };
