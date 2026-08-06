export interface NavigationItem {
  label: string;
  href: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Actividades', href: '/actividades/' },
  { label: 'Personal', href: '/personal/' },
  { label: 'Talleres', href: '/talleres/' },
  { label: 'Academias', href: '/academias/' },
  { label: 'Documentos', href: '/documentos/' },
];

export const secondaryNavigation: NavigationItem[] = [
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Actividades', href: '/actividades/' },
  { label: 'Talleres', href: '/talleres/' },
  { label: 'Academias', href: '/academias/' },
];

export const documentHubNavigation: NavigationItem[] = [
  { label: 'Centro de documentos', href: '/documentos/' },
  {
    label: 'Evaluaciones 2026',
    href: '/documentos/#evaluaciones-2026',
  },
  { label: 'Plan lector 2026', href: '/documentos/#plan-lector' },
  { label: 'Reglamentos', href: '/documentos/#reglamentos' },
];

export const enrollmentCta: NavigationItem = {
  label: 'Matrículas 2027',
  href: '/matriculas-2027/',
};
