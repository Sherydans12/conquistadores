# Variables de entorno para producción

## Resultado de la auditoría

La configuración de Astro usa solamente dos variables de aplicación:

| Variable | Staging | Producción |
|---|---|---|
| SITE_ENV | staging | production |
| SITE_URL | https://staging.colegioconquistadores.com | https://www.colegioconquistadores.com |

No se identificaron otras variables de entorno consumidas por el repositorio
para construir o ejecutar el sitio. No se deben añadir secretos para esta
aplicación estática basándose en este documento.

En Coolify, la configuración de producción debe ser exactamente:

    SITE_ENV=production
    SITE_URL=https://www.colegioconquistadores.com

El archivo .env.example declara los valores de staging. Las variables de
Coolify o del proveedor que sean propias de la plataforma, de Node o de
construcción no son variables funcionales del sitio y no deben inventarse
como requisito de esta migración.

## Qué valida el código

La función de configuración central acepta producción solo si se cumplen
simultáneamente estas condiciones:

- SITE_ENV es production;
- SITE_URL es una URL HTTPS válida;
- SITE_URL no contiene ruta distinta de raíz, query, fragmento, usuario ni
  contraseña;
- el host es exactamente www.colegioconquistadores.com.

En producción, el build utiliza ese host para site, canonicals, Open Graph y
sitemap, y permite indexación pública.

Para staging, el host canónico se fija a
staging.colegioconquistadores.com, incluso si se proporciona un valor ausente,
desconocido o no válido. Staging no permite indexación: el head usa
noindex,nofollow y robots bloquea el rastreo.

## Errores esperados

| Configuración | Resultado esperado |
|---|---|
| SITE_ENV=production sin SITE_URL | El build falla indicando que producción exige la URL pública exacta. |
| SITE_ENV=production con HTTP, ruta, query, credenciales o host distinto | El build falla indicando que producción exige la URL pública exacta. |
| SITE_ENV=production con URL que no puede parsearse | El build falla indicando que SITE_URL debe ser una URL HTTPS válida. |
| SITE_ENV distinto de production | Se resuelve como staging y noindex; no debe usarse para publicar el dominio público. |
| SITE_URL de staging válida con SITE_ENV=staging | Canonicals y sitemap usan staging; robots responde Disallow. |
| Variables ausentes en staging | Se usa el staging fijo y noindex; esto es una protección, no una señal de preparación para producción. |

## Verificación antes del cambio

Con el artefacto construido usando las variables de producción, revisar:

1. Una página pública contiene canonical con
   https://www.colegioconquistadores.com y sin query.
2. robots.txt permite rastreo y declara el sitemap en el mismo host www.
3. sitemap.xml lista solo URLs públicas indexables del mismo host.
4. Las rutas sensibles no aparecen en sitemap y no se construyen como
   formularios Astro.
5. El entorno staging conserva canonicals de staging, noindex,nofollow y
   robots con Disallow.
6. El resultado de npm run check, npm run build, npm run validate y npm run ci
   es correcto antes de autorizar cualquier cambio de tráfico.

La verificación de variables no sustituye aprobaciones institucionales,
decisión del portal, redirecciones ni respaldo. production-readiness.json debe
seguir con readyForProduction en false hasta que todos los bloqueos reales se
resuelvan.
