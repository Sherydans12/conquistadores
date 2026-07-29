# Auditoría pública de rutas sensibles

Fecha de auditoría: 2026-07-29  
Alcance: solicitudes HTTP GET anónimas a información pública y revisión del
HTML entregado. No se inició sesión, no se enviaron formularios ni se
solicitaron restablecimientos. No se guardaron cookies, nonces, tokens,
contraseñas ni valores de campos.

## Resultado ejecutivo

Las cuatro rutas observadas siguen expuestas en el dominio público, responden
HTTP 200 y permiten indexación. No existe evidencia pública de un portal de
notas individual ni de un proveedor externo: la ruta de notas es la protección
por contraseña de una entrada de WordPress. Las rutas de cuenta y recuperación
dependen del plugin User Registration de WordPress. El registro está
deshabilitado, aunque sigue publicado e indexable.

Esto impide trasladar estas rutas a Astro como páginas estáticas. Antes de
cambiar el dominio principal se requiere una decisión institucional sobre cada
flujo y una salida que no rompa sesiones, recuperación ni acceso a información
de estudiantes.

## Método y límites

- Se revisaron cabeceras, redirecciones, etiquetas SEO, formularios y recursos
  declarados en las respuestas públicas.
- La revisión de cookies se limitó a los nombres de cabeceras Set-Cookie
  observables en una solicitud anónima. No se creó un almacén de cookies y no
  se inspeccionó almacenamiento del navegador.
- Las referencias a nonces y CAPTCHA se documentan solo por su nombre o
  presencia. Sus valores no se registraron.
- La presencia de un plugin en HTML, rutas de recursos o API identifica una
  dependencia aparente; no demuestra su configuración interna.
- No se puede concluir desde información pública quién usa estos flujos, qué
  datos contienen, si el correo funciona, ni si las sesiones sobreviven una
  capa de proxy.

## Hallazgos comunes

| Aspecto | Hallazgo público |
|---|---|
| Host y transporte | Las cuatro URLs responden directamente por HTTPS en www.colegioconquistadores.com. |
| Redirección | No se observó una cabecera Location en la solicitud directa de cada ruta; el estado final fue 200. |
| Servidor visible | La respuesta declara Cloudflare. No se modificó ni se inspeccionó su configuración. |
| Cookies públicas | No se recibió Set-Cookie en las cuatro respuestas GET anónimas. Esto no permite inferir el comportamiento posterior a un POST ni el de un navegador autenticado. |
| Indexación | Las cuatro páginas entregan robots index, follow. La recuperación canonicaliza a Mi cuenta, pero sigue siendo rastreable. |
| Plataforma | Las cabeceras Link declaran la API wp-json y el recurso público wp/v2/pages correspondiente. |
| Capa visual global | Se cargan recursos WordPress/jQuery, Hello Elementor, Elementor/Pro Elements, Royal Elementor Addons, Ajax Search Lite, PDFObject/Document, Header Footer Elementor e Instagram Feed. Son dependencias de la plantilla y no una evidencia de que todas participen en el flujo sensible. |
| CAPTCHA | Aparecen nombres de configuración relacionados con reCAPTCHA en recursos globales, pero no se observó un desafío o campo CAPTCHA visible en los formularios de cuenta, recuperación o notas. |

## Inventario por ruta

### /notas/

| Campo | Evidencia pública |
|---|---|
| HTTP y redirecciones | 200; sin Location observada en la solicitud directa. |
| Título y SEO | Título: Notas - Colegio Conquistadores. Canonical: /notas/. Robots: index, follow. |
| Formulario visible | Un formulario de contraseña de contenido WordPress. |
| Acción y método | POST a /wp-login.php?action=postpass. |
| Campos sin valores | redirect_to, post_password y Submit. Tipos observados: hidden, password y submit. |
| CSRF, nonce o CAPTCHA | No se observó campo nonce ni CAPTCHA en este formulario. La ausencia visible no demuestra la ausencia de controles del servidor. |
| Cookies | Ninguna Set-Cookie en el GET anónimo. WordPress podría emitir una cookie de contraseña solo al enviar el formulario; eso no se probó. |
| Scripts y estilos cargados | Stack WordPress/Elementor descrito arriba; scripts principales: jQuery, jQuery Migrate, PDFObject, Elementor, Royal Elementor Addons, Ajax Search Lite, Pro Elements y Hello Elementor. Los estilos corresponden al core de WordPress y a esos plugins de plantilla. |
| Plugins o señales | WordPress; Elementor, Pro Elements, Royal Elementor Addons, Ajax Search Lite, Document/PDFObject, Header Footer Elementor e Instagram Feed. No se identificó un plugin académico ni de libro de notas. |
| Endpoints públicos referenciados | /wp-json/, /wp-json/wp/v2/pages/4893, /wp-login.php?action=postpass, /wp-admin/admin-ajax.php y /wp-json/wpraddons/v1. |
| Iframe o servicio externo | No se observó iframe ni enlace público a un sistema externo de calificaciones. |
| Dependencia aparente | Protección de contraseña de publicación WordPress, no autenticación por usuario. |
| Enlaces entrantes observados | Fue descubierta en el endpoint público de páginas WordPress; está fuera del sitemap Yoast. No se observó enlace desde las tres rutas sensibles restantes. Un crawl completo posterior debe confirmar enlaces de navegación o referencias externas. |
| Riesgo de cambio | Alto/crítico: retirar o sustituir la ruta sin decisión puede dejar sin acceso a un contenido que se presenta como notas. Mantener la contraseña compartida no equivale a un portal seguro de calificaciones. |

Interpretación: públicamente la página no acredita ser un sistema de notas
individual. Puede ser un aviso, un acceso compartido o un uso institucional
distinto. No se intentó descubrir ni validar la contraseña.

### /mi-cuenta/

| Campo | Evidencia pública |
|---|---|
| HTTP y redirecciones | 200; sin Location observada en la solicitud directa. |
| Título y SEO | Título: Mi cuenta - Colegio Conquistadores. Canonical: /mi-cuenta/. Robots: index, follow. |
| Formulario visible | Formulario de inicio de sesión User Registration. |
| Acción y método | POST a la misma URL (action vacío). |
| Campos sin valores | username, password, user-registration-login-nonce, _wp_http_referer, rememberme, redirect y previous_page. Tipos: text, password, hidden y checkbox. |
| CSRF, nonce o CAPTCHA | Se observan un nonce específico de User Registration y el referer de WordPress. No hubo CAPTCHA visible. Sus valores no se registraron. |
| Cookies | Ninguna Set-Cookie en el GET anónimo. El comportamiento de sesión tras un inicio de sesión no se probó. |
| Scripts y estilos cargados | Stack global más scripts y estilos de User Registration: validación, inputmask, user-registration, lost-password, ur-common, ur-login y tooltipster. |
| Plugins o señales | User Registration, WordPress, Elementor/Pro Elements, Royal Elementor Addons y los recursos globales indicados. |
| Endpoints públicos referenciados | /wp-json/, /wp-json/wp/v2/pages/4883, /wp-admin/admin-ajax.php, /wp-json/wpraddons/v1; el HTML declara rutas User Registration y enlaza recuperación. |
| Enlaces salientes sensibles | Enlaza a /mi-cuenta/lost-password/ y /registro/. |
| Enlaces entrantes observados | Está en page-sitemap.xml. La documentación previa lo registra como página pública. La procedencia exacta desde menús debe confirmarse con un crawl completo antes del corte. |
| Dependencia aparente | Autenticación y sesión WordPress mediante User Registration. No hay evidencia pública de WooCommerce. |
| Riesgo de cambio | Alto: un proxy o cambio de host puede afectar cookie, dominio, SameSite, redirect, nonce y sesión. Un Astro estático no puede reemplazar este flujo. |

### /mi-cuenta/lost-password/

| Campo | Evidencia pública |
|---|---|
| HTTP y redirecciones | 200; sin Location observada en la solicitud directa. |
| Título y SEO | Título: Mi cuenta - Colegio Conquistadores. Canonical: /mi-cuenta/. Robots: index, follow. |
| Formulario visible | Formulario User Registration de recuperación de contraseña. |
| Acción y método | POST a la misma URL (action vacío). |
| Campos sin valores | user_login, ur_reset_password, _wpnonce y _wp_http_referer. Tipos: text, hidden y submit. |
| CSRF, nonce o CAPTCHA | Se observan _wpnonce y referer. No hubo CAPTCHA visible. Sus valores no se registraron. |
| Cookies | Ninguna Set-Cookie en el GET anónimo. No se solicitó recuperación ni se verificó correo, tokens, límites o caducidad. |
| Scripts y estilos cargados | Mismo stack global y recursos específicos de User Registration indicados para Mi cuenta, incluido lost-password. |
| Plugins o señales | User Registration sobre WordPress; no se identificó WooCommerce. |
| Endpoints públicos referenciados | /wp-json/, /wp-json/wp/v2/pages/4883, /wp-admin/admin-ajax.php y /wp-json/wpraddons/v1. |
| Enlaces entrantes observados | Enlace explícito desde /mi-cuenta/ y ruta descubierta en el inventario público. |
| Dependencia aparente | Recuperación de identidad del plugin User Registration y de la entrega de correo configurada en WordPress. |
| Riesgo de cambio | Crítico: un destino incorrecto puede impedir recuperar cuentas o causar enlaces de recuperación que apunten al host equivocado. No puede probarse de forma segura sin una cuenta y autorización institucional. |

### /registro/

| Campo | Evidencia pública |
|---|---|
| HTTP y redirecciones | 200; sin Location observada en la solicitud directa. |
| Título y SEO | Título: Registro - Colegio Conquistadores. Canonical: /registro/. Robots: index, follow. |
| Formulario visible | No se observó formulario. El contenido público indica que el registro está deshabilitado. |
| Acción y campos | No aplica mientras no exista formulario visible. |
| CSRF, nonce o CAPTCHA | No hay formulario con nonce, CSRF o CAPTCHA visible. Solo aparecen referencias globales de plugins. |
| Cookies | Ninguna Set-Cookie en el GET anónimo. |
| Scripts y estilos cargados | Stack global WordPress/Elementor descrito arriba; no se cargaron scripts funcionales de User Registration específicos en la respuesta observada. |
| Plugins o señales | WordPress y señal genérica user-registration-page en el HTML; la página pública no demuestra un registro activo. |
| Endpoints públicos referenciados | /wp-json/, /wp-json/wp/v2/pages/4882, /wp-admin/admin-ajax.php y /wp-json/wpraddons/v1. |
| Enlaces entrantes observados | Está en page-sitemap.xml y recibe un enlace explícito desde /mi-cuenta/. |
| Dependencia aparente | Página WordPress asociada a User Registration, con alta deshabilitada. |
| Riesgo de cambio | Medio: dejarla sin decisión perpetúa una página indexable que no presta servicio; convertirla en registro real sin requisitos abriría un flujo de identidad no autorizado. La retirada, información alternativa o portal deben aprobarse. |

## Conclusiones para /notas/

Con la evidencia pública disponible:

- es una página publicada de WordPress, identificada como página 4893 por la
  API pública;
- usa el formulario estándar de contenido protegido de WordPress;
- no usa iframe ni enlaza públicamente a un proveedor de calificaciones;
- no acredita depender de una cuenta WordPress individual;
- no carga un plugin académico identificable;
- no permite afirmar que sea un portal real de calificaciones, aunque su título
  y propósito aparente requieren tratarla como ruta crítica;
- no se observaron rutas adicionales de notas. Esto no descarta enlaces,
  aplicaciones o recursos que solo sean visibles tras autenticación;
- no estaba en el sitemap, pero la URL publicada es compartible y está
  indexable, por lo que no debe suponerse privada;
- puede separarse del sitio institucional solo después de que el colegio
  confirme el sistema académico, su responsable y la experiencia esperada para
  apoderados, estudiantes y personal.

## Información que debe entregar el colegio

No fue posible determinar públicamente la siguiente información; no debe
inventarse ni inferirse desde el HTML:

| Tema | Confirmación necesaria |
|---|---|
| Sistema y proveedor | Nombre del sistema de notas, proveedor, contrato, URL oficial y si reemplaza o no a la página actual. |
| Responsable | Dueño institucional, administrador técnico, responsable de soporte y contacto de emergencia. |
| Usuarios y roles | Cantidad aproximada de estudiantes, apoderados, docentes y administradores; roles y permisos requeridos. |
| Datos tratados | Notas, asistencia, identificadores, comunicaciones, documentos u otros datos personales que se consultan o almacenan. |
| Acceso | Método de inicio de sesión, segundo factor si existe, políticas de contraseña, dispositivos y accesibilidad. |
| Recuperación | Quién emite los mensajes, dirección remitente, vigencia de enlaces, verificación de identidad y atención cuando falla. |
| Soporte | Canal, horario, tiempo de respuesta, responsables en períodos críticos y procedimiento de escalamiento. |
| Auditoría | Eventos que deben registrarse, quién revisa los accesos y cuánto tiempo se conservan los registros. |
| Respaldo | Responsable, frecuencia, ubicación, restauración probada y continuidad frente a una caída del proveedor. |
| Privacidad | Base institucional y legal, política aplicable, consentimiento cuando corresponda, retención y atención de solicitudes. |

## Implicación de lanzamiento

La presente auditoría es evidencia de preparación, no una aprobación de
arquitectura ni de salida a producción. Las rutas sensibles deben seguir siendo
un bloqueo hasta que exista una decisión institucional y un plan de prueba
autorizado por el responsable del sistema.
