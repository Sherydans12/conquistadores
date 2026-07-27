# Auditoría de la API pública de WordPress

Auditoría de solo lectura realizada el 2026-07-27. No se inició sesión, no se enviaron formularios y no se consultaron datos privados. La evidencia procesable está en [content-inventory.json](content-inventory.json); los recursos realmente usados están en [media-inventory.csv](media-inventory.csv).

## Endpoint raíz

`GET https://www.colegioconquistadores.com/wp-json/` respondió 200 y declaró:

- Nombre: Colegio Conquistadores.
- URL/home: `https://www.colegioconquistadores.com`.
- Front page: ID 9.
- `show_on_front`: `page`.
- Sin métodos de autenticación públicos declarados.
- Namespaces relevantes: `wp/v2`, `yoast/v1`, `elementor/v1`, `elementor-pro/v1`, `wpr-addons/v1`, `ajax-search-lite`, `user-registration/v1`, `wordfence/v1`, `litespeed/v1` y `simplystatic/v1`.

La presencia de namespaces solo identifica plugins o capacidades aparentes; no se invocaron rutas de escritura.

## Endpoints solicitados

| Endpoint | HTTP | Total público | Paginación / resultado |
|---|---:|---:|---|
| `/wp-json/` | 200 | — | índice de rutas disponible |
| `/wp-json/wp/v2/pages` | 200 | 17 | 17 publicados |
| `/wp-json/wp/v2/posts` | 200 | 47 | 47 publicados |
| `/wp-json/wp/v2/media` | 200 | 1.057 declarados | 1.054 objetos recuperados al paginar de forma estable por ID |
| `/wp-json/wp/v2/categories` | 200 | 4 | 4 objetos, uno sin entradas |
| `/wp-json/wp/v2/tags` | 200 | 0 | arreglo vacío |

`context=edit` sobre páginas respondió 401 `rest_forbidden_context`. Es el comportamiento esperado sin autenticación; por ello no se accedió a contenido `raw`, contraseñas, borradores ni metadatos privados.

## Páginas

Todas las páginas devueltas tienen estado `publish`.

| ID | slug | título | última modificación | Elementor público | observación |
|---:|---|---|---|---|---|
| 9 | `inicio` | Inicio | 2025-03-03 | sí | portada configurada |
| 1773 | `quienes-somos` | Quienes Somos | 2023-11-27 | sí | contenido institucional estable |
| 1817 | `actividades` | Actividades | 2024-06-06 | sí | listado/buscador de 47 entradas |
| 1871 | `personal` | Personal | 2025-03-03 | sí | 65 referencias de medios en el HTML REST |
| 1936 | `academias` | Academias | 2023-11-29 | sí | galerías |
| 1952 | `talleres` | Talleres | 2023-11-29 | sí | galerías |
| 1983 | `documentos` | Documentos | 2024-01-11 | sí | documentos 2024 |
| 4645 | `protocolos-internos` | Protocolos Internos | 2024-09-16 | sí | documentos 2024 |
| 4882 | `registro` | Registro | 2024-05-07 | no | salida del plugin; registro deshabilitado |
| 4883 | `mi-cuenta` | Mi cuenta | 2024-05-07 | no | formulario User Registration |
| 4893 | `notas` | Notas | 2024-05-07 | no | protegida por contraseña; fuera del sitemap |
| 5052 | `plan-lector-2026` | Plan Lector 2026 | 2025-12-23 | sí | página actual |
| 5172 | `reglamento-interno-de-convivencia-escolar` | Reglamento interno de convivencia escolar | 2026-05-19 | sí | descarga RICE 2026 |
| 5207 | `matriculas-2025` | Matriculas 2025 | 2025-12-18 | sí | mezcla contenido 2025/2026 |
| 5408 | `horarios-2025` | Horarios-2025 | 2025-03-03 | sí | diez PDF |
| 5552 | `calendario-de-evaluaciones-2026` | Calendario De Evaluación 2026 | 2026-03-22 | sí | once PDF |
| 5717 | `matriculas-2026` | Matriculas 2026 | 2026-03-16 | sí | portal público 2026 |

Una página está marcada `content.protected`: `notas`. Ninguna página tiene imagen destacada.

## Entradas

- 47 entradas, todas `publish`.
- Rango observado: 2023-03-03 a 2025-10-06.
- Las 47 tienen `featured_media`.
- Las 47 contienen marcado renderizado de Elementor.
- 33 relaciones pertenecen a categoría 4, 14 a categoría 11 y tres entradas recientes también están relacionadas con categoría 1; por ello existen 50 relaciones de categoría para 47 entradas.
- No existen relaciones de tags.
- Todas usan rutas con fecha `/YYYY/MM/DD/slug/`.
- El contenido REST mezcla el artículo con módulos globales de “últimas actividades”, buscador y tarjetas. No debe convertirse directamente a Markdown sin separar el cuerpo editorial.

El detalle completo de ID, slug, fecha, modificación, categorías, medio destacado y acción recomendada está en [content-inventory.json](content-inventory.json).

## Categorías y tags

| ID | nombre | slug | entradas |
|---:|---|---|---:|
| 1 | Uncategorized | `uncategorized` | 3 |
| 4 | Actividades 2023 | `actividades2023` | 33 |
| 10 | 1° Básico | `1-basico` | 0 |
| 11 | Actividades 2024 | `actividades-2024` | 14 |

La categoría “Actividades 2024” contiene también entradas 2025; el nombre ya no representa bien el contenido. No hay tags.

## Medios

El header `X-WP-Total` declara 1.057 medios y 11 páginas a `per_page=100`. Al paginar por ID se recuperaron 1.054 objetos:

| MIME | recuperados |
|---|---:|
| `image/jpeg` | 747 |
| `image/png` | 145 |
| `image/webp` | 18 |
| `application/pdf` | 141 |
| XLSX | 2 |
| `video/mp4` | 1 |

Otros hallazgos:

- 1.054 medios tienen estado `inherit`.
- 910 son imágenes y las 910 tienen `alt_text` vacío en la API.
- Solo 44 declaran un `post` padre; 1.010 están desacoplados.
- 1.050 exponen `media_details.filesize`.
- La biblioteca va de 2023-09-30 a 2026-05-19.
- La diferencia de tres objetos entre el total declarado y lo recuperado se registra como limitación; no se intentó resolver mediante rutas privadas.
- Solo 263 recursos locales están realmente referenciados por las 69 páginas base inspeccionadas: 189 imágenes, 73 PDF y 1 MP4.
- El inventario CSV añade 13 recursos externos relevantes (11 videos Drive, YouTube y Maps).

## Constructores, shortcodes y limpieza

- 61 de 64 páginas/entradas contienen clases `elementor-element`: 14 páginas y las 47 entradas.
- No quedaron shortcodes literales en `content.rendered`.
- La ausencia de shortcodes literales no demuestra que no existan en el contenido `raw`; el contexto público solo expone el resultado renderizado.
- Se observan widgets de Elementor, Pro Elements, Royal Elementor Addons, BlogLentor, Smart Slider, Ajax Search Lite, Instagram Feed y User Registration.
- El HTML contiene wrappers, estilos inline, IDs efímeros, módulos globales repetidos, `srcset`, cachés del slider y formularios con nonces.
- Todo contenido editorial reutilizable requiere extracción semántica y sanitización. No se debe copiar el HTML completo a Astro.

## Relaciones relevantes

- Página frontal: ID 9.
- `featured_media` de las entradas referencia IDs de `/media`.
- Los vínculos de medios deben reconstruirse por uso real, no confiar solo en `post`, porque 95,8 % de los medios recuperados no declara padre.
- `notas` está publicada y protegida, pero no aparece en el sitemap.
- Los archivos de categoría y autor duplican extractos de `/actividades/`.

## Endpoints no disponibles o limitados

- Los seis endpoints públicos solicitados están disponibles.
- `context=edit` está bloqueado con 401 sin autenticación.
- No se probaron endpoints de escritura, administración, usuarios, seguridad o plugins.
- No se guardaron cookies, nonces, contraseñas, credenciales ni HTML masivo.

## Recomendación de migración de contenido

1. Extraer cuerpo editorial y metadatos desde REST; eliminar header, buscador y módulos de relacionados repetidos.
2. Normalizar las 47 entradas a una colección tipada con fecha, título, slug histórico, categoría y medio principal.
3. Convertir páginas institucionales a datos/componentes Astro.
4. Mantener WordPress temporalmente como fuente de noticias solo si existe un flujo editorial real; consumirlo en build, nunca como HTML de cliente sin sanitizar.
5. Relacionar y migrar únicamente los 263 recursos usados, preservando las 73 URLs de documentos o creando redirecciones exactas.
