import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Heather Bauer Nutrition"),
    category: z.enum(["consumer", "investor"]).default("consumer"),
    contentType: z.enum([
      "how-to",
      "announcement",
      "user-story",
      "research-evidence",
      "glp1-case",
      "category",
    ]),
    keyword: z.string().optional(),
    heroImage: z.string().optional(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
