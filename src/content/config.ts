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
	}),

	game: defineCollection({
		schema: z.object({
			name: z.string(),
			description: z.string(),
			fontfamily: z.string(),
			fontsize: z.string(),
			genre: z.string(),
			price: z.string(),
			platforms: z.string(),
			videolink: z.string().url(),
			itchlink: z.string().url().optional(),
			steamlink: z.string().url().optional()
		})
	})
};
