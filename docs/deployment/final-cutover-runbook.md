# Corte final WordPress → Astro usando la misma aplicación

## Decisiones cerradas

- La aplicación actual de staging se promoverá a producción; no se crea una segunda app.
- `horarios-2025` y `ficha-matricula-2025` se retiran del catálogo.
- La actividad parcial `visita-del-kinder-jardin-conquistadores` se elimina.
- El MP4 heredado de 30,8 MB no se migra.
- La página `src/pages/404.astro` es la respuesta visual para URL inexistentes.
- `/horarios-2025/` y `/matriculas-2025/` deben quedar como 404, sin redirección.

## 1. Preparación de contenido

En Directus, conservar auditoría pero retirar del sitio:

1. `horarios-2025`: `status=archived`, `visibility=hidden`.
2. `ficha-matricula-2025`: `status=archived`, `visibility=hidden`.

El frontend también excluye ambos slugs como defensa adicional. Después del
rebuild, actualizar el snapshot versionado con `npm run documents:snapshot`.

## 2. Reglas heredadas

### 301

- `/protocolos-internos/` → `/documentos/?category=protocolos`
- `/category/actividades-2024/` → `/actividades/`
- `/category/actividades-2024/page/2/` → `/actividades/`
- La solicitud a `/` con `wpr_mega_menu=wpr-mega-menu-item-4795` → `/`, sin conservar query.

Se mantienen también las redirecciones aprobadas anteriores de calendarios,
plan lector, RICE, actividades 2023, Uncategorized y autor.

### 410 Gone

Estas rutas no se redirigen y no renderizan Astro:

- `/notas/`
- `/mi-cuenta/`
- `/mi-cuenta/lost-password/`
- `/registro/`

Ejemplo Nginx en la capa autoritativa:

```nginx
location = /notas { return 410; }
location = /notas/ { return 410; }
location = /mi-cuenta { return 410; }
location = /mi-cuenta/ { return 410; }
location = /mi-cuenta/lost-password { return 410; }
location = /mi-cuenta/lost-password/ { return 410; }
location = /registro { return 410; }
location = /registro/ { return 410; }
```

No desplegar reglas equivalentes en dos capas distintas sin definir cuál es la
autoritativa. La query del mega menú requiere una condición sobre query string;
no puede representarse como una redirección de ruta exacta común.

## 3. Backup inmediatamente antes del corte

- Backup final de WordPress y su base de datos.
- Backup de PostgreSQL de Directus.
- Backup del volumen `directus_uploads`.
- Registrar SHA de `main`, versiones de imágenes y hash SHA-256 de respaldos.
- Confirmar que existe una copia fuera de la VPS.

## 4. Promover la aplicación existente

En la misma aplicación Astro de Coolify:

```env
SITE_ENV=production
SITE_URL=https://www.colegioconquistadores.com
CMS_URL=https://cms.colegioconquistadores.com
CMS_DOCUMENTS_SOURCE=directus
CMS_STATIC_TOKEN=<token limitado Astro Build Reader>
```

El Flow de Directus conserva el mismo webhook porque el UUID de la aplicación no
cambia.

En Domains, asignar `https://www.colegioconquistadores.com`. El dominio de
staging puede mantenerse durante la primera verificación, pero después debe
retirarse o redirigirse a producción para evitar dos hosts públicos con el mismo
contenido.

Cambiar los registros DNS necesarios para que `www` apunte al servidor de
Coolify. Definir también la política del dominio raíz y redirigirlo a `www`.

## 5. QA posterior

```bash
curl -I https://www.colegioconquistadores.com/
curl -I https://www.colegioconquistadores.com/privacidad/
curl -I https://www.colegioconquistadores.com/qa-ruta-inexistente/
curl -I https://www.colegioconquistadores.com/notas/
curl -I https://www.colegioconquistadores.com/mi-cuenta/
curl -I https://www.colegioconquistadores.com/mi-cuenta/lost-password/
curl -I https://www.colegioconquistadores.com/registro/
```

Resultados:

- Inicio y Privacidad: `200`.
- Ruta inventada, horarios 2025 y matrículas 2025: `404`.
- Las cuatro rutas sensibles: `410`, sin `Location`.
- Redirecciones aprobadas: `301` con destino exacto.
- `robots.txt` permite indexación en producción.
- El sitemap usa `https://www.colegioconquistadores.com`.
- Los PDF abren desde Directus.
- No aparecen horarios 2025, ficha de matrícula 2025 ni la actividad del Kínder.

## 6. Rollback

No eliminar WordPress durante el periodo inicial. Si la QA falla:

1. Restaurar DNS anterior.
2. Mantener Directus sin cambios destructivos.
3. Desactivar temporalmente el Flow si genera despliegues no deseados.
4. Revisar logs y corregir antes de repetir el corte.
