import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import netlify from "@astrojs/netlify";

// astro.config runs before Astro's env loading, so read PUBLIC_* vars via Vite.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
);

// https://astro.build/config
export default defineConfig({
  site: "https://boxandpixel.com",
  // `output: "static"` is the default and prerenders everything. The adapter is
  // here only so individual routes can opt out with `export const prerender = false`
  // — right now that's just /api/contact, which ships as one Netlify Function.
  adapter: netlify(),
  // The whole site's CSS is ~18 KB (~5 KB gzipped). Inlining it removes the
  // render-blocking stylesheet requests, which costs more than the bytes.
  build: { inlineStylesheets: "always" },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-07-13",
      // Static build fetches at build time — always hit the live API, not the CDN.
      useCdn: false,
    }),
  ],
});
