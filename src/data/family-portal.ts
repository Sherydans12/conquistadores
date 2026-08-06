export const familyPortal = {
  url: 'https://portal.edupay.baselogic.cl/',
  shortLabel: 'Portal de pagos',
  ctaLabel: 'Ingresar al portal',
  title: 'Pagos y certificados, en un solo lugar',
  description:
    'El portal oficial del Colegio Conquistadores permite a apoderados y familias realizar gestiones frecuentes de forma directa y segura.',
  services: [
    {
      icon: 'payment',
      title: 'Pagar mensualidades',
      body: 'Realiza el pago de mensualidades mediante Webpay Plus.',
    },
    {
      icon: 'student-certificate',
      title: 'Certificado de alumno regular',
      body: 'Descarga el certificado de alumno regular cuando lo necesites.',
    },
    {
      icon: 'debt-certificate',
      title: 'Certificado de deuda cero',
      body: 'Obtén el certificado de deuda cero disponible en el portal.',
    },
  ],
} as const;
