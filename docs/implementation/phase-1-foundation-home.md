# Fase 1: sistema base y portada

## Alcance implementado

La fase reemplaza la portada inicial de Astro por una portada estática completa y establece la base reutilizable del sitio:

- sistema visual azul/dorado con tokens de color, tipografía, espaciado, escala fluida, bordes, sombras, capas y transiciones;
- configuración tipada del sitio y SEO, con separación entre staging y producción;
- layout global con salto al contenido, barra de anuncio, header, contenido principal y footer;
- navegación declarativa de escritorio y móvil, con un enlace único al centro de documentos;
- hero, introducción, historia, misión, visión, valores, atributos institucionales, actividades, talleres, academias, video diferido, redes, contacto, ubicación y CTA de matrículas;
- `robots.txt` dinámico y protección `noindex,nofollow` para staging;
- validación responsive y capturas de referencia.

No se modificaron WordPress, Cloudflare, Coolify, DNS, VPS ni el dominio de producción.

## Decisiones

- La portada es un refresh controlado, no una réplica de Elementor. Conserva el logo, el azul/dorado, el lema, la fachada y la estructura editorial principal.
- La configuración falla de forma segura a staging. El modo producción solo se activa cuando `SITE_ENV=production` y `SITE_URL` utiliza el host público esperado.
- Los enlaces de escritorio y móvil se generan desde `src/data/navigation.ts`; no hay dos inventarios de navegación.
- Los documentos públicos se centralizan en `/documentos/`. La navegación ya no expone PDF ni páginas documentales dispersas, y `Evaluaciones 2026` se accede desde el centro documental.
- Se reemplazaron los contadores desactualizados del sitio actual por atributos cualitativos verificables.
- Historia, misión, visión y valores permanecen visibles en móvil sin depender de JavaScript.
- El video usa una miniatura local y crea el iframe de YouTube con privacidad mejorada solo después de la interacción.
- Maps e Instagram se presentan como enlaces externos. No se cargan mapas, feeds ni tokens en la portada.
- Las imágenes principales se importan desde `src/assets/` para que Astro genere variantes optimizadas y reserve dimensiones.

## Componentes creados

- `AnnouncementBar.astro`
- `Header.astro`
- `MobileNav.astro`
- `Footer.astro`
- `Hero.astro`
- `SectionHeading.astro`
- `ActivityCard.astro`
- `ContactSection.astro`
- `LazyVideo.astro`
- `SeoHead.astro`
- `BaseLayout.astro`

Los datos se centralizan en `src/data/site.ts`, `src/data/navigation.ts`, `src/data/home.ts` y, para la ampliación documental, `src/data/documents.ts`. Los estilos base viven en `src/styles/tokens.css`, `src/styles/global.css` y `src/styles/utilities.css`.

## Recursos descargados

Solo se conservaron recursos públicos utilizados por la portada:

| Archivo local | Uso | Fuente pública |
| --- | --- | --- |
| `src/assets/images/brand/colegio-conquistadores-logo.png` | Header y footer | Logo publicado por el colegio |
| `src/assets/images/home/fachada-colegio-conquistadores.webp` | Hero | Imagen original de la fachada |
| `src/assets/images/activities/world-robot-olympiad-2025.webp` | Actividad destacada | Entrada pública WRO 2025 |
| `src/assets/images/activities/gala-raiz-folclorica-2025.webp` | Actividad destacada | Entrada pública Gala 2025 |
| `src/assets/images/activities/dia-de-la-familia-2025.webp` | Actividad destacada | Entrada pública Día de la Familia 2025 |
| `src/assets/images/home/taller-de-musica.webp` | Talleres | Página pública de talleres |
| `src/assets/images/home/academia-de-teatro.webp` | Academias | Página pública de academias |
| `src/assets/images/home/video-un-mundo-de-diferencias.webp` | Video diferido | Miniatura pública de YouTube |
| `public/favicon.png` y `public/apple-touch-icon.png` | Identidad del navegador | Derivados del logo público |
| `public/images/brand/colegio-conquistadores-og.webp` | Open Graph | Derivado optimizado de la fachada |

Los originales de trabajo se eliminaron después de convertirlos. No se descargó la biblioteca multimedia ni los 73 PDF.

## Fuentes de contenido

- auditorías e inventarios de `docs/migration/`;
- capturas de la portada actual;
- páginas públicas del Colegio Conquistadores;
- inventario de contenido para fechas, títulos y URL de actividades;
- información pública verificada: nombre, lema, dirección `Las Azucenas 690, Coquimbo`, teléfono `(51) 223 4652`, Instagram y video de YouTube.

El JSON-LD se limita a estos datos públicos. No se copió el grafo Yoast.

## Rutas pendientes al cierre de Fase 1

La rama de Fase 1 creó `/`, `/documentos/` y `/robots.txt`. Esta lista conserva
el estado histórico de aquella entrega. Fase 2 implementó posteriormente
`/quienes-somos/`, `/personal/`, `/talleres/`, `/academias/` y
`/matriculas-2026/`. Fase 3 implementó después `/actividades/` y las 47
rutas históricas.

Las siguientes URL continúan pendientes de páginas Astro o de una decisión de
redirección después de Fase 2:

- `/calendario-de-evaluaciones-2026/`
- `/plan-lector-2026/`
- `/protocolos-internos/`
- `/reglamento-interno-de-convivencia-escolar/`

No se crearon `/mi-cuenta/`, `/registro/` ni `/notas/`.

## Enlaces de actividades

Desde Fase 3, las tres actividades destacadas abren sus rutas Astro locales:

- World Robot Olympiad Chile, 6 de octubre de 2025;
- Gala Raíz Folclórica 2025, 29 de septiembre de 2025;
- Día de la Familia 2025, 19 de mayo de 2025.

Los documentos 2026 seleccionados, PISE 2024 y el archivo de horarios 2025 se presentan únicamente dentro de `/documentos/` y conservan enlaces externos temporales a WordPress. Carta Ley TEA y los protocolos 2024 permanecen en revisión y no aparecen en el listado público. Certificados de Estudios abre el servicio oficial externo de Mineduc.

## Validación

- `npm install`: correcto, sin vulnerabilidades informadas.
- `npm run build`: correcto; genera HTML estático para `/`, `/documentos/` y `/robots.txt`.
- Vista responsive comprobada en 360, 390, 768, 1024 y 1440 px, sin overflow horizontal ni imágenes rotas.
- Un único `h1`.
- Staging genera `noindex,nofollow`, canonical de staging y `Disallow: /`.
- Menú móvil comprobado con mouse, teclado, Enter, Space y Escape; restaura el foco, bloquea el scroll de fondo y se cierra al volver a escritorio.
- El enlace `Documentos` es directo en escritorio y móvil; no existe un submenú documental duplicado.
- El centro documental conserva los 39 resultados públicos en el HTML inicial y añade búsqueda y filtros progresivos sin peticiones de red.
- El video no crea iframe al cargar y usa `youtube-nocookie.com` solo después de la interacción.
- Consola del navegador revisada sin errores ni advertencias.

Capturas:

- `docs/implementation/screenshots/phase-1/desktop-home.png`
- `docs/implementation/screenshots/phase-1/tablet-home.png`
- `docs/implementation/screenshots/phase-1/mobile-home.png`
- `docs/implementation/screenshots/phase-1/mobile-menu-open.png`
- `docs/implementation/screenshots/document-center/desktop-documents.png`
- `docs/implementation/screenshots/document-center/tablet-documents.png`
- `docs/implementation/screenshots/document-center/mobile-documents.png`

La evidencia comparativa de diseño se documenta en `design-qa.md`.

## Limitaciones

- En el build de Fase 2 las cinco rutas institucionales y de matrícula ya no
  producen 404. Las rutas que permanecen en la lista anterior continúan
  pendientes.
- Algunos documentos conservan enlaces históricos externos, pero la portada no
  consulta WordPress en tiempo de ejecución.
- No hay feed de Instagram, mapa embebido, formulario de contacto ni integración headless. La búsqueda existe solo dentro del centro documental y funciona en cliente sobre el HTML estático.
- Fase 4 añadió el sitemap y el inventario versionado de redirecciones; las
  reglas pendientes continúan sin activarse.
- No se desplegó a staging ni se modificó la configuración de Coolify.

## Diferencias conscientes respecto al sitio actual

- Hero único en lugar de slider.
- Jerarquía visual más clara, copy más breve y CTA 2026.
- Navegación compacta y accesible en lugar del menú superpuesto de Elementor.
- Atributos institucionales verificables en lugar de contadores desactualizados.
- Secciones editoriales visibles y responsive en lugar de tabs obligatorios.
- Embeds diferidos y recursos locales optimizados.

## Siguiente fase

- implementar las páginas institucionales y las rutas documentadas prioritarias;
- revisar la equivalencia de las rutas documentales históricas antes de aprobar redirecciones;
- reemplazar los enlaces documentales temporales cuando exista una fuente build-time aprobada;
- definir la fuente editorial para actividades futuras;
- preparar sitemap y plan de redirecciones cuando exista paridad;
- revisar el despliegue en staging antes de cualquier cambio de dominio.
