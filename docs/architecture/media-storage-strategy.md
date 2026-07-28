# Estrategia de almacenamiento de medios

## Decisión provisional

Las 825 imágenes WebP históricas migradas pueden permanecer en el repositorio.
No se volverán a migrar, recortar ni eliminar en esta fase: preservan las 47
actividades y una línea base reproducible.

Esta excepción histórica no define la arquitectura editorial futura. Las nuevas
publicaciones no deben aumentar indefinidamente el tamaño del repositorio.

## Dirección recomendada

- Evaluar almacenamiento de objetos compatible con S3 antes de habilitar un
  flujo editorial sostenido.
- Conservar en Git la metadata tipada, las referencias inmutables, los textos
  alternativos y las decisiones de revisión.
- Usar nombres inmutables y versionados; reemplazar un archivo debe crear una
  clave nueva.
- Realizar transformaciones responsive durante el build o mediante un CDN de
  imágenes, manteniendo el original respaldado.
- Definir backups verificados, retención, restauración y eliminación aprobada.
- Evitar nuevas dependencias directas de `wp-content`; los enlaces PDF heredados
  actuales son excepciones temporales registradas.
- Separar permisos editoriales, publicación pública y borrado de originales.

## Umbral de revisión

La arquitectura debe revisarse antes de incorporar una nueva campaña o lote que
añada más de 10 MiB de fuentes, o cuando las imágenes de actividades superen
90 MiB en el repositorio. Alcanzar cualquiera de esos límites bloquea la carga
masiva hasta decidir almacenamiento, CDN, backups y costos.

No se seleccionó ni conectó proveedor en esta fase.
