# Design QA — Centro público de documentos

## Resultado

**passed**

No quedaron hallazgos P0, P1 o P2 después de la comparación y la corrección del estado vacío.

## Fuente visual

No existe una captura histórica de un centro documental equivalente. La fuente de verdad para esta ampliación es el sistema visual aprobado en Fase 1:

- escritorio: `docs/implementation/screenshots/phase-1/qa-desktop-implementation.png`;
- móvil: `docs/implementation/screenshots/phase-1/qa-mobile-implementation.png`;
- tokens y componentes globales de la misma rama.

La comparación evalúa la continuidad del chrome, identidad, tipografía, superficies y escala responsive. No intenta igualar el contenido del hero de portada con el encabezado interior.

## Evidencia de implementación

- Escritorio, viewport solicitado 1440 × 1000 CSS px, captura útil 1425 × 990 px, densidad 1: `docs/implementation/screenshots/document-center/desktop-documents.png`.
- Tablet, viewport solicitado 768 × 1024 CSS px, captura útil 753 × 1024 px, densidad 1: `docs/implementation/screenshots/document-center/tablet-documents.png`.
- Móvil, viewport solicitado 390 × 844 CSS px, captura útil 375 × 812 px, densidad 1: `docs/implementation/screenshots/document-center/mobile-documents.png`.
- Filtros activos, viewport solicitado 390 × 844 CSS px, captura útil 375 × 812 px: `docs/implementation/screenshots/document-center/mobile-filters-active.png`.
- Estado vacío, viewport solicitado 1440 × 800 CSS px, captura útil 1425 × 792 px: `docs/implementation/screenshots/document-center/empty-state.png`.

## Comparaciones lado a lado

- Escritorio, sistema aprobado a la izquierda y centro documental a la derecha: `docs/implementation/screenshots/document-center/qa-design-system-comparison.png`.
- Móvil, sistema aprobado a la izquierda y centro documental a la derecha: `docs/implementation/screenshots/document-center/qa-mobile-design-system-comparison.png`.

Las comparaciones usan capturas nativas con densidad equivalente. El estado comparado es la carga inicial sin filtros.

## Criterios revisados

- continuidad del azul principal, dorado, logo, CTA y navegación;
- jerarquía del H1 y encabezado interior;
- tipografía, pesos, radios, sombras, bordes y superficies;
- claridad del formulario, etiquetas, fieldsets y contador;
- tarjetas institucionales, badges y metadatos;
- adaptación de filtros y tarjetas a una columna;
- títulos completos, targets táctiles y foco visible;
- estado vacío y señalización de enlaces externos;
- ausencia de desbordamiento de página.

## Interacciones verificadas

- búsqueda sin distinción de acentos: `evaluacion` encuentra los calendarios y el reglamento pertinente;
- combinación `evaluacion` + categoría Evaluaciones + año 2026: 11 resultados;
- filtro Histórico: 2 resultados;
- búsqueda sin coincidencias: 0 resultados y estado vacío visible;
- limpiar filtros: restaura 39 resultados;
- contador `aria-live` actualizado;
- menú móvil: abre, bloquea fondo, cierra con Escape y devuelve el foco al botón;
- enlaces externos: 39 enlaces con indicación accesible, `target="_blank"` y `rel="noopener noreferrer"`;
- consola: sin errores ni advertencias durante las pruebas.

## Responsive

| Viewport solicitado | Ancho útil observado | Overflow de página |
| --- | ---: | --- |
| 360 px | 345 px | No |
| 390 px | 375 px | No |
| 768 px | 753 px | No |
| 1024 px | 1009 px | No |
| 1440 px | 1425 px | No |

La reducción de 15 px corresponde a la barra de desplazamiento vertical del navegador, no a un desbordamiento.

## Historial de correcciones

### Primera comparación

- P2: al filtrar sin coincidencias, el contenedor de grupos quedaba visible como una superficie vacía antes del mensaje.

### Corrección

- El contenedor de grupos se oculta cuando el contador llega a cero.
- El aviso de protocolos en revisión se oculta durante búsquedas sin relación y se conserva al filtrar específicamente por Protocolos.

### Segunda comparación

- El estado vacío queda inmediatamente bajo el encabezado del listado.
- No hay cortes de títulos ni deformación de componentes.
- La página conserva la identidad aprobada y presenta los filtros como una herramienta institucional, no como un explorador técnico.
- Sin hallazgos P0, P1 o P2.
