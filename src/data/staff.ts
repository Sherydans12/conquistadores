import type { ImageMetadata } from 'astro';
import arturoGalleguillos from '../assets/images/staff/arturo-galleguillos.webp';
import auryFeirlie from '../assets/images/staff/aury-feirlie.webp';
import franciscaMoroso from '../assets/images/staff/francisca-moroso.webp';
import franciscaTello from '../assets/images/staff/francisca-tello.webp';
import helenGonzales from '../assets/images/staff/helen-gonzales.webp';
import irisRojas from '../assets/images/staff/iris-rojas.webp';
import javieraToro from '../assets/images/staff/javiera-toro.webp';
import jorgeRodriguez from '../assets/images/staff/jorge-rodriguez.webp';
import josefaFernandois from '../assets/images/staff/josefa-fernandois.webp';
import juanBravo from '../assets/images/staff/juan-bravo.webp';
import karenCollao from '../assets/images/staff/karen-collao.webp';
import karinaAraya from '../assets/images/staff/karina-araya.webp';
import katherineFuenzalida from '../assets/images/staff/katherine-fuenzalida.webp';
import magdaAranda from '../assets/images/staff/magda-aranda.webp';
import marcelVasquez from '../assets/images/staff/marcel-vasquez.webp';
import marianaParadela from '../assets/images/staff/mariana-paradela.webp';
import nicoleRojas from '../assets/images/staff/nicole-rojas.webp';
import omarRivera from '../assets/images/staff/omar-rivera.webp';
import paulinaCasanga from '../assets/images/staff/paulina-casanga.webp';
import rodrigoAraya from '../assets/images/staff/rodrigo-araya.webp';
import roxanaHenriquez from '../assets/images/staff/roxana-henriquez.webp';
import sergioCaro from '../assets/images/staff/sergio-caro.webp';
import silviaSena from '../assets/images/staff/silvia-sena.webp';
import silvianneCabello from '../assets/images/staff/silvianne-cabello.webp';
import joselynGonzales from '../assets/images/staff/joselyn-gonzales.webp';

export type StaffArea =
  | 'direccion'
  | 'tecnico-pedagogico'
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
}

export interface StaffAreaDefinition {
  id: StaffArea;
  label: string;
  shortLabel: string;
  description: string;
}

export const staffAreas: StaffAreaDefinition[] = [
  {
    id: 'direccion',
    label: 'Dirección y Gestión',
    shortLabel: 'Dirección y gestión',
    description: 'Liderazgo institucional, coordinación y enfermería.',
  },
  {
    id: 'tecnico-pedagogico',
    label: 'Técnico Pedagógico y Convivencia Educativa',
    shortLabel: 'Técnico pedagógico',
    description: 'Unidad técnico-pedagógica y convivencia educativa.',
  },
  {
    id: 'gestion',
    label: 'Contabilidad, Secretaría e Inspectoría',
    shortLabel: 'Secretaría e inspectoría',
    description: 'Administración, secretaría e inspectoría general.',
  },
  {
    id: 'especialistas',
    label: 'Inclusión Educativa “DIE”',
    shortLabel: 'Inclusión educativa',
    description: 'Profesionales que acompañan el aprendizaje desde la inclusión.',
  },
  {
    id: 'docentes',
    label: 'Docentes',
    shortLabel: 'Docentes',
    description: 'Profesoras y profesores de jefatura, asignatura y academias.',
  },
  {
    id: 'asistentes',
    label: 'Asistentes de Aula',
    shortLabel: 'Asistentes de aula',
    description: 'Acompañamiento cotidiano en los cursos de enseñanza básica.',
  },
  {
    id: 'auxiliares',
    label: 'Auxiliares de Servicio',
    shortLabel: 'Auxiliares de servicio',
    description: 'Equipo de apoyo para el funcionamiento diario del colegio.',
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
  },
  {
    id: 'sergio-caro',
    name: 'Sergio Caro',
    role: 'Dirección',
    area: 'direccion',
    image: sergioCaro,
    imageAlt: 'Retrato de Sergio Caro',
  },
  {
    id: 'roxana-henriquez',
    name: 'Roxana Henríquez',
    role: 'Coordinadora de gestión · Enfermería',
    area: 'direccion',
    image: roxanaHenriquez,
    imageAlt: 'Retrato de Roxana Henríquez',
  },
  {
    id: 'rodrigo-araya',
    name: 'Rodrigo Araya',
    role: 'Unidad Técnico Pedagógico · Prof. Música',
    area: 'tecnico-pedagogico',
    image: rodrigoAraya,
    imageAlt: 'Retrato de Rodrigo Araya',
  },
  {
    id: 'francisca-moroso',
    name: 'Francisca Moroso',
    role: 'Convivencia Educativa · Prof. Matemáticas',
    area: 'tecnico-pedagogico',
    image: franciscaMoroso,
    imageAlt: 'Retrato de Francisca Moroso',
  },
  {
    id: 'silvia-sena',
    name: 'Silvia Sena',
    role: 'Contabilidad',
    area: 'gestion',
    image: silviaSena,
    imageAlt: 'Retrato de Silvia Sena',
  },
  {
    id: 'mary-jane',
    name: 'Mary Jane',
    role: 'Secretaría',
    area: 'gestion',
  },
  {
    id: 'aury-feirlie',
    name: 'Aury Feirlie',
    role: 'Inspectora General',
    area: 'gestion',
    image: auryFeirlie,
    imageAlt: 'Retrato de Aury Feirlie',
  },
  {
    id: 'nicole-rojas',
    name: 'Nicole Rojas',
    role: 'Inspectora',
    area: 'gestion',
    image: nicoleRojas,
    imageAlt: 'Retrato de Nicole Rojas',
  },
  {
    id: 'josefa-fernandois',
    name: 'Josefa Fernandois',
    role: 'Coordinadora “DIE” · Psicopedagoga',
    area: 'especialistas',
    image: josefaFernandois,
    imageAlt: 'Retrato de Josefa Fernandois',
  },
  {
    id: 'paulina-casanga',
    name: 'Paulina Casanga',
    role: 'Psicóloga',
    area: 'especialistas',
    image: paulinaCasanga,
    imageAlt: 'Retrato de Paulina Casanga',
  },
  {
    id: 'karen-collao',
    name: 'Karen Collao',
    role: 'Téc. en Educación Diferencial',
    area: 'especialistas',
    image: karenCollao,
    imageAlt: 'Retrato de Karen Collao',
  },
  {
    id: 'helen-gonzalez',
    name: 'Helen Gonzalez',
    role: 'Educadora Diferencial',
    area: 'especialistas',
    image: helenGonzales,
    imageAlt: 'Retrato de Helen Gonzalez',
  },
  {
    id: 'alondra-diaz',
    name: 'Alondra Diaz',
    role: 'Educadora Diferencial',
    area: 'especialistas',
  },
  {
    id: 'magda-aranda',
    name: 'Magda Aranda',
    role: 'Profesora jefe · 1° básico',
    area: 'docentes',
    image: magdaAranda,
    imageAlt: 'Retrato de Magda Aranda',
  },
  {
    id: 'katherine-fuenzalida',
    name: 'Katherine Fuenzalida',
    role: 'Profesora jefe · 2° básico',
    area: 'docentes',
    image: katherineFuenzalida,
    imageAlt: 'Retrato de Katherine Fuenzalida',
  },
  {
    id: 'mariana-paradela',
    name: 'Mariana Paradela',
    role: 'Profesora jefe · 3° básico',
    area: 'docentes',
    image: marianaParadela,
    imageAlt: 'Retrato de Mariana Paradela',
  },
  {
    id: 'valentina-carrasco',
    name: 'Valentina Carrasco',
    role: 'Profesora jefe · 4° básico',
    area: 'docentes',
  },
  {
    id: 'omar-rivera',
    name: 'Omar Rivera',
    role: 'Profesor de Matemáticas y Física',
    area: 'docentes',
    image: omarRivera,
    imageAlt: 'Retrato de Omar Rivera',
  },
  {
    id: 'javiera-toro',
    name: 'Javiera Toro',
    role: 'Profesora de Lenguaje y Comunicación y Filosofía',
    area: 'docentes',
    image: javieraToro,
    imageAlt: 'Retrato de Javiera Toro',
  },
  {
    id: 'juan-pablo-fox',
    name: 'Juan Pablo Fox',
    role: 'Profesor de Historia, Geografía y Ciencias Sociales',
    area: 'docentes',
  },
  {
    id: 'marcel-vasquez',
    name: 'Marcel Vásquez',
    role: 'Profesor de Ciencias, Biología y Química',
    area: 'docentes',
    image: marcelVasquez,
    imageAlt: 'Retrato de Marcel Vásquez',
  },
  {
    id: 'francisca-tello',
    name: 'Francisca Tello',
    role: 'Profesora de Inglés',
    area: 'docentes',
    image: franciscaTello,
    imageAlt: 'Retrato de Francisca Tello',
  },
  {
    id: 'jorge-rodriguez',
    name: 'Jorge Rodríguez',
    role: 'Profesor de Educación Física y Salud',
    area: 'docentes',
    image: jorgeRodriguez,
    imageAlt: 'Retrato de Jorge Rodríguez',
  },
  {
    id: 'maria-alejandra-perez',
    name: 'María Alejandra Pérez',
    role: 'Profesora de Ciencias para la Ciudadanía y Biología de los ecosistemas',
    area: 'docentes',
  },
  {
    id: 'elsa-diaz',
    name: 'Elsa Díaz',
    role: 'Profesora de Lenguaje y Comunicación y Religión',
    area: 'docentes',
  },
  {
    id: 'julio-bonilla',
    name: 'Julio Bonilla',
    role: 'Profesor de Comprensión de la historia reciente',
    area: 'docentes',
  },
  {
    id: 'iris-rojas',
    name: 'Iris Rojas',
    role: 'Profesora de Taller Arte en Acción y Magia de Leer · Academia de Teatro',
    area: 'docentes',
    image: irisRojas,
    imageAlt: 'Retrato de Iris Rojas',
  },
  {
    id: 'natalia-gonzalez',
    name: 'Natalia González',
    role: 'Profesora de Academia de Danza',
    area: 'docentes',
  },
  {
    id: 'carlos-morales',
    name: 'Carlos Morales',
    role: 'Profesor de Academia de Danza',
    area: 'docentes',
  },
  {
    id: 'bastian-zalazar',
    name: 'Bastian Zalazar',
    role: 'Profesor de Academia de Fútbol',
    area: 'docentes',
  },
  {
    id: 'javier-ruiz',
    name: 'Javier Ruiz',
    role: 'Profesor de Academia de Fútbol',
    area: 'docentes',
  },
  {
    id: 'juan-bravo',
    name: 'Juan Bravo',
    role: 'Profesor de Academia de Taekwondo',
    area: 'docentes',
    image: juanBravo,
    imageAlt: 'Retrato de Juan Bravo',
  },
  {
    id: 'loreto-araya',
    name: 'Loreto Araya',
    role: 'Asistente de aula · 1° Básico',
    area: 'asistentes',
  },
  {
    id: 'silvianne-cabello',
    name: 'Silvianne Cabello',
    role: 'Asistente de aula · 2° Básico',
    area: 'asistentes',
    image: silvianneCabello,
    imageAlt: 'Retrato de Silvianne Cabello',
  },
  {
    id: 'solang-hernandez',
    name: 'Solang Hernández',
    role: 'Asistente de aula · 3° Básico',
    area: 'asistentes',
  },
  {
    id: 'romina-corvalan',
    name: 'Romina Corvalán',
    role: 'Asistente de aula · 4° Básico',
    area: 'asistentes',
  },
  {
    id: 'casandra-gutierrez',
    name: 'Casandra Gutiérrez',
    role: 'Asistente de aula · 5° Básico',
    area: 'asistentes',
  },
  {
    id: 'joselyn-gonzalez',
    name: 'Joselyn González',
    role: 'Auxiliar de servicio',
    area: 'auxiliares',
    image: joselynGonzales,
    imageAlt: 'Retrato de Joselyn González',
  },
  {
    id: 'karina-araya',
    name: 'Karina Araya',
    role: 'Auxiliar de servicio',
    area: 'auxiliares',
    image: karinaAraya,
    imageAlt: 'Retrato de Karina Araya',
  },
  {
    id: 'isabel-ovalle',
    name: 'Isabel Ovalle',
    role: 'Auxiliar de servicio',
    area: 'auxiliares',
  },
];

export function getStaffByArea(area: StaffArea): StaffMember[] {
  return staff.filter((member) => member.area === area);
}
