import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const activityImage = z.object({
  image: z.string().startsWith('/src/assets/images/activities/'),
  alt: z.string().trim().min(1),
  caption: z.string().trim().min(1).optional(),
});

const externalResource = z.object({
  label: z.string().trim().min(1),
  url: z.string().url(),
  service: z.string().trim().min(1),
});

const activities = defineCollection({
  loader: glob({
    base: './src/content/activities',
    pattern: '**/*.md',
  }),
  schema: z
    .object({
      sourcePostId: z.number().int().positive(),
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      publishDate: z.coerce.date(),
      modifiedDate: z.coerce.date().optional(),
      year: z.number().int().min(2023).max(2025),
      slug: z.string().trim().min(1),
      historicalPath: z
        .string()
        .regex(/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/),
      legacyUrl: z.string().url(),
      featuredImage: z
        .string()
        .startsWith('/src/assets/images/activities/'),
      featuredAlt: z.string().trim().min(1),
      gallery: z.array(activityImage).optional(),
      externalResources: z.array(externalResource).optional(),
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
