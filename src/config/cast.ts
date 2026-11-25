// The Cast members, shown in the Elenco in this order: every actor, one photo each, as 4:5
// portraits in src/assets/cast/, named after the person. Carlos and Julien are in Sobre.
import anaIsabel from '../assets/cast/ana-isabel.jpg';
import bernardo from '../assets/cast/bernardo-delgado.jpg';
import flavio from '../assets/cast/flavio-vicente.jpg';
import goncalo from '../assets/cast/goncalo-espirito-santo.jpg';
import isabel from '../assets/cast/isabel.jpg';
import isabelFrazao from '../assets/cast/isabel-frazao.jpg';
import kimberly from '../assets/cast/kimberly-araujo.jpg';
import mariaInacio from '../assets/cast/maria-inacio.jpg';
import mariaInes from '../assets/cast/maria-ines-cabral.jpg';
import mariaPendeirada from '../assets/cast/maria-pendeirada.jpg';
import mariaSilva from '../assets/cast/maria-silva.jpg';
import marisa from '../assets/cast/marisa-tomas.jpg';
import mateus from '../assets/cast/mateus-silva.jpg';
import sara from '../assets/cast/sara-lucas.jpg';
import type { Person } from './team';

/** A Cast member is shown by name alone: no role. */
export type CastMember = Omit<Person, 'role'>;

export const CAST: CastMember[] = [
	{
		name: 'Gonçalo Espírito Santo',
		photo: goncalo,
		alt: {
			pt: 'Gonçalo Espírito Santo, de fato, de pé contra a luz de uma janela, olha para a câmara.',
			en: 'Gonçalo Espírito Santo, in a suit, stands against the light of a window and looks at the camera.',
		},
	},
	{
		name: 'Maria Inácio',
		photo: mariaInacio,
		alt: {
			pt: 'Maria Inácio, de cabelo encaracolado, lê o telemóvel debaixo de um candeeiro; na parede, uma ficha confidencial.',
			en: 'Maria Inácio, with curly hair, reads a phone under a lamp; on the wall, a confidential file.',
		},
	},
	{
		name: 'Ana Isabel',
		photo: anaIsabel,
		alt: {
			pt: 'Ana Isabel, de cabelo comprido, espreita de trás de uma parede.',
			en: 'Ana Isabel, with long hair, peers out from behind a wall.',
		},
	},
	{
		name: 'Maria Inês Cabral',
		photo: mariaInes,
		alt: {
			pt: 'Maria Inês Cabral, de cabelo encaracolado e calças vermelhas, numa escada exterior, junto a uma parede de tijolo.',
			en: 'Maria Inês Cabral, with curly hair and red trousers, on an outdoor staircase, by a brick wall.',
		},
	},
	{
		name: 'Flávio Vicente',
		photo: flavio,
		alt: {
			pt: 'Flávio Vicente, de fato, segura uma fita da polícia.',
			en: 'Flávio Vicente, in a suit, holds a strip of police tape.',
		},
	},
	{
		name: 'Bernardo Delgado',
		photo: bernardo,
		alt: {
			pt: 'Bernardo Delgado, de camisa azul, encostado a um muro de graffiti, olha para a câmara.',
			en: 'Bernardo Delgado, in a blue shirt, leans on a graffiti wall and looks at the camera.',
		},
	},
	{
		name: 'Isabel Frazão',
		photo: isabelFrazao,
		alt: {
			pt: 'Isabel Frazão, com marcas de sangue na cara e no braço, abraça um gato cinzento e olha para a câmara.',
			en: 'Isabel Frazão, with blood marks on the face and arm, hugs a grey cat and looks at the camera.',
		},
	},
	{
		name: 'Kimberly Araújo',
		photo: kimberly,
		alt: {
			pt: 'Kimberly Araújo, de camisola creme, encostada a uma parede vermelha e branca, olha para a câmara.',
			en: 'Kimberly Araújo, in a cream sweater, leans on a red and white wall and looks at the camera.',
		},
	},
	{
		name: 'Maria Silva',
		photo: mariaSilva,
		alt: {
			pt: 'Maria Silva, de casaco cinzento e vestido preto, sorri para a câmara entre redes e cordas, diante de uma parede vermelha.',
			en: 'Maria Silva, in a grey coat and a black dress, smiles at the camera among nets and ropes, in front of a red wall.',
		},
	},
	{
		name: 'Mateus Silva',
		photo: mateus,
		alt: {
			pt: 'Mateus Silva, de camisa branca e casaco aos quadrados verdes, encostado a uma parede de pedra, olha para a câmara.',
			en: 'Mateus Silva, in a white shirt and a green checked jacket, leans on a stone wall and looks at the camera.',
		},
	},
	{
		name: 'Marisa Tomas',
		photo: marisa,
		alt: {
			pt: 'Marisa Tomas, de casaco preto, de pé diante de uma casa com varanda de madeira.',
			en: 'Marisa Tomas, in a black jacket, stands in front of a house with a wooden balcony.',
		},
	},
	{
		name: 'Isabel Rodríguez',
		photo: isabel,
		alt: {
			pt: 'Isabel Rodríguez, de top branco e calças cinzentas, junto a uma parede com graffiti, inclina-se para a câmara.',
			en: 'Isabel Rodríguez, in a white top and grey trousers, by a graffiti wall, leans toward the camera.',
		},
	},
	{
		name: 'Sara Lucas',
		photo: sara,
		alt: {
			pt: 'Sara Lucas, de camisola vermelha, segura um livro aberto numa livraria.',
			en: 'Sara Lucas, in a red sweater, holds an open book in a bookshop.',
		},
	},
	{
		name: 'Maria Pendeirada',
		photo: mariaPendeirada,
		alt: {
			pt: 'Maria Pendeirada, de vestido estampado, ajoelhada junto a uma parede de pedra.',
			en: 'Maria Pendeirada, in a patterned dress, kneels by a stone wall.',
		},
	},
];
