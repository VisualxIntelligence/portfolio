# AHMED ALBADRI — PORTFOLIO WEBSITE BUILD SPECIFICATION
**Version 1.0 · July 2026 · Prepared for Claude Code handoff**

---

## 0. Project Overview

**Owner:** Ahmed Albadri · أحمد البدري — AI-First Graphic Designer & Multimedia Specialist, based in Riyadh/Doha, working across the Middle East.

**Primary goal:** Win an AI-first design role at a major engineering/professional-services firm (immediate target: WSP Middle East) by exhibiting (a) existing work — video explainers, presentations, strategy documents, design systems, storyboards — and (b) new self-initiated AI-generated samples proving capability across every deliverable type in the target JD, without requiring prior sector experience.

**Secondary goals:** Long-lived personal brand asset usable for future roles and freelance clients; easy self-service content management (add/remove projects and categories without code); demonstrate the AI-first workflow through the site itself (built with Claude Code, imagery via Higgsfield/GPT Image 2).

**Brand personality:** MINIMAL / EDITORIAL / TECHNICAL — "government-grade polish with a designer's eye." Bilingual English-Arabic identity.

**Honest-labeling rule (non-negotiable):** Every self-initiated sample is labeled **"Self-initiated concept — demonstration of capability"** with fictional client clearly stated. Applies to all MADAR LOOP content.

---

# PART 1 — TECHNICAL ARCHITECTURE

## 1.1 Information Architecture (Sitemap)

```
/                       Home — hero, muted autoplay video montage, featured work, category shortcuts
/work                   All work — single filterable grid (filter = Category, managed in CMS)
/work/[slug]            Case study page (universal template, video- or image-led)
/ai-lab                 AI-generated samples hub — MADAR LOOP programme + future experiments
/ai-lab/[slug]          AI case study (extends case study with Process section: prompts → consistency → QC)
/skills                 Agentic Skills — Claude skills/agents built by Ahmed, each with demo media
/about                  Bio, tool stack, Certifications grid, downloadable CV
/contact                Contact form (Sanity-backed or mailto) + LinkedIn/Behance links
/wsp                    OPTIONAL hidden page: tailored one-page pitch in WSP-style brand constraints,
                        linked only from the application. Clearly labeled as a tailored concept.
```

Default categories (editable documents in CMS, not hardcoded): Video Explainers · Presentations · Strategy & Documents · Design Systems · Storyboards · AI Lab.

## 1.2 User Journeys

1. **Hiring manager (primary):** lands on Home via CV link → watches 10s of montage → clicks a MADAR LOOP case study → sees process rigor → checks About/Certifications → contacts. *Friction to avoid:* slow video load (use poster + lazy embed); unlabeled spec work (always label).
2. **Technical reviewer:** goes straight to /skills → wants proof the agentic skills are real → each skill needs a screen-recording or live link. *Friction:* vague descriptions; require concrete "what it automates + stack" fields.
3. **Returning visitor / recruiter skim:** /work grid → filters "Video Explainers" → plays 2 videos inline. *Friction:* leaving the page to watch; use inline lightbox players.

## 1.3 Data Architecture — Sanity Schemas

```ts
// category
{ name: 'category', fields: [
  title (string), titleAr (string), slug, order (number), description (text) ]}

// project  — universal work item
{ name: 'project', fields: [
  title (string), titleAr (string), slug,
  category (reference → category), tags (array<string>),
  year (number), client (string),            // fictional clients marked in label field
  label (string, e.g. "Self-initiated concept"),
  heroImage (image), heroVideoUrl (url),     // YouTube/Vimeo — video-led if present
  gallery (array<image>),
  videoUrls (array<url>),
  summary (text), body (portableText),
  tools (array<string>),                     // e.g. Higgsfield, GPT Image 2, After Effects
  featured (boolean), publishedAt (datetime) ]}

// aiCaseStudy — extends project via same document with optional fields:
//   processSteps (array<{step, description, image}>)  // 01 Prompt Dev, 02 Consistency, 03 QC…
//   promptExcerpts (array<text>), beforeAfter ({before: image, after: image})

// agenticSkill
{ name: 'agenticSkill', fields: [
  name, slug, oneLiner (string), whatItAutomates (text),
  stack (array<string>), demoVideoUrl (url), screenshots (array<image>),
  repoOrLink (url), status (string: 'in use' | 'prototype') ]}

// certification
{ name: 'certification', fields: [
  name, issuer, year (number), badge (image), verifyUrl (url), order ]}

// siteSettings (singleton)
{ name: 'siteSettings', fields: [
  heroHeadline, heroHeadlineAr, montageVideoUrl, email, socials (array),
  footerLine (string, default "Based in Riyadh · Working across the Middle East") ]}
```

Relationships: `project.category → category` (many-to-one). Deleting a category prompts re-assignment. All list ordering via `order` + `publishedAt`.

## 1.4 API Surface & Integrations

- **Sanity Content API** (GROQ queries at build + ISR revalidation webhook → Vercel deploy hook on publish).
- **Sanity Studio** mounted at `/admin` (same repo, `/studio` route or separate `studio/` dir).
- **Video:** YouTube (unlisted) / Vimeo embeds via `lite-youtube-embed` (loads on click; poster image first). No self-hosted video files.
- **Contact:** simple serverless function (Vercel) → email via Resend free tier, or `mailto:` fallback v1.
- **Auth:** none public; Sanity handles Studio auth (Google login).

## 1.5 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Astro 4 + Tailwind CSS | Static-first speed, island hydration only where needed (filters, lightbox); ideal for media portfolios |
| CMS | Sanity (free tier) | Visual studio for add/remove projects & categories; image CDN with focal-point cropping |
| Interactive islands | Preact or vanilla + Alpine | Filter grid, lightbox, before/after slider — keep JS minimal |
| Hosting | Vercel (free) | Deploy hooks from Sanity publish; preview URLs; later custom domain (ahmedalbadri.com, ~$10–20/yr, Cloudflare Registrar) |
| Video | YouTube/Vimeo + lite-embed | Zero hosting cost, fast LCP |
| Fonts | Google Fonts (self-hosted subset) | Space Grotesk, Inter, IBM Plex Sans Arabic — see §2.2 |

## 1.6 Performance, SEO & i18n

- Targets: LCP < 2.0s, CLS < 0.05, INP < 200ms. Astro Image for all thumbnails (AVIF/WebP, lazy).
- URL: kebab-case slugs; per-page meta from Sanity; OG image auto-generated per project (satori or static template).
- Schema.org: `Person` (home/about), `CreativeWork` (case studies), `VideoObject` where video-led.
- **RTL/Arabic:** site chrome is English-primary with Arabic accents (name, titles, subtitles) — not a full mirrored AR site in v1. All Arabic strings rendered with `dir="rtl"` and `lang="ar"` inline; layout uses CSS logical properties (`margin-inline-start` etc.) so a full AR locale can be added later without refactoring.

---

# PART 2 — DESIGN SYSTEM ("Editorial Precision")

## 2.1 Color System

| Token | Hex | Use |
|---|---|---|
| `paper` | #F7F4EF | Global background |
| `paper-2` | #EFEAE2 | Cards, alternating sections |
| `ink` | #1A1815 | Primary text |
| `ink-2` | #4A4540 | Secondary text |
| `bronze-300` | #C89B72 | Hover states, AR calligraphic accents on dark |
| `bronze-500` | #A9744A | **Primary accent** — links, active filter chips, underlines, Arabic name |
| `bronze-700` | #7E5334 | Pressed states, small text on paper (AA-safe) |
| `line` | #DDD5C9 | Hairline rules, borders |
| Semantic | success #3F6C51 · warn #B08A3E · error #9C3D2E · info #3E5F7E | Forms/toasts only |

Neutrals (9 steps): #FBFAF7 → #F7F4EF → #EFEAE2 → #DDD5C9 → #B7AFA3 → #8C857A → #4A4540 → #2B2723 → #1A1815.

**Dark mode (optional v1.1):** invert paper↔ink family; bronze-300 becomes primary accent; imagery unchanged. Ship light-only in v1.

**WSP-style work note:** WSP's red/black corporate language appears only *inside* designated case-study artifacts and the optional /wsp page — never in site chrome.

## 2.2 Typography

| Role | Face | Rationale |
|---|---|---|
| Display EN (H1–H2) | **Space Grotesk** 500/700 | Contemporary grotesque, editorial at large sizes, free |
| Body/UI EN | **Inter** 400/500/600 | Neutral, superb legibility, pairs cleanly |
| All Arabic | **IBM Plex Sans Arabic** 400/500/700 | Professional, harmonized x-height with Latin pair, government-document credibility |

Scale (px / rem / line-height): 12/0.75/1.4 · 14/0.875/1.5 · 16/1/1.6 (body) · 18/1.125/1.6 · 22/1.375/1.4 · 28/1.75/1.3 · 36/2.25/1.2 · 48/3/1.1 · 64/4/1.05 (H1). Display tracking −1% at ≥36px; ALL-CAPS name lockup +8% tracking. Arabic never letter-spaced; Arabic line-height +10% vs Latin equivalent.

## 2.3 Spacing & Layout

8px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Container max-width 1200px (content 720px for prose). Breakpoints: xs 375 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536. Grid: 12-col desktop / 6 tablet / 4 mobile, 24px gutters. Generous top whitespace (96–128px section padding) — the "editorial" feel lives here.

## 2.4 Component Library (v1 build list)

**Navigation:** Header (AA monogram + name lockup EN/AR), NavLink, MobileMenu, Footer, SkipLink.
**Hero/Home:** HeroLockup, MontagePlayer (muted loop, poster-first), FeaturedRow, CategoryShortcuts.
**Work:** FilterChips (island), ProjectCard, ProjectGrid, EmptyState.
**Case study:** CaseHero, MetaRow (client/role/tools/label), Prose, GalleryGrid, VideoEmbed (lite), BeforeAfterSlider (island), ProcessSteps, PromptExcerpt, PrevNextNav, HonestyLabel (badge).
**Skills:** SkillCard, SkillDetail, StatusPill.
**About:** BioBlock, ToolStack, CertGrid, CertCard, CVDownload.
**Shared:** Button (primary/ghost), Tag, SectionHeading (EN+AR pair), HairlineRule, LightboxPlayer (island), Toast, ContactForm, SEOHead, OGImage template.
(≈32 components; islands limited to FilterChips, BeforeAfterSlider, LightboxPlayer, MobileMenu, ContactForm.)

## 2.5 Motion

Restraint = brand. Easing `cubic-bezier(0.22, 1, 0.36, 1)`; durations 150ms (hover) / 250ms (reveals) / 400ms (page hero fade). Animate: opacity + translateY(8px) on scroll-reveal for cards, underline grow on links, chip fill on filter select. Never animate: layout shifts, text tracking, parallax. Respect `prefers-reduced-motion`.

## 2.6 Accessibility

WCAG 2.1 AA. bronze-700 (not 500) for text-on-paper under 18px. Visible focus ring (2px ink offset 2px). All video embeds keyboard-operable with title attrs. Filter chips = `role="tablist"` semantics with `aria-pressed`. Arabic content: correct `lang`/`dir` per element. Alt text mandatory field in Sanity image types.

---

# PART 3 — HANDOFF ASSETS

## 3.1 Design Tokens (JSON)

```json
{
  "color": { "paper": "#F7F4EF", "paper2": "#EFEAE2", "ink": "#1A1815", "ink2": "#4A4540",
    "bronze300": "#C89B72", "bronze500": "#A9744A", "bronze700": "#7E5334", "line": "#DDD5C9" },
  "font": { "display": "Space Grotesk", "body": "Inter", "arabic": "IBM Plex Sans Arabic" },
  "space": [4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
  "radius": { "sm": 4, "md": 8, "lg": 16 },
  "container": 1200,
  "ease": "cubic-bezier(0.22, 1, 0.36, 1)"
}
```

## 3.2 CSS Variables

```css
:root {
  --paper:#F7F4EF; --paper-2:#EFEAE2; --ink:#1A1815; --ink-2:#4A4540;
  --bronze-300:#C89B72; --bronze:#A9744A; --bronze-700:#7E5334; --line:#DDD5C9;
  --font-display:"Space Grotesk",sans-serif; --font-body:"Inter",sans-serif;
  --font-ar:"IBM Plex Sans Arabic",sans-serif;
  --ease:cubic-bezier(.22,1,.36,1);
}
```

## 3.3 Content Plan — AI Lab Roadmap: **MADAR LOOP | حلقة المدار**

Fictional flagship: an orbital multimodal transit programme in an unnamed Gulf capital (airport ↔ business district ↔ waterfront). *(Name chosen to avoid collision with real "Al Madar" companies in the region; every artifact carries the honest-labeling badge.)*

| # | Deliverable | Phase | Becomes case study |
|---|---|---|---|
| 1 | Programme identity: logo, EN/AR lockup, palette, 8–10pp brand mini-guide (PDF) | 1 — Foundation | "Design standards & templates" |
| 2 | Consistency visualization set: flagship station as Higgsfield reference element → 6–8 renders (aerial, approach, concourse, dawn, night, construction) | 1 — Foundation | "Consistency across AI-generated assets" |
| 3 | Executive presentation (real PPTX): overview, process map, delivery timeline, KPI dashboard, bilingual titles | 2 — Documents | "Executive & government communication" |
| 4 | Bilingual report / executive summary (real designed PDF, AR-EN mirrored spreads) | 2 — Documents | "Document production" |
| 5 | Storyboard → 45–60s programme film (AI scenes from same reference environment, VO, captions, titles) | 3 — Motion | "Video & motion content" |
| 6 | Supporting kit: infographic, icon set, lower thirds | Interleaved | Breadth evidence |

Each AI Lab case study documents: brief → prompt development → consistency system → QC → final, with prompt excerpts and before/after where useful.

## 3.4 Build Phases for Claude Code

1. Scaffold Astro + Tailwind + Sanity (embedded studio at /admin); commit token config from §3.1–3.2.
2. Implement schemas (§1.3) + seed 2 sample projects and all default categories.
3. Build shared components → Home → Work grid + filters → Case study template.
4. AI Lab template (ProcessSteps, PromptExcerpt, BeforeAfterSlider) → Skills → About/Certifications → Contact.
5. SEO/OG, sitemap, analytics (Plausible or Vercel), Lighthouse pass vs §1.6 targets.
6. Deploy to Vercel (`ahmedalbadri.vercel.app`), wire Sanity publish → deploy hook. Custom domain when purchased.

## 3.5 Kickoff Prompt for Claude Code

> Build a bilingual-accented (EN primary, AR accents, RTL-ready via CSS logical properties) portfolio website for Ahmed Albadri, an AI-first graphic designer and multimedia specialist in the Middle East. Stack: Astro 4 + Tailwind + Sanity (studio at /admin) on Vercel. Brand: "Editorial Precision" — warm paper #F7F4EF, ink #1A1815, bronze accent #A9744A; Space Grotesk display, Inter body, IBM Plex Sans Arabic for Arabic. Pages: Home (video montage hero), filterable Work grid with CMS-managed categories, Case Study template (video-led capable, before/after slider, honesty label), AI Lab with process documentation fields, Agentic Skills, About with Certifications, Contact. Implement the Sanity schemas, components, motion, and accessibility rules exactly as specified in ahmed-albadri-portfolio-spec.md, phases §3.4.

---

*End of specification. Companion document to follow: MADAR LOOP creative production plan (prompt systems, reference-element setup, deliverable templates).*
