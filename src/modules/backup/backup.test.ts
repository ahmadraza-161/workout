import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

import { KV_DEFAULTS } from '@/modules/core/kv';

import { MAX_BACKUP_BYTES, parseBackup, TABLES, validateBackup, type Backup, type Cell } from './format';
import { replaceBackupData, type BackupDatabase } from './transaction';

jest.mock('@/modules/reminders', () => ({
  isReminderSchedule: jest.requireActual('../reminders/schedule').isReminderSchedule,
}));
jest.mock('@/modules/builder', () => ({ parseCustomPlan: jest.requireActual('../builder/model').parseCustomPlan }));

function emptyBackup(): Backup {
  return { app: 'offline-workout', schemaVersion: 2, contentVersion: '1', exportedAt: 1,
    data: { tables: Object.fromEntries(Object.keys(TABLES).map((name) => [name, []])), preferences: { ...KV_DEFAULTS } } };
}

function populatedBackup(): Backup {
  const backup = emptyBackup();
  backup.data.preferences['onboarding.completed'] = true;
  backup.data.preferences['settings.theme'] = 'dark';
  backup.data.preferences['reminders.schedule'] = { enabled: true, days: [2, 6], hour: 18, minute: 30 };
  backup.data.tables = {
    profile: [{ id: 1, gender: 'unspecified', goal: 'keep_fit', level: 1, height_cm: 170,
      weight_kg: 70, birth_year: 1990, days_per_week_target: 4, created_at: 1 }],
    sessions: [{ id: 'session', workout_id: 'workout', challenge_id: null, day: null, started_at: 1,
      ended_at: 30001, duration_sec: 30, completion_pct: 100, kcal: 2.5, feedback: 'just_right',
      local_date: '2026-09-30', created_at: 30001 }],
    session_items: [{ id: 'item', session_id: 'session', exercise_id: 'ex', order_index: 0,
      target_seconds: 30, target_reps: null, done_seconds: 30, done_reps: null, skipped: 0, rating: null }],
    challenge_state: [{ challenge_id: 'challenge', current_day: 2, started_at: 1, last_completed_at: 30001, status: 'active' }],
    weight_log: [{ id: 'weight', recorded_at: 1, local_date: '2026-09-30', weight_kg: 70 }],
    streaks: [{ id: 1, current: 1, longest: 2, last_workout_date: '2026-09-30' }],
    personal_bests: [{ id: 'best', exercise_id: 'ex', metric: 'hold_seconds', value: 30, achieved_at: 30001 }],
    achievements: [{ id: 'badge', unlocked_at: 30001 }],
    custom_workouts: [{ id: 'custom', title: 'My workout', items_json: JSON.stringify([{ exerciseId: 'ex', seconds: 30 }]),
      created_at: 1, updated_at: 30001 }],
    favorites: [{ workout_id: "quote' workout", added_at: 4 }],
    exercise_prefs: [{ exercise_id: 'ex', rating: 1 }],
  };
  return backup;
}

it('round trips a versioned backup including preferences', () => {
  const backup = emptyBackup();
  expect(parseBackup(JSON.stringify(backup))).toEqual(backup);
});

it('imports version-one backups and preserves version-two custom focus and rests', () => {
  expect(validateBackup({ ...emptyBackup(), schemaVersion: 1 }).schemaVersion).toBe(2);
  const backup = populatedBackup();
  backup.data.tables.custom_workouts![0]!.items_json = JSON.stringify({ version: 1, bodyFocus: 'abs',
    items: [{ exerciseId: 'ex', seconds: 30, rest: 15 }] });
  expect(parseBackup(JSON.stringify(backup))).toEqual(backup);
});

it('rejects oversized input, wrong versions, unknown fields and corrupt preferences', () => {
  expect(() => parseBackup(' '.repeat(MAX_BACKUP_BYTES + 1))).toThrow();
  const version = { ...emptyBackup(), schemaVersion: 3 };
  expect(() => validateBackup(version)).toThrow();
  const backup = emptyBackup();
  backup.data.preferences['settings.theme'] = 'invalid';
  expect(() => validateBackup(backup)).toThrow();
  backup.data.preferences = { ...KV_DEFAULTS };
  backup.data.tables.favorites = [{ workout_id: 'test', added_at: 1, unexpected: 'injected' }];
  expect(() => validateBackup(backup)).toThrow();
});

it('rejects orphan children and impossible calendar dates before writes', () => {
  const backup = emptyBackup();
  backup.data.tables.session_items = [{ id: 'item', session_id: 'missing', exercise_id: 'ex', order_index: 0,
    target_seconds: 30, target_reps: null, done_seconds: 30, done_reps: null, skipped: 0, rating: null }];
  expect(() => validateBackup(backup)).toThrow('Orphan');
  backup.data.tables.session_items = [];
  backup.data.tables.weight_log = [{ id: 'w', recorded_at: 1, local_date: '2026-02-30', weight_kg: 70 }];
  expect(() => validateBackup(backup)).toThrow();
});

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('drizzle/0000_fast_excalibur.sql', 'utf8'));
  sql.exec("PRAGMA foreign_keys=ON; ATTACH DATABASE ':memory:' AS backup_kv; CREATE TABLE backup_kv.storage (key TEXT PRIMARY KEY, value TEXT)");
  const adapter: BackupDatabase = {
    execSync: (statement) => sql.exec(statement),
    runSync: (statement, params) => sql.prepare(statement).run(...params),
    withTransactionSync: (task) => {
      sql.exec('BEGIN');
      try { task(); sql.exec('COMMIT'); }
      catch (error) { sql.exec('ROLLBACK'); throw error; }
    },
  };
  return { sql, adapter };
}

it('imports and resets every table and preference in actual SQLite', () => {
  const { sql, adapter } = database();
  try {
    const backup = parseBackup(JSON.stringify(populatedBackup()));
    replaceBackupData(adapter, backup);
    for (const table of Object.keys(TABLES)) {
      expect(sql.prepare(`SELECT * FROM "${table}"`).all()).toEqual(backup.data.tables[table]);
    }
    expect(sql.prepare('SELECT workout_id FROM favorites').get()?.workout_id).toBe("quote' workout");
    expect(sql.prepare("SELECT value FROM backup_kv.storage WHERE key='settings.theme'").get()?.value).toBe('"dark"');
    replaceBackupData(adapter, null);
    for (const table of Object.keys(TABLES)) expect(sql.prepare(`SELECT count(*) AS n FROM "${table}"`).get()?.n).toBe(0);
    expect(sql.prepare('SELECT count(*) AS n FROM backup_kv.storage').get()?.n).toBe(0);
    replaceBackupData(adapter, backup);
    for (const table of Object.keys(TABLES)) expect(sql.prepare(`SELECT * FROM "${table}"`).all()).toEqual(backup.data.tables[table]);
  } finally { sql.close(); }
});

it('rejects duplicate identifiers, malformed custom exercises and reversed session time', () => {
  const duplicate = populatedBackup();
  duplicate.data.tables.favorites!.push({ ...duplicate.data.tables.favorites![0]! });
  expect(() => validateBackup(duplicate)).toThrow('Invalid row');
  const custom = populatedBackup();
  custom.data.tables.custom_workouts![0]!.items_json = JSON.stringify([{ exerciseId: 'ex', seconds: -1 }]);
  expect(() => validateBackup(custom)).toThrow();
  const time = populatedBackup();
  time.data.tables.sessions![0]!.ended_at = 0;
  expect(() => validateBackup(time)).toThrow('Invalid session time');
});

it('rejects unknown metadata and unsafe resumed player state', () => {
  expect(() => validateBackup({ ...emptyBackup(), arbitrary: true })).toThrow();
  const backup = emptyBackup();
  backup.data.preferences['player.snapshot'] = { phase: 'exercise' };
  expect(() => validateBackup(backup)).toThrow('Invalid preferences');
});

it('rolls back records and preferences if an insert fails after deletion', () => {
  const { sql, adapter } = database();
  try {
    const original = emptyBackup();
    original.data.tables.favorites = [{ workout_id: 'original', added_at: 1 }];
    replaceBackupData(adapter, original);
    const fail: BackupDatabase = { ...adapter, runSync: (statement: string, params: Cell[]) => {
      if (statement.startsWith('INSERT INTO backup_kv')) throw new Error('disk failure');
      return adapter.runSync(statement, params);
    } };
    expect(() => replaceBackupData(fail, emptyBackup())).toThrow('disk failure');
    expect(sql.prepare('SELECT workout_id FROM favorites').get()?.workout_id).toBe('original');
    expect(sql.prepare('SELECT count(*) AS n FROM backup_kv.storage').get()?.n).toBe(Object.keys(KV_DEFAULTS).length);
  } finally { sql.close(); }
});
