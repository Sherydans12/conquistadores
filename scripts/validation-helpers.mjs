import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const projectRoot = process.cwd();
export const distRoot = path.join(projectRoot, 'dist');

export async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function readText(filePath) {
  return readFile(filePath, 'utf8');
}

export function routeFromHtmlFile(filePath) {
  const relativePath = path.relative(distRoot, filePath).replaceAll('\\', '/');

  if (relativePath === 'index.html') return '/';
  if (relativePath === '404.html') return '/404.html';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  return `/${relativePath}`;
}

export function distPathForRoute(route) {
  const pathname = decodeURIComponent(route.split(/[?#]/, 1)[0] || '/');

  if (pathname === '/') return path.join(distRoot, 'index.html');
  if (pathname.endsWith('/')) {
    return path.join(distRoot, ...pathname.split('/').filter(Boolean), 'index.html');
  }
  return path.join(distRoot, ...pathname.split('/').filter(Boolean));
}

export function extractAttributes(tag) {
  const attributes = new Map();
  const pattern =
    /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

export function extractMetaContent(html, key, value) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const attributes = extractAttributes(tag);
    if (attributes.get(key) === value) return attributes.get('content') ?? '';
  }
  return '';
}

export function extractLinkHref(html, rel) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    const attributes = extractAttributes(tag);
    const relations = (attributes.get('rel') ?? '').toLowerCase().split(/\s+/);
    if (relations.includes(rel)) return attributes.get('href') ?? '';
  }
  return '';
}

export function extractSitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    match[1]
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .trim(),
  );
}

export async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export function unique(values) {
  return [...new Set(values)];
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
}
