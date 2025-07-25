declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"card": {
"Card1.md": {
	id: "Card1.md";
  slug: "card1";
  body: string;
  collection: "card";
  data: InferEntrySchema<"card">
} & { render(): Render[".md"] };
"Card2.md": {
	id: "Card2.md";
  slug: "card2";
  body: string;
  collection: "card";
  data: InferEntrySchema<"card">
} & { render(): Render[".md"] };
"Card3.md": {
	id: "Card3.md";
  slug: "card3";
  body: string;
  collection: "card";
  data: InferEntrySchema<"card">
} & { render(): Render[".md"] };
};
"game": {
"dice_arena.md": {
	id: "dice_arena.md";
  slug: "dice_arena";
  body: string;
  collection: "game";
  data: InferEntrySchema<"game">
} & { render(): Render[".md"] };
"dualthrough.md": {
	id: "dualthrough.md";
  slug: "dualthrough";
  body: string;
  collection: "game";
  data: InferEntrySchema<"game">
} & { render(): Render[".md"] };
"gaserb.md": {
	id: "gaserb.md";
  slug: "gaserb";
  body: string;
  collection: "game";
  data: InferEntrySchema<"game">
} & { render(): Render[".md"] };
"llyulang.md": {
	id: "llyulang.md";
  slug: "llyulang";
  body: string;
  collection: "game";
  data: InferEntrySchema<"game">
} & { render(): Render[".md"] };
"thechaosincrypto.md": {
	id: "thechaosincrypto.md";
  slug: "thechaosincrypto";
  body: string;
  collection: "game";
  data: InferEntrySchema<"game">
} & { render(): Render[".md"] };
};
"project": {
"CPP_Modules.md": {
	id: "CPP_Modules.md";
  slug: "cpp_modules";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"Sinefile.md": {
	id: "Sinefile.md";
  slug: "sinefile";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"camagru.md": {
	id: "camagru.md";
  slug: "camagru";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"cub3D.md": {
	id: "cub3D.md";
  slug: "cub3d";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"ft_containers.md": {
	id: "ft_containers.md";
  slug: "ft_containers";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"ft_irc.md": {
	id: "ft_irc.md";
  slug: "ft_irc";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"ft_printf.md": {
	id: "ft_printf.md";
  slug: "ft_printf";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"ft_transcendence.md": {
	id: "ft_transcendence.md";
  slug: "ft_transcendence";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"get_next_line.md": {
	id: "get_next_line.md";
  slug: "get_next_line";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"libft.md": {
	id: "libft.md";
  slug: "libft";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"minishell.md": {
	id: "minishell.md";
  slug: "minishell";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"minitalk.md": {
	id: "minitalk.md";
  slug: "minitalk";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"movie-list.md": {
	id: "movie-list.md";
  slug: "movie-list";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"moviterm.md": {
	id: "moviterm.md";
  slug: "moviterm";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"my-portfolio-website.md": {
	id: "my-portfolio-website.md";
  slug: "my-portfolio-website";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"philosophers.md": {
	id: "philosophers.md";
  slug: "philosophers";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
"push_swap.md": {
	id: "push_swap.md";
  slug: "push_swap";
  body: string;
  collection: "project";
  data: InferEntrySchema<"project">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
