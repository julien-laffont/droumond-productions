// The Team members, shown in Sobre in this order; the Cast members are in src/config/cast.ts.
// Photos are 4:5 portraits in src/assets/team/; every text but the name is in each language.
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
			es: 'Director · Productor · Actor',
			fr: 'Réalisateur · Producteur · Acteur',
		},
		photo: carlos,
		alt: {
			pt: 'Carlos Droumond, de casaco castanho e camisola preta, encostado a um vidro que o reflete, numa rua de calçada.',
			en: 'Carlos Droumond, in a brown jacket and a black top, leaning on a glass wall that reflects him, on a cobbled street.',
			es: 'Carlos Droumond, con chaqueta marrón y jersey negro, apoyado en un cristal que lo refleja, en una calle empedrada.',
			fr: 'Carlos Droumond, en veste marron et haut noir, appuyé contre une vitre qui le reflète, dans une rue pavée.',
		},
	},
	{
		name: 'Julien Laffont',
		role: {
			pt: 'Ator · Gerente · Direção de atores',
			en: 'Actor · Managing director · Director of actors',
			es: 'Actor · Gerente · Dirección de actores',
			fr: 'Acteur · Gérant · Direction d’acteurs',
		},
		photo: julien,
		alt: {
			pt: 'Julien Laffont, de óculos escuros e casaco de cabedal.',
			en: 'Julien Laffont, in sunglasses and a leather jacket.',
			es: 'Julien Laffont, con gafas de sol y chaqueta de cuero.',
			fr: 'Julien Laffont, en lunettes de soleil et blouson de cuir.',
		},
	},
];
