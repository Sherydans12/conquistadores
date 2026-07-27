export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  temporaryLegacy?: boolean;
  children?: NavigationItem[];
}

const legacyBaseUrl = 'https://www.colegioconquistadores.com';

export const documentNavigation: NavigationItem[] = [
  { label: 'Plan Lector 2026', href: '/plan-lector-2026/' },
  { label: 'Protocolos internos', href: '/protocolos-internos/' },
  {
    label: 'Reglamento de convivencia',
    href: '/reglamento-interno-de-convivencia-escolar/',
  },
  { label: 'Documentos', href: '/documentos/' },
  {
    label: 'PISE 2024',
    href: `${legacyBaseUrl}/wp-content/uploads/2023/12/PLAN-INTEGRAL-DE-SEGURIDAD-ESCOLAR-COLEGIO-CONQUISTADORES-2024.pdf`,
    external: true,
    temporaryLegacy: true,
  },
  {
    label: 'Carta Ley TEA',
    href: `${legacyBaseUrl}/wp-content/uploads/2024/09/CARTA-LEY-TEA-COLEGIO-CONQUISTADORES.pdf`,
    external: true,
    temporaryLegacy: true,
  },
  {
    label: 'Certificados de Estudios',
    href: 'https://certificados.mineduc.cl/mvc/home/index',
    external: true,
  },
];

export const primaryNavigation: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Evaluaciones 2026',
    href: '/calendario-de-evaluaciones-2026/',
  },
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Actividades', href: '/actividades/' },
  { label: 'Personal', href: '/personal/' },
  {
    label: 'Documentos',
    href: '/documentos/',
    children: documentNavigation,
  },
];

export const secondaryNavigation: NavigationItem[] = [
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Actividades', href: '/actividades/' },
  { label: 'Talleres', href: '/talleres/' },
  { label: 'Academias', href: '/academias/' },
];

export const enrollmentCta: NavigationItem = {
  label: 'Matrículas 2026',
  href: '/matriculas-2026/',
};
