import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from './client';
import migrations from './migrations.generated';

export { db, sqlite, type Database } from './client';
export * as schema from './schema';

/** Applies pending migrations once at start-up (ARCHITECTURE §7.1). */
export function useDatabaseMigrations(): { success: boolean; error?: Error } {
  return useMigrations(db, migrations);
}
