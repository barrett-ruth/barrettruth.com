import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  build: {
    format: "file",
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-light",
      langs: [],
      wrap: true,
    },
  },
});
