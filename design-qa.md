# Design QA — Fase 1

## Resultado

**passed**

No quedaron hallazgos P0, P1 o P2 después de la corrección y la segunda comparación.

## Evidencia

### Referencias

- Escritorio: `docs/migration/screenshots/desktop/inicio.png`
- Móvil: `docs/migration/screenshots/mobile/inicio.png`
- Menú móvil abierto: `docs/migration/screenshots/mobile/inicio-menu-abierto.png`

### Implementación

- Escritorio, viewport solicitado 1440 × 1000 CSS px, captura útil 1425 × 990 px, densidad 1: `docs/implementation/screenshots/phase-1/qa-desktop-implementation.png`
- Móvil, viewport solicitado 390 × 844 CSS px, captura útil 375 × 812 px, densidad 1: `docs/implementation/screenshots/phase-1/qa-mobile-implementation.png`
- Menú móvil abierto, viewport 390 × 844 CSS px, captura 390 × 844 px, densidad 1: `docs/implementation/screenshots/phase-1/mobile-menu-open.png`

### Comparaciones lado a lado

- Escritorio, referencia a la izquierda e implementación a la derecha: `docs/implementation/screenshots/phase-1/qa-desktop-comparison.png`
- Móvil, referencia a la izquierda e implementación a la derecha: `docs/implementation/screenshots/phase-1/qa-mobile-comparison.png`

Las comparaciones se componen a tamaño nativo: 1425 × 990 px por lado en
escritorio y 375 × 812 px por lado en móvil. Usan el inicio de la portada y una
densidad de píxel equivalente.

## Criterios revisados

- identidad azul/dorado, logo, fachada, lema y contenido principal;
- legibilidad y contraste del texto sobre la imagen;
- escala tipográfica y jerarquía del H1;
- espaciado del anuncio, header, hero y primera sección;
- proporción y recorte de la imagen;
- navegación de escritorio y estado del menú móvil;
- CTA principal y secundario;
- foco visible, targets táctiles y distribución responsive.

## Historial de correcciones

### Primera revisión

- P1: el panel móvil comenzaba bajo una coordenada fija y podía superponerse con el header cuando la barra de anuncio estaba visible.
- P2: el hero móvil consumía demasiada altura y retrasaba el inicio del contenido institucional.

### Correcciones

- El panel pasó a posicionarse inmediatamente debajo del header real.
- Se redujo la altura responsive del hero sin perder legibilidad ni área táctil.
- Se verificó que el panel y el header comparten el mismo límite vertical, que el fondo queda bloqueado y que Escape restaura el foco.

### Segunda revisión

- Sin desbordes horizontales en 360, 390, 768, 1024 y 1440 px.
- Sin imágenes rotas.
- Sin errores o advertencias en consola.
- La versión final conserva la identidad de la referencia y aplica las diferencias de refresh solicitadas: hero alineado a la izquierda, navegación más clara y reemplazo de contadores no confiables por atributos cualitativos.
