# Centro público de documentos

## Alcance

La ruta estática `/documentos/` centraliza los documentos públicos del Colegio Conquistadores. Sustituye el submenú documental anterior por un enlace único en la navegación principal y ofrece búsqueda, filtros, archivo histórico y acceso al servicio de certificados de Mineduc.

La implementación no consulta WordPress desde el navegador, no descarga en bloque los 73 PDF inventariados y no activa redirecciones de producción.

## Arquitectura

- `src/pages/documentos.astro`: composición de la página, hero interior, secciones, archivo, servicio externo y SEO.
- `src/data/documents.ts`: tipos, categorías, inventario curado, validación de IDs, documentos visibles e inventario interno de revisión.
- `src/data/legacy-routes.ts`: inventario central tipado de compatibilidad SEO, sin activación.
- `src/components/documents/DocumentSearch.astro`: búsqueda y filtros progresivos con JavaScript vanilla.
- `src/components/documents/DocumentFilters.astro`: controles semánticos de categoría, año y vigencia.
- `src/components/documents/DocumentCard.astro`: presentación del documento y metadatos disponibles.
- `src/components/documents/DocumentList.astro`: agrupación semántica por categoría.
- `src/components/documents/DocumentStatusBadge.astro`: estados visibles Vigente, Histórico y Externo.
- `src/components/documents/ExternalServiceCard.astro`: acceso identificado al portal oficial de Mineduc.

Todos los documentos públicos permanecen en el HTML inicial. El script solo oculta o muestra resultados existentes y no construye HTML con cadenas ni realiza peticiones de red.

## Modelo de datos

`PublicDocument` conserva un ID estable, título, descripción, categoría, año opcional, audiencia, formato, tamaño, fecha de actualización, estado, URL, condición externa, destacado, visibilidad pública, procedencia histórica y palabras clave.

Estados:

- `current`: documento identificado por su nombre o contexto inventariado como correspondiente a 2026;
- `historical`: material preservado como referencia y presentado explícitamente como no actual;
- `review`: material localizado, pero oculto hasta validar vigencia y equivalencia;
- `external`: servicio público operado fuera del sitio del colegio.

El módulo valida al cargar que no existan IDs duplicados. Un registro con `public: false` o `status: 'review'` no entra en `publicDocuments`.

## Categorías

- Evaluaciones y calendarios (`evaluaciones`)
- Plan lector (`plan-lector`)
- Reglamentos y convivencia (`reglamentos`)
- Protocolos internos (`protocolos`)
- Seguridad escolar (`seguridad`)
- Horarios (`horarios`)
- Matrículas y admisión (`matriculas`)
- Documentos institucionales (`institucionales`)
- Otros (`otros`)

Los identificadores son estables y están separados de sus etiquetas visibles.

## Documentos visibles

El centro muestra 39 registros públicos:

- 11 calendarios de evaluaciones del primer semestre de 2026, de 1° básico a 3° medio;
- 11 planes lectores 2026, de 1° básico a 3° medio;
- 11 listas de útiles escolares 2026, de 1° básico a 3° medio;
- Reglamento Interno de Convivencia Escolar 2026;
- Reglamento de Evaluación 2026–2027;
- Proyecto Educativo Institucional 2026;
- Plan Integral de Seguridad Escolar 2024, identificado como histórico;
- archivo de horarios 2025, identificado como histórico;
- Certificados de Estudios, identificado como servicio externo de Mineduc.

La denominación 2026 proviene de los nombres de archivo, títulos o páginas inventariadas. Esta selección no convierte en vigente ningún otro documento que solo esté disponible públicamente.

## Archivo histórico

PISE 2024 y la página de horarios 2025 se conservan en una sección separada. Las tarjetas muestran el estado `Histórico` y advierten que no corresponden al periodo actual.

## Pendientes de revisión

Los siguientes registros se mantienen en el inventario interno con `public: false` y `status: 'review'`:

- Carta Ley TEA;
- Protocolo de Enfermería 2024;
- Protocolo de Accidentes Escolares 2024;
- Protocolo de Identidad de Género 2024;
- Reglamento de Evaluación 2025–2026;
- Ficha de matrícula 2025;
- Compra de materiales sin año identificable.

No aparecen en el HTML público ni en los resultados de búsqueda. La página explica que los protocolos históricos están en revisión de vigencia.

## Búsqueda y filtros

La mejora progresiva permite:

- buscar por título, descripción, categoría, palabras clave, audiencia y año;
- normalizar mayúsculas, minúsculas y acentos;
- combinar categoría, año y vigencia;
- actualizar el contador mediante `aria-live="polite"`;
- limpiar todos los filtros;
- mostrar un estado vacío anunciado.
- inicializar filtros desde `category`, `year`, `status` y `q`;
- reflejar filtros válidos en la URL sin peticiones de red.

Sin JavaScript, los controles permanecen deshabilitados y la lista completa continúa visible. Se ofrece una nota para usar la búsqueda del navegador.

## Enlaces temporales

Los PDF seleccionados continúan alojados temporalmente en `www.colegioconquistadores.com/wp-content/uploads/`. Solo se enlazan desde `/documentos/`, se identifican como externos y usan `target="_blank"` con `rel="noopener noreferrer"`.

El servicio Certificados de Estudios abre:

`https://certificados.mineduc.cl/mvc/home/index`

No existe dependencia de la API REST de WordPress ni de un script de WordPress en tiempo de ejecución.

## Rutas antiguas y compatibilidad SEO

`src/data/legacy-routes.ts` conserva las propuestas consolidadas para:

| Ruta histórica | Destino propuesto |
| --- | --- |
| `/plan-lector-2026/` | `/documentos/?category=plan-lector&year=2026` |
| `/protocolos-internos/` | `/documentos/?category=protocolos` |
| `/calendario-de-evaluaciones-2026/` | `/documentos/?category=evaluaciones&year=2026` |
| `/reglamento-interno-de-convivencia-escolar/` | `/documentos/?category=reglamentos&year=2026` |
| `/horarios-2025/` | `/documentos/?category=horarios&year=2025` |
| `/matriculas-2025/` | `/matriculas-2026/` |

Evaluaciones, plan lector y RICE 2026 tienen equivalencia aprobada. Protocolos,
horarios y Matrículas 2025 permanecen pendientes. Ninguna propuesta está
conectada a Astro, Coolify, Cloudflare ni otra infraestructura.

## Navegación

La navegación principal utiliza un único objeto declarativo compartido por escritorio y móvil:

```ts
{
  label: 'Documentos',
  href: '/documentos/',
}
```

`Evaluaciones 2026` salió de la navegación principal. La barra de anuncio enlaza a `/documentos/#evaluaciones-2026`. El footer apunta al centro y a sus secciones, sin PDF directos.

## Añadir un documento

1. Confirmar que el archivo es público y que su vigencia está respaldada por el título, la página oficial o una validación institucional.
2. Añadir un registro con ID único en `src/data/documents.ts`.
3. Completar solo metadatos comprobados; omitir tamaño, fecha o descripción cuando no estén disponibles.
4. Usar `status: 'review'` y `public: false` si existe cualquier duda de vigencia.
5. Marcar `external: true` mientras el archivo resida fuera de staging y conservar `sourceLegacyUrl`.
6. Añadir palabras clave útiles sin repetir datos sensibles.
7. Ejecutar el build para activar la validación de IDs duplicados y probar búsqueda, filtros y enlaces.

## Administración desde WordPress

Una fase futura puede crear un Custom Post Type `documento` con:

- título;
- descripción;
- archivo;
- categoría;
- año;
- audiencia;
- vigencia;
- fecha de actualización;
- palabras clave;
- destacado;
- público/oculto.

Astro consumiría esos registros durante el build, validaría el esquema y generaría HTML estático. Un webhook autorizado solicitaría un nuevo despliegue cuando cambie un documento. El navegador no consultaría la API REST de WordPress y WordPress seguiría fuera del camino crítico de lectura.

## Limitaciones

- Los PDF continúan alojados temporalmente en WordPress; no se copiaron ni optimizaron.
- La revisión editorial de los documentos marcados como `review` requiere confirmación institucional.
- Las redirecciones históricas están documentadas, pero no activadas.
- No se implementó un administrador, webhook ni integración headless. Fase 4
  añadió sitemap y validadores.
- No se verificó equivalencia completa de las páginas históricas; por eso ninguna propuesta 301 está aprobada.
- `@astrojs/check` y `typescript` no se añaden únicamente para esta fase si no forman parte de las dependencias existentes.

## Evidencia de QA

Capturas:

- `docs/implementation/screenshots/document-center/desktop-documents.png`
- `docs/implementation/screenshots/document-center/tablet-documents.png`
- `docs/implementation/screenshots/document-center/mobile-documents.png`
- `docs/implementation/screenshots/document-center/mobile-filters-active.png`
- `docs/implementation/screenshots/document-center/empty-state.png`

El detalle visual y técnico se registra en `design-qa.md`.
