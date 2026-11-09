# Colegio Conquistadores

Sitio institucional construido con Astro.

## Arquitectura actual

- **Frontend:** Astro estático, construido y servido por la aplicación
  `conquistadores:main-yp0gmnfgu5bj97zh3s539bd3` en Coolify.
- **CMS:** Directus, en un servicio y URL independientes. Astro consume su
  catálogo documental durante el build y el sitio enlaza a los archivos
  públicos alojados en Directus.
- **DNS:** Cloudflare. La aplicación de Coolify tiene configurado
  `https://www.colegioconquistadores.com`.
- **Instagram:** el navegador consulta el Worker
  `conquistadores-instagram-feed`; no requiere recompilar Astro para reflejar
  nuevas publicaciones.
- **WordPress y HostingPlus:** infraestructura anterior y fuentes históricas;
  no son el alojamiento actual del frontend.

La revisión de Coolify del 5 de noviembre de 2026 confirmó el repositorio
`Sherydans12/conquistadores`, rama `main`, despliegue automático por webhook
al recibir un push, build estático con Nixpacks y publicación de `/dist`
mediante `nginx:alpine`. La configuración de producción y sus límites están
en [production-environment.md](docs/deployment/production-environment.md).

## Desarrollo local

Las direcciones locales de trabajo son:

- http://localhost:4322/
- http://127.0.0.1:4322/

Instala las dependencias con `npm ci`. Para mantener el servidor en segundo
plano, usa los comandos de Astro:

    astro dev --background
    astro dev status
    astro dev logs
    astro dev stop

Antes de publicar, ejecuta las comprobaciones descritas en
[astro-coolify-production-runbook.md](docs/deployment/astro-coolify-production-runbook.md).
No hay entorno staging en el flujo vigente: los cambios pasan de local a
producción después de revisión y autorización.

## Documentación histórica

`docs/migration/` y varios documentos de `docs/implementation/` describen la
migración desde WordPress. Conservan evidencia histórica, no instrucciones del
alojamiento vigente. Los runbooks antiguos de corte y rollback están marcados
como reemplazados. `production-readiness.json` es un registro fechado el 4 de
agosto de 2026 y no representa una auditoría actual de producción.
