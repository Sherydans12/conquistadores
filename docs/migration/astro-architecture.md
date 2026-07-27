# Propuesta de arquitectura Astro

## Restricciones y base comprobada

- Astro 7.1.4.
- Node declarado en `package.json`: `>=22 <23`.
- El lockfile declara `>=22.12.0`; conviene alinear ambos requisitos en una tarea posterior.
- TypeScript extiende `astro/tsconfigs/strict`.
- `output: 'static'`.
- Sitio configurado: `https://staging.colegioconquistadores.com`.
- No se necesitan React, Vue, Svelte, Tailwind ni librerías visuales.
- Esta auditoría no modifica la estructura ni `src/pages/index.astro`.

## Estructura propuesta

```text
src/
  components/
    Header.astro
    MobileNav.astro
    Footer.astro
    Hero.astro
    AnnouncementBar.astro
    ActivityCard.astro
    ActivityGrid.astro
    DownloadCard.astro
    StaffCard.astro
    Gallery.astro
    LazyEmbed.astro
    SeoHead.astro
  layouts/
    BaseLayout.astro
    PageLayout.astro
    ActivityLayout.astro
  pages/
    index.astro
    quienes-somos.astro
    actividades/
      index.astro
      [...page].astro
    personal.astro
    talleres.astro
    academias.astro
    documentos.astro
    protocolos-internos.astro
    matriculas-2026.astro
    plan-lector-2026.astro
    calendario-de-evaluaciones-2026.astro
    reglamento-interno-de-convivencia-escolar.astro
    [...historicalRoutes].astro
  styles/
    tokens.css
    global.css
    utilities.css
  data/
    navigation.ts
    site.ts
    staff.ts
    downloads.ts
    redirects.ts
  content/
    activities/
  content.config.ts
public/
  images/
    brand/
    pages/
    activities/
  documents/
```

La estructura es una propuesta; no debe crearse hasta aprobar el modelo de contenido.

## 1. Contenido estable en Astro

Debe vivir como componentes/datos versionados:

- Inicio.
- Historia, misión, visión y valores.
- Talleres y academias.
- Personal.
- Navegación, footer y contacto.
- Portal informativo de Matrículas 2026.
- Plan Lector, Evaluaciones, Documentos, Protocolos y Reglamento.
- Metadatos SEO, organización y schema.

Usar TypeScript para listas repetibles (`staff.ts`, `downloads.ts`) y Markdown/MDX solo cuando el contenido editorial lo justifique. No colocar grandes bloques HTML de Elementor.

## 2. Noticias y contenido que podría seguir en WordPress

Hay 47 entradas históricas y una necesidad editorial potencial.

Opción recomendada por defecto:

- Migrar las 47 entradas a una colección Astro tipada.
- Conservar slugs y fechas históricas.
- Crear un importador reproducible desde REST que extraiga cuerpo, featured media y categorías.
- Revisar manualmente el HTML limpio antes de aceptar cada lote.

Opción híbrida si el colegio necesita seguir publicando sin Git:

- WordPress queda como CMS headless temporal.
- Astro consulta REST durante el build.
- Se cachea una representación normalizada.
- Un webhook seguro dispara rebuild.
- El frontend nunca solicita HTML Elementor en tiempo de ejecución.

`src/content.config.ts` sí conviene si se migra el archivo de actividades, porque aporta esquema de fecha, título, descripción, categoría, imagen, alt, canonical heredado y estado de revisión.

## 3. Medios a migrar

- 189 imágenes locales realmente usadas.
- 73 PDF locales.
- 1 MP4 local.
- Favicons/logo.

Proceso:

1. Relacionar cada recurso con página/entrada desde [media-inventory.csv](media-inventory.csv).
2. Elegir originales, no cachés de Smart Slider.
3. Optimizar imágenes y generar tamaños responsivos.
4. Completar textos alternativos.
5. Copiar documentos a una ruta estable o mantener el origen temporal.
6. Crear 301 exactos si cambia cualquier URL.

Para imágenes de contenido puede usarse `src/assets/` con el pipeline de Astro; para archivos que deben conservar URL exacta, `public/images/` y `public/documents/` resultan más predecibles.

## 4. Archivos que pueden quedar temporalmente en WordPress

- PDF cuya vigencia no haya sido confirmada.
- Videos/galerías históricas todavía no optimizados.
- Medios antiguos referenciados por enlaces externos.
- WordPress como fuente editorial, solo durante la transición.

No hacer proxy silencioso. Documentar cada recurso temporal y su fecha de retirada.

## 5. Servicios externos o endpoint propio

| Necesidad | solución |
|---|---|
| Notas/portal de estudiantes | proveedor académico o aplicación autenticada independiente |
| Cuenta/recuperación | proveedor de identidad; eliminar si no hay caso de uso |
| Búsqueda | índice estático generado en build y JS vanilla/Pagefind |
| Instagram | enlaces simples o caché build-time con fallback |
| YouTube/Maps | componente de carga diferida bajo interacción/consentimiento |
| Drive | conservar enlaces mientras se confirman permisos; migrar si se aprueba |
| Analítica | proveedor y consentimiento definidos explícitamente |
| Formularios futuros | servicio externo o endpoint propio con validación, rate limit y antispam |

## Componentes y responsabilidades

- `BaseLayout`: idioma `es`, head, canonical, OG, schema, skip link, header/footer.
- `Header`/`MobileNav`: navegación declarativa desde `navigation.ts`.
- `SeoHead`: contrato tipado; no permitir páginas indexables sin título/description.
- `ActivityLayout`: H1, fecha, categoría, imagen/alt, cuerpo y relacionados.
- `DownloadCard`: nombre, año, tipo, tamaño, URL y estado de vigencia.
- `Gallery`: figuras, captions, lazy loading y diálogo opcional accesible.
- `LazyEmbed`: thumbnail, consentimiento y alternativa de enlace.

## CSS

- Tokens de color, tipografía, espacios, radios y sombras en `tokens.css`.
- Mobile first.
- Montserrat autoalojada solo si la licencia y archivos se verifican; si no, usar una alternativa de sistema.
- Sin Tailwind.
- Sin icon font: SVG accesibles locales.
- `prefers-reduced-motion`, foco visible y contraste AA.

## Rutas

- Crear archivos explícitos para páginas estables.
- Generar las 47 actividades desde la colección manteniendo `/YYYY/MM/DD/slug/`.
- Evitar un catch-all opaco salvo para una tabla de rutas históricas muy controlada.
- Centralizar redirecciones en `src/data/redirects.ts` y en la capa de hosting, con pruebas.

## Build y despliegue

- Build estático reproducible.
- Validación de tipos y enlaces antes de publicar.
- Prueba de rutas y redirects contra [url-inventory.md](url-inventory.md).
- Sitemap/robots generados.
- Staging con `noindex`/protección a nivel de entorno hasta aprobar.
- No cambiar DNS, Cloudflare, Coolify o VPS como parte de la implementación inicial.

## Fases

1. Fundaciones: tokens, layout, SEO, navegación, footer.
2. Páginas institucionales y portada.
3. Documentos/portal 2026.
4. Colección de actividades y rutas históricas.
5. Medios, galerías y embeds.
6. Búsqueda y servicios externos.
7. Paridad, accesibilidad, rendimiento, SEO y redirecciones.
8. Publicación controlada y monitorización.
