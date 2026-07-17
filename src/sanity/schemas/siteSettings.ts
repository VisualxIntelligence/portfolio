import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeadline', title: 'Hero headline', type: 'string' }),
    defineField({ name: 'heroHeadlineAr', title: 'Hero headline (Arabic)', type: 'string' }),
    defineField({ name: 'montageVideoUrl', title: 'Montage video URL', type: 'url' }),
    defineField({ name: 'email', title: 'Contact email', type: 'string' }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'footerLine',
      title: 'Footer line',
      type: 'string',
      initialValue: 'Based in Riyadh · Working across the Middle East',
    }),
    defineField({
      name: 'cv',
      title: 'CV / Résumé (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
      description:
        'Upload the downloadable CV shown on the About and Contact pages. Until one is uploaded, the site falls back to the PDF committed at public/cv/.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});
