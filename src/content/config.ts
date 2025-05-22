import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    useKatex: z.boolean().optional().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
};
