import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
<<<<<<< Updated upstream
  site: 'https://julianjjo.github.io', // Replace with your actual domain
=======
  site: 'https://julianjjo.github.io',
>>>>>>> Stashed changes
  integrations: [tailwind(), sitemap()],
  output: "server",
  adapter: node({
    mode: "middleware"
  })
});
