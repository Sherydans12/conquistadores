import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { staticPublicRoutes } from '../data/public-routes';
import { site } from '../data/site';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function formatLastModified(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface SitemapEntry {
  path: string;
  priority?: number;
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastModified?: Date;
}

export const GET: APIRoute = async () => {
  const activities = await getCollection('activities');
  const staticEntries: SitemapEntry[] = staticPublicRoutes
    .filter((route) => route.includeInSitemap)
    .map((route) => ({
      path: route.path,
      priority: route.priority,
      changeFrequency: route.changeFrequency,
    }));
  const activityEntries: SitemapEntry[] = activities.map((activity) => ({
    path: activity.data.historicalPath,
    priority: 0.6,
    changeFrequency: 'yearly' as const,
    lastModified: activity.data.modifiedDate,
  }));
  const entries = [...staticEntries, ...activityEntries].sort((a, b) =>
    a.path.localeCompare(b.path, 'es'),
  );
  const urlElements = entries
    .map((entry) => {
      const lines = [
        '  <url>',
        `    <loc>${escapeXml(new URL(entry.path, site.baseUrl).toString())}</loc>`,
      ];

      if (entry.lastModified) {
        lines.push(
          `    <lastmod>${formatLastModified(entry.lastModified)}</lastmod>`,
        );
      }
      if (entry.changeFrequency) {
        lines.push(
          `    <changefreq>${entry.changeFrequency}</changefreq>`,
        );
      }
      if (entry.priority !== undefined) {
        lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }
      lines.push('  </url>');
      return lines.join('\n');
    })
    .join('\n');
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlElements,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
