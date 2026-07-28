import danceImage from '../assets/images/programs/academia-baile.webp';
import artImage from '../assets/images/programs/academia-conquistarte.webp';
import footballImage from '../assets/images/programs/academia-futbol.webp';
import theatreImage from '../assets/images/programs/academia-teatro.webp';
import type { SchoolProgram } from './workshops';

export const academies: SchoolProgram[] = [
  {
    id: 'futbol',
    title: 'Academia de fútbol',
    description:
      'La práctica del fútbol estimula habilidades físicas y el desarrollo motor, junto con el trabajo en equipo, la disciplina, la organización y la concentración.',
    image: footballImage,
    imageAlt:
      'Estudiantes participando en una práctica de fútbol en una cancha',
    type: 'academy',
    category: 'deporte',
    public: true,
  },
  {
    id: 'baile',
    title: 'Academia de baile',
    description:
      'El baile favorece la comunicación entre pares, la actividad física, la expresión y el desarrollo de habilidades cognitivas por medio del movimiento.',
    image: danceImage,
    imageAlt:
      'Estudiantes realizando una presentación grupal de baile',
    type: 'academy',
    category: 'arte',
    public: true,
  },
  {
    id: 'teatro',
    title: 'Academia de teatro',
    description:
      'El juego teatral abre oportunidades para fortalecer la autoestima, reconocer emociones, desarrollar habilidades sociales y estimular la expresión artística.',
    image: theatreImage,
    imageAlt:
      'Estudiantes caracterizados durante una presentación de teatro',
    type: 'academy',
    category: 'arte',
    public: true,
  },
  {
    id: 'conquistarte',
    title: 'Academia Conquistarte',
    description:
      'Las actividades artísticas y lúdicas estimulan habilidades manuales y psicomotoras, además de la creatividad y la imaginación.',
    image: artImage,
    imageAlt:
      'Estudiantes mostrando trabajos artísticos realizados en Conquistarte',
    type: 'academy',
    category: 'arte',
    public: true,
  },
  {
    id: 'yoga',
    title: 'Academia de yoga',
    description:
      'La propuesta publicada relaciona el yoga con pensamientos positivos, hábitos saludables y bienestar emocional mediante experiencias adaptadas al crecimiento y desarrollo infantil.',
    type: 'academy',
    category: 'bienestar',
    public: true,
    needsReview: true,
  },
];
