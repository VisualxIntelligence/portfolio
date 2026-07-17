import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type {
  AgenticSkill,
  Category,
  Certification,
  Img,
  Project,
  SiteSettings,
} from './types';
import {
  seedCategories,
  seedCertifications,
  seedProjects,
  seedSettings,
  seedSkills,
} from './seed';

/** Data access layer. With PUBLIC_SANITY_PROJECT_ID set, content comes from the
 *  Sanity Content API (GROQ); otherwise from the local seed (src/lib/seed.ts). */

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) ?? 'production';

export const cmsEnabled = Boolean(projectId);

let client: SanityClient | null = null;
let builder: ReturnType<typeof imageUrlBuilder> | null = null;

if (cmsEnabled) {
  client = createClient({ projectId: projectId!, dataset, apiVersion: '2026-07-01', useCdn: true });
  builder = imageUrlBuilder(client);
}

function img(source: any, width = 1600): Img | undefined {
  if (!source?.asset) return undefined;
  return {
    src: builder!.image(source).width(width).auto('format').url(),
    alt: source.alt ?? '',
    width,
  };
}

function mapProject(p: any): Project {
  return {
    ...p,
    slug: p.slug.current ?? p.slug,
    category: p.category && { ...p.category, slug: p.category.slug.current ?? p.category.slug },
    heroImage: img(p.heroImage),
    gallery: p.gallery?.map((g: any) => img(g)).filter(Boolean),
    processSteps: p.processSteps?.map((s: any) => ({ ...s, image: img(s.image, 1200) })),
    beforeAfter:
      p.beforeAfter?.before && p.beforeAfter?.after
        ? { before: img(p.beforeAfter.before, 1200)!, after: img(p.beforeAfter.after, 1200)! }
        : undefined,
  };
}

const PROJECT_FIELDS = `
  title, titleAr, slug, tags, year, client, label, heroVideoUrl, videoUrls,
  summary, body, tools, featured, publishedAt, promptExcerpts,
  heroImage { ..., "alt": alt }, gallery[] { ..., "alt": alt },
  documents[] { title, kind, "url": file.asset->url, "ext": file.asset->extension, "size": file.asset->size },
  processSteps[] { step, description, image { ..., "alt": alt } },
  beforeAfter { before { ..., "alt": alt }, after { ..., "alt": alt } },
  category-> { title, titleAr, slug, order, description }
`;

/** While the dataset is being populated, any content type with zero documents
 *  falls back to the seed so the site never ships empty sections. */
function fallback<T>(rows: T[], seed: T[], type: string): T[] {
  if (rows.length > 0) return rows;
  console.warn(`[data] Sanity has no "${type}" documents yet — using seed content.`);
  return seed;
}

export async function getCategories(): Promise<Category[]> {
  const sorted = [...seedCategories].sort((a, b) => a.order - b.order);
  if (!client) return sorted;
  const rows = await client.fetch(
    `*[_type == "category"] | order(order asc) { title, titleAr, "slug": slug.current, order, description }`,
  );
  return fallback(rows, sorted, 'category');
}

export async function getProjects(): Promise<Project[]> {
  const sorted = [...seedProjects].sort(
    (a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''),
  );
  if (!client) return sorted;
  const rows = await client.fetch(
    `*[_type == "project"] | order(publishedAt desc) { ${PROJECT_FIELDS} }`,
  );
  return fallback(rows.map(mapProject), sorted, 'project');
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.featured).slice(0, 4);
}

/** AI Lab = projects in the "ai-lab" category, plus anything with process documentation. */
export async function getAiLabProjects(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter(
    (p) => p.category?.slug === 'ai-lab' || (p.processSteps && p.processSteps.length > 0),
  );
}

export async function getSkills(): Promise<AgenticSkill[]> {
  if (!client) return seedSkills;
  const rows = await client.fetch(
    `*[_type == "agenticSkill"] | order(name asc) {
      name, "slug": slug.current, oneLiner, whatItAutomates, stack,
      demoVideoUrl, repoOrLink, status, screenshots[] { ..., "alt": alt }
    }`,
  );
  const mapped = rows.map((s: any) => ({
    ...s,
    screenshots: s.screenshots?.map((sc: any) => img(sc, 1200)).filter(Boolean),
  }));
  return fallback(mapped, seedSkills, 'agenticSkill');
}

export async function getCertifications(): Promise<Certification[]> {
  const sorted = [...seedCertifications].sort((a, b) => a.order - b.order);
  if (!client) return sorted;
  const rows = await client.fetch(
    `*[_type == "certification"] | order(order asc) {
      name, issuer, year, verifyUrl, order, badge { ..., "alt": alt }
    }`,
  );
  return fallback(
    rows.map((c: any) => ({ ...c, badge: img(c.badge, 800) })),
    sorted,
    'certification',
  );
}

export async function getSettings(): Promise<SiteSettings> {
  if (!client) return seedSettings;
  const row = await client.fetch(
    `*[_type == "siteSettings"][0] {
      heroHeadline, heroHeadlineAr, montageVideoUrl, email, footerLine,
      socials[] { label, url },
      "cvUrl": cv.asset->url
    }`,
  );
  if (!row) {
    console.warn('[data] Sanity has no siteSettings document yet — using seed content.');
    return seedSettings;
  }
  // Sanity serves file assets cross-origin, where the <a download> attribute is
  // ignored; the ?dl= param sets Content-Disposition so the CV still downloads.
  if (row.cvUrl) row.cvUrl = `${row.cvUrl}?dl=Ahmed-Albadri-CV.pdf`;
  // Drop null fields so seed defaults survive partially-filled settings.
  const clean = Object.fromEntries(Object.entries(row).filter(([, v]) => v != null));
  return { ...seedSettings, ...clean };
}
