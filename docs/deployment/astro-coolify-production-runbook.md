# Publicación y rollback de Astro en Coolify

## Estado verificado

Auditoría de solo lectura realizada el 5 de noviembre de 2026:

- Sitio Astro servido por Coolify en `https://www.colegioconquistadores.com`.
- Repositorio `Sherydans12/conquistadores`, rama `main`.
- Despliegue automático por webhook al recibir push a `main`.
- Build estático Nixpacks; Coolify publica `/dist` con `nginx:alpine` por
  el puerto interno 80.
- No hay health check configurado.
- Hay una aplicación Directus separada; no se despliega ni modifica como parte
  del frontend.
- No se usa staging. El flujo es local → producción.
- La homepage pública respondió HTTP 200. El HTML publicado aún no contiene
  `data-instagram-feed`; la integración pendiente del workspace no está en
  producción.

No se hizo commit, push, redeploy, rollback ni cambio de configuración. Antes
de publicar, revisa de nuevo el estado Git, los valores de build en Coolify y
que el objetivo de producción siga siendo la rama `main`.

## 1. Preparar y validar localmente

Desde la raíz del repositorio:

    git status --short --branch
    git diff --check
    npm run check
    npm run build
    npm run test:instagram-feed
    npm run ci

`npm run ci` repite check y build antes de los validadores del proyecto.
Revisa todos los archivos listados por Git, en particular el código y
configuración bajo `instagram-feed-worker/`; Coolify solo construye el frontend
y no despliega el Worker.

Confirma antes del release que Coolify tenga `SITE_ENV=production`,
`SITE_URL=https://www.colegioconquistadores.com` y la fuente documental
aprobada. Si la fuente es Directus, deben estar configuradas
`CMS_DOCUMENTS_SOURCE=directus`, `CMS_URL` y `CMS_STATIC_TOKEN`. No imprimas
el valor del token. Los requisitos completos están en
[production-environment.md](production-environment.md).

## 2. Publicar cuando exista autorización explícita

1. Revisa y selecciona los archivos que se aprobaron para este release. No uses
   `git add -A` sin revisar, porque hay cambios locales pendientes de la
   integración Instagram.
2. Crea un commit en `main` con solo esos archivos.
3. El comando que activa el despliegue automático es:

       git push origin main

   Todo push nuevo a `main` se dirige a producción. No lo ejecutes desde una
   rama o un árbol con cambios no revisados.
4. En Coolify abre el recurso
   `conquistadores:main-yp0gmnfgu5bj97zh3s539bd3`, entra al historial de
   deployments y confirma que el commit nuevo terminó sin errores. Si el
   webhook no inicia un deployment, revisa la integración y luego inicia
   manualmente el despliegue de la rama configurada; no cambies la rama ni las
   variables para resolver un webhook atrasado.

## 3. Verificar el sitio publicado

Como el recurso no tiene health check, valida manualmente:

1. `https://www.colegioconquistadores.com/` responde por HTTPS con HTTP 200,
   certificado válido y sin bucle de redirección.
2. El título, portada, navegación y enlaces internos corresponden al build
   aprobado. Prueba escritorio y móvil.
3. El feed muestra seis publicaciones, no incluye los tres IDs excluidos, las
   seis imágenes cargan y cada tarjeta abre la publicación correcta en
   Instagram. El endpoint debe conservar `Cache-Control: public, max-age=900`.
4. Las páginas de documentos, matrícula y privacidad cargan. Abre una muestra
   de PDF público alojado en Directus y confirma que no se publica un borrador.
5. `/robots.txt`, el sitemap, canonicals y enlaces del dominio apuntan a
   producción y permiten indexación según la configuración aprobada.
6. Revisa errores de consola y solicitudes fallidas. Registra el commit, hora,
   resultado de Coolify y resultado de estas comprobaciones.

No cambies DNS ni purgues caché como paso rutinario. El dominio raíz no figura
en la aplicación Coolify. La respuesta pública de www pasó por Cloudflare, pero
no se inspeccionaron los registros DNS ni el estado de proxy de otros nombres.

## 4. Rollback

### Preferido: imagen previa disponible

1. Detén nuevos pushes a `main` y registra el commit que produjo el incidente.
2. En el recurso de Coolify abre **Rollback**. Selecciona la imagen del último
   commit conocido como bueno y confirma el rollback.
3. Observa el estado y los logs del deployment.
4. Repite las comprobaciones HTTP, visuales, documentales y del feed de la
   sección anterior.

Durante esta auditoría Coolify tenía la retención configurada en dos imágenes,
pero solo mostraba la imagen actual y el botón Rollback estaba deshabilitado.
Comprueba que la imagen buena exista antes de depender de este método.

### Si Coolify no conserva una imagen anterior

Haz una reversión nueva de Git al commit de release que introdujo el fallo y
deja que Coolify construya esa revisión. Sustituye el marcador por el SHA real:

    git switch main
    git pull --ff-only origin main
    git revert --no-edit <release-sha>
    git push origin main

Esto crea un commit nuevo y evita reescribir historial. El push también activa
producción. Verifica el nuevo deployment y el sitio como en la sección 3.

El rollback de Astro no revierte cambios de DNS, Directus, el Worker ni
autenticación de Meta. Este runbook no autoriza cambiar ninguno de ellos.
