import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type ActivityEntry = CollectionEntry<'activities'>;

const activityImages = import.meta.glob<ImageMetadata>(
  '/src/assets/images/activities/**/*.webp',
  {
    eager: true,
    import: 'default',
  },
);

export function resolveActivityImage(path: string): ImageMetadata {
  const image = activityImages[path];

  if (!image) {
    throw new Error(`No se encontró la imagen local de actividad: ${path}`);
  }

  return image;
}

export function sortActivities(
  activities: ActivityEntry[],
): ActivityEntry[] {
  return [...activities].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

export function formatActivityDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Santiago',
  }).format(date);
}

export function activitySearchText(activity: ActivityEntry): string {
  return [
    activity.data.title,
    activity.data.description,
    activity.data.year,
    ...(activity.data.keywords ?? []),
  ].join(' ');
}
