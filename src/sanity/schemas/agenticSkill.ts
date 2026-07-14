import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'agenticSkill',
  title: 'Agentic Skill',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'oneLiner', title: 'One-liner', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'whatItAutomates',
      title: 'What it automates',
      type: 'text',
      rows: 4,
      description: 'Concrete description — vague claims fail the technical-reviewer journey (spec §1.2).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'demoVideoUrl', title: 'Demo video URL', type: 'url' }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
        }),
      ],
    }),
    defineField({ name: 'repoOrLink', title: 'Repo or live link', type: 'url' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['in use', 'prototype'], layout: 'radio' },
      initialValue: 'prototype',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'oneLiner' } },
});
