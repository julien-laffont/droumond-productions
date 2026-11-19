// The Team members shown in Equipa (#15), in order. To add or remove a person, edit this list:
// the grid rearranges itself so that nobody is left alone on a row (src/lib/team-grid.ts).
// Photos are 4:5 portraits in src/assets/team/; every text but the name has both languages.
//
// PROVISIONAL: until Julien says who appears (#18), the Characters of the Instagram profile stand
// in for the team (the team gave consent for the use of their image), and a visible tag says so.
import type { ImageMetadata } from 'astro';
import equipa1 from '../assets/team/equipa-1.jpg';
import equipa2 from '../assets/team/equipa-2.jpg';
import equipa3 from '../assets/team/equipa-3.jpg';
import equipa4 from '../assets/team/equipa-4.jpg';
import equipa5 from '../assets/team/equipa-5.jpg';
import type { Language } from './site';

/** A text in each language. */
type Text = Record<Language, string>;

export interface TeamMember {
	name: string;
	/** The small line under the name: the person's role in the company. */
	role: Text;
	photo: ImageMetadata;
	/** What the photo shows, for whoever cannot see it. */
	alt: Text;
}

/** Shows the tag "Provisório: personagens no lugar da equipa". `false` once the real team is in. */
export const TEAM_IS_PROVISIONAL = true;

const CHARACTER_OF_EFECTO_PLACEBO = {
	pt: 'Personagem · Efecto Placebo',
	en: 'Character · Efecto Placebo',
};
const CHARACTER = { pt: 'Personagem', en: 'Character' };

export const TEAM: TeamMember[] = [
	{
		name: 'Raul de Valverde',
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: equipa1,
		alt: {
			pt: 'Raul de Valverde, de óculos e casaco de cabedal, encostado a uma parede de tijolo.',
			en: 'Raul de Valverde, in glasses and a leather jacket, leaning on a brick wall.',
		},
	},
	{
		name: 'Miguel Figueredo',
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: equipa2,
		alt: {
			pt: 'Miguel Figueredo, de fato, olha para o relógio com um copo de vinho na mão.',
			en: 'Miguel Figueredo, in a suit, checks his watch with a glass of wine in his hand.',
		},
	},
	{
		name: 'Julien Laffont',
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: equipa3,
		alt: {
			pt: 'Julien Laffont, de óculos escuros e casaco de cabedal.',
			en: 'Julien Laffont, in sunglasses and a leather jacket.',
		},
	},
	{
		name: 'Bruno Moreira',
		role: CHARACTER,
		photo: equipa4,
		alt: {
			pt: 'Bruno Moreira, de fato, segura uma fita da polícia.',
			en: 'Bruno Moreira, in a suit, holds a strip of police tape.',
		},
	},
	{
		name: 'Nome por confirmar',
		role: CHARACTER,
		photo: equipa5,
		alt: {
			pt: 'Uma personagem de guarda-chuva transparente olha para cima, à chuva.',
			en: 'A character with a clear umbrella looks up in the rain.',
		},
	},
];
