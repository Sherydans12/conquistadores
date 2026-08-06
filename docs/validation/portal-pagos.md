# Validación de integración del portal de pagos

Fecha: 5 de agosto de 2026
Rama: `codex/matriculas-2027-edupay`
Portal: `https://portal.edupay.baselogic.cl/`

## Cobertura funcional

- CTA principal en el hero de la portada.
- Acción destacada y persistente en el encabezado.
- Acceso dentro del menú móvil.
- Sección informativa con pago de mensualidades mediante Webpay Plus, certificado de alumno regular y certificado de deuda cero.
- Acceso específico para familias en el footer.
- Todos los accesos usan la URL principal confirmada, se abren en una pestaña nueva y declaran `rel="noopener noreferrer"`.
- No se incorporaron iframes ni rutas internas no confirmadas.

## Validación responsive y accesible

| Vista | Resultado |
| --- | --- |
| 1440 × 1000 px | Encabezado, hero y sección informativa visibles y alineados con el sistema visual actual. |
| 1120 × 800 px | Navegación de escritorio sin superposición; 24 px entre navegación y acciones. |
| 768 × 800 px | Navegación de escritorio colapsada; menú y acceso al portal visibles. |
| 390 × 844 px | Sin desbordamiento horizontal; CTA del hero a ancho completo y encabezado operativo. |
| Menú móvil | Abre y cierra con estado ARIA correcto; portal y Matrículas visibles; Escape devuelve el menú al estado cerrado. |

Los enlaces incluyen contexto para lectores de pantalla sobre la apertura en una pestaña nueva. Los controles mantienen objetivos táctiles de al menos 44 px en la navegación móvil.

## Evidencia visual

- [Matrículas 2027 en escritorio](./matriculas-2027-desktop.png)
- [Menú de Matrículas 2027 en móvil](./matriculas-2027-mobile.png)
- [Portada en escritorio](./portal-home-desktop.png)
- [Portada en móvil](./portal-home-mobile.png)
- [Acceso del footer](./portal-footer-desktop.png)

## Validación técnica

- `npm run ci`: correcto.
- Astro check: 0 errores, 0 advertencias y 0 sugerencias.
- Build estático: 56 páginas generadas correctamente.
- Validaciones de rutas, enlaces, SEO, assets, documentos y 12 pruebas documentales: correctas.
- Detector de calidad visual/layout: sin hallazgos.
- Endpoint del portal: responde desde la URL principal y termina correctamente en el inicio de sesión (`HTTP 200`), comportamiento esperado para un portal autenticado.

## Catálogo de Matrículas 2027

- `/matriculas-2027/` y `/documentos/` llaman `loadDocumentCatalog()` durante el build y comparten el mismo selector normalizado.
- La sección 2027 admite únicamente `category=matriculas`, `year=2027` y estados de presentación que no sean históricos ni externos.
- Directus y el validador del snapshot admiten únicamente registros `published + public`; `draft`, `review`, `hidden` y `archived` quedan fuera antes de generar el catálogo.
- El snapshot actual no contiene documentos 2027, por lo que ambas rutas muestran el estado vacío institucional.
- El fixture automatizado confirma que un documento público 2027 aparece y que uno de 2026 no entra en la selección 2027.
