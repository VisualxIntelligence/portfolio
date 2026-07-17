// One-shot import of the local seed content (src/lib/seed.ts data, mirrored here as
// plain JS) into the Sanity dataset. Idempotent: uses deterministic _ids with
// createOrReplace, and reuses already-uploaded placeholder assets by filename.
//
// Usage:
//   1. Create a token with Editor rights at sanity.io/manage → API → Tokens
//   2. Add to .env:  SANITY_WRITE_TOKEN=sk...
//   3. node scripts/seed-sanity.mjs
import { createClient } from '@sanity/client';
import { createReadStream, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env parser (no dotenv dependency).
const env = {};
for (const line of readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}

const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';
const token = env.SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID missing from .env');
if (!token)
  throw new Error(
    'SANITY_WRITE_TOKEN missing. Create one at sanity.io/manage → API → Tokens (Editor) and add it to .env',
  );

const client = createClient({ projectId, dataset, token, apiVersion: '2026-07-01', useCdn: false });

const key = () => randomBytes(6).toString('hex');

// ── Asset upload with filename-based reuse ─────────────────────────────
const assetCache = new Map();
async function uploadImage(publicPath, alt) {
  if (!publicPath) return undefined;
  const file = join(root, 'public', publicPath.replace(/^\//, ''));
  const filename = basename(file);
  if (!assetCache.has(filename)) {
    const existing = await client.fetch(
      `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
      { f: filename },
    );
    if (existing) {
      assetCache.set(filename, existing);
    } else {
      const asset = await client.assets.upload('image', createReadStream(file), { filename });
      assetCache.set(filename, asset._id);
      console.log(`  uploaded asset ${filename}`);
    }
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: assetCache.get(filename) }, alt };
}

async function uploadFile(publicPath) {
  const file = join(root, 'public', publicPath.replace(/^\//, ''));
  const filename = basename(file);
  if (!assetCache.has(filename)) {
    const existing = await client.fetch(
      `*[_type == "sanity.fileAsset" && originalFilename == $f][0]._id`,
      { f: filename },
    );
    if (existing) {
      assetCache.set(filename, existing);
    } else {
      const asset = await client.assets.upload('file', createReadStream(file), { filename });
      assetCache.set(filename, asset._id);
      console.log(`  uploaded file ${filename}`);
    }
  }
  return { _type: 'file', asset: { _type: 'reference', _ref: assetCache.get(filename) } };
}

const block = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

// ── Seed content (mirrors src/lib/seed.ts) ─────────────────────────────
const HONESTY = 'Self-initiated concept — demonstration of capability';

const categories = [
  ['Video Explainers', 'فيديوهات توضيحية', 'video-explainers', 1, 'Motion pieces that turn complex programmes into 60-second stories.'],
  ['Presentations', 'عروض تقديمية', 'presentations', 2, 'Executive and government-grade decks, bilingual where it counts.'],
  ['Strategy & Documents', 'استراتيجية ووثائق', 'strategy-documents', 3, 'Reports, executive summaries and mirrored AR–EN editorial spreads.'],
  ['Design Systems', 'أنظمة تصميم', 'design-systems', 4, 'Identities, standards and templates built to be reused by teams.'],
  ['Storyboards', 'قصص مصورة', 'storyboards', 5, 'From script to frames — planning motion before a single render.'],
  ['AI Lab', 'مختبر الذكاء الاصطناعي', 'ai-lab', 6, 'Self-initiated AI-generated samples with documented process rigor.'],
].map(([title, titleAr, slug, order, description]) => ({
  _id: `category-${slug}`,
  _type: 'category',
  title,
  titleAr,
  slug: { current: slug },
  order,
  description,
}));

const catRef = (slug) => ({ _type: 'reference', _ref: `category-${slug}` });

async function buildProjects() {
  const g = (name, alt) => uploadImage(`/placeholders/${name}.svg`, alt);
  return [
    {
      _id: 'project-madar-loop-identity',
      _type: 'project',
      title: 'MADAR LOOP — Programme Identity & Brand Mini-Guide',
      titleAr: 'حلقة المدار — الهوية البصرية',
      slug: { current: 'madar-loop-identity' },
      category: catRef('design-systems'),
      tags: ['identity', 'bilingual', 'brand guide'],
      year: 2026,
      client: 'MADAR LOOP (fictional transit programme)',
      label: HONESTY,
      heroImage: await g('hero-identity', 'MADAR LOOP identity plate: bronze orbital mark over warm paper with Arabic lockup'),
      gallery: [
        { ...(await g('gallery-a', 'Logo construction grid for the MADAR LOOP orbital mark')), _key: key() },
        { ...(await g('gallery-b', 'EN/AR lockup variations on paper and ink backgrounds')), _key: key() },
        { ...(await g('gallery-d', 'Spread from the 10-page brand mini-guide')), _key: key() },
      ],
      summary:
        'Identity for a fictional orbital transit programme in a Gulf capital: logo, EN/AR lockup, palette, and a 10-page brand mini-guide built as reusable design standards.',
      body: [
        block('MADAR LOOP is the fictional flagship of my AI Lab: an orbital multimodal transit line linking an airport, a business district and a waterfront. The identity had to feel government-grade — credible next to real GCC infrastructure brands — while staying distinct from any existing operator.'),
        block('The mark is a single continuous loop with a station node, drawn on an 8px grid. The bilingual lockup treats Arabic as a first-class script: IBM Plex Sans Arabic, matched x-height, never letter-spaced. The mini-guide covers palette, typography, grid, photography direction and misuse cases, so the system can be applied by a team, not just by me.'),
      ],
      tools: ['Illustrator', 'Figma', 'GPT Image 2', 'InDesign'],
      featured: true,
      publishedAt: '2026-05-10T09:00:00Z',
    },
    {
      _id: 'project-madar-loop-consistency-set',
      _type: 'project',
      title: 'Consistency Across AI-Generated Assets — Station Reference Set',
      titleAr: 'اتساق الأصول المولّدة',
      slug: { current: 'madar-loop-consistency-set' },
      category: catRef('ai-lab'),
      tags: ['AI imagery', 'consistency', 'Higgsfield'],
      year: 2026,
      client: 'MADAR LOOP (fictional transit programme)',
      label: HONESTY,
      heroImage: await g('hero-consistency', 'Grid of eight renders of the same flagship station across times of day'),
      gallery: [
        { ...(await g('gallery-b', 'Aerial render of the flagship station at dawn')), _key: key() },
        { ...(await g('gallery-c', 'Concourse interior render with consistent material palette')), _key: key() },
        { ...(await g('gallery-a', 'Night approach render showing identical architecture')), _key: key() },
      ],
      summary:
        'One flagship station, locked as a Higgsfield reference element, rendered eight ways — aerial, approach, concourse, dawn, night, construction — without drifting off-model.',
      body: [
        block('The hardest problem in AI-generated campaign imagery is consistency: the second render never quite matches the first. This study locks a single flagship station design as a reference element and reproduces it across eight scenarios that a real programme would need — from investor-deck aerials to construction-progress shots.'),
        block('Every render passed a QC checklist: silhouette match, material palette, signage placement, and lighting logic. Failures were documented, not hidden — three of the eleven generations were rejected and re-prompted.'),
      ],
      tools: ['Higgsfield', 'GPT Image 2', 'Photoshop'],
      featured: true,
      publishedAt: '2026-05-24T09:00:00Z',
      processSteps: [
        { _type: 'processStep', _key: key(), step: '01 — Prompt Development', description: 'Built a base scene grammar: fixed architecture descriptors, camera language and negative prompts, versioned like code.', image: await g('process-1', 'Annotated prompt document with versioned scene grammar') },
        { _type: 'processStep', _key: key(), step: '02 — Consistency System', description: 'Locked the station as a reference element; every new scene inherits geometry and materials before scenario-specific prompting.', image: await g('process-2', 'Reference-element board showing the locked station geometry') },
        { _type: 'processStep', _key: key(), step: '03 — Quality Control', description: 'Side-by-side silhouette and palette checks against the reference; rejected generations logged with the reason.', image: await g('process-3', 'QC grid comparing eight renders against the reference') },
      ],
      promptExcerpts: [
        'Flagship elevated transit station, single continuous roof loop in warm bronze anodised aluminium, glass concourse beneath, desert-coastal light — aerial three-quarter view, 35mm, morning haze. Consistent with reference element MADAR-ST-01.',
        'Same station, street-level approach at dusk, passengers with luggage, bilingual EN/AR wayfinding totems in ink and bronze, no fictional operator logos other than MADAR LOOP lockup.',
      ],
      beforeAfter: {
        before: await g('before', 'Early generation with drifting architecture and wrong materials'),
        after: await g('after', 'Final render matching the locked reference element'),
      },
    },
    {
      _id: 'project-madar-loop-executive-presentation',
      _type: 'project',
      title: 'Executive Presentation — Programme Overview & KPI Dashboard',
      titleAr: 'العرض التنفيذي للبرنامج',
      slug: { current: 'madar-loop-executive-presentation' },
      category: catRef('presentations'),
      tags: ['PPTX', 'bilingual', 'dashboard'],
      year: 2026,
      client: 'MADAR LOOP (fictional transit programme)',
      label: HONESTY,
      heroImage: await g('hero-exec-deck', 'Title slide of the executive deck with bilingual headline'),
      gallery: [
        { ...(await g('gallery-a', 'Process map slide with swimlane diagram')), _key: key() },
        { ...(await g('gallery-d', 'KPI dashboard slide with editorial data visualisation')), _key: key() },
      ],
      summary:
        'A real, working PPTX: programme overview, process map, delivery timeline and KPI dashboard with bilingual titles — built to the standard of a government steering committee.',
      body: [
        block('Decks for engineering programmes fail in predictable ways: cluttered timelines, unreadable KPI tables, Arabic added as an afterthought. This deck is built on a strict grid with a slide-master system, so programme teams can extend it without breaking the design.'),
        block('Every data visual is drawn, not screenshotted — editable charts with the Editorial Precision palette, AA-contrast labels and bilingual titles that treat Arabic typography correctly.'),
      ],
      tools: ['PowerPoint', 'Illustrator', 'GPT Image 2'],
      featured: true,
      publishedAt: '2026-06-07T09:00:00Z',
    },
    {
      _id: 'project-madar-loop-bilingual-report',
      _type: 'project',
      title: 'Bilingual Executive Summary — Mirrored AR–EN Report',
      titleAr: 'الملخص التنفيذي ثنائي اللغة',
      slug: { current: 'madar-loop-bilingual-report' },
      category: catRef('strategy-documents'),
      tags: ['editorial', 'RTL', 'report'],
      year: 2026,
      client: 'MADAR LOOP (fictional transit programme)',
      label: HONESTY,
      heroImage: await g('hero-report', 'Open spread of the bilingual report with mirrored columns'),
      gallery: [
        { ...(await g('gallery-c', 'English spread with editorial grid and bronze rules')), _key: key() },
        { ...(await g('gallery-b', 'Arabic spread, fully mirrored RTL layout')), _key: key() },
      ],
      documents: [
        {
          _type: 'document',
          _key: key(),
          title: 'MADAR LOOP — Executive Summary',
          kind: 'Bilingual PDF report',
          file: await uploadFile('/placeholders/sample-report.pdf'),
        },
      ],
      summary:
        'A designed PDF report with genuinely mirrored AR–EN spreads — same grid, same hierarchy, two reading directions — proving document production depth beyond decks.',
      body: [
        block('Bilingual government documents usually pick a side: the Arabic reads like a translation pasted into an English layout. Here both languages get the same editorial treatment — a mirrored grid where margins, folios and rules flip direction, and Arabic type is set with its own line-height and no letter-spacing.'),
        block('The report includes an executive summary, programme phasing, and a risk matrix — each element designed once and mirrored, demonstrating a system rather than a one-off.'),
      ],
      tools: ['InDesign', 'Illustrator'],
      featured: false,
      publishedAt: '2026-06-18T09:00:00Z',
    },
    {
      _id: 'project-madar-loop-programme-film',
      _type: 'project',
      title: 'Programme Film — Storyboard to 60-Second Cut',
      titleAr: 'فيلم البرنامج',
      slug: { current: 'madar-loop-programme-film' },
      category: catRef('video-explainers'),
      tags: ['motion', 'storyboard', 'AI video'],
      year: 2026,
      client: 'MADAR LOOP (fictional transit programme)',
      label: HONESTY,
      heroImage: await g('hero-film', 'Film frame of the station at night with lower-third caption'),
      gallery: [
        { ...(await g('gallery-a', 'Storyboard page with twelve numbered frames')), _key: key() },
        { ...(await g('gallery-c', 'Frame from the dawn aerial sequence')), _key: key() },
      ],
      summary:
        'A 45–60s programme film: storyboarded first, then AI scenes generated from the same locked reference environment, with voiceover, captions and bilingual titles.',
      body: [
        block('The film closes the loop on the MADAR LOOP system: the same reference station that anchors the still imagery becomes the set for a motion piece. Every AI-generated scene was storyboarded before generation — frames, camera moves and durations planned on paper, so the edit was an assembly, not a search.'),
        block('Voiceover, kinetic captions and EN/AR titles were produced with the same restraint as the rest of the brand: one easing curve, no gratuitous moves.'),
      ],
      tools: ['Higgsfield', 'After Effects', 'Premiere Pro', 'ElevenLabs'],
      featured: true,
      publishedAt: '2026-06-30T09:00:00Z',
      processSteps: [
        { _type: 'processStep', _key: key(), step: '01 — Script & Storyboard', description: 'Twelve-frame board with camera language and timing before any generation.', image: await g('process-1', 'Storyboard page with camera notes') },
        { _type: 'processStep', _key: key(), step: '02 — Scene Generation', description: 'Scenes generated from the locked reference environment; off-model takes rejected.', image: await g('process-2', 'Contact sheet of generated takes with QC marks') },
        { _type: 'processStep', _key: key(), step: '03 — Edit & Finishing', description: 'Cut, VO, captions and bilingual titles finished in After Effects and Premiere.', image: await g('process-3', 'Timeline screenshot of the final edit') },
      ],
      promptExcerpts: [
        'Slow dawn aerial pull-back over MADAR-ST-01 station, bronze roof catching first light, city waking behind — 6 seconds, gentle ease, no camera shake.',
      ],
    },
    {
      _id: 'project-madar-loop-supporting-kit',
      _type: 'project',
      title: 'Supporting Kit — Infographic, Icon Set & Lower Thirds',
      titleAr: 'حزمة الدعم البصري',
      slug: { current: 'madar-loop-supporting-kit' },
      category: catRef('storyboards'),
      tags: ['icons', 'infographic', 'motion kit'],
      year: 2026,
      client: 'MADAR LOOP (fictional transit programme)',
      label: HONESTY,
      heroImage: await g('hero-kit', 'Sheet of transit icons, an infographic and lower-third designs'),
      gallery: [
        { ...(await g('gallery-b', 'Icon set on the 8px grid')), _key: key() },
        { ...(await g('gallery-d', 'Programme infographic with bronze data accents')), _key: key() },
      ],
      summary:
        'The breadth pass: a programme infographic, a 24-icon transit set on the brand grid, and animated lower thirds — the unglamorous assets real programmes run on.',
      body: [
        block('Identity systems live or die in the supporting assets. This kit proves the MADAR LOOP standards survive contact with everyday deliverables: a phasing infographic, a 24-icon wayfinding set drawn on the same grid as the logo, and lower thirds animated with the brand easing curve.'),
      ],
      tools: ['Illustrator', 'After Effects', 'Figma'],
      featured: false,
      publishedAt: '2026-07-05T09:00:00Z',
    },
  ];
}

async function buildSkills() {
  const g = (name, alt) => uploadImage(`/placeholders/${name}.svg`, alt);
  return [
    {
      _id: 'agenticSkill-brand-qc-agent',
      _type: 'agenticSkill',
      name: 'Brand QC Agent',
      slug: { current: 'brand-qc-agent' },
      oneLiner: 'A Claude skill that audits AI-generated imagery against locked brand references.',
      whatItAutomates:
        'Given a folder of generated renders and a reference board, it checks silhouette match, palette drift and signage placement, then writes a pass/fail QC log with reasons — the manual checklist from the MADAR LOOP consistency study, automated.',
      stack: ['Claude Code', 'Claude Skills', 'Python', 'Pillow'],
      screenshots: [{ ...(await g('skill-1', 'Terminal output of the brand QC agent logging pass/fail per render')), _key: key() }],
      status: 'in use',
    },
    {
      _id: 'agenticSkill-bilingual-deck-builder',
      _type: 'agenticSkill',
      name: 'Bilingual Deck Builder',
      slug: { current: 'bilingual-deck-builder' },
      oneLiner: 'Generates grid-true, bilingual PPTX decks from a structured outline.',
      whatItAutomates:
        'Turns a YAML outline into a PowerPoint file on the Editorial Precision slide masters: EN/AR titles set with correct fonts and direction, KPI tables styled to AA contrast, and speaker notes carried through — an afternoon of layout in about a minute.',
      stack: ['Claude Code', 'python-pptx', 'Claude Skills'],
      screenshots: [{ ...(await g('skill-2', 'Generated deck open in PowerPoint next to the YAML outline')), _key: key() }],
      status: 'prototype',
    },
    {
      _id: 'agenticSkill-prompt-version-librarian',
      _type: 'agenticSkill',
      name: 'Prompt Version Librarian',
      slug: { current: 'prompt-version-librarian' },
      oneLiner: 'Versions and diffs image-generation prompts like source code.',
      whatItAutomates:
        'Stores every prompt iteration with its output thumbnail and QC verdict, diffs prompt changes between versions, and answers "which change fixed the roofline?" — turning prompt development into a documented, reviewable process.',
      stack: ['Claude Code', 'Git', 'SQLite'],
      status: 'prototype',
    },
  ];
}

async function buildCerts() {
  const badge = await uploadImage('/placeholders/cert-badge.svg', 'Placeholder certification badge');
  return [1, 2].map((order) => ({
    _id: `certification-sample-${order}`,
    _type: 'certification',
    name: 'Sample Certification — replace in Studio',
    issuer: 'Issuing body',
    year: 2026 - order,
    badge,
    order,
  }));
}

const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  heroHeadline: 'AI-first design, government-grade polish.',
  heroHeadlineAr: 'تصميم يقوده الذكاء الاصطناعي بإتقان تحريري',
  email: 'visualintelligenceai@gmail.com',
  socials: [
    { _type: 'social', _key: key(), label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { _type: 'social', _key: key(), label: 'Behance', url: 'https://www.behance.net/' },
  ],
  footerLine: 'Based in Riyadh · Working across the Middle East',
};

// ── Run ────────────────────────────────────────────────────────────────
console.log(`Seeding project ${projectId} / dataset ${dataset}…`);
const docs = [
  ...categories,
  ...(await buildProjects()),
  ...(await buildSkills()),
  ...(await buildCerts()),
  settings,
];

let tx = client.transaction();
for (const doc of docs) tx = tx.createOrReplace(doc);
await tx.commit();
console.log(`Done — ${docs.length} documents written. Open /admin to review.`);
