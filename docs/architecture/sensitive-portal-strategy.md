# Estrategia para portal sensible

## Estado actual

El sitio Astro se prepara como sitio institucional estático. El sitio público
anterior expone cuatro rutas sensibles en WordPress:

- /notas/ es una página protegida por contraseña compartida de WordPress; no se
  identificó públicamente un sistema de calificaciones ni un iframe externo.
- /mi-cuenta/ es un inicio de sesión del plugin User Registration.
- /mi-cuenta/lost-password/ es la recuperación del mismo plugin.
- /registro/ informa que el registro está deshabilitado.

Todas responden 200 e index, follow en el sitio anterior. La evidencia completa
está en ../security/public-sensitive-routes-audit.md. Ninguna de estas
funciones existe en el runtime Astro y no debe simularse con páginas estáticas.

## Datos que faltan

La evidencia pública no permite identificar el sistema de notas, proveedor,
usuarios, roles, datos tratados, responsable, soporte, recuperación, auditoría,
respaldo ni requisitos de privacidad. Tampoco demuestra si hay sesiones activas
que sobrevivan un proxy. El colegio debe confirmar estos puntos antes de
autorizar una arquitectura.

## Opciones evaluadas

### Opción A: portal en subdominio

Esquema propuesto:

    www.colegioconquistadores.com  -> Astro institucional
    portal.colegioconquistadores.com -> portal seguro

Ventajas:

- Aísla el portal autenticado del sitio institucional estático.
- Las cookies pueden ser host-only para portal, reduciendo exposición y
  colisiones con el sitio público.
- Permite certificados, registros, monitoreo, despliegue y rollback del portal
  como unidad separada.
- Hace explícito que la autenticación, recuperación y autorización pertenecen
  al proveedor del portal, no a Astro.
- Reduce la dependencia futura de WordPress y permite conservar el hosting
  anterior durante la transición sin mezclar sesiones.

Aspectos a resolver:

- Definir la URL de entrada y cómo se comunicarán las rutas antiguas.
- Configurar certificado para el subdominio y confirmar correo transaccional
  del proveedor sin alterar los registros de correo institucional.
- Verificar que los cookies se emitan para portal y que no requieran compartir
  dominio con www.
- Diseñar una experiencia clara: el enlace institucional abre el portal y
  explica dónde pedir ayuda.
- Confirmar la compatibilidad del proveedor existente o su migración.

Rollback: alto. www puede volver a WordPress o Astro sin cambiar el portal, y
el portal puede mantenerse en su proveedor mientras se resuelve el sitio
institucional.

### Opción B: conservar rutas bajo el dominio principal mediante proxy

Esquema temporal:

    /notas/*
    /mi-cuenta/*
    servidas desde el hosting WordPress anterior detrás del dominio principal

Ventajas:

- Mantiene las URLs conocidas y reduce el cambio visible para usuarios.
- Puede conservar temporalmente un flujo WordPress existente cuando no hay
  tiempo para moverlo.
- Permite devolver el resto del sitio a WordPress con pocas decisiones de URL.

Riesgos y condiciones:

- El proxy debe preservar el Host esperado por WordPress, esquema HTTPS,
  cabeceras de origen, rutas, query, respuestas Location y recursos absolutos.
- Las cookies de WordPress, sesiones, nonces y CSRF pueden fallar si cambian
  dominio, Secure, HttpOnly, SameSite, Path o URL de retorno.
- El restablecimiento podría generar correos y enlaces con host incorrecto.
- WordPress puede producir URL absolutas al host anterior, contenido mixto o
  cadenas de redirección.
- Caché de Cloudflare, proxy inverso y caché de aplicación deben excluir
  respuestas autenticadas y formularios. Una configuración incorrecta puede
  filtrar respuestas o romper sesiones.
- Requiere coordinación y pruebas integrales autorizadas en Coolify/Traefik o
  Cloudflare. Esta fase no tiene acceso ni autorización para hacerlas.

Por no poder probar sesiones completas de manera pública y segura, esta opción
se clasifica como de mayor riesgo operacional. Solo puede ser una contingencia
temporal, con propietario, fecha de revisión y plan de reversión.

### Opción C: reemplazar por un portal nuevo

Un portal nuevo podría alcanzar una solución independiente de WordPress, pero
no debe construirse hasta definir requisitos institucionales.

Debe cubrir, como mínimo:

- autenticación y recuperación administradas por un proveedor adecuado;
- autorización por rol y por relación válida con el estudiante;
- cifrado en tránsito y almacenamiento conforme al proveedor y política
  institucional;
- bitácora de accesos, consultas, cambios y eventos de seguridad;
- respaldo, restauración comprobada y plan de continuidad;
- privacidad, retención de datos, atención de solicitudes y acuerdos con
  proveedores;
- integración con la fuente oficial de notas, sin duplicar datos sin dueño
  claro;
- soporte, capacitación, tiempos de respuesta y responsables.

Es la opción con mayor esfuerzo, costo y plazo relativos. Su seguridad no se
puede puntuar como garantizada hasta elegir proveedor, requisitos y operación.

## Matriz de decisión provisional

Escala: 1 es desfavorable y 5 es favorable. En esfuerzo y costo, 5 significa
menor esfuerzo o costo relativo. En riesgo de lanzamiento, 5 significa menor
riesgo. Las puntuaciones son una evaluación técnica provisional, no una
decisión del colegio.

| Criterio | A. Subdominio | B. Proxy temporal | C. Portal nuevo | Explicación |
|---|---:|---:|---:|---|
| Seguridad | 5 | 2 | 4 | Aísla cookies y superficie; B acopla sesiones al proxy; C puede ser sólido, pero aún no está definido. |
| Continuidad | 4 | 5 | 2 | B conserva URLs existentes; A depende de una comunicación y proveedor; C requiere migración. |
| Esfuerzo | 3 | 2 | 1 | A requiere coordinación de subdominio; B exige pruebas complejas; C es un proyecto completo. |
| Costo | 3 | 3 | 1 | A puede usar proveedor existente; B mantiene dos plataformas; C incluye desarrollo y operación. |
| Reversibilidad | 5 | 4 | 3 | A separa decisiones; B puede desactivar proxy, pero afecta sesiones; C implica datos y adopción. |
| Independencia de WordPress | 5 | 1 | 5 | A y C permiten separar identidad; B sigue dependiendo de WordPress. |
| Experiencia de usuarios | 4 | 5 | 3 | B conserva URLs; A es clara con buena comunicación; C depende de diseño y migración. |
| Administración | 4 | 2 | 3 | A delimita responsables; B distribuye diagnóstico entre capas; C requiere nueva operación. |
| Mantenimiento | 4 | 1 | 3 | A reduce acoplamiento; B suma proxy, WordPress y cachés; C requiere equipo y ciclo propio. |
| Compatibilidad con sistema actual | 3 | 4 | 2 | B es más compatible, aunque no está validado; A depende de integración; C debe construirla. |
| Riesgo durante lanzamiento | 4 | 1 | 2 | A permite cambios separados; B es riesgosa sin pruebas de sesión; C tiene alto cambio simultáneo. |
| Total orientativo | 44 | 30 | 29 | No sustituye aprobación institucional ni pruebas autorizadas. |

## Recomendación provisional

La recomendación técnica provisional es la opción A: sitio institucional en
www y portal autenticado aislado en portal. La evidencia respalda esta
preferencia porque las rutas actuales mezclan una contraseña compartida y
sesiones WordPress con el sitio público, mientras que Astro es estático.

La recomendación solo es válida si el colegio confirma el sistema académico,
autoriza al responsable, acepta la URL del portal y se valida la compatibilidad
del proveedor. No constituye aprobación institucional ni permiso para crear el
subdominio.

La contingencia es la opción B, exclusivamente para continuidad temporal si el
portal existente debe seguir funcionando y un responsable puede aprobar y
probar de manera integral el proxy. Debe marcarse como alto riesgo y no
implementarse sin una ventana de cambio, criterios de éxito y rollback.

## Seguridad, privacidad, cookies y dominios

- Astro no debe recibir, emitir ni procesar credenciales, contraseñas,
  restablecimientos o notas.
- El portal debe usar cookies host-only y seguras, HTTPS, HttpOnly y una
  política SameSite acorde al flujo real. Sus atributos deben validarse por el
  responsable del portal.
- Las rutas de login, recuperación, registro y notas deben estar fuera del
  sitemap y no indexables una vez se decida su destino. No se debe usar
  robots.txt como única medida de retirada.
- Los correos de recuperación deben pertenecer al proveedor de identidad y
  mantener un dominio y enlaces coherentes con el portal.
- El dueño de los datos debe definir minimización, acceso por rol, retención,
  bitácoras, respaldos y atención de incidentes antes de tratar datos de
  estudiantes.
- No se deben compartir cookies entre www y portal sin una necesidad
  documentada y revisión de seguridad.

## Administración futura de WordPress

La separación recomendable es:

    www  -> Astro
    admin o cms -> WordPress editorial
    portal -> funciones autenticadas

WordPress puede conservarse como CMS headless si el colegio requiere edición
editorial. En ese caso:

- el frontend WordPress no debe ser el sitio público indexable; se debe decidir
  una URL editorial no indexable y evitar que compita con www;
- wp-admin debe quedar protegido con cuentas individuales, segundo factor,
  mínimo privilegio, actualización y restricciones de acceso apropiadas; el
  mecanismo exacto requiere decisión del administrador;
- la REST API debe quedar limitada a lo indispensable para build/importación,
  con escritura autenticada y sin exponer datos sensibles;
- los despliegues deben dispararse tras publicación mediante un mecanismo
  autenticado, registrado y reversible, o por una importación controlada;
- Astro debe obtener contenido en build o importación de servidor, nunca desde
  el navegador del visitante;
- imágenes y documentos deben vivir en almacenamiento estable con URLs
  deliberadas y respaldo, en vez de depender de una biblioteca WordPress sin
  plan de continuidad;
- WordPress y su base de datos requieren respaldos con restauración probada,
  responsable y retención definida.

Estos son principios de diseño; no se configuró un subdominio, API, webhook ni
control administrativo.

## Rollback y riesgo

El hosting WordPress anterior debe permanecer operativo durante una ventana de
seguridad cuya duración es una decisión pendiente del colegio. La reversión del
sitio institucional debe poder devolver solo el tráfico web a WordPress sin
afectar correo. La estrategia detallada se encuentra en
../deployment/production-rollback-runbook.md.

Riesgos principales:

1. Cambiar www sin decisión para las rutas sensibles puede dejar enlaces 404,
   contenido sin acceso o una página estática engañosa.
2. Un proxy de sesión mal configurado puede romper recuperación, generar URLs
   incorrectas o exponer respuestas cacheadas.
3. La contraseña compartida actual no proporciona autorización individual para
   notas.
4. Un portal nuevo sin fuente de datos, soporte y respaldo definidos puede
   trasladar el riesgo en lugar de resolverlo.

## Decisiones necesarias

1. Confirmar qué es realmente Notas y su sistema oficial.
2. Decidir el destino de Mi cuenta, recuperación y Registro.
3. Nombrar responsables funcionales, técnicos y de privacidad.
4. Aprobar o rechazar el portal en subdominio y una ruta de contingencia.
5. Definir cuándo se retirarán las rutas WordPress y cuánto tiempo quedará
   operativo el hosting anterior.
6. Aprobar un plan de pruebas autorizado para el proveedor elegido.

## Orden de implementación futuro

1. Recibir las decisiones y datos faltantes del colegio.
2. Seleccionar proveedor/propietario del portal y documentar requisitos.
3. Diseñar la experiencia de enlace, noindex y comunicación de las rutas
   antiguas.
4. Preparar el portal o, solo si se aprueba, un proxy temporal en un entorno
   controlado.
5. Ejecutar pruebas autorizadas de identidad, roles, recuperación, correo,
   privacidad y rollback.
6. Aprobar las redirecciones finales y el cambio de dominio.
7. Ejecutar el corte mediante el runbook y conservar la reversión disponible.

La recomendación provisional, la decisión institucional y la implementación
futura son etapas distintas. Este documento cubre las dos primeras; no autoriza
la tercera.
