# Arquitectura del CMS documental

```text
Visitante
  │
  └── www.colegioconquistadores.com (Astro estático)
          ▲
          │ build con token de servidor
          │
      cms.colegioconquistadores.com (Directus privado)
          ├── PostgreSQL
          └── uploads persistentes
```

## Límite de confianza

El token `CMS_STATIC_TOKEN` existe únicamente en el entorno de build de
Coolify. El módulo Directus se ejecuta en el frontmatter de Astro al generar el
HTML y no se importa desde scripts de navegador.

El visitante no consulta colecciones REST. Al abrir un PDF publicado puede
solicitar un asset estable al dominio CMS; ese acceso se limita por policy a la
carpeta pública y MIME PDF. Las carpetas de revisión y archivo no tienen acceso
anónimo.

## Fuentes y disponibilidad

La instancia Directus es la fuente editorial. El snapshot versionado permite
CI reproducible y desarrollo sin red. Producción admite:

- Directus, con fallo explícito si no responde; o
- snapshot revisado y habilitado con `CMS_APPROVED_SNAPSHOT=true`.

Una lista vacía nunca es un resultado válido. Coolify publica una nueva versión
de Astro solo después de terminar el build, por lo que un fallo conserva el
sitio anterior.

## Datos públicos

Astro solicita una lista cerrada de campos. Excluye `notes_internal`,
`user_created`, `user_updated`, auditoría y configuración. Las categorías
inactivas y los estados draft, review, hidden y archived no cruzan el límite.

## Escalado

La primera versión usa una instancia de Directus, PostgreSQL y rate limiting en
memoria; Redis no aporta una necesidad comprobada. Antes de usar varias réplicas
se deben diseñar sesiones, rate limiting y coordinación compartidos.
