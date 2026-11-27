// The Crew members, shown in the Equipa section in this order. Photos are 4:5 portraits in
// src/assets/crew/; the two co-founders are also Team members (src/config/team.ts).
import type { ImageMetadata } from 'astro';
import carlos from '../assets/crew/carlos-droumond.jpg';
import goncalo from '../assets/crew/goncalo-espirito-santo.jpg';
import isabel from '../assets/crew/isabel-rodriguez.jpg';
import julien from '../assets/crew/julien-laffont.jpg';
import lada from '../assets/crew/lada-sao-miguel.jpg';
import maria from '../assets/crew/maria-pendeirada.jpg';
import natan from '../assets/crew/natan.jpg';
import sara from '../assets/crew/sara-lucas.jpg';
import type { Language } from './site';

/** A text in each language. */
type Text = Record<Language, string>;

export interface CrewMember {
	name: string;
	/** The small line under the name: what the person does in the crew. */
	role: Text;
	photo: ImageMetadata;
	/** What the photo shows, for whoever cannot see it. */
	alt: Text;
}

const ASSISTANT_DIRECTOR: Text = {
	pt: 'Assistente de realizador',
	en: 'Assistant director',
	es: 'Ayudante de dirección',
	fr: 'Assistanat à la réalisation',
};
const ACTRESS_ASSISTANT: Text = {
	pt: 'Atriz · Assistente de direção dos atores',
	en: 'Actress · Assistant director of actors',
	es: 'Actriz · Ayudante de dirección de actores',
	fr: 'Actrice · Assistante à la direction d’acteurs',
};

export const CREW: CrewMember[] = [
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
			pt: 'Carlos Droumond, de óculos escuros e casaco castanho-escuro, a olhar para a esquerda.',
			en: 'Carlos Droumond, in sunglasses and a dark brown jacket, looking to the left.',
			es: 'Carlos Droumond, con gafas de sol y chaqueta marrón oscuro, mirando hacia la izquierda.',
			fr: 'Carlos Droumond, en lunettes de soleil et veste marron foncé, regardant vers la gauche.',
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
			pt: 'Julien Laffont, de óculos escuros e casaco de cabedal, diante de uma parede de cartazes.',
			en: 'Julien Laffont, in sunglasses and a leather jacket, in front of a wall of posters.',
			es: 'Julien Laffont, con gafas de sol y chaqueta de cuero, delante de una pared de carteles.',
			fr: 'Julien Laffont, en lunettes de soleil et blouson de cuir, devant un mur d’affiches.',
		},
	},
	{
		name: 'Gonçalo Espirito Santo',
		role: {
			pt: 'Ator · Guionista',
			en: 'Actor · Screenwriter',
			es: 'Actor · Guionista',
			fr: 'Acteur · Scénariste',
		},
		photo: goncalo,
		alt: {
			pt: 'Gonçalo Espirito Santo, de fato escuro, sentado numa esplanada à noite, a beber um copo de vinho.',
			en: 'Gonçalo Espirito Santo, in a dark suit, sitting on a terrace at night, drinking a glass of wine.',
			es: 'Gonçalo Espirito Santo, con traje oscuro, sentado en una terraza de noche, bebiendo una copa de vino.',
			fr: 'Gonçalo Espirito Santo, en costume sombre, assis à une terrasse le soir, buvant un verre de vin.',
		},
	},
	{
		name: 'Isabel Rodríguez',
		role: {
			pt: 'Atriz · Figurinista',
			en: 'Actress · Costume designer',
			es: 'Actriz · Figurinista',
			fr: 'Actrice · Costumière',
		},
		photo: isabel,
		alt: {
			pt: 'Isabel Rodríguez, de top branco e calças cinzentas, encostada a uma parede com graffiti.',
			en: 'Isabel Rodríguez, in a white top and grey trousers, leaning on a graffiti wall.',
			es: 'Isabel Rodríguez, con top blanco y pantalón gris, apoyada en una pared con grafitis.',
			fr: 'Isabel Rodríguez, en haut blanc et pantalon gris, appuyée contre un mur couvert de graffitis.',
		},
	},
	{
		name: 'Maria Pendeirada',
		role: ACTRESS_ASSISTANT,
		photo: maria,
		alt: {
			pt: 'Maria Pendeirada, de cabelo encaracolado, ao pôr do sol, entre ervas secas.',
			en: 'Maria Pendeirada, with curly hair, at sunset among dry grass.',
			es: 'Maria Pendeirada, de pelo rizado, al atardecer, entre hierbas secas.',
			fr: 'Maria Pendeirada, aux cheveux bouclés, au coucher du soleil, parmi les herbes sèches.',
		},
	},
	{
		name: 'Sara Lucas',
		role: ACTRESS_ASSISTANT,
		photo: sara,
		alt: {
			pt: 'Sara Lucas, de camisola vinho, com um livro aberto na mão, numa livraria.',
			en: 'Sara Lucas, in a burgundy top, holding an open book, in a bookshop.',
			es: 'Sara Lucas, con jersey granate y un libro abierto en la mano, en una librería.',
			fr: 'Sara Lucas, en pull bordeaux, un livre ouvert à la main, dans une librairie.',
		},
	},
	{
		name: 'Natan',
		role: ASSISTANT_DIRECTOR,
		photo: natan,
		alt: {
			pt: 'Natan, de óculos e casaco preto, com uma credencial de staff ao peito, diante de uma parede de pedra.',
			en: 'Natan, in glasses and a black jacket, with a staff badge on the chest, in front of a stone wall.',
			es: 'Natan, con gafas y chaqueta negra, con una acreditación de staff en el pecho, delante de una pared de piedra.',
			fr: 'Natan, avec des lunettes et une veste noire, un badge staff sur la poitrine, devant un mur de pierre.',
		},
	},
	{
		name: 'Lada São Miguel',
		role: ASSISTANT_DIRECTOR,
		photo: lada,
		alt: {
			pt: 'Lada São Miguel, de cabelo curto, com rosas azuis pintadas no rosto e no pescoço.',
			en: 'Lada São Miguel, with short hair, with blue roses painted on the face and neck.',
			es: 'Lada São Miguel, de pelo corto, con rosas azules pintadas en la cara y el cuello.',
			fr: 'Lada São Miguel, aux cheveux courts, avec des roses bleues peintes sur le visage et le cou.',
		},
	},
];
