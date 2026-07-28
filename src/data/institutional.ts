export interface InstitutionalValue {
  id: string;
  title: string;
  description: string;
}

export const institutional = {
  introduction:
    'Colegio Conquistadores es una comunidad educativa particular de Coquimbo que declara una propuesta integral e inclusiva, orientada a generar aprendizajes alegres y efectivos.',
  history: [
    'El Colegio Conquistadores fue fundado en 2018 por el profesor Arturo Galleguillos Trigo, licenciado en Educación y magíster en Mediación.',
    'La información institucional publicada señala que el colegio comenzó con cursos de 1° a 3° básico y posteriormente amplió su oferta a educación básica completa. La misma fuente expresa el propósito de avanzar hasta 4° medio.',
  ],
  mission:
    'Entregar a nuestros educandos una educación integral e inclusiva, desarrollando habilidades cognitivas, afectivas, artísticas y deportivas dentro de un clima de alegría y respeto, permitiéndoles ser agentes de cambio positivo hacia la sociedad.',
  vision:
    'Lograr ser una institución educativa generadora de oportunidades que forme personas integrales, con sólidos valores y capacidades académicas, con el propósito de aportar a la construcción de una sociedad con valores humanamente trascendentes.',
  educationalApproach: [
    {
      title: 'Aprendizaje integral',
      description:
        'La propuesta institucional reúne dimensiones cognitivas, afectivas, artísticas y deportivas.',
    },
    {
      title: 'Inclusión y diversidad',
      description:
        'El enfoque publicado reconoce la diversidad y las capacidades de cada estudiante como parte del aprendizaje.',
    },
    {
      title: 'Alegría y respeto',
      description:
        'El lema “Aprender con alegría” se vincula con un clima educativo de respeto, confianza y participación.',
    },
    {
      title: 'Metodologías activas',
      description:
        'La historia institucional destaca el uso de experiencias lúdicas para promover aprendizajes significativos.',
    },
  ],
} as const;

export const institutionalValues: InstitutionalValue[] = [
  {
    id: 'respeto',
    title: 'Respeto',
    description:
      'Por uno mismo y los demás, por sus sentimientos, ideas, proyectos y creencias; por la comunidad escolar, las culturas que coexisten y el ambiente que nos sostiene.',
  },
  {
    id: 'innovacion',
    title: 'Innovación',
    description:
      'El conocimiento científico, tecnológico, humanista y artístico ofrece bases para aprender con creatividad a lo largo de la vida.',
  },
  {
    id: 'solidaridad',
    title: 'Solidaridad',
    description:
      'El aprendizaje adquiere sentido al compartirse con otros mediante la convivencia, la colaboración y la cooperación.',
  },
  {
    id: 'compromiso',
    title: 'Compromiso',
    description:
      'El aprendizaje se transforma en valores que sostienen el cumplimiento de metas y la búsqueda de la excelencia personal y profesional.',
  },
];
