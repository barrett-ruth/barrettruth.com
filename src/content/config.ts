import { defineCollection, z } from "astro:content";

const base = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  useKatex: z.boolean().optional(),
  useD3: z.boolean().optional(),
  scripts: z.array(z.string()).optional(),
  redirect: z.string().optional(),
  showToc: z.boolean().optional(),
});

export const collections = {
  x: defineCollection({ type: "content", schema: base }),
};
