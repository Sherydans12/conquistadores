# Auditoría funcional

Auditoría pública y de solo lectura realizada el 2026-07-27. No se enviaron formularios ni se autenticó ninguna cuenta.

## Matriz de funcionalidades

| Función | Comportamiento actual | Dependencia aparente | ¿Reconstruir? | Solución Astro recomendada | Riesgos | Prioridad |
|---|---|---|---|---|---|---|
| Header y navegación | aviso, menú principal, anclas, desplegable Documentos, CTA de matrícula y header sticky | Elementor Pro / Pro Elements / Royal Addons | sí | componente Astro accesible; submenú con HTML semántico y JS mínimo | enlaces/años incoherentes, foco móvil | alta |
| Menú móvil | botón hamburguesa con `aria-expanded`, panel azul y submenú | Elementor | sí | `<button>` + controlador pequeño sin framework; Escape, foco y scroll correctos | navegación por teclado | alta |
| Hero | slider con imagen, overlay, textos y CTA | Smart Slider 3 | sí, simplificado | hero estático o carrusel solo si hay más de una campaña real | CLS, peso, movimiento, CTA 2025 | alta |
| Contadores | tres cifras animadas | Elementor Counter / jQuery Numerator | opcional | cifras reales renderizadas en HTML; animación progresiva respetando reduced motion | hoy parten en cero | media |
| Tabs institucionales | Historia, Misión, Visión, Valores | Elementor tabs | sí | tabs accesibles o secciones simples | contenido oculto/duplicado, teclado | media |
| Actividades/noticias | listado de 47 entradas, tarjetas, categorías y fechas | WordPress posts, Elementor, BlogLentor | sí | colección Astro o WordPress headless en build; rutas históricas estáticas | pérdida de URLs, HTML contaminado | alta |
| Búsqueda de actividades | campo “Buscar Actividad…” y filtros ocultos | Ajax Search Lite | según necesidad | índice JSON estático con JS ligero o Pagefind; alternativa sin JS | relevancia, accesibilidad, carga | media |
| Archivos/categorías/autor | listados paginados y duplicados | WordPress archives | no necesariamente | consolidar en `/actividades/` con filtros y 301, o recrear páginas estáticas | duplicación SEO | media |
| Galerías/carruseles | imágenes por talleres, academias y entradas | Smart Slider / Elementor | sí | galería semántica; `loading=lazy`, `srcset`, lightbox opcional sin librería pesada | 103 MB referenciados, alt faltante | alta |
| Tabla de la Gala | tabla de cursos, presentación y tipo de baile | HTML en contenido Elementor | sí | `<table>` semántica con caption y wrapper responsive | lectura móvil | media |
| PDF y documentos | 73 PDF locales enlazados desde páginas/menú | biblioteca WordPress | sí | `public/documents/` o almacenamiento estable; conservar URL/301 | enlaces rotos y documentos desactualizados | alta |
| Videos de la Gala | once enlaces a archivos Google Drive | Google Drive | sí como enlaces | tarjetas externas con nombre/curso, tamaño/duración cuando se conozcan | permisos de Drive, disponibilidad | alta |
| Video portada | YouTube “Un mundo de Diferencias” | YouTube iframe / Elementor | sí | thumbnail local + iframe bajo interacción o `loading=lazy` | cookies, privacidad, terceros | media |
| Mapa | Google Maps de Las Azucenas 690 | Google Maps iframe | sí o sustituir | imagen/mapa estático y enlace “Abrir en Maps”; iframe bajo interacción | cookies, rendimiento | media |
| Instagram | seis tarjetas cacheadas y enlace al perfil | Smash Balloon Instagram Feed | opcional | enlaces sociales y, si se requiere feed, caché build-time con fallback | token/API, contenido obsoleto, cookies | media |
| Teléfono | texto visible en portada y `tel:+56512234652` en Matrículas 2026 | enlace HTML | sí | CTA `tel:` consistente y accesible | formato y medición | alta |
| Certificados de estudios | enlace global a `certificados.mineduc.cl` | servicio externo Mineduc | sí como enlace | mantener externo, avisar nueva pestaña | disponibilidad externa | media |
| Mi cuenta | login de usuario/correo, contraseña, recordar y recuperación | User Registration + WordPress | decisión pendiente | retirar si no hay uso; si es necesario, servicio de identidad/portal dedicado | credenciales, sesiones, privacidad | alta |
| Registro | muestra “Registration is currently disabled.” | User Registration | no en su estado actual | eliminar/noindex o crear flujo real con requisitos definidos | página inútil e indexable | baja |
| Notas | formulario `post_password` contra `wp-login.php` | protección por contraseña de WordPress | no como está | portal académico con autenticación, autorización, auditoría y proveedor definido | datos de estudiantes; alta sensibilidad | crítica |
| Recuperación de contraseña | `/mi-cuenta/lost-password/` canonicaliza a Mi cuenta | User Registration | solo si hay portal | flujo del proveedor de identidad | seguridad y entrega de correo | alta |
| Footer | logo y copyright | Elementor footer | sí | footer Astro con contacto, navegación, privacidad y documentos | información legal incompleta | media |

## Formularios observados

### Mi cuenta

- `POST` a `/mi-cuenta/`.
- Campos: `username`, `password`, `rememberme`, nonce, referer, redirect y botón de acceso.
- No se envió.
- No debe portarse el nonce, endpoint ni HTML del plugin.

### Notas

- `POST` a `/wp-login.php?action=postpass`.
- Campo obligatorio `post_password`.
- No se envió ni se intentó descubrir la contraseña.
- La protección por contraseña compartida no es adecuada para notas individuales.

### Registro

- No hay formulario activo; el sitio informa que el registro está deshabilitado.

### Búsqueda

- Formularios GET de Ajax Search Lite con `phrase`, selectores de post type y filtros.
- Aparecen en `/actividades/` y en las plantillas de entrada.

No se encontró un formulario público de contacto.

## Descargas y medios

- 73 PDF locales usados.
- 11 videos externos en Google Drive desde la Gala.
- 1 MP4 local referenciado.
- Galerías con imágenes originales y variantes cacheadas.
- No se disparó ninguna descarga durante la auditoría.

## Scripts y plugins observados

- WordPress 7.0.2 y jQuery/jQuery Migrate.
- Elementor y Pro Elements.
- Royal Elementor Addons.
- BlogLentor y Slick.
- Smart Slider 3.
- Ajax Search Lite.
- Instagram Feed.
- User Registration.
- Hello Elementor.
- PDFObject del plugin Document.
- Yoast SEO.

La reconstrucción no necesita replicar estas dependencias. Sus resultados deben reemplazarse por HTML semántico, CSS propio y JavaScript mínimo.

## Terceros y enlaces externos

- YouTube.
- Google Maps.
- Google Drive.
- Instagram.
- Mineduc Certificados.
- Gravatar en el archivo de autor.
- Host `www` como canónico y subdominio `staging` para Astro.

No se encontraron enlaces de WhatsApp, `mailto:` ni Facebook en las 69 páginas base. Solo se encontró un enlace `tel:` explícito; el teléfono también aparece como texto.

## Cookies, analítica y captcha

- No se detectó Google Analytics, Google Tag Manager ni beacon de Cloudflare en el HTML revisado.
- No se encontró banner de consentimiento.
- YouTube, Maps, Instagram y los flujos de cuenta pueden usar cookies; no se inspeccionó almacenamiento del navegador.
- Cadenas relacionadas con captcha aparecen en recursos globales de plugins, pero no se observó un campo o desafío captcha visible en los formularios auditados.

Antes de producción se debe decidir una política de privacidad, cargar embeds bajo consentimiento cuando corresponda y validar analítica de forma explícita.

## Calendarios

No hay un calendario interactivo. “Calendario de Evaluaciones 2026” es una página de once descargas PDF por curso. Puede conservarse así en la primera fase y evolucionar después a datos estructurados.

## Riesgos funcionales principales

1. Tratar `notas` como página estática expondría o degradaría un flujo sensible.
2. Cambiar URLs de PDF rompería enlaces guardados y compartidos.
3. Consumir HTML Elementor directamente mantendría plugins, estilos y contenido duplicado.
4. El feed de Instagram y Drive dependen de permisos/servicios externos.
5. El buscador actual está acoplado a WordPress y aparece duplicado en entradas.
6. Las galerías necesitan optimización y textos alternativos antes de migrarse.
