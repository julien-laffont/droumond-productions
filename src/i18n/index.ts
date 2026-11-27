import type { Language } from '../config/site';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { pt, type Dictionary } from './pt';

/** The interface texts of each language. */
export const dictionaries: Record<Language, Dictionary> = { pt, en, es, fr };
