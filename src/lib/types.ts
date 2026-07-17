/** Normalized content types consumed by pages — served either from Sanity or from local seed data. */

export interface Img {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Category {
  title: string;
  titleAr?: string;
  slug: string;
  order: number;
  description?: string;
}

export interface ProcessStep {
  step: string;
  description?: string;
  image?: Img;
}

/** Portable Text block (subset we render). */
export interface PTSpan {
  _type: 'span';
  text: string;
  marks?: string[];
}
export interface PTBlock {
  _type: 'block';
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children: PTSpan[];
  markDefs?: { _key: string; _type: string; href?: string }[];
}

export interface Project {
  title: string;
  titleAr?: string;
  slug: string;
  category: Category;
  tags?: string[];
  year?: number;
  client?: string;
  label?: string;
  heroImage?: Img;
  heroVideoUrl?: string;
  gallery?: Img[];
  videoUrls?: string[];
  summary?: string;
  body?: PTBlock[];
  tools?: string[];
  featured?: boolean;
  publishedAt?: string;
  // AI Lab extension
  processSteps?: ProcessStep[];
  promptExcerpts?: string[];
  beforeAfter?: { before: Img; after: Img };
}

export interface AgenticSkill {
  name: string;
  slug: string;
  oneLiner: string;
  whatItAutomates: string;
  stack?: string[];
  demoVideoUrl?: string;
  screenshots?: Img[];
  repoOrLink?: string;
  status: 'in use' | 'prototype';
}

export interface Certification {
  name: string;
  issuer: string;
  year?: number;
  badge?: Img;
  verifyUrl?: string;
  order: number;
}

export interface Social {
  label: string;
  url: string;
}

export interface SiteSettings {
  heroHeadline: string;
  heroHeadlineAr?: string;
  montageVideoUrl?: string;
  email: string;
  socials: Social[];
  footerLine: string;
  /** Resolved URL of the downloadable CV (Sanity file, or the static repo fallback). */
  cvUrl: string;
}
