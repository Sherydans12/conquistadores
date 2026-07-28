# Plan de migración SEO

## Avance de Fase 4

La preparación versionada ya incluye sitemap Astro de 55 URL públicas,
`robots.txt` seguro por entorno, canonicals coherentes, filtros URL, inventario
central de 23 rutas heredadas, 18 propuestas exactas de redirección, validadores
SEO/enlaces/rutas/assets y CI. Ninguna regla se ha activado. Cinco redirecciones,
la query del mega menú y los flujos sensibles continúan pendientes de
aprobación; por ello el sitio no está listo para producción.

## Estado actual

- 78 URLs públicas relevantes documentadas en [url-inventory.md](url-inventory.md).
- 68 URLs en el índice de sitemap Yoast.
- `sitemap.xml` responde 404; `sitemap_index.xml` responde 200.
- Las 68 URLs del sitemap tienen título y canonical.
- 60 de 68 no contienen H1.
- 54 de 68 no tienen una metadescripción no vacía.
- 5 de 68 no tienen `og:description`.
- 15 de 68 no tienen `og:image`.
- Ninguna de las 68 está marcada `noindex`.
- Cuenta, recuperación, registro, notas protegidas, autor, categorías y el artefacto de mega menú son indexables.
- Yoast genera schema con combinaciones de `WebPage`, `Article`, `CollectionPage`, `ProfilePage`, `WebSite`, `Organization`, `Person`, `BreadcrumbList` e `ImageObject`.

## Host y protocolo

Conservar como origen canónico:

`https://www.colegioconquistadores.com`

Redirecciones actuales que deben mantenerse en una sola etapa:

| Origen | Destino |
|---|---|
| `http://colegioconquistadores.com/*` | `https://www.colegioconquistadores.com/*` |
| `https://colegioconquistadores.com/*` | `https://www.colegioconquistadores.com/*` |
| `http://www.colegioconquistadores.com/*` | `https://www.colegioconquistadores.com/*` |
| rutas sin slash | versión equivalente con slash |

No cambiar el host canónico al subdominio staging.

## URLs que deben conservarse exactamente

Prioridad absoluta:

- `/`
- `/quienes-somos/`
- `/actividades/`
- `/personal/`
- `/talleres/`
- `/academias/`
- `/documentos/`
- `/protocolos-internos/`
- `/matriculas-2026/`
- `/plan-lector-2026/`
- `/calendario-de-evaluaciones-2026/`
- `/reglamento-interno-de-convivencia-escolar/`
- Las 47 rutas de entradas con fecha.
- Las 73 URLs de PDF, salvo que exista una redirección 301 exacta y comprobada.

La lista exhaustiva está en [url-inventory.md](url-inventory.md).

## Duplicación y consolidación

| Grupo | Problema | propuesta |
|---|---|---|
| `/actividades/`, categorías y autor | mismos extractos en varios archivos | mantener `/actividades/` como hub; decidir filtros estáticos o 301 desde archivos |
| `/category/uncategorized/` | archivo genérico con tres entradas | reclasificar entradas y 301 al hub/categoría correcta |
| `/author/administrador/` y páginas 2-5 | poco valor, duplicación | 301 a `/actividades/` o `noindex,follow` temporal |
| `?wpr_mega_menu=...` | artefacto técnico en sitemap | retirar del sitemap y 301 a `/` o devolver 410 si se confirma que no tiene enlaces externos |
| `/matriculas-2025/` y `/matriculas-2026/` | solapamiento y copy incoherente | validar documentos; después 301 de 2025 a 2026 |
| `/mi-cuenta/lost-password/` | canonical a `/mi-cuenta/` | mantener solo si existe portal; de lo contrario retirar y noindex |
| `/2023/08/22/dia-de-la-ninez-2/` | slug no coincide con Natalicio Bernardo O’Higgins | conservar la URL histórica; corregir solo título/contenido |

No fusionar entradas con títulos parecidos sin comparar contenido y enlaces entrantes.

## Redirecciones 301 propuestas

Propuestas que requieren aprobación antes de implementarse:

| Origen | Destino | condición |
|---|---|---|
| `/?wpr_mega_menu=wpr-mega-menu-item-4795` | `/` | confirmar que es solo artefacto |
| `/matriculas-2025/` | `/matriculas-2026/` | confirmar vigencia y equivalencia de documentos |
| `/author/administrador/` y `/page/2-5/` | `/actividades/` | si no se recrea el archivo |
| `/category/uncategorized/` | `/actividades/` | tras reclasificar |
| archivos de categorías | `/actividades/` o filtros equivalentes | si se consolida el archivo |
| `/registro/` | portal o página informativa aprobada | no redirigir a ciegas |
| `/mi-cuenta/`, recuperación y `/notas/` | portal seguro aprobado | nunca a una página estática que simule autenticación |

Generar una tabla de redirecciones versionada y probar cada origen con `curl -I` antes del cambio de DNS.

## Títulos y metadescripciones

- Conservar los títulos reconocibles y corregir faltas de ortografía/año.
- Usar un H1 único por página.
- Mantener títulos SEO de aproximadamente 50-60 caracteres cuando sea posible.
- Redactar metadescripciones únicas de 140-160 caracteres para las 54 URLs sin descripción.
- En actividades, resumir el cuerpo real; no usar módulos globales de “últimas actividades”.
- Evitar títulos de archivo “Uncategorized archivos” y “administrador, autor”.

## Canonicals

- Canonical absoluto y autocanónico en todas las páginas indexables.
- Canonical del host `www` y HTTPS.
- Los filtros o búsqueda interna deben ser `noindex` o canonicalizar al hub, según implementación.
- No canonicalizar una página 2025 a 2026 si su contenido/documentos todavía difieren; usar 301 solo cuando haya equivalencia.

## Open Graph y social

Para cada página indexable:

- `og:title`, `og:description`, `og:url`, `og:type`.
- `og:image` de al menos 1200 × 630 px con texto alternativo.
- `twitter:card=summary_large_image`.
- Imagen por defecto institucional para las 15 páginas que no tienen `og:image`.
- Imagen destacada propia para cada actividad.

## Favicon

El sitio actual usa variantes recortadas de `Logo-1` en 32, 180, 192 y 270 px. El proyecto Astro todavía usa favicons de plantilla. Crear un set optimizado y consistente:

- SVG simplificado cuando sea legible.
- ICO/PNG 32 px.
- Apple touch icon 180 px.
- Web app icon 192/512 si se necesita.

## Datos estructurados

Implementar JSON-LD deliberado:

- `EducationalOrganization` para el colegio.
- `WebSite` en la portada.
- `BreadcrumbList` en páginas internas.
- `Article` para actividades.
- Datos de organización: nombre, URL, logo, teléfono, dirección y redes verificadas.

No copiar todo el grafo Yoast. Validar con Rich Results Test y Schema Validator.

## Sitemap

- Generar un sitemap estático desde rutas Astro.
- Incluir solo canonicals 200 e indexables.
- Excluir cuenta, recuperación, registro deshabilitado, notas, búsqueda, artefactos técnicos y filtros.
- Si se mantienen categorías, incluir únicamente las que tengan valor propio.
- Mantener `lastmod` cuando provenga de fechas reales.
- Publicar en una URL estable y referenciarla desde `robots.txt`.
- Redirigir `sitemap_index.xml` o conservar un índice compatible durante la transición.

## robots.txt

El actual es gestionado parcialmente por Cloudflare, permite `/` y añade señales de contenido. La versión nueva debe:

- Permitir recursos necesarios.
- Referenciar el sitemap.
- Bloquear rutas técnicas solo cuando no exista riesgo de ocultar URLs que deberían desindexarse mediante `noindex`.
- Mantener las señales de contenido decididas por el propietario.
- No confiar en `Disallow` para retirar URLs indexadas.

## Páginas que no deberían indexarse

Pendientes de aprobación:

- `/registro/`
- `/mi-cuenta/`
- `/mi-cuenta/lost-password/`
- `/notas/`
- el artefacto `wpr_mega_menu`
- búsqueda y filtros
- archivo de autor
- `Uncategorized`

Las rutas sensibles primero deben servir `noindex` o redirigir de forma correcta; no basta bloquearlas en robots.

## Plan para evitar pérdida de posicionamiento

1. Congelar inventario y obtener analítica/Search Console antes del cambio.
2. Normalizar contenido y medios manteniendo rutas.
3. Crear redirecciones solo con equivalencia confirmada.
4. Comparar títulos, descripciones, canonicals, H1, OG y schema entre origen y staging.
5. Validar todos los PDF y recursos 200.
6. Generar sitemap y robots en staging sin indexarlo públicamente.
7. Ejecutar crawl preproducción, revisar 404/5xx, cadenas y páginas huérfanas.
8. Cambiar tráfico solo cuando exista paridad.
9. Monitorizar cobertura, rankings, logs, Core Web Vitals y errores 404 durante al menos 6-8 semanas.
10. Mantener redirecciones de largo plazo.
