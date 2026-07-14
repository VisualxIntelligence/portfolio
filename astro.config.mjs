import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = env.PUBLIC_SANITY_DATASET ?? 'production';

// The embedded Studio (/admin) only mounts once a Sanity project ID exists.
// Until then the site builds entirely from the local seed content in src/lib/seed.ts.
const sanityEnabled = Boolean(projectId);

// @sanity/astro's module-dedupe plugin aliases `sanity`/`styled-components` in
// dev, which loops Vite's dep optimizer here ("504 Outdated Optimize Dep" on
// /admin). The integration provides this escape hatch; production builds are
// unaffected either way.
process.env.SANITY_ASTRO_DISABLE_MODULE_DEDUPE ??= '1';

// Static output in both modes: content changes redeploy via the Sanity → Vercel
// deploy hook (spec §1.4), and the embedded Studio is a client-side SPA.
export default defineConfig({
  site: env.PUBLIC_SITE_URL ?? 'https://ahmedalbadri.vercel.app',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    ...(sanityEnabled
      ? [
          sanity({
            projectId,
            dataset,
            useCdn: true,
            apiVersion: '2026-07-01',
            studioBasePath: '/admin',
          }),
        ]
      : []),
    sitemap(),
  ],
  vite: {
    css: { transformer: 'postcss' },
  },
});
