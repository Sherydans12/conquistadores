# Fase 6 — CMS documental e integración build-time

Fecha: 30 de julio de 2026.

## Resultado implementado

El centro de documentos de Astro deja de depender de un arreglo TypeScript
manual en tiempo de ejecución. La fuente se resuelve durante el build mediante
`src/lib/cms/`:

- `directus.ts`: cliente REST de servidor con timeout, campos permitidos y
  validación defensiva;
- `documents.ts`: selección explícita de Directus o snapshot;
- `types.ts`: esquema tipado y validación de runtime.

El navegador recibe solo HTML y el JavaScript de búsqueda local. No recibe
tokens ni ejecuta requests hacia Directus.

## Inventario inicial

El inventario anterior se exportó antes de retirar `src/data/documents.ts`:

- 39 documentos públicos;
- 7 documentos pendientes, guardados en el seed como `review + hidden`;
- 9 categorías;
- URLs heredadas, audiencia, palabras clave, formato y tamaño conocido.

`src/data/generated/documents.seed.json` es la entrada reproducible de la
importación inicial. `documents.snapshot.json` contiene únicamente los 39
públicos y no incluye notas internas, usuarios ni tokens.

## Selección de fuente

`CMS_DOCUMENTS_SOURCE=directus` exige `CMS_URL` y `CMS_STATIC_TOKEN`. Cualquier
timeout, respuesta inválida, lista vacía o configuración incompleta falla el
build.

`CMS_DOCUMENTS_SOURCE=snapshot` valida el archivo versionado. En producción
también exige `CMS_APPROVED_SNAPSHOT=true`.

Sin una selección:

- CI y desarrollo usan snapshot;
- staging usa Directus solo cuando URL y token están configurados;
- producción falla y exige una decisión explícita.

No existe fallback silencioso de Directus a una lista vacía o a datos antiguos
durante un build de producción.

## Orden y exposición

Directus filtra `status=published` y `visibility=public`; el adaptador vuelve a
excluir cualquier estado no público. El orden es:

1. destacados;
2. orden manual;
3. fecha de publicación descendente;
4. título.

Los archivos gestionados usan `/assets/{id}/{filename}` sin token. El Public
Role del CMS debe permitir únicamente PDF de la carpeta pública.

## Comandos

```bash
npm run documents:snapshot
npm run test:documents
npm run validate:documents
npm run ci
```

Actualizar snapshot requiere `CMS_URL` y `CMS_STATIC_TOKEN` en el entorno. El
diff generado debe revisarse antes de commit.

## Privacidad y rutas retiradas

Se añadió `/privacidad/` con `PageLayout`, SEO propio, noindex en staging y
placeholder explícito para el responsable legal/canal no verificado. El footer
la enlaza.

`/notas/`, `/mi-cuenta/`, `/mi-cuenta/lost-password/` y `/registro/` están
registradas como `gone`, `410` y aprobadas. La regla del servidor está
documentada pero no activada.

## Estado

La implementación local no resuelve el blocker de producción. Aún deben
completarse despliegue, aplicación de esquema, usuarios, 2FA, importación,
Flow, prueba de permisos y restauración de backup.
