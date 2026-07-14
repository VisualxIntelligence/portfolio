// Renders the default OG image (1200x630 PNG) from an inline SVG using sharp.
// Run: node scripts/gen-og.mjs
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F4EF"/>
  <line x1="60" y1="90" x2="1140" y2="90" stroke="#DDD5C9" stroke-width="2"/>
  <line x1="60" y1="540" x2="1140" y2="540" stroke="#DDD5C9" stroke-width="2"/>
  <circle cx="980" cy="300" r="120" fill="none" stroke="#A9744A" stroke-width="4"/>
  <ellipse cx="980" cy="300" rx="170" ry="48" fill="none" stroke="#C89B72" stroke-width="2.5" transform="rotate(-18 980 300)"/>
  <circle cx="1128" cy="252" r="7" fill="#A9744A"/>
  <text x="60" y="285" font-family="Arial, sans-serif" font-size="64" font-weight="bold" letter-spacing="4" fill="#1A1815">AHMED ALBADRI</text>
  <text x="62" y="345" font-family="Arial, sans-serif" font-size="30" fill="#A9744A">AI-First Graphic Designer &amp; Multimedia Specialist</text>
  <text x="1140" y="62" text-anchor="end" font-family="Arial, sans-serif" font-size="30" fill="#7E5334">أحمد البدري</text>
  <text x="60" y="580" font-family="Arial, sans-serif" font-size="18" fill="#4A4540">Riyadh · Doha · Working across the Middle East</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, 'public', 'og-default.png'));
console.log('Wrote public/og-default.png');
