# Ahmed Albadri — Portfolio

Bilingual-accented (EN primary, AR accents, RTL-ready) portfolio for an AI-first graphic
designer & multimedia specialist. Built to `ahmed-albadri-portfolio-spec.md` ("Editorial
Precision" design system).

**Stack:** Astro 4 · Tailwind CSS · Sanity (embedded Studio at `/admin`) · Vercel.

## Commands

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static build to dist/
npm run preview
```

Utility scripts: `node scripts/gen-placeholders.mjs` (seed imagery),
`node scripts/gen-og.mjs` (default OG image).

## Content: seed mode vs CMS mode

The site runs in one of two modes, decided by `PUBLIC_SANITY_PROJECT_ID`:

- **Seed mode (default, no env vars):** all content comes from
  [src/lib/seed.ts](src/lib/seed.ts) — six default categories, the MADAR LOOP sample
  projects, agentic skills, sample certifications and site settings. `/admin` is disabled.
- **CMS mode:** copy `.env.example` → `.env` and set the Sanity project ID. Content is
  fetched via GROQ at build time and the Studio mounts at `/admin`
  (schemas in [src/sanity/schemas](src/sanity/schemas)).

### Going live with Sanity (one-time)

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage); note the
   project ID; add your deploy URL + `http://localhost:4321` to CORS origins.
2. Fill `.env` (and the same vars in Vercel project settings).
3. Import the starter content: create an API token (sanity.io/manage → API → Tokens,
   Editor rights), add it to `.env` as `SANITY_WRITE_TOKEN=...`, then run
   `node scripts/seed-sanity.mjs`. This uploads the placeholder plates and creates all
   categories, projects, skills, certifications and site settings (idempotent — safe to
   re-run). Alternatively, create content by hand in `/admin`.
4. In sanity.io/manage → API → Webhooks, add a webhook pointing at a Vercel
   **deploy hook** URL so publishing content triggers a rebuild.

While the dataset is empty (or any content type has no documents yet), builds fall back
to the local seed for that type, so the site never ships blank sections.

### Editing content — prefer the deployed Studio

The `/admin` Studio on the **deployed site** (Vercel) is a production build and is rock
solid — **use it for all day-to-day content editing** (uploading the CV, adding projects,
etc.). It writes to the same Sanity dataset.

The **local** `/admin` runs through Vite's dev dependency optimizer, which — because the
Sanity Studio is a very large bundle — can intermittently fail after a schema edit or a
cold start with errors like _"Failed to fetch dynamically imported module …/.vite/deps/…"_
or _"504 Outdated Optimize Dep"_. It is usually self-healing (the Studio auto-reloads). If
it gets stuck, reset the dev dependency cache:

```bash
npm run dev:clean   # clears node_modules/.vite, then starts the dev server
```

Then hard-refresh the browser once (Ctrl/Cmd+Shift+R). Related config knobs in
`astro.config.mjs`, both dev-only and required — keep them: `SANITY_ASTRO_DISABLE_MODULE_DEDUPE=1`
and `optimizeDeps.include: ['react-is']`.

## Deploying to Vercel

1. Push this folder to a Git repo and import it in Vercel (framework preset: Astro).
2. Set `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_URL`.
3. Create a deploy hook (Settings → Git → Deploy Hooks) and wire it to the Sanity webhook.
4. Optional: add the custom domain and enable Vercel Analytics (or add Plausible's script
   in `src/layouts/Base.astro`).

## Before sharing the live site

- Replace placeholder plates (`public/placeholders/`) with real artwork via the Studio.
- Set the montage/hero video URLs (unlisted YouTube or Vimeo) in Site Settings.
- Drop the real CV at `public/cv.pdf` (the About page links to it).
- Replace the sample certifications with real ones.
- **Honest-labeling rule (non-negotiable):** every self-initiated sample keeps the label
  "Self-initiated concept — demonstration of capability" with the fictional client stated.

## Design system quick reference

Tokens live in [tailwind.config.mjs](tailwind.config.mjs) and
[src/styles/global.css](src/styles/global.css): paper `#F7F4EF`, ink `#1A1815`, bronze
`#A9744A` (700 `#7E5334` for small text on paper — AA), hairline `#DDD5C9`; Space Grotesk
display, Inter body, IBM Plex Sans Arabic (never letter-spaced, +10% line-height); easing
`cubic-bezier(0.22,1,0.36,1)`, 150/250/400 ms; layout uses CSS logical properties so a full
Arabic locale can be added without refactoring.
