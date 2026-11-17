import { defaultDatabaseDirectory } from 'expo-sqlite';

import { getContentPack } from '@/modules/content';
import { sqlite } from '@/modules/core/db';
import { getKv, KV_DEFAULTS, type KvKey } from '@/modules/core/kv';

import { TABLES, validateBackup, type Backup, type Cell } from './format';
import { replaceBackupData } from './transaction';

/** Export portable data only; interrupted player state is deliberately excluded. */
export function collectBackup(): Backup {
  const tables: Backup['data']['tables'] = {};
  sqlite.withTransactionSync(() => {
    for (const table of Object.keys(TABLES)) tables[table] = sqlite.getAllSync<Record<string, Cell>>(`SELECT * FROM "${table}"`);
  });
  const preferences = Object.fromEntries(Object.keys(KV_DEFAULTS).map((key) =>
    [key, key === 'player.snapshot' ? null : getKv(key as KvKey)]));
  return validateBackup({ app: 'offline-workout', schemaVersion: 2, contentVersion: String(getContentPack().contentVersion),
    exportedAt: Date.now(), data: { tables, preferences } });
}

/** Attach the existing Expo KV database so import/reset has one SQL rollback boundary. */
export function replaceUserData(backup: Backup | null): void {
  // Initialize the storage schema before attaching; this name was verified in Expo SDK 57's source.
  getKv('settings.theme');
  const directory = defaultDatabaseDirectory.replace(/^file:\/\//, '').replace(/\/$/, '');
  sqlite.runSync('ATTACH DATABASE ? AS backup_kv', [`${directory}/ExpoSQLiteStorage`]);
  try { replaceBackupData(sqlite, backup); }
  finally { sqlite.execSync('DETACH DATABASE backup_kv'); }
}
