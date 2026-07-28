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
    'Esta página reúne orientación general y accesos públicos para el proceso 2026. Antes de realizar un trámite, confirma con el colegio los requisitos y documentos que correspondan a tu situación.',
  audience:
    'Familias y apoderados que buscan información pública sobre admisión y matrícula 2026 del Colegio Conquistadores.',
  steps: [
    {
      number: '01',
      title: 'Revisa la información pública',
      description:
        'Consulta los documentos 2026 disponibles en el centro documental y evita utilizar versiones identificadas como históricas.',
    },
    {
      number: '02',
      title: 'Confirma el procedimiento',
      description:
        'Contacta directamente al colegio para validar requisitos, fechas, niveles y la documentación que debes presentar.',
    },
    {
      number: '03',
      title: 'Presenta los antecedentes indicados',
      description:
        'Entrega únicamente los documentos que el establecimiento confirme para el proceso. La publicación de esta página no implica disponibilidad de cupos.',
    },
  ] satisfies EnrollmentStep[],
  accesses: [
    {
      title: 'Listas de útiles 2026',
      description: 'Documentos organizados por curso en el centro documental.',
      href: '/documentos/#matriculas-admision',
    },
    {
      title: 'Plan lector 2026',
      description: 'Planes de lectura publicados para los distintos niveles.',
      href: '/documentos/#plan-lector',
    },
    {
      title: 'Documentos de matrícula',
      description: 'Accesos institucionales y de admisión disponibles para 2026.',
      href: '/documentos/#documentos-institucionales',
    },
    {
      title: 'Reglamentos',
      description: 'Reglamentos y documentos de convivencia publicados.',
      href: '/documentos/#reglamentos',
    },
    {
      title: 'Contacto',
      description: `Teléfono ${site.phone.display} y ubicación del colegio en Coquimbo.`,
      href: '#contacto-matriculas',
    },
  ] satisfies EnrollmentAccess[],
} as const;
