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
			es: 'Gonçalo Espírito Santo, de traje, de pie a contraluz ante una ventana, mira a la cámara.',
			fr: 'Gonçalo Espírito Santo, en costume, debout à contre-jour devant une fenêtre, regarde l’objectif.',
		},
	},
	{
		name: 'Maria Inácio',
		photo: mariaInacio,
		alt: {
			pt: 'Maria Inácio, de cabelo encaracolado, lê o telemóvel debaixo de um candeeiro; na parede, uma ficha confidencial.',
			en: 'Maria Inácio, with curly hair, reads a phone under a lamp; on the wall, a confidential file.',
			es: 'Maria Inácio, de pelo rizado, lee el móvil bajo una lámpara; en la pared, una ficha confidencial.',
			fr: 'Maria Inácio, aux cheveux bouclés, lit son téléphone sous une lampe ; au mur, une fiche confidentielle.',
		},
	},
	{
		name: 'Ana Isabel',
		photo: anaIsabel,
		alt: {
			pt: 'Ana Isabel, de cabelo comprido, espreita de trás de uma parede.',
			en: 'Ana Isabel, with long hair, peers out from behind a wall.',
			es: 'Ana Isabel, de pelo largo, se asoma por detrás de una pared.',
			fr: 'Ana Isabel, aux cheveux longs, jette un coup d’œil de derrière un mur.',
		},
	},
	{
		name: 'Maria Inês Cabral',
		photo: mariaInes,
		alt: {
			pt: 'Maria Inês Cabral, de cabelo encaracolado e calças vermelhas, numa escada exterior, junto a uma parede de tijolo.',
			en: 'Maria Inês Cabral, with curly hair and red trousers, on an outdoor staircase, by a brick wall.',
			es: 'Maria Inês Cabral, de pelo rizado y pantalón rojo, en una escalera exterior, junto a una pared de ladrillo.',
			fr: 'Maria Inês Cabral, aux cheveux bouclés et en pantalon rouge, dans un escalier extérieur, près d’un mur de briques.',
		},
	},
	{
		name: 'Flávio Vicente',
		photo: flavio,
		alt: {
			pt: 'Flávio Vicente, de fato, segura uma fita da polícia.',
			en: 'Flávio Vicente, in a suit, holds a strip of police tape.',
			es: 'Flávio Vicente, de traje, sujeta una cinta policial.',
			fr: 'Flávio Vicente, en costume, tient un ruban de police.',
		},
	},
	{
		name: 'Bernardo Delgado',
		photo: bernardo,
		alt: {
			pt: 'Bernardo Delgado, de camisa azul, encostado a um muro de graffiti, olha para a câmara.',
			en: 'Bernardo Delgado, in a blue shirt, leans on a graffiti wall and looks at the camera.',
			es: 'Bernardo Delgado, con camisa azul, apoyado en un muro con grafitis, mira a la cámara.',
			fr: 'Bernardo Delgado, en chemise bleue, adossé à un mur de graffitis, regarde l’objectif.',
		},
	},
	{
		name: 'Isabel Frazão',
		photo: isabelFrazao,
		alt: {
			pt: 'Isabel Frazão, com marcas de sangue na cara e no braço, abraça um gato cinzento e olha para a câmara.',
			en: 'Isabel Frazão, with blood marks on the face and arm, hugs a grey cat and looks at the camera.',
			es: 'Isabel Frazão, con marcas de sangre en la cara y en el brazo, abraza a un gato gris y mira a la cámara.',
			fr: 'Isabel Frazão, avec des traces de sang sur le visage et le bras, serre un chat gris contre elle et regarde l’objectif.',
		},
	},
	{
		name: 'Kimberly Araújo',
		photo: kimberly,
		alt: {
			pt: 'Kimberly Araújo, de camisola creme, encostada a uma parede vermelha e branca, olha para a câmara.',
			en: 'Kimberly Araújo, in a cream sweater, leans on a red and white wall and looks at the camera.',
			es: 'Kimberly Araújo, con jersey crema, apoyada en una pared roja y blanca, mira a la cámara.',
			fr: 'Kimberly Araújo, en pull crème, adossée à un mur rouge et blanc, regarde l’objectif.',
		},
	},
	{
		name: 'Maria Silva',
		photo: mariaSilva,
		alt: {
			pt: 'Maria Silva, de casaco cinzento e vestido preto, sorri para a câmara entre redes e cordas, diante de uma parede vermelha.',
			en: 'Maria Silva, in a grey coat and a black dress, smiles at the camera among nets and ropes, in front of a red wall.',
			es: 'Maria Silva, con abrigo gris y vestido negro, sonríe a la cámara entre redes y cuerdas, delante de una pared roja.',
			fr: 'Maria Silva, en manteau gris et robe noire, sourit à l’objectif parmi des filets et des cordes, devant un mur rouge.',
		},
	},
	{
		name: 'Mateus Silva',
		photo: mateus,
		alt: {
			pt: 'Mateus Silva, de camisa branca e casaco aos quadrados verdes, encostado a uma parede de pedra, olha para a câmara.',
			en: 'Mateus Silva, in a white shirt and a green checked jacket, leans on a stone wall and looks at the camera.',
			es: 'Mateus Silva, con camisa blanca y chaqueta de cuadros verdes, apoyado en una pared de piedra, mira a la cámara.',
			fr: 'Mateus Silva, en chemise blanche et veste à carreaux verts, adossé à un mur de pierre, regarde l’objectif.',
		},
	},
	{
		name: 'Marisa Tomas',
		photo: marisa,
		alt: {
			pt: 'Marisa Tomas, de casaco preto, de pé diante de uma casa com varanda de madeira.',
			en: 'Marisa Tomas, in a black jacket, stands in front of a house with a wooden balcony.',
			es: 'Marisa Tomas, con chaqueta negra, de pie delante de una casa con balcón de madera.',
			fr: 'Marisa Tomas, en veste noire, debout devant une maison au balcon de bois.',
		},
	},
	{
		name: 'Isabel Rodríguez',
		photo: isabel,
		alt: {
			pt: 'Isabel Rodríguez, de top branco e calças cinzentas, junto a uma parede com graffiti, inclina-se para a câmara.',
			en: 'Isabel Rodríguez, in a white top and grey trousers, by a graffiti wall, leans toward the camera.',
			es: 'Isabel Rodríguez, con top blanco y pantalón gris, junto a una pared con grafitis, se inclina hacia la cámara.',
			fr: 'Isabel Rodríguez, en haut blanc et pantalon gris, près d’un mur de graffitis, se penche vers l’objectif.',
		},
	},
	{
		name: 'Sara Lucas',
		photo: sara,
		alt: {
			pt: 'Sara Lucas, de camisola vermelha, segura um livro aberto numa livraria.',
			en: 'Sara Lucas, in a red sweater, holds an open book in a bookshop.',
			es: 'Sara Lucas, con jersey rojo, sostiene un libro abierto en una librería.',
			fr: 'Sara Lucas, en pull rouge, tient un livre ouvert dans une librairie.',
		},
	},
	{
		name: 'Maria Pendeirada',
		photo: mariaPendeirada,
		alt: {
			pt: 'Maria Pendeirada, de vestido estampado, ajoelhada junto a uma parede de pedra.',
			en: 'Maria Pendeirada, in a patterned dress, kneels by a stone wall.',
			es: 'Maria Pendeirada, con vestido estampado, arrodillada junto a una pared de piedra.',
			fr: 'Maria Pendeirada, en robe imprimée, agenouillée près d’un mur de pierre.',
		},
	},
];
