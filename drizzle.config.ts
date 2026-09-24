import { defineConfig } from 'drizzle-kit';

// SQL migrations are generated into ./drizzle, then bundled into a TypeScript
// module by tools/db/bundle-migrations.ts (no extra Babel plugin needed).
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/modules/core/db/schema.ts',
  out: './drizzle',
});
