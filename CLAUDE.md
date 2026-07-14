# CLAUDE.md — Ahmed Albadri Portfolio

Astro 4 + Tailwind + Sanity portfolio built to `ahmed-albadri-portfolio-spec.md`. Read that
spec before making design or schema changes — it is the source of truth.

## Commands

- `npm run dev` — dev server on :4321 (or use the `portfolio-dev` launch config)
- `npm run build` — static build; must pass before considering any change done
- `node scripts/gen-placeholders.mjs` / `node scripts/gen-og.mjs` — regenerate seed imagery

## Architecture

- **Dual content source:** `src/lib/data.ts` serves everything. If
  `PUBLIC_SANITY_PROJECT_ID` is set it queries Sanity (GROQ); otherwise it returns the
  local seed from `src/lib/seed.ts`. Keep `src/sanity/schemas/*`, `src/lib/types.ts` and
  `src/lib/seed.ts` in sync when changing any content model.
- **Islands are vanilla JS** in Astro `<script>` tags (WorkGrid filter, lightbox,
  before/after slider, mobile menu, contact form). No framework hydration; React exists
  only for the embedded Sanity Studio (`/admin`, enabled in CMS mode).
- **AI Lab** pages are ordinary `project` documents with the optional process fields
  (`processSteps`, `promptExcerpts`, `beforeAfter`); `/ai-lab/[slug]` renders them with
  `showProcess`, `/work/[slug]` without.

## Non-negotiable rules (from the spec)

- **Honesty label:** self-initiated/spec work always displays
  "Self-initiated concept — demonstration of capability". Never remove `HonestyLabel`.
- **Accessibility:** bronze-500 is only for text ≥18px on paper; use bronze-700 below
  that. Alt text is a required field on every Sanity image. Keep visible focus rings.
- **Arabic:** always `lang="ar" dir="rtl"`, IBM Plex Sans Arabic, never letter-spaced.
  Use CSS logical properties (`ms-*`, `start-*`, `inset-inline-*`) — no `ml-`/`left-`.
- **Motion:** only opacity/translateY reveals, underline grows, chip fills — 150/250/400ms
  with `var(--ease)`; everything honors `prefers-reduced-motion`.
- The `.reveal` pattern is gated on `html.js` and has a 2s IntersectionObserver fallback —
  keep both when touching `src/layouts/Base.astro` or `src/styles/global.css`.
