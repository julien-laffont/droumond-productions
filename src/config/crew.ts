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

const ASSISTANT_DIRECTOR: Text = { pt: 'Assistente de realizador', en: 'Assistant director' };
const ACTRESS_ASSISTANT: Text = {
	pt: 'Atriz · Assistente de direção dos atores',
	en: 'Actress · Assistant director of actors',
};

export const CREW: CrewMember[] = [
	{
		name: 'Carlos Droumond',
		role: { pt: 'Realizador · Produtor · Ator', en: 'Director · Producer · Actor' },
		photo: carlos,
		alt: {
			pt: 'Carlos Droumond, de óculos escuros e casaco castanho-escuro, a olhar para a esquerda.',
			en: 'Carlos Droumond, in sunglasses and a dark brown jacket, looking to the left.',
		},
	},
	{
		name: 'Julien Laffont',
		role: {
			pt: 'Ator · Gerente · Direção de atores',
			en: 'Actor · Managing director · Director of actors',
		},
		photo: julien,
		alt: {
			pt: 'Julien Laffont, de óculos escuros e casaco de cabedal, diante de uma parede de cartazes.',
			en: 'Julien Laffont, in sunglasses and a leather jacket, in front of a wall of posters.',
		},
	},
	{
		name: 'Gonçalo Espirito Santo',
		role: { pt: 'Ator · Guionista', en: 'Actor · Screenwriter' },
		photo: goncalo,
		alt: {
			pt: 'Gonçalo Espirito Santo, de fato escuro, sentado numa esplanada à noite, a beber um copo de vinho.',
			en: 'Gonçalo Espirito Santo, in a dark suit, sitting on a terrace at night, drinking a glass of wine.',
		},
	},
	{
		name: 'Isabel Rodríguez',
		role: { pt: 'Atriz · Figurinista', en: 'Actress · Costume designer' },
		photo: isabel,
		alt: {
			pt: 'Isabel Rodríguez, de top branco e calças cinzentas, encostada a uma parede com graffiti.',
			en: 'Isabel Rodríguez, in a white top and grey trousers, leaning on a graffiti wall.',
		},
	},
	{
		name: 'Maria Pendeirada',
		role: ACTRESS_ASSISTANT,
		photo: maria,
		alt: {
			pt: 'Maria Pendeirada, de cabelo encaracolado, ao pôr do sol, entre ervas secas.',
			en: 'Maria Pendeirada, with curly hair, at sunset among dry grass.',
		},
	},
	{
		name: 'Sara Lucas',
		role: ACTRESS_ASSISTANT,
		photo: sara,
		alt: {
			pt: 'Sara Lucas, de camisola vinho, com um livro aberto na mão, numa livraria.',
			en: 'Sara Lucas, in a burgundy top, holding an open book, in a bookshop.',
		},
	},
	{
		name: 'Natan',
		role: ASSISTANT_DIRECTOR,
		photo: natan,
		alt: {
			pt: 'Natan, de óculos e casaco preto, com uma credencial de staff ao peito, diante de uma parede de pedra.',
			en: 'Natan, in glasses and a black jacket, with a staff badge on the chest, in front of a stone wall.',
		},
	},
	{
		name: 'Lada São Miguel',
		role: ASSISTANT_DIRECTOR,
		photo: lada,
		alt: {
			pt: 'Lada São Miguel, de cabelo curto, com rosas azuis pintadas no rosto e no pescoço.',
			en: 'Lada São Miguel, with short hair, with blue roses painted on the face and neck.',
		},
	},
];
