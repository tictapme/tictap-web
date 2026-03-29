import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    metaDescription: z.string(),
    publicUrl: z.string().url(),
    publishedTime: z.string(),
    modifiedTime: z.string(),
    ogImage: z.string().url(),
    ogImageWidth: z.number().int().positive(),
    ogImageHeight: z.number().int().positive(),
    author: z.string().default('TicTAP'),
    readingTime: z.string().default('4 minutos'),
    category: z.string().default('mantenimiento y operaciones'),
    deck: z.string().optional(),
    footerText: z.string().optional(),
    footerCtaText: z.string().optional(),
    footerCtaUrl: z.string().url().optional(),
    heroAside: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
