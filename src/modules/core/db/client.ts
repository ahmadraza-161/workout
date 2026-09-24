import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

const DATABASE_NAME = 'home-workout.db';

const sqlite = openDatabaseSync(DATABASE_NAME);
// WAL keeps writes fast during workouts; foreign keys make session_items
// follow their session on delete (SQLite leaves them off by default).
sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });
export type Database = typeof db;
