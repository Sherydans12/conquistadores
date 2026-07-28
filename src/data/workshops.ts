import type { ImageMetadata } from 'astro';
import musicImage from '../assets/images/programs/taller-musica.webp';
import motorSkillsImage from '../assets/images/programs/taller-motricidad.webp';
import knowledgeImage from '../assets/images/programs/taller-mundo-saberes.webp';

export interface SchoolProgram {
  id: string;
  title: string;
  description: string;
  image?: ImageMetadata;
  imageAlt?: string;
  type: 'workshop' | 'academy';
  category?: 'deporte' | 'arte' | 'bienestar' | 'aprendizaje';
  audience?: string;
  schedule?: string;
  public: boolean;
  needsReview?: boolean;
}

export const workshops: SchoolProgram[] = [
  {
    id: 'musica',
    title: 'Taller de música',
    description:
      'La música aporta al desarrollo infantil y puede fortalecer la seguridad emocional y la confianza. El taller promueve el reconocimiento y respeto por distintos géneros, gustos e intereses musicales.',
    image: musicImage,
    imageAlt:
      'Docente con una guitarra durante una actividad musical con estudiantes',
    type: 'workshop',
    category: 'arte',
    public: true,
  },
  {
    id: 'motricidad',
    title: 'Taller de motricidad',
    description:
      'El taller estimula la motricidad fina y gruesa mediante experiencias vinculadas al juego, el baile y la diversión, favoreciendo el desarrollo progresivo de distintas habilidades.',
    image: motorSkillsImage,
    imageAlt:
      'Estudiantes participando en una actividad de motricidad en el patio del colegio',
    type: 'workshop',
    category: 'bienestar',
    public: true,
  },
  {
    id: 'mundo-de-saberes',
    title: 'Taller Mundo de Saberes',
    description:
      'Propone un aprendizaje dinámico que conecta la exploración, el arte y la expresión para generar conocimientos previos y facilitar la adquisición de nuevos aprendizajes.',
    image: knowledgeImage,
    imageAlt:
      'Estudiantes explorando materiales durante el taller Mundo de Saberes',
    type: 'workshop',
    category: 'aprendizaje',
    public: true,
  },
];
