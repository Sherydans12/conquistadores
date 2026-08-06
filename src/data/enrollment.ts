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
    'Esta página reúne orientación general y accesos públicos para el proceso 2027. Antes de realizar un trámite, confirma con el colegio los requisitos, fechas y documentos que correspondan a tu situación.',
  audience:
    'Familias y apoderados que buscan información pública sobre admisión y matrícula 2027 del Colegio Conquistadores.',
  steps: [
    {
      number: '01',
      title: 'Revisa la información pública',
      description:
        'Consulta la orientación disponible y revisa el año y la vigencia indicados en cada documento público.',
    },
    {
      number: '02',
      title: 'Confirma el procedimiento',
      description:
        'Contacta directamente al colegio para validar requisitos, fechas, niveles y la documentación que debes presentar.',
    },
    {
      number: '03',
      title: 'Sigue las indicaciones confirmadas',
      description:
        'Realiza únicamente los trámites y entrega los documentos que el establecimiento confirme. La publicación de esta página no implica disponibilidad de cupos.',
    },
  ] satisfies EnrollmentStep[],
  accesses: [
    {
      title: 'Documentos disponibles',
      description: 'Consulta los archivos públicos e identifica el año indicado en cada uno.',
      href: '/documentos/#matriculas-admision-2027',
    },
    {
      title: 'Reglamentos',
      description: 'Revisa los reglamentos y documentos de convivencia publicados.',
      href: '/documentos/#reglamentos',
    },
    {
      title: 'Información institucional',
      description: 'Accede a los documentos institucionales disponibles públicamente.',
      href: '/documentos/#documentos-institucionales',
    },
    {
      title: 'Plan lector',
      description: 'Consulta los planes de lectura publicados para los distintos niveles.',
      href: '/documentos/#plan-lector',
    },
    {
      title: 'Contacto',
      description: `Teléfono ${site.phone.display} y ubicación del colegio en Coquimbo.`,
      href: '#contacto-matriculas',
    },
  ] satisfies EnrollmentAccess[],
} as const;
