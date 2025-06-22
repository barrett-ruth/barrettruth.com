import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import path from "path";

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
  vite: {
    resolve: {
      alias: {
        "@components": path.resolve(".", "src/components"),
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-light",
      langs: [],
      wrap: true,
    },
  },
});
