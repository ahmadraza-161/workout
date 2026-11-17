import { TABLES, validateBackup, type Backup, type Cell } from './format';

export interface BackupDatabase {
  execSync: (sql: string) => void;
  runSync: (sql: string, params: Cell[]) => unknown;
  withTransactionSync: (task: () => void) => void;
}

/** Replace records and attached preferences together; exceptions roll back both databases. */
export function replaceBackupData(database: BackupDatabase, backup: Backup | null): void {
  if (backup) validateBackup(backup);
  database.withTransactionSync(() => {
    // Delete child records before parents, preserving the migration history and schema.
    database.execSync('DELETE FROM session_items');
    for (const table of Object.keys(TABLES).filter((name) => name !== 'session_items')) {
      database.execSync(`DELETE FROM "${table}"`);
    }
    database.execSync('DELETE FROM backup_kv.storage');
    if (!backup) return;
    for (const [table, fields] of Object.entries(TABLES)) {
      const columns = Object.keys(fields);
      const sql = `INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
      for (const row of backup.data.tables[table]!) database.runSync(sql, columns.map((column) => row[column]!));
    }
    for (const [key, value] of Object.entries(backup.data.preferences)) {
      database.runSync('INSERT INTO backup_kv.storage (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
    }
  });
}
