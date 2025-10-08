import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    useKatex: z.boolean().optional().default(false),
    useD3: z.boolean().optional().default(false),
    scripts: z.array(z.string()).optional(),
  }),
});

const gistsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
});

const gitsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  gists: gistsCollection,
  git: gitsCollection,
};
