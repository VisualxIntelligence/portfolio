import type {
  AgenticSkill,
  Category,
  Certification,
  Project,
  SiteSettings,
} from './types';
import { paragraphs } from './portableText';

/** Local seed content — used whenever PUBLIC_SANITY_PROJECT_ID is unset so the
 *  site builds and previews before the CMS exists. Mirrors the Sanity schemas 1:1.
 *  All MADAR LOOP work is fictional and carries the honest-labeling badge (spec §0). */

export const HONESTY_LABEL = 'Self-initiated concept — demonstration of capability';

const ph = (name: string, alt: string, w = 1600, h = 1000) => ({
  src: `/placeholders/${name}.svg`,
  alt,
  width: w,
  height: h,
});

export const seedCategories: Category[] = [
  { title: 'Video Explainers', titleAr: 'فيديوهات توضيحية', slug: 'video-explainers', order: 1, description: 'Motion pieces that turn complex programmes into 60-second stories.' },
  { title: 'Presentations', titleAr: 'عروض تقديمية', slug: 'presentations', order: 2, description: 'Executive and government-grade decks, bilingual where it counts.' },
  { title: 'Strategy & Documents', titleAr: 'استراتيجية ووثائق', slug: 'strategy-documents', order: 3, description: 'Reports, executive summaries and mirrored AR–EN editorial spreads.' },
  { title: 'Design Systems', titleAr: 'أنظمة تصميم', slug: 'design-systems', order: 4, description: 'Identities, standards and templates built to be reused by teams.' },
  { title: 'Storyboards', titleAr: 'قصص مصورة', slug: 'storyboards', order: 5, description: 'From script to frames — planning motion before a single render.' },
  { title: 'AI Lab', titleAr: 'مختبر الذكاء الاصطناعي', slug: 'ai-lab', order: 6, description: 'Self-initiated AI-generated samples with documented process rigor.' },
];

const cat = (slug: string) => seedCategories.find((c) => c.slug === slug)!;

export const seedProjects: Project[] = [
  {
    title: 'MADAR LOOP — Programme Identity & Brand Mini-Guide',
    titleAr: 'حلقة المدار — الهوية البصرية',
    slug: 'madar-loop-identity',
    category: cat('design-systems'),
    tags: ['identity', 'bilingual', 'brand guide'],
    year: 2026,
    client: 'MADAR LOOP (fictional transit programme)',
    label: HONESTY_LABEL,
    heroImage: ph('hero-identity', 'MADAR LOOP identity plate: bronze orbital mark over warm paper with Arabic lockup'),
    gallery: [
      ph('gallery-a', 'Logo construction grid for the MADAR LOOP orbital mark'),
      ph('gallery-b', 'EN/AR lockup variations on paper and ink backgrounds'),
      ph('gallery-d', 'Spread from the 10-page brand mini-guide'),
    ],
    summary:
      'Identity for a fictional orbital transit programme in a Gulf capital: logo, EN/AR lockup, palette, and a 10-page brand mini-guide built as reusable design standards.',
    body: paragraphs(
      'MADAR LOOP is the fictional flagship of my AI Lab: an orbital multimodal transit line linking an airport, a business district and a waterfront. The identity had to feel government-grade — credible next to real GCC infrastructure brands — while staying distinct from any existing operator.',
      'The mark is a single continuous loop with a station node, drawn on an 8px grid. The bilingual lockup treats Arabic as a first-class script: IBM Plex Sans Arabic, matched x-height, never letter-spaced. The mini-guide covers palette, typography, grid, photography direction and misuse cases, so the system can be applied by a team, not just by me.',
    ),
    tools: ['Illustrator', 'Figma', 'GPT Image 2', 'InDesign'],
    featured: true,
    publishedAt: '2026-05-10T09:00:00Z',
  },
  {
    title: 'Consistency Across AI-Generated Assets — Station Reference Set',
    titleAr: 'اتساق الأصول المولّدة',
    slug: 'madar-loop-consistency-set',
    category: cat('ai-lab'),
    tags: ['AI imagery', 'consistency', 'Higgsfield'],
    year: 2026,
    client: 'MADAR LOOP (fictional transit programme)',
    label: HONESTY_LABEL,
    heroImage: ph('hero-consistency', 'Grid of eight renders of the same flagship station across times of day'),
    gallery: [
      ph('gallery-b', 'Aerial render of the flagship station at dawn'),
      ph('gallery-c', 'Concourse interior render with consistent material palette'),
      ph('gallery-a', 'Night approach render showing identical architecture'),
    ],
    videoUrls: [],
    summary:
      'One flagship station, locked as a Higgsfield reference element, rendered eight ways — aerial, approach, concourse, dawn, night, construction — without drifting off-model.',
    body: paragraphs(
      'The hardest problem in AI-generated campaign imagery is consistency: the second render never quite matches the first. This study locks a single flagship station design as a reference element and reproduces it across eight scenarios that a real programme would need — from investor-deck aerials to construction-progress shots.',
      'Every render passed a QC checklist: silhouette match, material palette, signage placement, and lighting logic. Failures were documented, not hidden — three of the eleven generations were rejected and re-prompted.',
    ),
    tools: ['Higgsfield', 'GPT Image 2', 'Photoshop'],
    featured: true,
    publishedAt: '2026-05-24T09:00:00Z',
    processSteps: [
      {
        step: '01 — Prompt Development',
        description: 'Built a base scene grammar: fixed architecture descriptors, camera language and negative prompts, versioned like code.',
        image: ph('process-1', 'Annotated prompt document with versioned scene grammar'),
      },
      {
        step: '02 — Consistency System',
        description: 'Locked the station as a reference element; every new scene inherits geometry and materials before scenario-specific prompting.',
        image: ph('process-2', 'Reference-element board showing the locked station geometry'),
      },
      {
        step: '03 — Quality Control',
        description: 'Side-by-side silhouette and palette checks against the reference; rejected generations logged with the reason.',
        image: ph('process-3', 'QC grid comparing eight renders against the reference'),
      },
    ],
    promptExcerpts: [
      'Flagship elevated transit station, single continuous roof loop in warm bronze anodised aluminium, glass concourse beneath, desert-coastal light — aerial three-quarter view, 35mm, morning haze. Consistent with reference element MADAR-ST-01.',
      'Same station, street-level approach at dusk, passengers with luggage, bilingual EN/AR wayfinding totems in ink and bronze, no fictional operator logos other than MADAR LOOP lockup.',
    ],
    beforeAfter: {
      before: ph('before', 'Early generation with drifting architecture and wrong materials'),
      after: ph('after', 'Final render matching the locked reference element'),
    },
  },
  {
    title: 'Executive Presentation — Programme Overview & KPI Dashboard',
    titleAr: 'العرض التنفيذي للبرنامج',
    slug: 'madar-loop-executive-presentation',
    category: cat('presentations'),
    tags: ['PPTX', 'bilingual', 'dashboard'],
    year: 2026,
    client: 'MADAR LOOP (fictional transit programme)',
    label: HONESTY_LABEL,
    heroImage: ph('hero-exec-deck', 'Title slide of the executive deck with bilingual headline'),
    gallery: [
      ph('gallery-a', 'Process map slide with swimlane diagram'),
      ph('gallery-d', 'KPI dashboard slide with editorial data visualisation'),
    ],
    summary:
      'A real, working PPTX: programme overview, process map, delivery timeline and KPI dashboard with bilingual titles — built to the standard of a government steering committee.',
    body: paragraphs(
      'Decks for engineering programmes fail in predictable ways: cluttered timelines, unreadable KPI tables, Arabic added as an afterthought. This deck is built on a strict grid with a slide-master system, so programme teams can extend it without breaking the design.',
      'Every data visual is drawn, not screenshotted — editable charts with the Editorial Precision palette, AA-contrast labels and bilingual titles that treat Arabic typography correctly.',
    ),
    tools: ['PowerPoint', 'Illustrator', 'GPT Image 2'],
    featured: true,
    publishedAt: '2026-06-07T09:00:00Z',
  },
  {
    title: 'Bilingual Executive Summary — Mirrored AR–EN Report',
    titleAr: 'الملخص التنفيذي ثنائي اللغة',
    slug: 'madar-loop-bilingual-report',
    category: cat('strategy-documents'),
    tags: ['editorial', 'RTL', 'report'],
    year: 2026,
    client: 'MADAR LOOP (fictional transit programme)',
    label: HONESTY_LABEL,
    heroImage: ph('hero-report', 'Open spread of the bilingual report with mirrored columns'),
    gallery: [
      ph('gallery-c', 'English spread with editorial grid and bronze rules'),
      ph('gallery-b', 'Arabic spread, fully mirrored RTL layout'),
    ],
    documents: [
      {
        title: 'MADAR LOOP — Executive Summary',
        kind: 'Bilingual PDF report',
        url: '/placeholders/sample-report.pdf',
        ext: 'pdf',
        size: 727,
      },
    ],
    summary:
      'A designed PDF report with genuinely mirrored AR–EN spreads — same grid, same hierarchy, two reading directions — proving document production depth beyond decks.',
    body: paragraphs(
      'Bilingual government documents usually pick a side: the Arabic reads like a translation pasted into an English layout. Here both languages get the same editorial treatment — a mirrored grid where margins, folios and rules flip direction, and Arabic type is set with its own line-height and no letter-spacing.',
      'The report includes an executive summary, programme phasing, and a risk matrix — each element designed once and mirrored, demonstrating a system rather than a one-off.',
    ),
    tools: ['InDesign', 'Illustrator'],
    featured: false,
    publishedAt: '2026-06-18T09:00:00Z',
  },
  {
    title: 'Programme Film — Storyboard to 60-Second Cut',
    titleAr: 'فيلم البرنامج',
    slug: 'madar-loop-programme-film',
    category: cat('video-explainers'),
    tags: ['motion', 'storyboard', 'AI video'],
    year: 2026,
    client: 'MADAR LOOP (fictional transit programme)',
    label: HONESTY_LABEL,
    heroImage: ph('hero-film', 'Film frame of the station at night with lower-third caption'),
    // heroVideoUrl: add the real unlisted YouTube/Vimeo URL to switch this study to video-led.
    gallery: [
      ph('gallery-a', 'Storyboard page with twelve numbered frames'),
      ph('gallery-c', 'Frame from the dawn aerial sequence'),
    ],
    summary:
      'A 45–60s programme film: storyboarded first, then AI scenes generated from the same locked reference environment, with voiceover, captions and bilingual titles.',
    body: paragraphs(
      'The film closes the loop on the MADAR LOOP system: the same reference station that anchors the still imagery becomes the set for a motion piece. Every AI-generated scene was storyboarded before generation — frames, camera moves and durations planned on paper, so the edit was an assembly, not a search.',
      'Voiceover, kinetic captions and EN/AR titles were produced with the same restraint as the rest of the brand: one easing curve, no gratuitous moves.',
    ),
    tools: ['Higgsfield', 'After Effects', 'Premiere Pro', 'ElevenLabs'],
    featured: true,
    publishedAt: '2026-06-30T09:00:00Z',
    processSteps: [
      {
        step: '01 — Script & Storyboard',
        description: 'Twelve-frame board with camera language and timing before any generation.',
        image: ph('process-1', 'Storyboard page with camera notes'),
      },
      {
        step: '02 — Scene Generation',
        description: 'Scenes generated from the locked reference environment; off-model takes rejected.',
        image: ph('process-2', 'Contact sheet of generated takes with QC marks'),
      },
      {
        step: '03 — Edit & Finishing',
        description: 'Cut, VO, captions and bilingual titles finished in After Effects and Premiere.',
        image: ph('process-3', 'Timeline screenshot of the final edit'),
      },
    ],
    promptExcerpts: [
      'Slow dawn aerial pull-back over MADAR-ST-01 station, bronze roof catching first light, city waking behind — 6 seconds, gentle ease, no camera shake.',
    ],
  },
  {
    title: 'Supporting Kit — Infographic, Icon Set & Lower Thirds',
    titleAr: 'حزمة الدعم البصري',
    slug: 'madar-loop-supporting-kit',
    category: cat('storyboards'),
    tags: ['icons', 'infographic', 'motion kit'],
    year: 2026,
    client: 'MADAR LOOP (fictional transit programme)',
    label: HONESTY_LABEL,
    heroImage: ph('hero-kit', 'Sheet of transit icons, an infographic and lower-third designs'),
    gallery: [
      ph('gallery-b', 'Icon set on the 8px grid'),
      ph('gallery-d', 'Programme infographic with bronze data accents'),
    ],
    summary:
      'The breadth pass: a programme infographic, a 24-icon transit set on the brand grid, and animated lower thirds — the unglamorous assets real programmes run on.',
    body: paragraphs(
      'Identity systems live or die in the supporting assets. This kit proves the MADAR LOOP standards survive contact with everyday deliverables: a phasing infographic, a 24-icon wayfinding set drawn on the same grid as the logo, and lower thirds animated with the brand easing curve.',
    ),
    tools: ['Illustrator', 'After Effects', 'Figma'],
    featured: false,
    publishedAt: '2026-07-05T09:00:00Z',
  },
];

export const seedSkills: AgenticSkill[] = [
  {
    name: 'Brand QC Agent',
    slug: 'brand-qc-agent',
    oneLiner: 'A Claude skill that audits AI-generated imagery against locked brand references.',
    whatItAutomates:
      'Given a folder of generated renders and a reference board, it checks silhouette match, palette drift and signage placement, then writes a pass/fail QC log with reasons — the manual checklist from the MADAR LOOP consistency study, automated.',
    stack: ['Claude Code', 'Claude Skills', 'Python', 'Pillow'],
    screenshots: [ph('skill-1', 'Terminal output of the brand QC agent logging pass/fail per render')],
    status: 'in use',
  },
  {
    name: 'Bilingual Deck Builder',
    slug: 'bilingual-deck-builder',
    oneLiner: 'Generates grid-true, bilingual PPTX decks from a structured outline.',
    whatItAutomates:
      'Turns a YAML outline into a PowerPoint file on the Editorial Precision slide masters: EN/AR titles set with correct fonts and direction, KPI tables styled to AA contrast, and speaker notes carried through — an afternoon of layout in about a minute.',
    stack: ['Claude Code', 'python-pptx', 'Claude Skills'],
    screenshots: [ph('skill-2', 'Generated deck open in PowerPoint next to the YAML outline')],
    status: 'prototype',
  },
  {
    name: 'Prompt Version Librarian',
    slug: 'prompt-version-librarian',
    oneLiner: 'Versions and diffs image-generation prompts like source code.',
    whatItAutomates:
      'Stores every prompt iteration with its output thumbnail and QC verdict, diffs prompt changes between versions, and answers "which change fixed the roofline?" — turning prompt development into a documented, reviewable process.',
    stack: ['Claude Code', 'Git', 'SQLite'],
    status: 'prototype',
  },
];

export const seedCertifications: Certification[] = [
  { name: 'Sample Certification — replace in Studio', issuer: 'Issuing body', year: 2025, badge: ph('cert-badge', 'Placeholder certification badge', 800, 800), order: 1 },
  { name: 'Sample Certification — replace in Studio', issuer: 'Issuing body', year: 2024, badge: ph('cert-badge', 'Placeholder certification badge', 800, 800), order: 2 },
];

export const seedSettings: SiteSettings = {
  heroHeadline: 'AI-first design, government-grade polish.',
  heroHeadlineAr: 'تصميم يقوده الذكاء الاصطناعي بإتقان تحريري',
  montageVideoUrl: '',
  email: 'visualintelligenceai@gmail.com',
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'Behance', url: 'https://www.behance.net/' },
  ],
  footerLine: 'Based in Riyadh · Working across the Middle East',
  cvUrl: '/cv/Ahmed-Albadri-CV.pdf',
};
