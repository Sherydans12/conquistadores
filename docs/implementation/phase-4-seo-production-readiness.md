# Fase 4: SEO y preparación para producción

## Alcance

Esta fase incorpora controles versionados de calidad y prepara la transición sin
modificar Cloudflare, DNS, Coolify, VPS, WordPress, el dominio público ni la
configuración activa de producción. Tampoco activa redirecciones en Astro.

La entrega añade validación oficial de Astro/TypeScript, sitemap, robots por
entorno, canonicals coherentes, filtros compatibles con URL, inventarios de
rutas, archivos de importación para Cloudflare, validadores, presupuestos de
medios, CI y documentos internos de aprobación.

## Dependencias y comandos

Dependencias de desarrollo:

- `@astrojs/check` `^0.9.10`;
- `typescript` `^6.0.3`.

`npm run check` ejecuta `astro check`. `npm run validate` reúne actividades,
rutas, enlaces, SEO y assets. `npm run ci` ejecuta check, build y todos los
validadores sin importar ni materializar contenido.

## Entorno, canonical y Open Graph

`src/data/site-config.ts` es la fuente única para los hosts aprobados y la
resolución de entorno. Producción solo compila cuando se proporcionan
simultáneamente:

```text
SITE_ENV=production
SITE_URL=https://www.colegioconquistadores.com
```

Una variable desconocida, incompleta, inválida, con HTTP, ruta, query o un host
distinto falla a staging; si se pidió producción, el build falla explícitamente.
Staging usa canonicals del host staging y `noindex,nofollow`. Producción futura
usará exclusivamente `www`, `index,follow`, Open Graph y sitemap del mismo host.
La 404 siempre es `noindex,nofollow`.

## Sitemap y robots

`src/pages/sitemap.xml.ts` genera 55 URL absolutas:

- 8 rutas estables registradas en `src/data/public-routes.ts`;
- 47 actividades obtenidas directamente de la colección.

Las actividades incluyen `lastmod` solo cuando existe `modifiedDate`. No se
inventan fechas para páginas institucionales.

Se excluyen 404, robots, cuenta, recuperación, registro, notas, búsquedas,
filtros, parámetros, rutas heredadas, PDF, contenido en revisión y rutas
técnicas. En staging el sitemap existe para QA, pero `robots.txt` responde
`Disallow: /`. En producción futura responderá `Allow: /` y referenciará
`https://www.colegioconquistadores.com/sitemap.xml`.

## Filtros mediante URL

Actividades admite `year=2023|2024|2025` y `q`. Documentos admite `q`,
categorías tipadas, `year=2024|2025|2026` y
`status=current|historical|external`.

Los scripts leen `URLSearchParams`, aceptan solo opciones presentes en los
controles, ignoran y eliminan valores inválidos, inicializan controles, ejecutan
el primer filtro y normalizan la URL con `history.replaceState`. Nunca insertan
HTML desde parámetros ni hacen peticiones de red.

Todo el contenido continúa en el HTML inicial y es accesible sin JavaScript.
Los canonicals permanecen en el hub sin parámetros y los filtros se excluyen del
sitemap.

## Rutas públicas y heredadas

El registro público contiene `/`, cinco páginas institucionales (incluida
Matrículas 2026), Documentos y Actividades. Las 47 rutas dinámicas se derivan
de la colección.

`src/data/legacy-routes.ts` consolida 23 rutas reales del inventario:

- 6 rutas documentales;
- 7 rutas de categorías y paginación;
- 5 rutas de autor y paginación;
- 4 rutas sensibles;
- 1 artefacto de query del mega menú.

No existen dos fuentes de redirecciones y el registro no está conectado al
runtime.

## Redirecciones

Hay 18 propuestas exactas exportadas al CSV:

- 13 aprobadas por equivalencia: evaluaciones 2026, plan lector 2026, RICE 2026,
  categoría 2023 y sus tres paginaciones, Uncategorized, autor y sus cuatro
  paginaciones;
- 5 pendientes: protocolos, horarios 2025, Matrículas 2025 y categoría
  Actividades 2024 con su paginación.

Actividades 2024 permanece pendiente porque la categoría heredada también
contiene publicaciones 2025. Matrículas 2025 permanece pendiente por diferencias
documentales. La query del mega menú se documenta aparte y no está aprobada.

Los archivos `docs/deployment/cloudflare-redirects.csv` y
`cloudflare-redirect-rules.md` preparan importación, orden y pruebas, sin aplicar
reglas.

## Rutas sensibles

- `/mi-cuenta/`: `pending`, bloqueador.
- `/mi-cuenta/lost-password/`: `pending`, bloqueador.
- `/notas/`: `pending`, bloqueador crítico.
- `/registro/`: candidato `gone` 410, no aprobado.

No se construyeron formularios, contraseñas, endpoints ni páginas estáticas que
simulen autenticación. La salida debe ser un portal seguro, servicio externo,
subdominio dedicado o eliminación aprobada.

## Validadores

- `validate-site-routes.mjs`: 8 rutas, 47 actividades, HTML, 404, sitemap,
  robots, sensibilidad, colección y manifiesto; admite crawl con `--base-url`.
- `validate-internal-links.mjs`: enlaces, assets, anchors, navegación, portada y
  actividades; separa terceros y permite temporalmente solo los PDF bajo
  `wp-content/uploads` enlazados desde `/documentos/`.
- `validate-seo-output.mjs`: títulos, descripciones, canonical, H1, robots, OG,
  Twitter, idioma, JSON-LD y schemas esperados.
- `validate-asset-budget.mjs`: inventario y límites de fuentes, actividades,
  build, `_astro` y archivos individuales.

Los límites editoriales de título y descripción producen avisos, no fallos por
uno o dos caracteres.

## QA local y capturas

El crawl opcional confirmó 200 para las 55 rutas públicas, la presencia de la
404 y una respuesta 404 real para una ruta inexistente. El recorrido en
navegador validó las rutas prioritarias y las cuatro actividades de muestra.

Los filtros se comprobaron mediante carga inicial, cambios de control,
normalización de URL, limpieza y parámetros inválidos. Los canonicals
permanecieron sin query, staging mantuvo `noindex,nofollow`, el viewport móvil
no presentó desborde horizontal y la consola no registró errores ni avisos.

Las seis evidencias requeridas están en
`docs/implementation/screenshots/phase-4/`. El navegador integrado bloquea por
política la vista directa de XML; por eso `sitemap-response.png` y
`staging-robots.png` son evidencias legibles generadas desde las respuestas
locales HTTP 200 ya verificadas.

## Presupuesto de assets

Línea base validada:

- 870 imágenes fuente;
- `src/assets`: 77,3 MiB;
- actividades: 76,3 MiB;
- mayor fuente: 373,7 KiB;
- `dist`: 152,1 MiB;
- `dist/_astro`: 150,4 MiB;
- 2.662 variantes de imagen generadas;
- mayor asset generado: 396,0 KiB.

Se mantienen los límites solicitados: 1 MiB por fuente, 100 MiB para actividades,
125 MiB para fuentes, 250 MiB para `_astro` y 750 KiB por generado. No se
eliminaron galerías. La estrategia futura está en
`docs/architecture/media-storage-strategy.md`.

## GitHub Actions

`.github/workflows/ci.yml` se ejecuta en push a `main` y pull requests hacia
`main`, con Ubuntu, Node 22, caché npm, `npm ci` y `npm run ci`. Tiene permisos de
solo lectura y no contiene importación WordPress, materialización, crawls
externos, despliegues ni secretos.

## Bloqueadores

El sitio no está listo para producción. Permanecen:

- aprobación institucional de personal, fotografías, oferta y documentos;
- decisión segura para cuenta, recuperación y notas;
- actividad parcial del Kínder y MP4 de 30,8 MB;
- cinco redirecciones exactas y regla de mega menú pendientes;
- decisión de registro 410;
- analítica, privacidad y consentimiento.

El detalle operativo está en `docs/review/production-content-approval.md` y el
estado legible por máquinas en
`docs/deployment/production-readiness.json`.

## Trabajo posterior

1. Resolver bloqueadores con responsables institucionales.
2. Aprobar únicamente reglas con equivalencia confirmada.
3. Probar Cloudflare en modo desactivado o entorno controlado.
4. Ejecutar crawl comparativo de las 78 URL antes y después.
5. Definir portal sensible y flujo editorial.
6. Revisar almacenamiento de objetos antes de crecimiento sostenido.
7. Desplegar solo mediante una fase autorizada distinta.
