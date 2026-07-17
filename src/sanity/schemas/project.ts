import { defineArrayMember, defineField, defineType } from 'sanity';

/** Reusable image type with mandatory alt text (spec §2.6). */
const accessibleImage = (name: string, title: string, opts: { required?: boolean } = {}) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Required — describes the image for screen readers.',
        validation: (r) => r.required(),
      }),
    ],
    ...(opts.required ? { validation: (r: any) => r.required() } : {}),
  });

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'aiProcess', title: 'AI Process (AI Lab)' },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'titleAr', title: 'Title (Arabic)', type: 'string', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      group: 'content',
    }),
    defineField({ name: 'year', title: 'Year', type: 'number', group: 'content' }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'content',
      description: 'Fictional clients must be marked via the Label field below.',
    }),
    defineField({
      name: 'label',
      title: 'Honesty label',
      type: 'string',
      group: 'content',
      description:
        'Non-negotiable for spec work, e.g. "Self-initiated concept — demonstration of capability".',
    }),
    accessibleImage('heroImage', 'Hero image'),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero video URL (YouTube/Vimeo)',
      type: 'url',
      group: 'media',
      description: 'If present the case study becomes video-led.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'videoUrls',
      title: 'Additional video URLs',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'url' })],
    }),
    defineField({
      name: 'documents',
      title: 'Documents & downloads',
      type: 'array',
      group: 'media',
      description: 'Reports, presentations, PDFs and other files shown as downloads on the case study.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'projectDocument',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              options: { accept: '.pdf,.doc,.docx,.ppt,.pptx,.key,.xls,.xlsx' },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'kind',
              title: 'Kind',
              type: 'string',
              description: 'Optional label, e.g. "Executive summary", "Presentation", "Brand guide".',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'kind' } },
        }),
      ],
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 4, group: 'content' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'tools',
      title: 'Tools',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      group: 'meta',
      description: 'e.g. Higgsfield, GPT Image 2, After Effects',
    }),
    defineField({ name: 'featured', title: 'Featured on Home', type: 'boolean', initialValue: false, group: 'meta' }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', group: 'meta' }),

    // ── AI Lab extension fields (spec §1.3 aiCaseStudy) ────────────────
    defineField({
      name: 'processSteps',
      title: 'Process steps',
      type: 'array',
      group: 'aiProcess',
      description: '01 Prompt Development, 02 Consistency System, 03 QC…',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({ name: 'step', title: 'Step title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
            }),
          ],
          preview: { select: { title: 'step', subtitle: 'description', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'promptExcerpts',
      title: 'Prompt excerpts',
      type: 'array',
      group: 'aiProcess',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
    }),
    defineField({
      name: 'beforeAfter',
      title: 'Before / After',
      type: 'object',
      group: 'aiProcess',
      fields: [
        defineField({
          name: 'before',
          title: 'Before',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
        }),
        defineField({
          name: 'after',
          title: 'After',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'heroImage' },
  },
  orderings: [
    { title: 'Published, newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
});
