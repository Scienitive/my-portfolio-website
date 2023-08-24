import {defineCollection, z } from 'astro:content';

export const collections = {
    card: defineCollection({
        schema: z.object({
            title: z.string(),
            content: z.string()
        })
    })
};