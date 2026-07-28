import {
  distPathForRoute,
  distRoot,
  extractAttributes,
  pathExists,
  readText,
  routeFromHtmlFile,
  walkFiles,
} from './validation-helpers.mjs';

const htmlFiles = (await walkFiles(distRoot)).filter((filePath) =>
  filePath.endsWith('.html'),
);
const htmlByRoute = new Map();
for (const filePath of htmlFiles) {
  htmlByRoute.set(routeFromHtmlFile(filePath), await readText(filePath));
}

const errors = [];
const ignored = {
  mailto: 0,
  tel: 0,
  external: 0,
  javascriptAnchor: 0,
  googleDrive: 0,
  mineduc: 0,
  maps: 0,
  youtube: 0,
  temporaryWordPressPdf: 0,
};
const externalServiceHosts = new Map([
  ['drive.google.com', 'googleDrive'],
  ['certificados.mineduc.cl', 'mineduc'],
  ['www.google.com', 'maps'],
  ['google.com', 'maps'],
  ['www.youtube.com', 'youtube'],
  ['youtube.com', 'youtube'],
  ['www.youtube-nocookie.com', 'youtube'],
]);

function hasAnchor(html, anchor) {
  const decoded = decodeURIComponent(anchor);
  const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `\\b(?:id|name)\\s*=\\s*(?:"${escaped}"|'${escaped}')`,
    'i',
  ).test(html);
}

async function validateInternalTarget(rawValue, sourceRoute, kind) {
  if (!rawValue || rawValue.startsWith('data:')) return;
  if (rawValue.startsWith('mailto:')) {
    ignored.mailto += 1;
    return;
  }
  if (rawValue.startsWith('tel:')) {
    ignored.tel += 1;
    return;
  }
  if (rawValue.startsWith('javascript:')) {
    ignored.javascriptAnchor += 1;
    return;
  }
  if (/localhost|127\.0\.0\.1|\[::1\]/i.test(rawValue)) {
    errors.push(`${sourceRoute}: enlace accidental a localhost (${rawValue})`);
    return;
  }

  let target;
  try {
    target = new URL(rawValue, `https://local.invalid${sourceRoute}`);
  } catch {
    errors.push(`${sourceRoute}: URL inválida (${rawValue})`);
    return;
  }

  if (target.hostname !== 'local.invalid') {
    if (
      target.hostname === 'staging.colegioconquistadores.com' &&
      kind === 'href'
    ) {
      errors.push(`${sourceRoute}: enlace editorial accidental a staging (${rawValue})`);
      return;
    }
    if (target.hostname === 'www.colegioconquistadores.com') {
      if (
        sourceRoute === '/documentos/' &&
        target.pathname.startsWith('/wp-content/uploads/') &&
        target.pathname.toLowerCase().endsWith('.pdf')
      ) {
        ignored.temporaryWordPressPdf += 1;
        return;
      }
      errors.push(
        `${sourceRoute}: enlace temporal no permitido hacia WordPress fuera del centro documental (${rawValue})`,
      );
      return;
    }
    const service = externalServiceHosts.get(target.hostname);
    if (service) ignored[service] += 1;
    else ignored.external += 1;
    return;
  }

  const targetPath = target.pathname;
  const targetFile = distPathForRoute(targetPath);
  if (!(await pathExists(targetFile))) {
    errors.push(`${sourceRoute}: destino interno inexistente (${rawValue})`);
    return;
  }

  if (kind === 'href' && target.hash) {
    const targetRoute =
      targetPath === '/'
        ? '/'
        : targetPath.endsWith('/')
          ? targetPath
          : targetPath === '/404.html'
            ? '/404.html'
            : targetPath;
    const targetHtml = htmlByRoute.get(targetRoute);
    if (targetHtml && !hasAnchor(targetHtml, target.hash.slice(1))) {
      errors.push(`${sourceRoute}: anchor inexistente (${rawValue})`);
    }
  }
}

for (const [sourceRoute, html] of htmlByRoute) {
  const tags =
    html.match(/<(?:a|img|script|link|source|video|audio|iframe)\b[^>]*>/gi) ??
    [];

  for (const tag of tags) {
    const attributes = extractAttributes(tag);
    const tagName = tag.match(/^<(\w+)/i)?.[1].toLowerCase();
    if (tagName === 'a' && attributes.has('href')) {
      await validateInternalTarget(attributes.get('href'), sourceRoute, 'href');
    } else if (tagName === 'link' && attributes.has('href')) {
      const rel = (attributes.get('rel') ?? '').toLowerCase();
      if (!rel.includes('canonical')) {
        await validateInternalTarget(attributes.get('href'), sourceRoute, 'src');
      }
    } else if (attributes.has('src')) {
      await validateInternalTarget(attributes.get('src'), sourceRoute, 'src');
    }

    const srcset = attributes.get('srcset');
    if (srcset) {
      for (const candidate of srcset.split(',')) {
        const value = candidate.trim().split(/\s+/, 1)[0];
        await validateInternalTarget(value, sourceRoute, 'src');
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Validación de enlaces fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Enlaces y assets internos correctos en ${htmlFiles.length} HTML.`);
console.log(
  `Excepciones temporales: ${ignored.temporaryWordPressPdf} enlaces a PDF en wp-content.`,
);
console.log(
  `Externos registrados: Drive ${ignored.googleDrive}, Mineduc ${ignored.mineduc}, Maps ${ignored.maps}, YouTube ${ignored.youtube}, otros ${ignored.external}.`,
);
