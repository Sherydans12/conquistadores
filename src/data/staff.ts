import type { ImageMetadata } from 'astro';
import arturoGalleguillos from '../assets/images/staff/arturo-galleguillos.webp';
import auryFeirlie from '../assets/images/staff/aury-feirlie.webp';
import carlaFlores from '../assets/images/staff/carla-flores.webp';
import cesarAlzamora from '../assets/images/staff/cesar-alzamora.webp';
import elzaDias from '../assets/images/staff/elza-dias.webp';
import franciscaMoroso from '../assets/images/staff/francisca-moroso.webp';
import franciscaTello from '../assets/images/staff/francisca-tello.webp';
import helenGonzales from '../assets/images/staff/helen-gonzales.webp';
import irisRojas from '../assets/images/staff/iris-rojas.webp';
import javieraGalaz from '../assets/images/staff/javiera-galaz.webp';
import javieraToro from '../assets/images/staff/javiera-toro.webp';
import jorgeRodriguez from '../assets/images/staff/jorge-rodriguez.webp';
import josefaFernandois from '../assets/images/staff/josefa-fernandois.webp';
import joselynGonzales from '../assets/images/staff/joselyn-gonzales.webp';
import juanBravo from '../assets/images/staff/juan-bravo.webp';
import juanPabloCastillo from '../assets/images/staff/juan-pablo-castillo.webp';
import karenCollao from '../assets/images/staff/karen-collao.webp';
import karinaAraya from '../assets/images/staff/karina-araya.webp';
import katherineFuenzalida from '../assets/images/staff/katherine-fuenzalida.webp';
import magdaAranda from '../assets/images/staff/magda-aranda.webp';
import marcelVasquez from '../assets/images/staff/marcel-vasquez.webp';
import marianaParadela from '../assets/images/staff/mariana-paradela.webp';
import nicoleRojas from '../assets/images/staff/nicole-rojas.webp';
import omarRivera from '../assets/images/staff/omar-rivera.webp';
import paolaBarraza from '../assets/images/staff/paola-barraza.webp';
import paolaContreras from '../assets/images/staff/paola-contreras.webp';
import paulinaCasanga from '../assets/images/staff/paulina-casanga.webp';
import rodrigoAraya from '../assets/images/staff/rodrigo-araya.webp';
import roxanaHenriquez from '../assets/images/staff/roxana-henriquez.webp';
import sergioCaro from '../assets/images/staff/sergio-caro.webp';
import silviaSena from '../assets/images/staff/silvia-sena.webp';
import silvianneCabello from '../assets/images/staff/silvianne-cabello.webp';
import sofiaNavarrete from '../assets/images/staff/sofia-navarrete.webp';

export type StaffArea =
  | 'direccion'
  | 'gestion'
  | 'especialistas'
  | 'docentes'
  | 'asistentes'
  | 'auxiliares';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  area: StaffArea;
  image?: ImageMetadata;
  imageAlt?: string;
  public: boolean;
  needsReview?: boolean;
  sourceUrl?: string;
}

export interface StaffAreaDefinition {
  id: StaffArea;
  label: string;
  description: string;
}

const sourceUrl = 'https://www.colegioconquistadores.com/personal/';

export const staffAreas: StaffAreaDefinition[] = [
  {
    id: 'direccion',
    label: 'Dirección',
    description: 'Sostenedor, dirección y unidades técnico-pedagógicas.',
  },
  {
    id: 'gestion',
    label: 'Gestión y apoyo',
    description: 'Administración, secretaría e inspectoría.',
  },
  {
    id: 'especialistas',
    label: 'Equipo de especialistas',
    description: 'Profesionales de apoyo publicados por el colegio.',
  },
  {
    id: 'docentes',
    label: 'Docentes',
    description: 'Profesoras y profesores de jefatura, asignatura y academias.',
  },
  {
    id: 'asistentes',
    label: 'Asistentes de aula',
    description: 'Equipo de apoyo directo en los cursos publicados.',
  },
  {
    id: 'auxiliares',
    label: 'Auxiliares de servicio',
    description: 'Personal de apoyo para el funcionamiento cotidiano.',
  },
];

export const staff: StaffMember[] = [
  {
    id: 'arturo-galleguillos',
    name: 'Arturo Galleguillos',
    role: 'Sostenedor',
    area: 'direccion',
    image: arturoGalleguillos,
    imageAlt: 'Retrato de Arturo Galleguillos',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'sergio-caro',
    name: 'Sergio Caro',
    role: 'Director',
    area: 'direccion',
    image: sergioCaro,
    imageAlt: 'Retrato de Sergio Caro',
    public: true,
    sourceUrl,
  },
  {
    id: 'francisca-moroso',
    name: 'Francisca Moroso',
    role: 'UTP Primer Ciclo · Profesora de Matemáticas',
    area: 'direccion',
    image: franciscaMoroso,
    imageAlt: 'Retrato de Francisca Moroso',
    public: true,
    sourceUrl,
  },
  {
    id: 'rodrigo-araya',
    name: 'Rodrigo Araya',
    role: 'UTP Segundo Ciclo · Profesor de Música',
    area: 'direccion',
    image: rodrigoAraya,
    imageAlt: 'Retrato de Rodrigo Araya',
    public: true,
    sourceUrl,
  },
  {
    id: 'silvia-sena',
    name: 'Silvia Sena',
    role: 'Contabilidad',
    area: 'gestion',
    image: silviaSena,
    imageAlt: 'Retrato de Silvia Sena',
    public: true,
    sourceUrl,
  },
  {
    id: 'roxana-henriquez',
    name: 'Roxana Henriquez',
    role: 'Secretaria · Técnica en Enfermería',
    area: 'gestion',
    image: roxanaHenriquez,
    imageAlt: 'Retrato de Roxana Henriquez',
    public: true,
    sourceUrl,
  },
  {
    id: 'aury-feirlie',
    name: 'Aury Feirlie',
    role: 'Inspectora',
    area: 'gestion',
    image: auryFeirlie,
    imageAlt: 'Retrato de Aury Feirlie',
    public: true,
    sourceUrl,
  },
  {
    id: 'karen-collao',
    name: 'Karen Collao',
    role: 'Inspectora · Técnica en Educación Diferencial',
    area: 'gestion',
    image: karenCollao,
    imageAlt: 'Retrato de Karen Collao',
    public: true,
    sourceUrl,
  },
  {
    id: 'paulina-casanga',
    name: 'Paulina Casanga',
    role: 'Psicóloga',
    area: 'especialistas',
    image: paulinaCasanga,
    imageAlt: 'Retrato de Paulina Casanga',
    public: true,
    sourceUrl,
  },
  {
    id: 'josefa-fernandois',
    name: 'Josefa Fernandois',
    role: 'Psicopedagoga',
    area: 'especialistas',
    image: josefaFernandois,
    imageAlt: 'Retrato de Josefa Fernandois',
    public: true,
    sourceUrl,
  },
  {
    id: 'elza-dias',
    name: 'Elza Días',
    role: 'Profesora Jefe 1° Básico',
    area: 'docentes',
    image: elzaDias,
    imageAlt: 'Retrato de Elza Días',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'katherine-fuenzalida',
    name: 'Katherine Fuenzalida',
    role: 'Profesora Jefe 2° Básico',
    area: 'docentes',
    image: katherineFuenzalida,
    imageAlt: 'Retrato de Katherine Fuenzalida',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'mariana-paradela',
    name: 'Mariana Paradela',
    role: 'Profesora Jefe 3° Básico',
    area: 'docentes',
    image: marianaParadela,
    imageAlt: 'Retrato de Mariana Paradela',
    public: true,
    sourceUrl,
  },
  {
    id: 'magda-aranda',
    name: 'Magda Aranda',
    role: 'Profesora Jefe 4° Básico',
    area: 'docentes',
    image: magdaAranda,
    imageAlt: 'Retrato de Magda Aranda',
    public: true,
    sourceUrl,
  },
  {
    id: 'paola-contreras',
    name: 'Paola Contreras',
    role: 'Profesora Jefe 5° Básico',
    area: 'docentes',
    image: paolaContreras,
    imageAlt: 'Retrato de Paola Contreras',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'javiera-toro',
    name: 'Javiera Toro',
    role: 'Profesora de Lenguaje',
    area: 'docentes',
    image: javieraToro,
    imageAlt: 'Retrato de Javiera Toro',
    public: true,
    sourceUrl,
  },
  {
    id: 'marcel-vasquez',
    name: 'Marcel Vasquez',
    role: 'Profesor de Ciencias',
    area: 'docentes',
    image: marcelVasquez,
    imageAlt: 'Retrato de Marcel Vasquez',
    public: true,
    sourceUrl,
  },
  {
    id: 'juan-pablo-castillo',
    name: 'Juan Pablo Castillo',
    role: 'Profesor de Historia y Geografía',
    area: 'docentes',
    image: juanPabloCastillo,
    imageAlt: 'Retrato de Juan Pablo Castillo',
    public: true,
    sourceUrl,
  },
  {
    id: 'omar-rivera',
    name: 'Omar Rivera',
    role: 'Profesor de Matemáticas',
    area: 'docentes',
    image: omarRivera,
    imageAlt: 'Retrato de Omar Rivera',
    public: true,
    sourceUrl,
  },
  {
    id: 'helen-gonzales',
    name: 'Helen Gonzales',
    role: 'Profesora de Lenguaje',
    area: 'docentes',
    image: helenGonzales,
    imageAlt: 'Retrato de Helen Gonzales',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'iris-rojas',
    name: 'Iris Rojas',
    role: 'Profesora de Academia de Teatro y Taller de Expresión',
    area: 'docentes',
    image: irisRojas,
    imageAlt: 'Retrato de Iris Rojas',
    public: true,
    sourceUrl,
  },
  {
    id: 'jorge-rodriguez',
    name: 'Jorge Rodriguez',
    role: 'Profesor de Educación Física',
    area: 'docentes',
    image: jorgeRodriguez,
    imageAlt: 'Retrato de Jorge Rodriguez',
    public: true,
    sourceUrl,
  },
  {
    id: 'javiera-galaz',
    name: 'Javiera Galaz',
    role: 'Profesora de Academia de Voleibol',
    area: 'docentes',
    image: javieraGalaz,
    imageAlt: 'Retrato de Javiera Galaz',
    public: true,
    sourceUrl,
  },
  {
    id: 'cesar-alzamora',
    name: 'Cesar Alzamora',
    role: 'Profesor de Educación Física',
    area: 'docentes',
    image: cesarAlzamora,
    imageAlt: 'Retrato de Cesar Alzamora',
    public: true,
    sourceUrl,
  },
  {
    id: 'juan-bravo',
    name: 'Juan Bravo',
    role: 'Profesor de Academia de Taekwondo',
    area: 'docentes',
    image: juanBravo,
    imageAlt: 'Retrato de Juan Bravo',
    public: true,
    sourceUrl,
  },
  {
    id: 'francisca-tello',
    name: 'Francisca Tello',
    role: 'Profesora de Inglés',
    area: 'docentes',
    image: franciscaTello,
    imageAlt: 'Retrato de Francisca Tello',
    public: true,
    sourceUrl,
  },
  {
    id: 'silvianne-cabello',
    name: 'Silvianne Cabello',
    role: 'Asistente de Aula 1° Básico',
    area: 'asistentes',
    image: silvianneCabello,
    imageAlt: 'Retrato de Silvianne Cabello',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'carla-flores',
    name: 'Carla Flores',
    role: 'Asistente de Aula 2° Básico',
    area: 'asistentes',
    image: carlaFlores,
    imageAlt: 'Retrato de Carla Flores',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'sofia-navarrete',
    name: 'Sofía Navarrete',
    role: 'Asistente de Aula 3° Básico',
    area: 'asistentes',
    image: sofiaNavarrete,
    imageAlt: 'Retrato de Sofía Navarrete',
    public: true,
    sourceUrl,
  },
  {
    id: 'paola-barraza',
    name: 'Paola Barraza',
    role: 'Asistente de Aula 4° Básico',
    area: 'asistentes',
    image: paolaBarraza,
    imageAlt: 'Retrato de Paola Barraza',
    public: true,
    sourceUrl,
  },
  {
    id: 'nicole-rojas',
    name: 'Nicole Rojas',
    role: 'Auxiliar de Servicio',
    area: 'auxiliares',
    image: nicoleRojas,
    imageAlt: 'Retrato de Nicole Rojas',
    public: true,
    sourceUrl,
  },
  {
    id: 'joselyn-gonzales',
    name: 'Joselyn Gonzáles',
    role: 'Auxiliar de Servicio',
    area: 'auxiliares',
    image: joselynGonzales,
    imageAlt: 'Retrato de Joselyn Gonzáles',
    public: true,
    needsReview: true,
    sourceUrl,
  },
  {
    id: 'karina-araya',
    name: 'Karina Araya',
    role: 'Auxiliar de Servicio',
    area: 'auxiliares',
    image: karinaAraya,
    imageAlt: 'Retrato de Karina Araya',
    public: true,
    sourceUrl,
  },
];

export const publicStaff = staff.filter((member) => member.public);

export function getStaffByArea(area: StaffArea): StaffMember[] {
  return publicStaff.filter((member) => member.area === area);
}
