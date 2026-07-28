# Fase 3: archivo histórico de Actividades

## Alcance

Esta fase migra a Astro el archivo público de Actividades del Colegio
Conquistadores. Incluye `/actividades/`, las 47 rutas históricas fechadas, una
colección tipada, contenido editorial local, imágenes destacadas y galerías,
búsqueda y filtros en cliente, navegación entre publicaciones y SEO individual.

El build permanece estático. No consulta WordPress en el navegador ni durante
un build normal. Tampoco incorpora categorías heredadas, autor, comentarios,
cuenta, registro, notas, analytics, sitemap final, redirecciones de producción
ni publicación automática.

## Arquitectura

- `src/content.config.ts` define la colección `activities` mediante el loader
  `glob` compatible con Astro 7 y un esquema validado con Zod.
- `src/content/activities/{year}/{slug}.md` contiene cada entrada revisable en Git.
- `src/pages/[year]/[month]/[day]/[slug].astro` genera la URL histórica exacta
  mediante `getStaticPaths()`.
- `src/layouts/ActivityLayout.astro` concentra cabecera, contenido, imagen,
  galería, recursos externos, navegación, relacionados y datos estructurados.
- `src/pages/actividades/index.astro` presenta el archivo completo.
- `src/data/activities.ts` resuelve imágenes locales y concentra orden y fechas.
- `src/components/activities/` contiene las piezas propias del archivo.

El esquema exige `sourcePostId`, título, descripción, fechas, año, slug, ruta
histórica, URL heredada, imagen y alt, estado de revisión y calidad. Las
galerías y recursos externos también están tipados. Se comprueba además la
coherencia entre fecha, año, slug y ruta.

## Importación y limpieza

`npm run activities:import` consulta los endpoints REST públicos de WordPress,
pagina las 47 entradas, resuelve medios destacados, inspecciona los recursos
realmente usados y guarda una representación intermedia ignorada por Git en
`.cache/activity-import/`. No usa cookies, nonces ni autenticación y no
sobrescribe una caché existente sin `--overwrite-cache`.

`npm run activities:materialize` transforma esa caché en Markdown e imágenes
WebP. No sobrescribe el contenido curado sin `--overwrite-content`. El proceso:

1. excluye encabezado, pie, buscador, “Últimas actividades”, relacionados,
   formularios, estilos y scripts;
2. conserva párrafos, listas, enlaces y estructura editorial verificable;
3. resuelve originales usados por los sliders y descarta archivos de caché;
4. evita duplicar las tres imágenes que ya utilizaba la portada;
5. limita originales a 1600 px para destacadas y 1200 px para galería, sin
   agrandar imágenes pequeñas;
6. genera el manifiesto de migración y el reporte de revisión.

El HTML local de la tabla de Gala fue revisado y limitado a elementos
semánticos. No se usa `set:html` para cuerpo remoto.

## Resultado editorial y medios

- 47 actividades, entre el 3 de marzo de 2023 y el 6 de octubre de 2025.
- 46 entradas clasificadas como `full`: se recuperó todo el cuerpo editorial
  público identificado por el importador.
- 1 entrada `partial` y `needs-review`: “Visita del Kínder – Jardín
  Conquistadores”. Conserva texto, destacada y galería; se omitió el MP4
  heredado de 30,8 MB y requiere decisión editorial.
- 0 entradas clasificadas como `minimal`.
- 47 imágenes destacadas locales.
- 778 imágenes de galería vinculadas por uso público real.
- 825 recursos WebP únicos contando las destacadas.
- 80.018.598 bytes (76,3 MiB) de imágenes fuente locales.
- 382.680 bytes (373,7 KiB) para la imagen fuente individual más pesada.
- Astro generó 2.662 variantes WebP responsive en `dist/_astro` (150,3 MiB en
  conjunto; la mayor, 396 KiB). Cada página solo referencia sus propios
  recursos. Las imágenes bajo el pliegue usan carga diferida y reservan
  dimensiones.

Las tres destacadas de portada reutilizan sus archivos existentes y ahora
apuntan a rutas Astro locales. No quedan enlaces temporales de actividad a
WordPress en la portada.

Los alt generados describen la actividad y la posición dentro de su registro
fotográfico cuando la fuente no entregaba un alt público útil. Los captions
solo se conservan cuando existían en la fuente.

## Gala Raíz Folclórica 2025

La entrada conserva el texto editorial, una tabla con caption, encabezados y
10 presentaciones de curso, dentro de un contenedor con desplazamiento
horizontal propio. También conserva 11 enlaces públicos a Google Drive:
presentaciones de 1° a 8° Básico, 1° y 2° Medio, y la gala completa.

Los enlaces se identifican como externos, usan `noopener noreferrer` y no
crean iframes ni descargan videos automáticamente.

## Archivo, búsqueda y filtros

Las 47 publicaciones forman parte del HTML inicial y se agrupan por año con
`details`. Sin JavaScript pueden abrirse y recorrerse normalmente. Con
JavaScript, la búsqueda:

- ignora mayúsculas y acentos;
- combina texto y año;
- actualiza un contador con `aria-live`;
- muestra un estado vacío;
- limpia filtros;
- abre automáticamente los grupos con coincidencias;
- no hace peticiones de red.

El año se deriva de la fecha real de publicación, no de las categorías
inconsistentes de WordPress.

## SEO

Cada actividad tiene título, metadescripción factual, canonical de staging,
Open Graph, Twitter Card, imagen social, un H1, breadcrumb, fechas y JSON-LD
`Article`. El publisher es Colegio Conquistadores; no se publica el autor
genérico “administrador”. El archivo añade `CollectionPage`.

Staging mantiene `noindex,nofollow`. No se activaron canonical de producción,
redirecciones ni sitemap final.

## Rutas exactas

Además de `/actividades/`, se preservan:

- `/2023/03/03/una-calida-bienvenida/`
- `/2023/04/06/actividad-pascua-2/`
- `/2023/04/14/acto-natalicio-de-gabriela-mistral/`
- `/2023/04/19/vacuna-influenza/`
- `/2023/04/24/semana-del-dia-del-libro/`
- `/2023/05/03/taller-para-padres-y-apoderados/`
- `/2023/05/10/dia-del-alumno/`
- `/2023/05/15/mes-del-mar/`
- `/2023/05/22/salida-a-navegar/`
- `/2023/05/24/visita-al-centro-cultural-palace/`
- `/2023/06/09/talento-conquistadores/`
- `/2023/06/25/jardin-japones-de-serena/`
- `/2023/06/27/dia-canino-de-accion-y-aprendizaje-con-carabineros-en-nuestra-escuela/`
- `/2023/06/30/dia-nacional-del-bombero/`
- `/2023/07/01/despedida-del-primer-semestre/`
- `/2023/08/02/segundo-taller-para-padres-y-apoderados/`
- `/2023/08/09/visita-a-la-cruz-del-tercer-milenio/`
- `/2023/08/11/torneo-de-atletismo/`
- `/2023/08/18/visita-a-la-serena-zoo/`
- `/2023/08/19/dia-de-la-ninez/`
- `/2023/08/22/dia-de-la-ninez-2/`
- `/2023/09/13/obra-de-teatro-un-mundo-de-diferencias/`
- `/2023/10/11/acto-mes-de-octubre-encuentro-de-dos-mundos/`
- `/2023/10/16/visita-a-recinto-teleton/`
- `/2023/11/10/actividad-higiene-bucal/`
- `/2023/11/14/acto-mes-de-noviembre-derechos-de-los-ninos-y-ninas/`
- `/2023/11/17/visita-cementerio-ingles-de-guayacan/`
- `/2023/11/19/visita-al-jardin-japones-la-serena/`
- `/2023/11/20/expo-big-bang/`
- `/2023/11/22/dia-de-la-musica/`
- `/2023/11/23/visita-centro-cultural-mohamed-vi/`
- `/2023/11/23/mi-primera-experiencia-conquistadores/`
- `/2023/12/15/cierre-de-aniversario-conquistadores/`
- `/2023/12/28/bienvenida-a-estudiantes-2024/`
- `/2024/04/13/visita-biblioteca-gabriela-mistral/`
- `/2024/04/23/dia-de-libro/`
- `/2024/05/10/dia-del-estudiante/`
- `/2024/05/17/english-day-conquistaloza/`
- `/2024/05/27/glorias-navales/`
- `/2024/07/20/jornada-deportiva/`
- `/2024/07/22/encuentro-amistoso-de-voleibol/`
- `/2024/07/23/acto-pueblos-originarios/`
- `/2024/08/30/visita-del-kinder-jardin-conquistadores/`
- `/2024/10/04/campana-teleton-2024/`
- `/2025/05/19/dia-de-la-familia-2025/`
- `/2025/09/29/gala-raiz-folclorica-2025/`
- `/2025/10/06/colegio-conquistadores-lleva-su-innovacion-a-la-world-robot-olympiad-chile/`

`docs/implementation/activity-migration-manifest.json` registra la relación
exacta entre post ID, URL heredada, ruta Astro, calidad, revisión, imágenes y
recursos externos.

## Validación y QA

- `npm run build`: correcto; genera 56 páginas HTML, incluido el hub y las 47
  rutas estáticas.
- `npm run activities:validate-routes`: correcto; compara los 47 documentos con
  `url-inventory.md`, comprueba unicidad, fechas, slugs y existencia de imágenes.
- `npm run activities:validate`: correcto; revisa el contenido limpio, los HTML
  de `dist/`, un H1, `noindex,nofollow`, enlaces locales de portada y manifiesto.
- El validador admite crawl con
  `node scripts/validate-activity-routes.mjs --base-url=http://localhost:4321`.
- El crawl local comprobó HTTP 200 en `/actividades/` y las 47 rutas.
- Se revisaron 360, 390, 768, 1024 y 1440 px sin overflow horizontal de página.
- Búsqueda, combinación por año, contador, limpieza y estado vacío funcionan
  sin red; “robot” devuelve una actividad y 2024 devuelve diez.
- La navegación móvil abre, bloquea el fondo, marca Actividades, cierra con
  Escape y restaura el foco.
- Gala presenta 10 filas de datos, caption, 11 enlaces Drive y scroll interno
  de tabla en móvil.
- La consola del navegador no registró errores ni advertencias durante la
  muestra revisada.

La evidencia visual se guarda en
`docs/implementation/screenshots/phase-3/`.

## Fuente editorial futura

### Opción A: WordPress headless en build-time

WordPress puede mantenerse como editor privado. Un importador normaliza cada
publicación a contenido local o snapshot y un webhook seguro dispara el
despliegue. El navegador nunca consulta REST.

### Opción B: edición en Git

Cada actividad nueva se crea como Markdown, las imágenes se optimizan y el
cambio se revisa mediante pull request antes del despliegue automático.

No se implementó webhook ni automatización de publicación en esta fase.

## Limitaciones y trabajo pendiente

- La entrada del Kínder conserva una migración parcial por el video omitido.
- La calidad de una migración indica el contenido público recuperado, no la
  vigencia institucional de la actividad.
- Los 11 videos de Gala siguen dependiendo de permisos y disponibilidad en
  Google Drive.
- El repositorio crece 76,3 MiB en fuentes WebP para conservar las galerías
  usadas; conviene evaluar almacenamiento de objetos antes de un crecimiento
  editorial sostenido.
- No se instaló `@astrojs/check` ni TypeScript porque no forman parte de las
  dependencias del proyecto.
- Quedan pendientes categorías, autor, paginaciones, redirecciones, sitemap
  final, dominio principal, cuenta, registro, notas, analytics y fuente
  editorial futura.
