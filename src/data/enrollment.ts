import { site } from './site';

export interface EnrollmentStep {
  number: string;
  title: string;
  description: string;
}

export interface EnrollmentAccess {
  title: string;
  description: string;
  href: string;
}

export const enrollment = {
  introduction:
    'Encuentra aquí una guía general y los documentos disponibles para Matrículas 2027.',
  audience:
    'Información para familias y apoderados interesados en el proceso de admisión y matrícula 2027 del Colegio Conquistadores.',
  steps: [
    {
      number: '01',
      title: 'Infórmate sobre el proceso',
      description:
        'Revisa la orientación general y los documentos disponibles para Matrículas 2027.',
    },
    {
      number: '02',
      title: 'Confirma tu caso con el colegio',
      description:
        'Consulta los requisitos, fechas, niveles, cupos y documentos que corresponden a tu familia.',
    },
    {
      number: '03',
      title: 'Sigue las indicaciones',
      description:
        'Realiza los trámites y entrega los documentos que el colegio te indique.',
    },
  ] satisfies EnrollmentStep[],
  accesses: [
    {
      title: 'Documentos disponibles',
      description: 'Consulta los documentos de Matrículas 2027 y revisa el año indicado en cada archivo.',
      href: '/documentos/#matriculas-admision-2027',
    },
    {
      title: 'Reglamentos',
      description: 'Consulta los reglamentos y las orientaciones de convivencia escolar.',
      href: '/documentos/#reglamentos',
    },
    {
      title: 'Información institucional',
      description: 'Conoce el proyecto educativo y otros documentos institucionales.',
      href: '/documentos/#documentos-institucionales',
    },
    {
      title: 'Plan lector',
      description: 'Consulta los planes de lectura de cada nivel.',
      href: '/documentos/#plan-lector',
    },
    {
      title: 'Contacto',
      description: `Teléfono ${site.phone.display} y ubicación del colegio en Coquimbo.`,
      href: '#contacto-matriculas',
    },
  ] satisfies EnrollmentAccess[],
} as const;
