// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// site / base: project Pages under https://sung-park.github.io/family-travels/
export default defineConfig({
  site: 'https://sung-park.github.io',
  // Must start and end with `/` so BASE_URL joins correctly (e.g. /family-travels/about/)
  base: '/family-travels/',
  vite: {
    plugins: [tailwindcss()],
  },
});
