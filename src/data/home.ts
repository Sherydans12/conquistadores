import type { ImageMetadata } from 'astro';
import heroImage from '../assets/images/home/fachada-colegio-conquistadores.webp';
import workshopImage from '../assets/images/home/taller-de-musica.webp';
import academyImage from '../assets/images/home/academia-de-teatro.webp';
import videoImage from '../assets/images/home/video-un-mundo-de-diferencias.webp';
import wroImage from '../assets/images/activities/world-robot-olympiad-2025.webp';
import galaImage from '../assets/images/activities/gala-raiz-folclorica-2025.webp';
import familyImage from '../assets/images/activities/dia-de-la-familia-2025.webp';
import { familyPortal } from './family-portal';

export interface Activity {
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  href: string;
  image: ImageMetadata;
  alt: string;
}

export const home = {
  announcement: {
    visible: true,
    text: 'Calendario de Evaluaciones 2026 actualizado',
    href: '/documentos/#evaluaciones-2026',
  },
  hero: {
    image: heroImage,
    alt: 'Fachada azul del Colegio Conquistadores en Coquimbo',
    eyebrow: 'Comunidad educativa en Coquimbo',
    title: 'Colegio Conquistadores',
    tagline: 'Aprender con alegría',
    primaryCta: {
      label: 'Ir al Portal de Pagos',
      href: familyPortal.url,
      external: true,
    },
    secondaryCta: {
      label: 'Conoce Matrículas 2027',
      href: '/matriculas-2027/',
    },
  },
  introduction: {
    eyebrow: 'Nuestro colegio',
    title: 'Una educación que reconoce a cada estudiante',
    body: 'Somos una comunidad educativa particular con una visión moderna e inclusiva. Promovemos aprendizajes alegres y efectivos, valorando la diversidad, las capacidades y el trabajo conjunto de estudiantes, familias y docentes.',
  },
  institutional: [
    {
      title: 'Historia',
      body: 'El Colegio Conquistadores fue fundado en 2018 por el profesor Arturo Galleguillos Trigo. Comenzó con cursos de 1° a 3° básico y ha ampliado progresivamente su propuesta educativa con un equipo comprometido y metodologías lúdicas.',
    },
    {
      title: 'Misión',
      body: 'Brindar una educación integral e inclusiva, fomentando habilidades cognitivas, afectivas, artísticas y deportivas en un ambiente de alegría y respeto.',
    },
    {
      title: 'Visión',
      body: 'Formar personas íntegras, con sólidos valores y capacidades académicas, que generen oportunidades y contribuyan activamente a la sociedad.',
    },
    {
      title: 'Valores',
      body: 'Respeto, solidaridad, innovación y compromiso guían el aprendizaje, el trabajo en equipo, el conocimiento y la inclusión.',
    },
  ],
  attributes: [
    {
      title: 'Educación integral',
      body: 'Aprendizajes académicos, afectivos, artísticos y deportivos que acompañan el desarrollo de cada estudiante.',
    },
    {
      title: 'Comunidad inclusiva',
      body: 'Una cultura de respeto que reconoce la diversidad y promueve la participación de toda la comunidad.',
    },
    {
      title: 'Aprendizaje activo',
      body: 'Metodologías lúdicas y experiencias que conectan conocimiento, creatividad y colaboración.',
    },
  ],
  activities: [
    {
      title:
        'Colegio Conquistadores lleva su innovación a la World Robot Olympiad Chile',
      date: '2025-10-06',
      dateLabel: '6 de octubre de 2025',
      category: 'Innovación',
      href: '/2025/10/06/colegio-conquistadores-lleva-su-innovacion-a-la-world-robot-olympiad-chile/',
      image: wroImage,
      alt: 'Estudiantes del Colegio Conquistadores en la World Robot Olympiad Chile',
    },
    {
      title: 'Gala Raíz Folclórica 2025',
      date: '2025-09-29',
      dateLabel: '29 de septiembre de 2025',
      category: 'Comunidad',
      href: '/2025/09/29/gala-raiz-folclorica-2025/',
      image: galaImage,
      alt: 'Presentación de estudiantes en la Gala Raíz Folclórica 2025',
    },
    {
      title: 'Día de la Familia 2025',
      date: '2025-05-19',
      dateLabel: '19 de mayo de 2025',
      category: 'Convivencia',
      href: '/2025/05/19/dia-de-la-familia-2025/',
      image: familyImage,
      alt: 'Comunidad del Colegio Conquistadores durante el Día de la Familia 2025',
    },
  ] satisfies Activity[],
  enrichment: [
    {
      title: 'Talleres',
      body: 'Experiencias divertidas y educativas que incluyen música, motricidad y el mundo de saberes.',
      href: '/talleres/',
      linkLabel: 'Conocer talleres',
      image: workshopImage,
      alt: 'Estudiantes participando en un taller de música',
    },
    {
      title: 'Academias',
      body: 'Programas deportivos, artísticos y de bienestar para explorar intereses, crear y compartir.',
      href: '/academias/',
      linkLabel: 'Conocer academias',
      image: academyImage,
      alt: 'Estudiantes participando en una academia de teatro',
    },
  ],
  video: {
    title: 'Un mundo de diferencias',
    description:
      'Una mirada a una experiencia artística de nuestra comunidad educativa.',
    youtubeId: 'Ff5jlg1Ez98',
    externalUrl: 'https://www.youtube.com/watch?v=Ff5jlg1Ez98',
    thumbnail: videoImage,
    alt: 'Miniatura del video institucional Un mundo de diferencias',
  },
} as const;
