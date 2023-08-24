import {defineCollection, z } from 'astro:content';

export const collections = {
    card: defineCollection({
        schema: z.object({
            title: z.string(),
            content: z.string()
        })
    }),

	project: defineCollection({
		schema: z.object({
			type: z.string(),
			name: z.string(),
			description: z.string(),
			techs: z.array(z.string()),
			githublink: z.string().url().optional(),
			livelink: z.string().url().optional(),
			photolinks: z.array(z.string()).optional()
		})
	})
};
