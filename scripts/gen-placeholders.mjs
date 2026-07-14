// Generates editorial-styled SVG placeholder imagery for the local seed content.
// Run: node scripts/gen-placeholders.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'placeholders');
mkdirSync(outDir, { recursive: true });

const C = {
  paper: '#F7F4EF',
  paper2: '#EFEAE2',
  ink: '#1A1815',
  ink2: '#4A4540',
  bronze300: '#C89B72',
  bronze: '#A9744A',
  bronze700: '#7E5334',
  line: '#DDD5C9',
};

/** Editorial placeholder: warm paper, hairline grid, bronze geometry, EN/AR caption. */
function plate({ w = 1600, h = 1000, bg = C.paper2, motif = 'orbit', en = '', ar = '', dark = false }) {
  const fg = dark ? C.paper : C.ink;
  const sub = dark ? C.bronze300 : C.bronze700;
  const base = dark ? C.ink : bg;
  const rule = dark ? '#2B2723' : C.line;
  const cx = w / 2;
  const cy = h / 2 - 40;

  const motifs = {
    orbit: `
      <circle cx="${cx}" cy="${cy}" r="${h * 0.28}" fill="none" stroke="${C.bronze}" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${h * 0.42}" ry="${h * 0.16}" fill="none" stroke="${sub}" stroke-width="1.5" transform="rotate(-18 ${cx} ${cy})"/>
      <circle cx="${cx + h * 0.395}" cy="${cy - h * 0.13}" r="10" fill="${C.bronze}"/>
      <circle cx="${cx}" cy="${cy}" r="5" fill="${fg}"/>`,
    grid: `
      ${Array.from({ length: 5 }, (_, i) => `<rect x="${cx - 220 + i * 92}" y="${cy - 160 + (i % 2) * 36}" width="60" height="${240 - (i % 3) * 48}" fill="none" stroke="${C.bronze}" stroke-width="1.5"/>`).join('')}
      <line x1="${cx - 260}" y1="${cy + 140}" x2="${cx + 260}" y2="${cy + 140}" stroke="${fg}" stroke-width="2"/>`,
    frames: `
      <rect x="${cx - 300}" y="${cy - 140}" width="180" height="120" fill="none" stroke="${C.bronze}" stroke-width="2"/>
      <rect x="${cx - 90}" y="${cy - 170}" width="180" height="120" fill="none" stroke="${sub}" stroke-width="1.5"/>
      <rect x="${cx + 120}" y="${cy - 140}" width="180" height="120" fill="none" stroke="${C.bronze}" stroke-width="2"/>
      <path d="M ${cx - 210} ${cy + 60} L ${cx - 150} ${cy + 130} L ${cx - 90} ${cy + 60}" fill="none" stroke="${fg}" stroke-width="2"/>
      <line x1="${cx - 300}" y1="${cy + 130}" x2="${cx + 300}" y2="${cy + 130}" stroke="${rule}" stroke-width="1"/>`,
    document: `
      <rect x="${cx - 150}" y="${cy - 190}" width="300" height="380" fill="${dark ? '#221F1B' : C.paper}" stroke="${C.bronze}" stroke-width="2"/>
      ${Array.from({ length: 7 }, (_, i) => `<line x1="${cx - 110}" y1="${cy - 130 + i * 40}" x2="${cx + ((i % 3) - 1) * 20 + 90}" y2="${cy - 130 + i * 40}" stroke="${i === 0 ? C.bronze : rule}" stroke-width="${i === 0 ? 3 : 1.5}"/>`).join('')}`,
    wave: `
      <path d="M ${cx - 340} ${cy} C ${cx - 240} ${cy - 120}, ${cx - 120} ${cy + 120}, ${cx} ${cy} S ${cx + 240} ${cy - 120}, ${cx + 340} ${cy}" fill="none" stroke="${C.bronze}" stroke-width="2.5"/>
      <path d="M ${cx - 340} ${cy + 50} C ${cx - 240} ${cy - 70}, ${cx - 120} ${cy + 170}, ${cx} ${cy + 50} S ${cx + 240} ${cy - 70}, ${cx + 340} ${cy + 50}" fill="none" stroke="${sub}" stroke-width="1.5"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${base}"/>
  <line x1="48" y1="72" x2="${w - 48}" y2="72" stroke="${rule}" stroke-width="1"/>
  <line x1="48" y1="${h - 72}" x2="${w - 48}" y2="${h - 72}" stroke="${rule}" stroke-width="1"/>
  ${motifs[motif] ?? motifs.orbit}
  <text x="48" y="52" font-family="Space Grotesk, Arial, sans-serif" font-size="22" letter-spacing="2" fill="${sub}">${en.toUpperCase()}</text>
  <text x="${w - 48}" y="52" text-anchor="end" font-family="IBM Plex Sans Arabic, Arial, sans-serif" font-size="24" fill="${fg}">${ar}</text>
  <text x="48" y="${h - 34}" font-family="Inter, Arial, sans-serif" font-size="16" fill="${dark ? C.bronze300 : C.ink2}">Placeholder plate — replace via Sanity Studio</text>
</svg>`;
}

const plates = [
  ['hero-identity', { motif: 'orbit', en: 'Madar Loop — Identity', ar: 'حلقة المدار' }],
  ['hero-consistency', { motif: 'frames', en: 'Consistency Set', ar: 'اتساق بصري', dark: true }],
  ['hero-exec-deck', { motif: 'grid', en: 'Executive Presentation', ar: 'عرض تنفيذي' }],
  ['hero-report', { motif: 'document', en: 'Bilingual Report', ar: 'تقرير ثنائي اللغة' }],
  ['hero-film', { motif: 'wave', en: 'Programme Film', ar: 'فيلم البرنامج', dark: true }],
  ['hero-kit', { motif: 'grid', en: 'Supporting Kit', ar: 'حزمة الدعم' }],
  ['gallery-a', { motif: 'orbit', en: 'Plate A', ar: 'لوحة أ' }],
  ['gallery-b', { motif: 'frames', en: 'Plate B', ar: 'لوحة ب' }],
  ['gallery-c', { motif: 'wave', en: 'Plate C', ar: 'لوحة ج' }],
  ['gallery-d', { motif: 'document', en: 'Plate D', ar: 'لوحة د' }],
  ['before', { motif: 'frames', en: 'Before — raw generation', ar: 'قبل' }],
  ['after', { motif: 'orbit', en: 'After — consistency pass', ar: 'بعد', dark: true }],
  ['process-1', { motif: 'document', en: '01 Prompt Development', ar: 'تطوير الموجهات' }],
  ['process-2', { motif: 'frames', en: '02 Consistency System', ar: 'نظام الاتساق' }],
  ['process-3', { motif: 'grid', en: '03 Quality Control', ar: 'ضبط الجودة' }],
  ['skill-1', { motif: 'grid', en: 'Skill — brand QC agent', ar: 'مهارة', dark: true }],
  ['skill-2', { motif: 'document', en: 'Skill — deck builder', ar: 'مهارة' }],
  ['cert-badge', { motif: 'orbit', en: 'Certification', ar: 'شهادة', w: 800, h: 800 }],
  ['montage-poster', { motif: 'wave', en: 'Showreel montage', ar: 'مونتاج', w: 1920, h: 1080, dark: true }],
];

for (const [name, opts] of plates) {
  writeFileSync(join(outDir, `${name}.svg`), plate(opts));
}
console.log(`Wrote ${plates.length} placeholder plates to public/placeholders/`);
