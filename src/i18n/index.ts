import type { Language } from '../config/site';
import { en } from './en';
import { pt, type Dictionary } from './pt';

/** The interface texts of each language. */
export const dictionaries: Record<Language, Dictionary> = { pt, en };
