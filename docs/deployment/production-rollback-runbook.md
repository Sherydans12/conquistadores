# Runbook de rollback a WordPress

## Objetivo

Restaurar de forma controlada el sitio público WordPress anterior si el cambio
a Astro produce un impacto material. El rollback devuelve el tráfico web al
origen anterior; no debe alterar correo, usuarios, contraseñas, base de datos,
plugins ni contenido salvo que exista un incidente separado y autorizado.

El hosting WordPress anterior debe mantenerse operativo durante una ventana de
seguridad. La duración de esa ventana es una decisión institucional pendiente.

## Autoridad y registro

Solo el patrocinador institucional o su delegado puede ordenar el rollback, con
recomendación del responsable técnico. Registrar:

- hora de detección y de la decisión;
- síntoma y evidencia pública;
- responsable que ejecuta cada cambio;
- registros web afectados y valores previos/restaurados;
- estado de correo, certificados, proxy y rutas;
- hora en que WordPress vuelve a recibir tráfico;
- comunicaciones emitidas y revisión posterior.

No registrar cookies, credenciales, nonces, enlaces de recuperación ni datos de
estudiantes.

## Condiciones que disparan rollback

El equipo debe revertir o evaluar reversión inmediata si ocurre uno de estos
casos:

1. www entrega errores sostenidos, contenido equivocado, certificado inválido,
   bucles de redirección o una proporción material de 404/5xx.
2. Rutas institucionales críticas, documentos o rutas históricas fallan y no
   existe corrección segura dentro de la ventana.
3. La ruta sensible aprobada deja a usuarios sin acceso, muestra contenido
   incorrecto o presenta un riesgo de sesión, caché, privacidad o
   recuperación.
4. Se detecta impacto en correo causado por un cambio web. Preservar los
   registros de correo y volver el tráfico web sin modificar MX, SPF, DKIM o
   DMARC.
5. Los certificados, assets esenciales, robots/canonical o redirecciones
   producen un daño significativo y no se puede corregir sin riesgo.
6. El responsable institucional determina que la experiencia pública no cumple
   la aprobación otorgada.

Una anomalía menor y acotada puede resolverse sin rollback solo si el
responsable técnico documenta por qué no afecta continuidad, seguridad ni
privacidad.

## Preparación que debe existir

- Exportación vigente de DNS y registro de los valores web antes del corte.
- Registro de qué destino reciben www y dominio raíz, sin asumir si son A,
  AAAA o CNAME.
- Hosting WordPress, archivos y base de datos comprobados como disponibles.
- Certificado WordPress vigente o capacidad documentada de servir HTTPS tras
  restaurar el tráfico.
- Estado anterior de reglas de proxy y redirecciones aprobado/documentado.
- Contactos de DNS/Cloudflare, plataforma, WordPress, correo, portal y
  patrocinador institucional.

## Procedimiento de rollback

### 1. Contener y decidir

1. Declarar incidente y detener nuevas reglas, despliegues o cambios de
   contenido.
2. Confirmar que WordPress anterior responde por un host/origen alternativo
   autorizado antes de dirigirle tráfico público.
3. Decidir si el retorno incluye todo el sitio web o solo desactivar una
   capa de proxy aprobada. Si existe duda sobre sesiones o privacidad,
   privilegiar el retorno completo del sitio web.

### 2. Restaurar tráfico web

1. Restaurar los registros web de www y del dominio raíz a los valores
   registrados antes del corte, o revertir el destino web mediante el control
   de tráfico aprobado.
2. No modificar los registros de correo: MX, SPF, DKIM, DMARC y cualquier
   servicio de correo deben conservarse tal como estaban.
3. Si el cambio usó proxy, desactivar únicamente el proxy de rutas sensibles o
   devolverlo al origen WordPress documentado. Evitar reglas amplias que
   afecten otras rutas.
4. Desactivar las redirecciones nuevas que no existían antes del corte, en
   orden inverso y solo cuando estén identificadas. Restaurar las rutas
   WordPress antiguas sin inventar equivalencias.
5. No aplicar cambios de base de datos, plugins o contraseñas para forzar el
   retorno.

### 3. Certificados y caché

1. Verificar que el certificado de www corresponde al destino restaurado y que
   HTTPS no presenta advertencias ni redirecciones contradictorias.
2. Si se requiere purgar caché Cloudflare, hacerlo solo después de restaurar el
   origen y con el alcance mínimo necesario. Registrar alcance, hora y
   responsable; no purgar por rutina sin confirmar la causa.
3. Confirmar que caché, proxy y origen entregan la misma ruta, host y esquema.
4. Si existe portal separado, no modificar su certificado o DNS salvo que esté
   implicado en el incidente y el responsable del portal lo autorice.

### 4. Validar el retorno

1. Confirmar que la portada WordPress, páginas institucionales, una muestra de
   actividades y documentos responden correctamente por HTTPS.
2. Confirmar que las rutas sensibles vuelven al comportamiento WordPress
   previo sin iniciar sesión, enviar formularios ni solicitar recuperación.
3. Confirmar que robots, sitemap y canonicals corresponden de nuevo al sitio
   WordPress restaurado.
4. El responsable de correo verifica que el servicio sigue operativo mediante
   su prueba autorizada.
5. Revisar 404, 5xx, certificados, redirecciones y logs durante la
   propagación. Mantener el sitio Astro aislado del tráfico público hasta
   investigar.

## Comunicaciones

1. Informar internamente al patrocinador, responsables técnicos y soporte del
   portal que se ejecutó el retorno, su alcance y el siguiente punto de
   actualización.
2. Publicar un aviso externo solo si el patrocinador lo aprueba y existe
   afectación observable para familias o personal. No divulgar causas de
   seguridad ni datos personales.
3. Registrar consultas de usuarios por canal de soporte, sin pedir ni copiar
   contraseñas.

## Conservación de evidencia

Conservar para la revisión posterior:

- exportación DNS anterior y estado restaurado;
- lista de cambios web y reglas afectadas;
- resultados de comprobaciones públicas, crawl y códigos HTTP;
- registros relevantes de CDN/origen, sin datos personales;
- estado de certificados, correo y portal;
- cronología de decisiones y comunicaciones.

## Revisión posterior

1. Realizar una revisión sin culpas con responsables institucionales, de
   plataforma, WordPress, correo y portal.
2. Identificar la causa, rutas afectadas, controles que faltaron y pruebas que
   deben añadirse.
3. Actualizar los runbooks, la matriz de decisión y production-readiness.json
   solo con evidencia y aprobaciones reales.
4. Acordar una nueva fecha de intento únicamente después de resolver los
   bloqueos; el rollback no convierte la arquitectura en aprobada.
