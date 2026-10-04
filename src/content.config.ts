import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const activityImage = z.object({
  image: z.string().startsWith('/src/assets/images/activities/'),
  alt: z.string().trim().min(1),
  caption: z.string().trim().min(1).optional(),
});

const externalResource = z.object({
  label: z.string().trim().min(1),
  url: z.url(),
  service: z.string().trim().min(1),
  group: z.string().trim().min(1).optional(),
});

const activities = defineCollection({
  loader: glob({
    base: './src/content/activities',
    pattern: '**/*.md',
  }),
  schema: z
    .object({
      sourcePostId: z.number().int().positive().optional(),
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      publishDate: z.coerce.date(),
      modifiedDate: z.coerce.date().optional(),
      year: z.number().int().min(2023),
      slug: z.string().trim().min(1),
      historicalPath: z
        .string()
        .regex(/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/),
      legacyUrl: z.url().optional(),
      featuredImage: z
        .string()
        .startsWith('/src/assets/images/activities/'),
      featuredAlt: z.string().trim().min(1),
      gallery: z.array(activityImage).optional(),
      galleryTitle: z.string().trim().min(1).optional(),
      galleryDescription: z.string().trim().min(1).optional(),
      galleryAspectRatio: z.enum(['classic', 'wide']).optional(),
      galleryExpanded: z.boolean().optional(),
      externalResources: z.array(externalResource).optional(),
      externalResourcesTitle: z.string().trim().min(1).optional(),
      externalResourcesDescription: z.string().trim().min(1).optional(),
      category: z.string().trim().min(1).optional(),
      keywords: z.array(z.string().trim().min(1)).optional(),
      featured: z.boolean().default(false),
      reviewStatus: z.enum(['reviewed', 'needs-review']),
      contentQuality: z.enum(['full', 'partial', 'minimal']),
    })
    .superRefine((activity, context) => {
      const pathParts = activity.historicalPath.split('/').filter(Boolean);
      const publishedYear = activity.publishDate.getUTCFullYear();

      if (pathParts[0] !== String(activity.year) || publishedYear !== activity.year) {
        context.addIssue({
          code: 'custom',
          message: 'El año debe coincidir con la fecha y la ruta histórica.',
        });
      }

      if (pathParts.at(-1) !== activity.slug) {
        context.addIssue({
          code: 'custom',
          message: 'El slug debe coincidir con el último segmento de la ruta.',
        });
      }

      if (
        activity.modifiedDate &&
        activity.modifiedDate.getTime() < activity.publishDate.getTime()
      ) {
        context.addIssue({
          code: 'custom',
          message: 'La fecha de modificación no puede anteceder a la publicación.',
        });
      }
    }),
});

export const collections = { activities };
