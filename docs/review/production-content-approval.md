# Aprobación institucional previa a producción

Este checklist es interno y no debe publicarse en el frontend.

## Bloqueadores críticos

- [x] Retirar `/notas/` con respuesta 410; no habrá portal académico público.
- [x] Retirar `/mi-cuenta/`, su recuperación y `/registro/` con respuesta 410.
- [x] Confirmar autorización institucional y legal para publicar fotografías de
  estudiantes en las 47 actividades y sus galerías.

## Bloqueadores de producción

- [x] Revisar las ocho fichas marcadas: Arturo Galleguillos, Elza Días,
  Katherine Fuenzalida, Paola Contreras, Helen Gonzales, Silvianne Cabello,
  Carla Flores y Joselyn Gonzáles.
- [x] Confirmar vigencia de la nómina completa y de sus cargos.
- [x] Confirmar vigencia, responsables, edades, horarios y cupos de talleres.
- [x] Confirmar vigencia, responsables, edades, horarios y cupos de academias.
- [x] Confirmar la nómina de academias publicada, incluida yoga.
- [x] Mantener como `review + hidden` los siete documentos pendientes: Carta Ley TEA,
  Enfermería 2024, Accidentes Escolares 2024, Identidad de Género 2024,
  Reglamento de Evaluación 2025–2026, ficha de matrícula 2025 y Compra de
  materiales sin año.
- [ ] Corregir o retirar la ficha de matrícula inconsistente entre 2025 y 2026.
- [ ] Confirmar vigencia de todos los PDF 2024/2025 visibles o enlazados.
- [ ] Resolver la actividad parcial del Kínder y decidir si se conserva, migra o
  retira el MP4 heredado de 30,8 MB.
- [ ] Aprobar individualmente las redirecciones pendientes de protocolos,
  horarios, Matrículas 2025 y categoría Actividades 2024.
- [x] Aprobar respuesta 410 para `/registro/`, sin redirección a Inicio.
- [ ] Confirmar redes sociales, dirección, teléfono y responsables de contacto.
- [x] No utilizar analítica durante el lanzamiento inicial.
- [ ] Aprobar responsable y canal de contacto definitivos de la política de
  privacidad.

## Mejoras posteriores

- [ ] Elegir el flujo editorial de actividades futuras: Git o WordPress
  headless en build.
- [ ] Evaluar almacenamiento de objetos S3 y CDN antes de crecimiento sostenido.
- [ ] Migrar los PDF temporales fuera de `wp-content` conservando URLs o 301
  exactos.
- [ ] Revisar alt y captions con responsables editoriales.
- [ ] Añadir monitorización de 404, Search Console y Core Web Vitals después del
  lanzamiento.
