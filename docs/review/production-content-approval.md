# Aprobación institucional previa a producción

Este checklist es interno y no debe publicarse en el frontend.

## Bloqueadores críticos cerrados

- [x] Retirar `/notas/` con respuesta 410; no habrá portal académico público.
- [x] Retirar `/mi-cuenta/`, su recuperación y `/registro/` con respuesta 410.
- [x] Confirmar autorización institucional y legal para publicar fotografías de estudiantes en las actividades conservadas.

## Contenido aprobado para el lanzamiento

- [x] Revisar las ocho fichas de personal marcadas y confirmar nómina y cargos.
- [x] Confirmar vigencia de talleres y academias, incluida yoga.
- [x] Mantener ocultos los documentos que continúan en revisión editorial.
- [x] Retirar `ficha-matricula-2025` por inconsistencia entre periodos.
- [x] Retirar completamente `horarios-2025` por falta de utilidad y equivalencia documental.
- [x] Retirar la actividad parcial del Kínder del 30 de agosto de 2024.
- [x] No migrar el MP4 heredado de 30,8 MB.
- [x] Aprobar `/protocolos-internos/` hacia el filtro de protocolos.
- [x] Consolidar las rutas de categoría Actividades 2024 en `/actividades/`.
- [x] Descartar la query técnica del mega menú mediante 301 a `/`.
- [x] Mantener `/horarios-2025/` y `/matriculas-2025/` como 404 sin reemplazo.
- [x] Confirmar dirección `Las Azucenas 690`, teléfono `(51) 223 4652`, responsable Arturo Javier Galleguillos Trigo y correo `galleguillostrigo@gmail.com`.
- [x] No utilizar analítica durante el lanzamiento inicial.
- [x] Aprobar el contenido definitivo de la página de privacidad.

## Operación aún pendiente

- [ ] Archivar y ocultar los dos registros retirados en Directus.
- [ ] Aplicar en el proxy o CDN las reglas 301 y 410 ya aprobadas.
- [ ] Ejecutar backup final, promoción de la app existente, cambio DNS y QA HTTP.

## Mejoras posteriores

- [ ] Elegir el flujo editorial de actividades futuras.
- [ ] Evaluar almacenamiento de objetos S3 y CDN antes de crecimiento sostenido.
- [ ] Revisar alt y captions con responsables editoriales.
- [ ] Añadir monitorización de 404, Search Console y Core Web Vitals después del lanzamiento.
