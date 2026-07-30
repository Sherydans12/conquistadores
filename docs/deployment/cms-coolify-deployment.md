# Despliegue CMS + Astro en Coolify

## CMS

1. Confirmar que `Sherydans12/conquistadores-cms` sea privado.
2. Crear un recurso Docker Compose con `docker-compose.yml`.
3. Cargar las variables de `.env.example`; secrets solo en Coolify.
4. Asociar `cms.colegioconquistadores.com` a `directus:8055`.
5. Forzar TLS y configurar cabeceras seguras.
6. Configurar backups de PostgreSQL y uploads.
7. Desplegar y esperar ambos health checks.
8. Ejecutar schema dry-run, revisar y aplicar sobre base vacía/respaldada.
9. Ejecutar bootstrap, revisar policies y activar 2FA.
10. Crear el usuario Astro Build Reader y asignar su token limitado.
11. Importar primero con `--dry-run`, luego los 39 públicos y 7 review.
12. Probar que un PDF público abre y uno en revisión no.

No aplicar schema destructivo ni importar antes de verificar backups.

## Astro

Variables de staging/producción:

```env
CMS_URL=https://cms.colegioconquistadores.com
CMS_STATIC_TOKEN=<secret de Coolify>
CMS_DOCUMENTS_SOURCE=directus
```

CI mantiene `CMS_DOCUMENTS_SOURCE=snapshot` y no necesita internet. Para un
release de emergencia con snapshot:

```env
CMS_DOCUMENTS_SOURCE=snapshot
CMS_APPROVED_SNAPSHOT=true
```

Esta excepción requiere diff revisado y aprobación registrada.

## Flow

Configurar manualmente el Flow descrito en el repositorio CMS:

- evento create/update;
- condición `published + public`;
- validación de metadata y PDF;
- POST al endpoint de deploy de Coolify con token limitado;
- timeout de 10 segundos;
- debounce/concurrencia;
- notificación de error y reintento manual.

El payload y endpoint exactos se verifican contra la versión instalada de
Coolify. No guardar la URL autenticada ni el token en Git.

## Aceptación

- build Directus exitoso con 39 públicos;
- draft/review/hidden/archived excluidos;
- token ausente de HTML y assets JS;
- publicación y retirada disparan un único build;
- un build fallido conserva el sitio anterior;
- restauración de PostgreSQL y uploads probada;
- privacy aprobada;
- reglas 410 aplicadas y verificadas.

Hasta completar esta lista, `documentCms=false` y
`readyForProduction=false`.
