# Entorno de producción Astro

## Arquitectura y configuración observadas

Auditoría de solo lectura del 5 de noviembre de 2026:

- Coolify v4.6.0, proyecto `My first project`, entorno `production`.
- Aplicación Astro: `conquistadores:main-yp0gmnfgu5bj97zh3s539bd3`.
- Fuente GitHub: `Sherydans12/conquistadores`, rama `main`.
- Dominio configurado en la aplicación: `https://www.colegioconquistadores.com`,
  con redirección HTTP a HTTPS. El dominio raíz no está configurado en esta
  aplicación.
- Estrategia: Nixpacks (marcada como obsoleta en Coolify), tipo de sitio
  estático, directorio base `/`, directorio publicado `/dist`, imagen
  `nginx:alpine`, puerto interno 80. Los comandos de instalación y build están
  vacíos y Coolify los detecta automáticamente. No hay Dockerfile, configuración
  Nixpacks ni Railpack versionados en este repositorio.
- Coolify indica que el recurso está ejecutándose sin health check.
- El despliegue automático por webhook al hacer push a `main` está habilitado.
- El repositorio declara Node `>=22 <23`. Coolify también muestra
  `NIXPACKS_NODE_VERSION`; su valor no se copió durante esta revisión.

La aplicación Astro es independiente de Directus. Directus conserva su propio
recurso y URL `https://cms.colegioconquistadores.com`; el código obtiene el
catálogo durante el build y enlaza los archivos públicos alojados allí. Esta
revisión no cambió ni reconfiguró Directus.

Cloudflare es el proveedor DNS informado. La respuesta HTTP pública de www
incluyó `Server: cloudflare` y `CF-Ray`, lo que confirma que esa solicitud pasó
por Cloudflare. No se inspeccionaron los registros DNS ni el estado de proxy de
otros nombres; no cambiar esos valores a partir de esta auditoría.

## Variables que consume Astro

Los nombres existentes deben conservarse. El panel de Coolify mostró estas
variables, sin copiar sus valores:

| Variable | Uso y requisito |
|---|---|
| `SITE_ENV` | Para un build público debe ser `production`. |
| `SITE_URL` | Para un build público debe ser exactamente `https://www.colegioconquistadores.com`. |
| `CMS_DOCUMENTS_SOURCE` | El código acepta `directus` o `snapshot`. En producción exige `directus`, salvo que se apruebe un snapshot con `CMS_APPROVED_SNAPSHOT=true`. |
| `CMS_URL` | Obligatoria con fuente Directus; debe ser una URL HTTPS válida fuera de local. |
| `CMS_STATIC_TOKEN` | Obligatoria con fuente Directus. Es un secreto de build y no debe ir a Git, HTML, assets del navegador ni logs. |
| `CMS_APPROVED_SNAPSHOT` | Solo se usa para autorizar explícitamente el modo snapshot en producción. |
| `PUBLIC_INSTAGRAM_FEED_URL` | Opcional. El componente usa por defecto la URL pública del Worker si no se define. No apareció entre las variables de Coolify observadas. |

La interfaz confirmó la presencia de los nombres CMS y del sitio, pero sus
valores no se recopilaron. Antes de publicar, confirmar en Coolify el valor
efectivo de `SITE_ENV`, `SITE_URL` y `CMS_DOCUMENTS_SOURCE`; comprobar que
`CMS_URL` apunta al CMS correcto y que el secreto Directus sigue configurado.
No pegar el valor del token en terminal, documentación ni logs.

El snapshot versionado indica origen Directus y contiene 38 documentos públicos
efectivos. Tres archivos PDF de muestra respondieron HTTP 200 durante esta
auditoría. La ejecución de los validadores locales confirma también que el
token no se incorpora a HTML o JavaScript.

## Alcance de esta auditoría

- No se usó staging; el flujo vigente es local → producción.
- No se hizo push, despliegue, modificación de Coolify, cambio DNS, cambio de
  autenticación o token Meta, cambio del Worker ni modificación de Directus.
- La configuración observada en el panel puede cambiar; verificarla de nuevo
  antes de una publicación.
- La estrategia Nixpacks está marcada como obsoleta. No se cambió a Railpack
  porque eso requiere una prueba y autorización separadas.
- No hay health check. Un estado `Running` no basta para validar un release;
  usar las comprobaciones HTTP y visuales del runbook vigente.
- Coolify conserva dos imágenes, pero durante la auditoría la página de rollback
  mostraba solo la imagen en ejecución y la acción Rollback estaba deshabilitada.
  No asumir que existe una imagen anterior utilizable.

Ver el [runbook de publicación y rollback](astro-coolify-production-runbook.md).
