// The Team members, shown in Sobre in this order; the Cast members are in src/config/cast.ts.
// Photos are 4:5 portraits in src/assets/team/; every text but the name has both languages.
import type { ImageMetadata } from 'astro';
import carlos from '../assets/team/carlos-droumond.jpg';
import julien from '../assets/team/julien-laffont.jpg';
import type { Language } from './site';

/** A text in each language. */
type Text = Record<Language, string>;

export interface Person {
	name: string;
	/** The small line under the name. */
	role: Text;
	photo: ImageMetadata;
	/** What the photo shows, for whoever cannot see it. */
	alt: Text;
}

export const TEAM: Person[] = [
	{
		name: 'Carlos Droumond',
		role: {
			pt: 'Realizador · Produtor · Ator',
			en: 'Director · Producer · Actor',
		},
		photo: carlos,
		alt: {
			pt: 'Carlos Droumond, de casaco castanho e camisola preta, encostado a um vidro que o reflete, numa rua de calçada.',
			en: 'Carlos Droumond, in a brown jacket and a black top, leaning on a glass wall that reflects him, on a cobbled street.',
		},
	},
	{
		name: 'Julien Laffont',
		role: {
			pt: 'Gerente · Ator · Direção de atores',
			en: 'Managing director · Actor · Director of actors',
		},
		photo: julien,
		alt: {
			pt: 'Julien Laffont, de óculos escuros e casaco de cabedal.',
			en: 'Julien Laffont, in sunglasses and a leather jacket.',
		},
	},
];
