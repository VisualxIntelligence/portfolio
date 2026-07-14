import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'ahmed-albadri-portfolio',
  title: 'Ahmed Albadri — Portfolio Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('agenticSkill').title('Agentic Skills'),
            S.documentTypeListItem('certification').title('Certifications'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // siteSettings is a singleton managed via the fixed documentId above
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
});
