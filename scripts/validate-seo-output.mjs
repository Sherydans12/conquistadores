import path from 'node:path';
import {
  distPathForRoute,
  distRoot,
  extractAttributes,
  extractLinkHref,
  extractMetaContent,
  extractSitemapLocations,
  readText,
} from './validation-helpers.mjs';

const errors = [];
const warnings = [];
const sitemap = await readText(path.join(distRoot, 'sitemap.xml'));
const sitemapUrls = extractSitemapLocations(sitemap);
const sitemapPaths = sitemapUrls.map((location) => new URL(location).pathname);
const sitemapHosts = new Set(sitemapUrls.map((location) => new URL(location).hostname));
const robotsText = await readText(path.join(distRoot, 'robots.txt'));
const isProduction = robotsText.includes('Allow: /');
const expectedRobots = isProduction ? 'index,follow' : 'noindex,nofollow';

if (sitemapHosts.size !== 1) errors.push('El sitemap mezcla hosts.');
if (
  isProduction &&
  !robotsText.includes(
    'Sitemap: https://www.colegioconquistadores.com/sitemap.xml',
  )
) {
  errors.push('robots.txt de producción no referencia el sitemap canónico aprobado.');
}
if (!isProduction && !robotsText.includes('Disallow: /')) {
  errors.push('robots.txt no bloquea el entorno no productivo.');
}

function textContent(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function schemasFromHtml(html, route) {
  const schemas = [];
  const scripts =
    html.match(
      /<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>[\s\S]*?<\/script>/gi,
    ) ?? [];
  for (const script of scripts) {
    const json = script
      .replace(/^<script\b[^>]*>/i, '')
      .replace(/<\/script>$/i, '')
      .trim();
    try {
      schemas.push(JSON.parse(json));
    } catch (error) {
      errors.push(`${route}: JSON-LD inválido (${error.message})`);
    }
  }
  return schemas;
}

function schemaHasType(schema, type) {
  if (Array.isArray(schema)) return schema.some((item) => schemaHasType(item, type));
  if (!schema || typeof schema !== 'object') return false;
  if (schema['@type'] === type) return true;
  if (Array.isArray(schema['@type']) && schema['@type'].includes(type)) return true;
  return Object.values(schema).some((value) => schemaHasType(value, type));
}

async function validatePage(route, expectedUrl) {
  const html = await readText(distPathForRoute(route));
  const title = textContent(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = extractMetaContent(html, 'name', 'description');
  const canonical = extractLinkHref(html, 'canonical');
  const pageRobots = extractMetaContent(html, 'name', 'robots');
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const lang = extractAttributes(html.match(/<html\b[^>]*>/i)?.[0] ?? '').get('lang');

  if (!title) errors.push(`${route}: title vacío.`);
  if (!description) errors.push(`${route}: metadescripción vacía.`);
  if (!canonical) {
    errors.push(`${route}: canonical ausente.`);
  } else {
    let canonicalUrl;
    try {
      canonicalUrl = new URL(canonical);
      if (canonicalUrl.search || canonicalUrl.hash) {
        errors.push(`${route}: canonical contiene parámetros o fragmento.`);
      }
      if (/localhost|127\.0\.0\.1|\[::1\]/i.test(canonicalUrl.hostname)) {
        errors.push(`${route}: canonical contiene localhost.`);
      }
      if (canonicalUrl.toString() !== expectedUrl) {
        errors.push(`${route}: canonical ${canonical} no coincide con ${expectedUrl}.`);
      }
    } catch {
      errors.push(`${route}: canonical no es absoluto (${canonical}).`);
    }
  }
  if (h1Count !== 1) errors.push(`${route}: contiene ${h1Count} H1; se esperaba uno.`);
  if (pageRobots !== expectedRobots) {
    errors.push(`${route}: robots=${pageRobots || 'ausente'}; se esperaba ${expectedRobots}.`);
  }
  if (lang !== 'es') errors.push(`${route}: lang debe ser es.`);

  const requiredMeta = [
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:url'],
    ['property', 'og:image'],
    ['name', 'twitter:card'],
  ];
  for (const [key, value] of requiredMeta) {
    if (!extractMetaContent(html, key, value)) errors.push(`${route}: falta ${value}.`);
  }

  const schemas = schemasFromHtml(html, route);
  if (route === '/' && !schemas.some((schema) => schemaHasType(schema, 'EducationalOrganization'))) {
    errors.push('/: falta EducationalOrganization.');
  }
  if (
    route === '/actividades/' &&
    !schemas.some((schema) => schemaHasType(schema, 'CollectionPage'))
  ) {
    errors.push('/actividades/: falta CollectionPage.');
  }
  if (
    /^\/\d{4}\/\d{2}\/\d{2}\//.test(route) &&
    !schemas.some((schema) => schemaHasType(schema, 'Article'))
  ) {
    errors.push(`${route}: falta Article.`);
  }

  if (title.length < 20 || title.length > 70) {
    warnings.push(`${route}: título de ${title.length} caracteres.`);
  }
  if (description.length < 90 || description.length > 180) {
    warnings.push(`${route}: descripción de ${description.length} caracteres.`);
  }
}

for (let index = 0; index < sitemapPaths.length; index += 1) {
  await validatePage(sitemapPaths[index], sitemapUrls[index]);
}

const notFoundHtml = await readText(path.join(distRoot, '404.html'));
const notFoundRobots = extractMetaContent(notFoundHtml, 'name', 'robots');
if (notFoundRobots !== 'noindex,nofollow') {
  errors.push(`/404.html: robots=${notFoundRobots || 'ausente'}; debe ser noindex,nofollow.`);
}
if ((notFoundHtml.match(/<h1\b/gi) ?? []).length !== 1) {
  errors.push('/404.html debe contener un H1.');
}
for (const sensitivePath of ['/mi-cuenta/', '/mi-cuenta/lost-password/', '/registro/', '/notas/']) {
  if (sitemapPaths.includes(sensitivePath)) {
    errors.push(`El sitemap contiene la ruta sensible ${sensitivePath}.`);
  }
}

warnings.forEach((warning) => console.warn(`Aviso SEO: ${warning}`));
if (errors.length > 0) {
  console.error(`Validación SEO fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `SEO correcto en ${sitemapPaths.length} páginas públicas; entorno ${isProduction ? 'production' : 'staging'}.`,
);
console.log(`Avisos editoriales no bloqueantes: ${warnings.length}.`);
