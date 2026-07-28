# Informe ejecutivo de migración

## Resumen

El sitio público es mayor de lo que su menú sugiere. La auditoría encontró 78 URLs relevantes, 64 contenidos REST publicados, 24 páginas/plantillas visuales distintas auditadas, 263 recursos locales realmente usados y varios flujos dinámicos acoplados a WordPress.

La reconstrucción es viable como sitio Astro estático. El contenido institucional, documentos y archivo de noticias pueden migrarse sin frameworks de UI. La excepción es el flujo de notas/cuenta: no debe copiarse ni simularse como página estática y requiere una decisión de producto y seguridad.

## Alcance medido

| Métrica | Resultado |
|---|---:|
| URLs públicas relevantes | 78 |
| URLs en sitemap | 68 |
| Páginas WordPress publicadas | 17 |
| Entradas WordPress publicadas | 47 |
| Categorías | 4 |
| Tags | 0 |
| Plantillas/páginas auditadas visualmente | 24 |
| Capturas | 49 |
| Medios declarados por REST | 1.057 |
| Medios recuperados por paginación pública | 1.054 |
| Recursos locales realmente usados | 263 |
| Imágenes usadas | 189 |
| PDF usados | 73 |
| Video local usado | 1 |
| Recursos externos inventariados | 13 |
| Peso aproximado de los recursos locales referenciados | 103 MB |

## Contenido reutilizable

- Historia, misión, visión y valores.
- Información y fotografía institucional.
- Nómina y roles del personal, previa corrección.
- Talleres y academias.
- 47 actividades históricas.
- Portal informativo 2026.
- 73 PDF y enlaces de Drive, previa revisión de vigencia.
- Identidad visual azul/dorado, logo y lema.

## Contenido que requiere limpieza

- 61 contenidos con markup Elementor.
- Entradas que mezclan cuerpo editorial con buscador y “últimas actividades”.
- 148 de 189 imágenes usadas sin alt procesable.
- Nombres de archivo deficientes y variantes cacheadas.
- `Matriculas 2025` con copy/documentos de distintos años.
- Categoría “Actividades 2024” con publicaciones 2025.
- Categoría “Uncategorized”.
- Nombres/cargos con capitalización y ortografía inconsistente.
- 54 URLs del sitemap sin metadescripción y 60 sin H1.

## Funcionalidades dinámicas relevantes

- Smart Slider, carruseles y galerías.
- Buscador Ajax de actividades.
- Feed de Instagram.
- YouTube y Google Maps.
- Once videos Google Drive.
- Descargas de documentos.
- Login, recuperación y registro User Registration.
- Página de notas protegida por contraseña.
- Contadores y tabs.
- Enlace telefónico.

## Riesgos principales

1. **Notas y cuenta:** contienen autenticación/contraseña y no pueden convertirse en estático sin un portal seguro.
2. **SEO:** 47 URLs históricas y 73 PDF deben conservarse o redirigirse exactamente.
3. **Contenido Elementor:** copiarlo mantendría deuda, duplicación y dependencias de plugins.
4. **Medios:** aproximadamente 103 MB, 30 archivos sobre 500 KB y 18 sobre 1 MB.
5. **Alt y accesibilidad:** 148 imágenes usadas sin alt, H1 ausentes y archivos móviles muy largos.
6. **Vigencia:** documentos 2024/2025 conviven con 2026.
7. **Terceros:** Drive, Instagram, YouTube y Maps dependen de permisos, cookies y disponibilidad.
8. **REST de medios:** diferencia de tres objetos entre total declarado y paginación recuperada.

## Arquitectura recomendada

- Astro estático y TypeScript estricto.
- Componentes `.astro`, CSS propio y JavaScript mínimo.
- Colección tipada local implementada para las 47 actividades históricas.
- Datos TypeScript para navegación, personal y documentos.
- Medios optimizados en el repositorio o almacenamiento estable.
- WordPress headless solo si existe necesidad editorial, consumido en build.
- Portal de notas/cuenta fuera del sitio estático.

Detalle: [astro-architecture.md](astro-architecture.md).

## Orden de implementación

| Fase | Alcance | Complejidad relativa |
|---|---|---|
| 0 | decisiones, vigencia documental, portal y redirects | media |
| 1 | tokens, layout, header/footer, SEO base | media |
| 2 | inicio y páginas institucionales | media |
| 3 | documentos y páginas 2026 | media |
| 4 | importación/limpieza de 47 actividades | completada |
| 5 | medios, galerías y enlaces Drive de actividades | completada |
| 6 | búsqueda de actividades; otros servicios externos | parcial |
| 7 | paridad, accesibilidad, rendimiento y SEO | alta |
| 8 | publicación y monitorización | media |

## Decisiones pendientes

- ¿Las noticias futuras se editarán en Git/Astro o seguirán en WordPress headless?
- ¿Existe un sistema oficial para notas y cuentas? ¿Quién lo administra?
- ¿Qué PDF 2024/2025 siguen vigentes?
- ¿Se redirige Matrículas 2025 a 2026?
- ¿Se conservan categorías o se consolidan en `/actividades/`?
- ¿Se migra o se mantiene temporalmente cada video de Drive?
- ¿Se necesita feed de Instagram o basta con enlaces?
- ¿Qué analítica y política de consentimiento se usarán?
- ¿Qué datos del personal pueden seguir publicándose?
- ¿Se mantiene Montserrat autoalojada?

## Checklist para el siguiente agente

- [ ] Leer [url-inventory.md](url-inventory.md) y no cambiar rutas sin añadir redirect.
- [ ] Leer [visual-audit.md](visual-audit.md) y revisar las 49 capturas.
- [ ] Usar [content-inventory.json](content-inventory.json), no copiar HTML completo.
- [ ] Filtrar medios con [media-inventory.csv](media-inventory.csv).
- [ ] Confirmar vigencia de los 73 PDF.
- [ ] Obtener una decisión sobre `notas`, cuenta y recuperación.
- [x] Implementar una Astro collection local para el archivo histórico.
- [ ] Implementar primero layout, navegación, SEO y tokens.
- [ ] Mantener `output: static`, TypeScript estricto y cero frameworks UI.
- [ ] Crear H1 único y metadescripción por página.
- [ ] Completar alt/captions antes de aceptar imágenes.
- [ ] Preservar las 47 rutas de entradas.
- [ ] Preparar y probar redirects de archivos/autor/mega menú.
- [x] Generar sitemap, robots, canonicals, OG y JSON-LD.
- [x] Versionar inventarios de rutas, validadores y CI de preparación.
- [ ] Validar móvil, teclado, contraste, reduced motion y embeds.
- [ ] Ejecutar crawl comparativo contra las 78 URLs después de aprobar redirects.
- [ ] Ejecutar `npm run build` antes de cualquier publicación.

## Índice de entregables

- [Inventario de URLs](url-inventory.md)
- [Auditoría visual](visual-audit.md)
- [Auditoría REST WordPress](wordpress-api-audit.md)
- [Inventario procesable de contenido](content-inventory.json)
- [Inventario de medios](media-inventory.csv)
- [Auditoría funcional](functional-audit.md)
- [Plan SEO](seo-migration-plan.md)
- [Arquitectura Astro](astro-architecture.md)

## Limitaciones

- Auditoría basada únicamente en información pública el 2026-07-27.
- No se accedió a WordPress, hosting, Cloudflare, Coolify, DNS ni VPS.
- No se enviaron formularios ni se descargó la biblioteca completa.
- Las capturas son del primer viewport; el contenido completo se revisó mediante DOM, enlaces y metadatos.
- No se dispone de Search Console, analítica ni logs, por lo que la prioridad SEO final debe contrastarse con datos reales.
