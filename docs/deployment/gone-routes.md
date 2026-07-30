# Rutas retiradas con HTTP 410

Decisión aprobada:

| Ruta | Motivo |
| --- | --- |
| `/notas/` | Notas no se utiliza. |
| `/mi-cuenta/` | No existen cuentas públicas necesarias. |
| `/mi-cuenta/lost-password/` | No se necesita recuperación pública. |
| `/registro/` | No existirá registro público. |

No se redirigen a Inicio. Deben responder `410 Gone` sin renderizar el sitio.
La decisión está versionada en `src/data/legacy-routes.ts`.

## Nginx

Regla preparada, no aplicada:

```nginx
location = /notas/ { return 410; }
location = /mi-cuenta/ { return 410; }
location = /mi-cuenta/lost-password/ { return 410; }
location = /registro/ { return 410; }
```

Si el proxy normaliza la barra final, añadir equivalentes exactos sin slash o
una redirección interna que termine en 410, nunca a `/`.

## Cloudflare Worker alternativo

```js
const gone = new Set([
  '/notas/',
  '/mi-cuenta/',
  '/mi-cuenta/lost-password/',
  '/registro/',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (gone.has(url.pathname)) {
      return new Response('Gone', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
```

La variante exacta depende de la configuración existente; no desplegar ambas
capas sin decidir cuál es autoritativa.

## Validación posterior

```bash
curl -I https://www.colegioconquistadores.com/notas/
curl -I https://www.colegioconquistadores.com/mi-cuenta/
curl -I https://www.colegioconquistadores.com/mi-cuenta/lost-password/
curl -I https://www.colegioconquistadores.com/registro/
```

Las cuatro deben responder 410 sin `Location`. Verificar además 200 en rutas
públicas y 404 en una ruta inexistente.
