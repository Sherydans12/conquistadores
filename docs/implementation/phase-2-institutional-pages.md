# Fase 2: páginas institucionales y Matrículas 2026

## Alcance

Esta fase crea cinco páginas interiores estáticas, una página 404 propia y la
arquitectura compartida necesaria para ampliar el sitio:

- `/quienes-somos/`
- `/personal/`
- `/talleres/`
- `/academias/`
- `/matriculas-2026/`
- `/404.html`

No se implementaron Actividades, las 47 entradas históricas, cuenta, registro,
notas, redirecciones, sitemap final, WordPress headless, administración ni una
migración completa de PDF.

## Layout y componentes compartidos

`src/layouts/PageLayout.astro` extiende `BaseLayout.astro` y centraliza hero,
breadcrumbs, SEO, ancho, espaciado, CTA opcional y JSON-LD de página y
`BreadcrumbList`.

Componentes creados:

- `PageHero.astro`
- `Breadcrumbs.astro`
- `StaffCard.astro`
- `ProgramCard.astro`
- `Gallery.astro`
- `EnrollmentCard.astro`
- `Callout.astro`

Las galerías son grillas semánticas con `figure`, `figcaption`, imágenes
responsive y carga diferida. No se usa slider, autoplay, lightbox o librería de
galería.

## Datos importados

- `src/data/institutional.ts`: historia, misión, visión, valores y enfoque.
- `src/data/staff.ts`: 33 personas visibles, seis áreas y metadatos de revisión.
- `src/data/workshops.ts`: música, motricidad y Mundo de Saberes.
- `src/data/academies.ts`: fútbol, baile, teatro, Conquistarte y yoga.
- `src/data/enrollment.ts`: orientación general, pasos prudentes y accesos al
  centro documental.

El contenido deriva de información públicamente visible y de los inventarios
levantados el 27 de julio de 2026. Que una persona, taller o academia siga
publicada no se presenta como confirmación de vigencia institucional.

## Imágenes utilizadas

Se incorporaron 40 WebP locales:

- 33 retratos vinculados a las 33 personas visibles;
- 3 imágenes de talleres;
- 4 imágenes de academias.

Los archivos viven en:

- `src/assets/images/staff/`
- `src/assets/images/programs/`

Se consolidaron las variantes originales inventariadas cuando estaban
disponibles. Las imágenes antiguas que solo existían como recortes de 150 × 150
se conservaron en su resolución publicada, sin escalarlas artificialmente. La
academia de yoga usa el fallback institucional porque la página pública no
presentó una imagen propia verificable. Ningún archivo optimizado supera 1 MB.

## Fuentes públicas

- `https://www.colegioconquistadores.com/quienes-somos/`
- `https://www.colegioconquistadores.com/personal/`
- `https://www.colegioconquistadores.com/talleres/`
- `https://www.colegioconquistadores.com/academias/`
- `https://www.colegioconquistadores.com/matriculas-2026/`
- inventarios y auditorías de `docs/migration/`
- capturas históricas de escritorio y móvil

No se copió HTML de Elementor. Se extrajeron textos editoriales, nombres,
cargos, relaciones de medios y datos de contacto públicos.

## Datos marcados para revisión

`needsReview: true` identifica ocho fichas de personal por diferencias entre el
texto visible y el nombre del archivo, o por ambigüedad de nombre/cargo:

- Arturo Galleguillos
- Elza Días
- Katherine Fuenzalida
- Paola Contreras
- Helen Gonzales
- Silvianne Cabello
- Carla Flores
- Joselyn Gonzáles

La academia de yoga también queda marcada para revisión porque no tenía una
imagen pública propia y su disponibilidad actual no está confirmada.

Las marcas son internas y no publican observaciones sobre personas. La página
avisa de forma general que la nómina requiere validación institucional antes de
producción.

## Matrículas y documentos

`/matriculas-2026/` es una página de orientación y no duplica las 11 listas de
útiles ni los 11 planes lectores. Los accesos llevan a anclas existentes de
`/documentos/`:

- `/documentos/#matriculas-admision`
- `/documentos/#plan-lector`
- `/documentos/#documentos-institucionales`
- `/documentos/#reglamentos`

La ficha de matrícula rotulada como 2026 en WordPress enlazaba a un PDF 2025 y
no se publicó como documento vigente. Tampoco se afirma disponibilidad de cupos.

## Enlaces temporales

Las páginas institucionales nuevas no dependen de WordPress en el navegador.
`sourceUrl` se conserva solo como procedencia interna en los datos de personal.

El centro documental mantiene temporalmente sus enlaces externos ya
documentados hacia archivos de WordPress. Esta fase no los duplica ni modifica.
Google Maps se abre como servicio externo identificado.

## Decisiones visuales

- continuidad del azul, dorado, escudo y tipografía del sistema aprobado;
- hero interior consistente con breadcrumb y H1 único;
- tarjetas 2026 como referencia de superficies y bordes;
- imágenes con overlay para preservar contraste;
- navegación de áreas y dos columnas móviles para reducir la longitud de
  Personal;
- grillas estáticas para talleres y academias;
- página 404 con accesos a Inicio, Documentos y Matrículas.

## Navegación y SEO

La navegación declarativa añade Talleres y Academias y conserva un único enlace
directo a Documentos. Escritorio y móvil aplican `aria-current="page"`.

Cada página tiene título, descripción, canonical de staging, Open Graph,
Twitter Card, un H1 y breadcrumbs. Staging mantiene `noindex,nofollow`. Quiénes
somos usa `AboutPage`; las demás páginas interiores usan `WebPage`. No se creó
schema de personas.

## QA y evidencia

Capturas guardadas en `docs/implementation/screenshots/phase-2/`:

- `desktop-quienes-somos.png`
- `mobile-quienes-somos.png`
- `desktop-personal.png`
- `mobile-personal.png`
- `desktop-talleres.png`
- `mobile-talleres.png`
- `desktop-academias.png`
- `mobile-academias.png`
- `desktop-matriculas.png`
- `mobile-matriculas.png`
- `mobile-navigation.png`
- `not-found.png`

Comprobaciones:

- 200 en las cinco rutas y Documentos;
- 404 real para una ruta inexistente, usando la página propia;
- un H1 por página;
- sin overflow en 360, 390, 768, 1024 y 1440 px;
- cero imágenes rotas o sin texto alternativo en las páginas revisadas;
- menú móvil abre, bloquea scroll, cierra con Escape y restaura foco;
- `aria-current` activo en navegación;
- enlaces externos con `target`, `noopener` e identificación;
- consola sin errores ni advertencias;
- todos los datos y grupos permanecen en el HTML;
- sin `fetch()` ni consultas `wp-json` en el navegador;
- `npm run build` correcto;
- `git diff --check` correcto.

## Limitaciones

- `@astrojs/check` y `typescript` no forman parte de las dependencias y no se
  añadieron solo para esta fase.
- La nómina, talleres y academias requieren confirmación institucional antes de
  producción.
- Algunos retratos de origen solo estaban disponibles a 150 × 150.
- No hay información pública verificada sobre horarios, edades, cupos,
  profesores responsables o inscripción de talleres y academias.
- La página pública de Matrículas 2026 no describe un proceso formal completo;
  la nueva página organiza orientación conservadora y deriva la confirmación al
  colegio.
- Los PDF siguen centralizados y temporalmente alojados fuera de staging.

## Rutas todavía pendientes

- `/actividades/`
- 47 rutas históricas de entradas
- `/calendario-de-evaluaciones-2026/`
- `/plan-lector-2026/`
- `/protocolos-internos/`
- `/reglamento-interno-de-convivencia-escolar/`
- `/registro/`
- `/mi-cuenta/`
- `/notas/`

## Tareas siguientes

- validar institucionalmente nómina y oferta extracurricular;
- definir el portal seguro para cuenta/notas;
- migrar Actividades conservando sus 47 rutas;
- revisar equivalencia antes de activar redirecciones;
- definir fuente editorial futura;
- preparar sitemap y crawl final cuando exista paridad;
- revisar despliegue de staging sin cambiar producción.
