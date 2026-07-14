import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'issuer', title: 'Issuer', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
    }),
    defineField({ name: 'verifyUrl', title: 'Verification URL', type: 'url' }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'issuer', media: 'badge' } },
});
