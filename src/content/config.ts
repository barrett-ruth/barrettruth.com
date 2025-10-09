import { defineCollection, z } from "astro:content";

const base = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  useKatex: z.boolean().optional(),
  useD3: z.boolean().optional(),
});

export const collections = {
  algorithms: defineCollection({ type: "content", schema: base }),
  software: defineCollection({ type: "content", schema: base }),
  meditations: defineCollection({ type: "content", schema: base }),
  "autonomous-racing": defineCollection({ type: "content", schema: base }),

  git: defineCollection({ type: "content", schema: base }),
  gists: defineCollection({ type: "content", schema: base }),
};
