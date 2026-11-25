// The Cast members, shown in the Elenco in this order; the grid never leaves one alone on a row
// (src/lib/cast-grid.ts). Photos are 4:5 portraits in src/assets/cast/, named after the original.
import bruno from '../assets/cast/bruno-moreira.jpg';
import dsc07395 from '../assets/cast/dsc07395.jpg';
import mg1914 from '../assets/cast/mg-1914.jpg';
import mg1947 from '../assets/cast/mg-1947.jpg';
import miguel from '../assets/cast/miguel-figueiredo.jpg';
import type { Person } from './team';

const CHARACTER_OF_EFECTO_PLACEBO = {
	pt: 'Personagem · Efecto Placebo',
	en: 'Character · Efecto Placebo',
};

/** Until the person's name is known. */
const NAME_UNKNOWN = 'Nome por confirmar';

export const CAST: Person[] = [
	{
		name: 'Miguel Figueiredo',
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: miguel,
		alt: {
			pt: 'Miguel Figueiredo, de fato, bebe um copo de vinho tinto num bar, à noite.',
			en: 'Miguel Figueiredo, in a suit, drinks a glass of red wine in a bar at night.',
		},
	},
	{
		name: NAME_UNKNOWN,
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: mg1947,
		alt: {
			pt: 'Uma personagem de cabelo encaracolado lê o telemóvel debaixo de um candeeiro; na parede, uma ficha confidencial.',
			en: 'A character with curly hair reads a phone under a lamp; on the wall, a confidential file.',
		},
	},
	{
		name: NAME_UNKNOWN,
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: dsc07395,
		alt: {
			pt: 'Uma personagem de cabelo comprido espreita de trás de uma parede.',
			en: 'A character with long hair peers out from behind a wall.',
		},
	},
	{
		name: NAME_UNKNOWN,
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: mg1914,
		alt: {
			pt: 'Uma personagem de cabelo encaracolado e calças vermelhas numa escada exterior, junto a uma parede de tijolo.',
			en: 'A character with curly hair and red trousers on an outdoor staircase, by a brick wall.',
		},
	},
	{
		name: 'Bruno Moreira',
		role: CHARACTER_OF_EFECTO_PLACEBO,
		photo: bruno,
		alt: {
			pt: 'Bruno Moreira, de fato, segura uma fita da polícia.',
			en: 'Bruno Moreira, in a suit, holds a strip of police tape.',
		},
	},
];
