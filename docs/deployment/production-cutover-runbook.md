# Runbook de cambio a producción

## Propósito y límites

Este runbook describe un cambio futuro y reversible del sitio institucional
hacia Astro. No ejecuta cambios en DNS, Cloudflare, Coolify, VPS, cPanel,
WordPress, correo, usuarios, contraseñas, plugins, base de datos, dominio ni
redirecciones.

No autoriza el lanzamiento mientras production-readiness.json mantenga
readyForProduction en false. Un responsable institucional debe dirigir el
cambio y registrar hora, responsable, resultado y decisión de continuar o
revertir para cada paso.

## Roles mínimos antes de iniciar

| Rol | Responsabilidad |
|---|---|
| Patrocinador institucional | Autoriza el cambio, contenido, privacidad, portal y comunicaciones. |
| Responsable DNS/Cloudflare | Ejecuta solo los cambios aprobados de tráfico web y conserva exportaciones previas. |
| Responsable de plataforma | Publica el build Astro configurado y verifica el origen alternativo. |
| Responsable WordPress | Confirma respaldo, estado del hosting anterior y capacidad de rollback. |
| Responsable de correo | Verifica que MX, SPF, DKIM, DMARC y servicios de correo no resulten afectados. |
| Responsable del portal | Confirma el destino de notas/cuenta y las pruebas autorizadas. |
| Observador de lanzamiento | Registra resultados, errores, logs y la decisión de rollback. |

## Antes del cambio

### Aprobaciones y punto de partida

1. Confirmar por escrito aprobación institucional de contenido, fotografías,
   personal, talleres, academias, documentos, contacto, redes, privacidad y
   analítica.
2. Confirmar la decisión para Notas, Mi cuenta, recuperación y Registro. No
   iniciar el corte si alguna ruta queda sin destino aprobado.
3. Confirmar las redirecciones aprobadas una a una; no importar las filas
   pendientes del CSV de redirecciones.
4. Definir la ventana, responsables, canal de comunicación, umbrales de
   rollback y quién tiene autoridad para activarlo.
5. Guardar el estado de producción como no listo hasta que las decisiones sean
   reales; una recomendación técnica no sustituye estas aprobaciones.

### Respaldos y conservación

1. El responsable WordPress debe crear y verificar un respaldo recuperable de
   archivos, configuración y contenido del hosting anterior.
2. Debe crear y verificar un respaldo recuperable de la base de datos
   WordPress, con fecha, ubicación, responsable y procedimiento de
   restauración documentados.
3. Conservar una exportación de la zona DNS y registrar los valores vigentes
   de los registros web antes de cambiarlos.
4. Mantener operativo el hosting WordPress anterior durante la ventana de
   seguridad. Su duración queda pendiente de decisión institucional.
5. No modificar registros de correo; tomar una línea base de recepción y envío
   según el procedimiento autorizado del colegio.

### Preparación técnica y SEO

1. Construir y validar Astro con variables de producción exactas:

       SITE_ENV=production
       SITE_URL=https://www.colegioconquistadores.com

2. Verificar en el artefacto resultante que canonicals, Open Graph, sitemap y
   robots usan exclusivamente el host www de producción.
3. Comprobar que el sitemap solo incluye rutas públicas indexables y excluye
   notas, cuenta, recuperación, registro, filtros y rutas técnicas.
4. Revisar robots en producción prevista: debe permitir el sitio público y
   declarar el sitemap del host www. En staging debe continuar noindex y
   bloqueado para rastreo.
5. Revisar las 55 rutas Astro, la 404, navegación, enlaces internos, documentos
   y presupuesto de recursos. Conservar el resultado de CI.
6. Ejecutar una revisión comparativa contra el inventario de 78 URLs y
   clasificar cada una como conservar, redirigir aprobado, portal aprobado,
   retirar aprobado o pendiente. No dejar rutas sensibles como suposición.
7. Verificar los destinos de todas las redirecciones aprobadas y que no haya
   cadenas, loops ni destino a staging.
8. Preparar monitoreo de disponibilidad, errores 404/5xx, registros del origen,
   certificados, Search Console y Core Web Vitals.

### Portal sensible

1. Confirmar que el portal aprobado existe, tiene propietario y no apunta a una
   página estática que imite acceso.
2. Si se eligió un subdominio, confirmar certificado, destino, noindex y
   procedimiento de soporte; no crear ni cambiar el subdominio en esta fase de
   documentación.
3. Si excepcionalmente se aprobó un proxy temporal, disponer de evidencia de
   pruebas autorizadas de sesión, recuperación, cookies, CSRF, URL absolutas,
   HTTPS, caché y rollback. Sin esa evidencia, no activarlo.
4. Confirmar que Registro tiene una respuesta institucional aprobada. No abrir
   altas de usuarios como parte del cambio del sitio.

## Durante el cambio

Registrar cada resultado en una bitácora de lanzamiento. Si se cumple una
condición de rollback, detener los pasos restantes y seguir el runbook de
reversión.

1. Publicar el build Astro ya validado en modo producción, manteniéndolo fuera
   del tráfico público hasta completar la comprobación por host alternativo u
   origen autorizado.
2. Validar por el host alternativo las rutas públicas prioritarias, robots,
   sitemap, canonicals, assets, respuesta 404 y certificado del origen. No
   enviar formularios ni usar credenciales.
3. El responsable DNS/Cloudflare actualiza únicamente el registro o destino web
   autorizado para www y, si corresponde, el dominio raíz según el plan
   aprobado. Conservar MX y demás registros de correo sin cambios.
4. Esperar y observar la propagación conforme al TTL previamente registrado.
5. Activar un proxy de rutas sensibles únicamente si está expresamente aprobado
   y validado. Si no lo está, mantener las rutas fuera del cambio hasta su
   decisión; no crear una redirección improvisada.
6. Aplicar solo redirecciones aprobadas, en el orden documentado. Confirmar que
   el host y HTTPS se normalizan en un único salto cuando sea posible.
7. Comprobar públicamente rutas principales, una muestra de rutas históricas,
   documentos, rutas de redirección aprobadas y una URL inexistente. No probar
   login, recuperación, registro ni contraseñas.
8. Comprobar en móvil navegación, legibilidad, enlaces, documentación y
   ausencia de desbordamiento en las rutas prioritarias.
9. Verificar certificados de www y del destino del portal que corresponda.
10. El responsable de correo verifica que los servicios de correo sigan
    funcionando conforme a su prueba autorizada, sin cambiar registros de
    correo.

## Después del cambio

### Validación inmediata

1. Ejecutar un crawl de las 78 URLs inventariadas y registrar HTTP final,
   destino, canonical y robots.
2. Verificar cada redirección 301 aprobada, preservación de ruta/query cuando
   corresponda, ausencia de cadenas y destino 200.
3. Revisar 404, 5xx, redirecciones inesperadas, errores de assets y logs de
   origen/CDN.
4. Confirmar sitemap, robots, canonicals y páginas indexables en el dominio
   público. No solicitar indexación de rutas sensibles.
5. Revisar Search Console cuando el responsable tenga acceso: cobertura,
   sitemap, errores, inspección de URL y cambios de tráfico.
6. Seguir Core Web Vitals, disponibilidad, rendimiento móvil y errores de
   navegador en la ventana acordada.
7. Comprobar por el responsable que correo, formularios públicos aprobados y
   enlaces de contacto conservan su comportamiento. No convertir esta
   comprobación en una prueba de cuenta o recuperación.
8. El responsable del portal valida la disponibilidad según su procedimiento
   autorizado y reporta incidentes sin compartir datos personales en la
   bitácora.

### Estabilización y cierre

1. Mantener el hosting WordPress anterior operativo y el rollback disponible.
2. Conservar logs, capturas de cabeceras, resultados del crawl, exportación DNS
   previa y lista de cambios realizados.
3. Comunicar resultado a responsables institucionales, incluyendo incidencias,
   rutas pendientes y la fecha prevista de revisión de la ventana de seguridad.
4. No retirar WordPress ni cambiar el estado a listo para producción hasta que
   el colegio apruebe el cierre de la ventana y los indicadores acordados.

## Prohibiciones durante el cambio

- No tocar MX, SPF, DKIM, DMARC ni cuentas de correo como parte del cambio web.
- No cambiar contraseñas, usuarios, base de datos, plugins o configuración
  WordPress para compensar un error de Astro.
- No redirigir Notas, Mi cuenta o recuperación a Inicio.
- No publicar credenciales, cookies, nonces, tokens, datos de estudiantes ni
  resultados de portales en la bitácora.
- No desactivar el origen WordPress antes de que la reversión haya sido
  comprobada como disponible.
