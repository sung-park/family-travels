import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { daySchema, tripSchema } from "./lib/schemas";
import { isPublishableTripPath } from "./lib/trip-path";

/**
 * trips: src/content/trips/<slug>/trip.md
 * days:  src/content/trips/<slug>/days/*.md
 * `_`-prefixed folders (e.g. _template) are excluded.
 */
const trips = defineCollection({
  loader: glob({
    pattern: "*/trip.md",
    base: "./src/content/trips",
    generateId: ({ entry }) => {
      // entry like "2026-nha-trang/trip.md"
      const slug = entry.split("/")[0] ?? entry;
      return slug;
    },
  }),
  schema: tripSchema,
});

const days = defineCollection({
  loader: glob({
    pattern: "*/days/*.md",
    base: "./src/content/trips",
    generateId: ({ entry }) => {
      // "2026-nha-trang/days/2026-09-03.md" → "2026-nha-trang__2026-09-03"
      const parts = entry.replace(/\\/g, "/").split("/");
      const slug = parts[0];
      const file = parts[parts.length - 1]?.replace(/\.md$/, "") ?? entry;
      return `${slug}__${file}`;
    },
  }),
  schema: daySchema,
});

export const collections = { trips, days };

export { isPublishableTripPath };
