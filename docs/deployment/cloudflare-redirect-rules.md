# Reglas de redirección propuestas para Cloudflare

## Estado

Este documento prepara reglas futuras. No se aplicó ninguna configuración en
Cloudflare, DNS, Coolify, VPS, WordPress ni producción. La fuente exacta de
decisiones es `src/data/legacy-routes.ts`; el CSV adjunto incluye tanto reglas
aprobadas como propuestas pendientes para impedir una importación ciega.

## Orden recomendado

1. Forzar HTTP a HTTPS conservando ruta y query.
2. Redirigir `colegioconquistadores.com` a
   `https://www.colegioconquistadores.com` conservando ruta y query.
3. Resolver el artefacto exacto
   `wpr_mega_menu=wpr-mega-menu-item-4795` hacia `/` una vez aprobado.
4. Aplicar redirecciones exactas aprobadas del CSV.
5. Aplicar patrones de categorías, autor o paginación solo cuando sus reglas
   exactas hayan sido probadas y aprobadas.
6. Dejar al origen responder rutas normales y 404.

El host y protocolo deben normalizarse en una sola redirección cuando sea
posible para evitar cadenas. Las reglas de contenido deben evaluarse después de
normalizar el host.

## Reglas de host y protocolo

- `http://colegioconquistadores.com/*` →
  `https://www.colegioconquistadores.com/$1`
- `https://colegioconquistadores.com/*` →
  `https://www.colegioconquistadores.com/$1`
- `http://www.colegioconquistadores.com/*` →
  `https://www.colegioconquistadores.com/$1`

Las expresiones futuras deben preservar la ruta y la query, excepto cuando una
regla de contenido indique expresamente reemplazarlas.

## Artefacto de mega menú

La única URL registrada en el inventario es:

`/?wpr_mega_menu=wpr-mega-menu-item-4795`

Debe evaluarse por host, ruta `/` y el par exacto de query. No conviene usar una
regla amplia para cualquier parámetro `wpr_mega_menu`. La propuesta es 301 a
`/`, pero permanece pendiente hasta confirmar que no existe contenido ni tráfico
que justifique otra respuesta.

## Patrones opcionales

El inventario solo acredita:

- `/category/actividades2023/` y páginas 2 a 4;
- `/category/actividades-2024/` y página 2;
- `/author/administrador/` y páginas 2 a 5.

Las reglas exactas del CSV son más seguras para el lanzamiento. Un patrón puede
reemplazarlas después, limitado a esos prefijos y rangos. No debe capturar
categorías, autores ni páginas que no aparezcan en `url-inventory.md`.

## Pruebas previas

- Importar primero en un entorno de prueba o mantener las reglas desactivadas.
- Verificar que solo las filas con `approved=true` entren en el conjunto activo.
- Probar host, protocolo, ruta, query, slash final y conservación de parámetros.
- Confirmar que cada destino responde 200 y que su canonical no contiene query.
- Confirmar que cuenta, recuperación, registro y notas no se redirigen a Inicio.
- Revisar que no existan cadenas, bucles o saltos entre `www` y staging.

## Pruebas posteriores

- Ejecutar `curl -I` sobre cada origen exacto.
- Registrar código, `Location`, número de saltos y destino final.
- Repetir el crawl del inventario de 78 URLs.
- Vigilar 404, cobertura, logs y Search Console durante al menos seis a ocho
  semanas.
- Mantener las redirecciones aprobadas a largo plazo.
