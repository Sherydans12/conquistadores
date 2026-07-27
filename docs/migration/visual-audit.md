# Auditoría visual

Auditoría realizada el 2026-07-27 con navegador automatizado sobre el sitio público. Se usaron viewports de 1440 × 1000 px para escritorio y 390 × 844 px para móvil. El ancho útil observado en la mayoría de páginas móviles fue 375 px por la barra de desplazamiento.

Se auditaron visualmente 24 páginas/plantillas representativas y se guardaron 49 capturas: 24 de escritorio, 24 equivalentes en móvil y una captura adicional del menú móvil abierto. Cada PNG corresponde al primer viewport; el contenido bajo el pliegue se revisó mediante DOM, alturas, enlaces y elementos funcionales. Se evitó el cosido de página completa porque el header `sticky` producía duplicados artificiales en la captura automatizada.

## Cobertura de capturas

| Página o plantilla | Escritorio | Móvil |
|---|---|---|
| Inicio | [inicio](screenshots/desktop/inicio.png) | [inicio](screenshots/mobile/inicio.png) |
| Menú móvil abierto | — | [menú abierto](screenshots/mobile/inicio-menu-abierto.png) |
| Quiénes somos | [escritorio](screenshots/desktop/quienes-somos.png) | [móvil](screenshots/mobile/quienes-somos.png) |
| Talleres | [escritorio](screenshots/desktop/talleres.png) | [móvil](screenshots/mobile/talleres.png) |
| Academias | [escritorio](screenshots/desktop/academias.png) | [móvil](screenshots/mobile/academias.png) |
| Documentos | [escritorio](screenshots/desktop/documentos.png) | [móvil](screenshots/mobile/documentos.png) |
| Registro | [escritorio](screenshots/desktop/registro.png) | [móvil](screenshots/mobile/registro.png) |
| Mi cuenta | [escritorio](screenshots/desktop/mi-cuenta.png) | [móvil](screenshots/mobile/mi-cuenta.png) |
| Notas protegidas | [escritorio](screenshots/desktop/notas.png) | [móvil](screenshots/mobile/notas.png) |
| Actividades | [escritorio](screenshots/desktop/actividades.png) | [móvil](screenshots/mobile/actividades.png) |
| Protocolos internos | [escritorio](screenshots/desktop/protocolos-internos.png) | [móvil](screenshots/mobile/protocolos-internos.png) |
| Personal | [escritorio](screenshots/desktop/personal.png) | [móvil](screenshots/mobile/personal.png) |
| Horarios 2025 | [escritorio](screenshots/desktop/horarios-2025.png) | [móvil](screenshots/mobile/horarios-2025.png) |
| Matrículas 2025 | [escritorio](screenshots/desktop/matriculas-2025.png) | [móvil](screenshots/mobile/matriculas-2025.png) |
| Plan lector 2026 | [escritorio](screenshots/desktop/plan-lector-2026.png) | [móvil](screenshots/mobile/plan-lector-2026.png) |
| Matrículas 2026 | [escritorio](screenshots/desktop/matriculas-2026.png) | [móvil](screenshots/mobile/matriculas-2026.png) |
| Evaluaciones 2026 | [escritorio](screenshots/desktop/calendario-evaluaciones-2026.png) | [móvil](screenshots/mobile/calendario-evaluaciones-2026.png) |
| Reglamento de convivencia | [escritorio](screenshots/desktop/reglamento-convivencia.png) | [móvil](screenshots/mobile/reglamento-convivencia.png) |
| Archivo Actividades 2023 | [escritorio](screenshots/desktop/categoria-actividades-2023.png) | [móvil](screenshots/mobile/categoria-actividades-2023.png) |
| Archivo Actividades 2024 | [escritorio](screenshots/desktop/categoria-actividades-2024.png) | [móvil](screenshots/mobile/categoria-actividades-2024.png) |
| Archivo “Uncategorized” | [escritorio](screenshots/desktop/categoria-sin-categoria.png) | [móvil](screenshots/mobile/categoria-sin-categoria.png) |
| Archivo de autor | [escritorio](screenshots/desktop/autor-administrador.png) | [móvil](screenshots/mobile/autor-administrador.png) |
| Entrada 2023 representativa | [escritorio](screenshots/desktop/actividad-bienvenida-2023.png) | [móvil](screenshots/mobile/actividad-bienvenida-2023.png) |
| Entrada WRO 2025 | [escritorio](screenshots/desktop/actividad-wro-2025.png) | [móvil](screenshots/mobile/actividad-wro-2025.png) |
| Gala folclórica con tabla/Drive | [escritorio](screenshots/desktop/actividad-gala-folclorica-2025.png) | [móvil](screenshots/mobile/actividad-gala-folclorica-2025.png) |

Las restantes entradas usan la misma plantilla de actividad. La cobertura combina una entrada temprana, la publicación más reciente y la publicación con tabla y once descargas externas.

## Sistema visual observado

### Header y navegación

- Barra superior blanca de aviso con “Calendario de Evaluaciones 2026 Actualizado”.
- Header azul marino, logo a la izquierda, navegación en mayúsculas y CTA dorado “Matrículas 2026”.
- Navegación principal: Inicio, Evaluaciones 2026, anclas de Historia/Actividades/Redes/Contacto, Personal y un desplegable Documentos.
- El desplegable enlaza Plan Lector 2026, Protocolos, Reglamento de convivencia, dos PDF globales y Certificados de Estudios en Mineduc.
- En móvil, el logo deja de ocupar el primer plano; se muestran un botón hamburguesa y el CTA de matrícula. El menú abierto ocupa una tarjeta azul con borde dorado y conserva el submenú Documentos.
- El header se vuelve `sticky`; debe conservarse el acceso rápido, pero conviene reducir su altura y validar foco, Escape, `aria-expanded` y bloqueo de scroll.

### Hero

- Smart Slider con fotografía de la fachada, overlay oscuro, tipografía condensada en mayúsculas y CTA azul.
- Mensajes reconocibles: “Colegio Conquistadores”, “Aprender con alegría”, dirección y “Matrículas abiertas”.
- En móvil el texto sigue legible, aunque ocupa gran parte del viewport.
- La CTA del hero todavía apunta a `/matriculas-2025/`, mientras el header apunta a 2026. Es una inconsistencia prioritaria.

### Tipografías

- Montserrat es la tipografía visual dominante para navegación, títulos, botones y tarjetas.
- El `body` declara fallback de sistema (`Segoe UI`, Roboto, Helvetica/Arial), aunque gran parte del contenido de Elementor vuelve a Montserrat.
- El hero usa una familia condensada distinta o una variante de display cargada por el slider.
- Hay uso intenso de mayúsculas. Conviene mantenerlo en títulos cortos, no en párrafos ni textos accesibles.

### Colores

Paleta aproximada extraída de estilos computados y capturas:

| Uso | Color aproximado |
|---|---|
| Azul principal | `#1a2779` |
| Azul secundario | `#253e85` |
| Dorado/amarillo | `#e8b94d` |
| Turquesa de estadísticas | `#20bca6` |
| Morado de estadísticas | `#8b3eaa` |
| Fondo general | `#f1f1f1` |
| Texto | `#333333` |
| Superficies | `#ffffff` |

La combinación azul/dorado, el logo y la frase “Aprender con alegría” son los elementos de identidad que más conviene preservar.

### Botones, tarjetas y banners

- Botones azules o dorados, texto blanco, radio de borde cercano a 5 px.
- Tarjetas blancas con iconos circulares azules para documentos y protocolos.
- Tarjetas de personal con foto circular, nombre y cargo; en móvil pasan a una columna.
- Tarjetas de actividades con imagen, categoría, fecha y tiempo de lectura.
- Las páginas 2026 (`matriculas-2026`, `plan-lector-2026`, `calendario-de-evaluaciones-2026`) tienen un sistema más limpio: tarjetas con borde sutil, chips por ciclo, acentos amarillos y navegación lateral.
- La barra de aviso se repite en todas las plantillas y consume altura móvil.

### Galerías, carruseles, tablas y embebidos

- Smart Slider se usa en el hero y en galerías de talleres, academias y actividades.
- Las entradas históricas usan galerías/carruseles con numerosas imágenes, muchas cargadas desde carpetas `sliderNN`.
- La Gala Raíz Folclórica contiene una tabla real de 11 filas × 3 columnas y once botones a Google Drive.
- La portada incluye feed de Instagram, video de YouTube y mapa de Google.
- No se encontraron tablas en las demás plantillas representativas.

### Formularios

- `Mi cuenta` muestra un formulario de acceso generado por User Registration.
- `Notas` muestra el formulario de contraseña de WordPress.
- `Registro` solo informa en inglés que el registro está deshabilitado.
- `Actividades` y las entradas incorporan el buscador Ajax Search Lite.
- No hay formulario público de contacto en la portada; el contacto visible es teléfono y mapa.

### Footer

- Footer azul con logo pequeño y copyright “2023-2026 Colegio Conquistadores”.
- No contiene navegación secundaria, dirección, políticas ni enlaces sociales visibles.
- Conviene ampliar el footer en Astro con datos de contacto, navegación, accesibilidad, privacidad y documentos legales, sin perder su simplicidad.

## Responsive

- Las 24 páginas auditadas no mostraron overflow horizontal: el ancho del `body` coincidió con el ancho útil del viewport.
- El layout pasa de grillas a una columna de forma consistente.
- Las páginas largas se vuelven excesivas en móvil: `/actividades/` alcanzó aproximadamente 24.795 px; personal, archivos y autor superaron ampliamente 9.000 px.
- El menú móvil funciona, expone `aria-expanded` y mantiene el CTA, pero la jerarquía del submenú no es evidente hasta interactuar.
- Las tarjetas 2026 responden mejor que las páginas heredadas y deberían ser la base visual.
- La tabla de la gala no produjo overflow en la comprobación de ancho, pero debe envolverse en un contenedor desplazable en la reconstrucción.

## Animaciones visibles

- Contadores numéricos de la portada.
- Transiciones del Smart Slider y carruseles.
- Tabs Historia/Misión/Visión/Valores.
- Hover y transiciones de botones/tarjetas.
- Botón “volver arriba”.

Las animaciones son mayormente controladas por JavaScript de plugins; no se detectó una lista útil de `animation-name` CSS en la portada. En Astro deben reducirse a transiciones discretas y respetar `prefers-reduced-motion`.

## Inconsistencias y deuda visual

- Mezcla de tres generaciones: legado Elementor, archivos del tema y páginas 2026 mucho más refinadas.
- La portada inicia los contadores en cero y depende de JS para alcanzar valores reales.
- CTA del hero desactualizada hacia Matrículas 2025.
- `Matriculas 2025` muestra el título visual “Matriculas 2026” y mezcla documentos de años.
- Capitalización y ortografía inconsistentes en nombres/cargos del personal.
- 148 de 189 imágenes usadas carecen de texto alternativo procesable.
- El logo y varios iconos globales no tienen `alt`.
- `Uncategorized`, autor y archivos duplican tarjetas de actividades.
- Muchas tarjetas usan imágenes grandes o nombres “WhatsApp”, “Screenshot” y “Untitled”.
- Falta un H1 semántico en 60 de 68 URLs del sitemap, aunque visualmente existan títulos H2.

## Conservar

- Identidad azul/dorado, logo, lema y fotografía de la fachada.
- Estructura del hero y CTA de admisión, actualizando año/URL.
- Accesos rápidos a Evaluaciones, Matrículas, Plan Lector, documentos y teléfono.
- Tarjetas de descarga y el sistema visual de las páginas 2026.
- Actividades con imagen/fecha/categoría y archivo histórico.
- Galerías de hitos escolares, pero con imágenes optimizadas.
- Tabla y enlaces de la Gala.

## Mejorar

- Unificar la experiencia alrededor del diseño 2026.
- Reducir plugins, movimiento y altura del header.
- Añadir H1 único, jerarquía coherente, foco visible y textos alternativos.
- Limitar listados iniciales y paginar o filtrar de forma accesible.
- Sustituir iconos de fuentes por SVG locales.
- Optimizar JPEG/PNG a WebP/AVIF y generar `srcset`.
- Implementar embeds con carga diferida y alternativa de enlace.
- Revisar copy, años, nombres y documentos antes de migrar.
