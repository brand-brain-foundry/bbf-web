import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
  },
  editor: lexicalEditor(),
  collections: [
    // Phase H1-1: schemas Users, Authors, Posts, Cases, Pages, Categories, Tags, Media, Videos, Subscribers, Submissions, Audits, Redirects
    // Episodes collection NOT created (D-BBF-WEB-22 deferred)
    // Currently empty — Phase F-3 bootstrap only
  ],
  secret: process.env.PAYLOAD_SECRET || 'placeholder-secret-replace-in-f5',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
});
