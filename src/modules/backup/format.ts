import { KV_DEFAULTS, type KvKey } from '@/modules/core/kv';
import { isReminderSchedule } from '@/modules/reminders';
import { parseCustomPlan } from '@/modules/builder';

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export type Cell = string | number | null;
type Check = (value: unknown) => boolean;
const number = (min = 0, max = Number.MAX_SAFE_INTEGER): Check =>
  (v) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
const integer = (min = 0, max = Number.MAX_SAFE_INTEGER): Check => (v) => number(min, max)(v) && Number.isInteger(v);
const string = (max = 200): Check => (v) => typeof v === 'string' && v.length > 0 && v.length <= max;
const choices = (...values: unknown[]): Check => (v) => values.includes(v);
const nullable = (check: Check): Check => (v) => v === null || check(v);
const date: Check = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const timestamp = integer(0, 8640000000000000);

// Explicit field allowlist: never derive SQL identifiers from the imported document.
export const TABLES: Record<string, Record<string, Check>> = {
  profile: { id: choices(1), gender: nullable(choices('male', 'female', 'unspecified')),
    goal: nullable(choices('build_muscle', 'burn_fat', 'keep_fit', 'flexibility')), level: nullable(integer(1, 3)),
    height_cm: nullable(number(90, 250)), weight_kg: nullable(number(20, 400)), birth_year: nullable(integer(1900, 2100)),
    days_per_week_target: integer(1, 7), created_at: timestamp },
  sessions: { id: string(), workout_id: string(), challenge_id: nullable(string()), day: nullable(integer(1, 366)),
    started_at: timestamp, ended_at: nullable(timestamp), duration_sec: integer(), completion_pct: integer(0, 100),
    kcal: number(), feedback: nullable(choices('too_easy', 'just_right', 'too_hard')), local_date: date, created_at: timestamp },
  session_items: { id: string(), session_id: string(), exercise_id: string(), order_index: integer(),
    target_seconds: nullable(integer()), target_reps: nullable(integer()), done_seconds: integer(),
    done_reps: nullable(integer()), skipped: choices(0, 1), rating: nullable(choices(-1, 1)) },
  challenge_state: { challenge_id: string(), current_day: integer(1, 366), started_at: timestamp,
    last_completed_at: nullable(timestamp), status: choices('active', 'completed', 'abandoned') },
  weight_log: { id: string(), recorded_at: timestamp, local_date: date, weight_kg: number(20, 400) },
  streaks: { id: choices(1), current: integer(), longest: integer(), last_workout_date: nullable(date) },
  personal_bests: { id: string(), exercise_id: string(), metric: choices('hold_seconds', 'reps_in_set', 'workout_seconds'),
    value: number(), achieved_at: timestamp },
  achievements: { id: string(), unlocked_at: timestamp },
  custom_workouts: { id: string(), title: string(120), items_json: validCustomItems, created_at: timestamp, updated_at: timestamp },
  favorites: { workout_id: string(), added_at: timestamp },
  exercise_prefs: { exercise_id: string(), rating: choices(-1, 1) },
};

function validCustomItems(value: unknown): boolean {
  if (typeof value !== 'string' || value.length > 100000) return false;
  try {
    return parseCustomPlan(JSON.parse(value)) !== null;
  } catch { return false; }
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasFields(value: Record<string, unknown>, fields: string[]): boolean {
  return Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

export interface Backup {
  app: 'offline-workout'; schemaVersion: 2; contentVersion: string; exportedAt: number;
  data: { tables: Record<string, Record<string, Cell>[]>; preferences: Record<string, unknown> };
}

function validPreference(key: KvKey, value: unknown): boolean {
  if (key === 'player.snapshot') return value === null;
  if (key === 'reminders.schedule') return value === null || isReminderSchedule(value);
  if (key === 'settings.units') return choices('metric', 'imperial')(value);
  if (key === 'settings.theme') return choices('system', 'light', 'dark')(value);
  if (key === 'settings.timers.restMode') return choices('default', 'custom')(value);
  if (key === 'settings.timers.restSeconds') return integer(5, 120)(value);
  if (key === 'settings.timers.prepSeconds') return choices(0, 5, 10, 15, 20, 30)(value);
  if (key === 'search.recent') return Array.isArray(value) && value.length <= 100 && value.every(string(200));
  if (key === 'app.lastVersionSeen') return nullable(string())(value);
  if (key === 'feedback.note') return typeof value === 'string' && value.length <= 10000;
  return typeof KV_DEFAULTS[key] === 'boolean' && typeof value === 'boolean';
}

/** Validate both backup generations; version one arrays remain readable by the builder. */
export function validateBackup(value: unknown): Backup {
  if (!record(value) || !hasFields(value, ['app', 'schemaVersion', 'contentVersion', 'exportedAt', 'data']) ||
      value.app !== 'offline-workout' || ![1, 2].includes(Number(value.schemaVersion)) || typeof value.schemaVersion !== 'number' ||
      !string()(value.contentVersion) || !timestamp(value.exportedAt) || !record(value.data) ||
      !hasFields(value.data, ['tables', 'preferences']) ||
      !record(value.data.tables) || !record(value.data.preferences)) throw new Error('Invalid backup');
  const { tables, preferences } = value.data;
  if (Object.keys(tables).length !== Object.keys(TABLES).length) throw new Error('Invalid tables');
  for (const [name, fields] of Object.entries(TABLES)) {
    const rows = tables[name];
    if (!Array.isArray(rows) || rows.length > 50000) throw new Error('Invalid rows');
    const primary = Object.keys(fields)[0]!;
    const ids = new Set<unknown>();
    for (const row of rows) {
      if (!record(row) || Object.keys(row).length !== Object.keys(fields).length ||
          !Object.entries(fields).every(([field, check]) => check(row[field])) || ids.has(row[primary])) {
        throw new Error('Invalid row');
      }
      ids.add(row[primary]);
    }
  }
  if (Object.keys(preferences).length !== Object.keys(KV_DEFAULTS).length ||
      !Object.keys(KV_DEFAULTS).every((key) => validPreference(key as KvKey, preferences[key]))) throw new Error('Invalid preferences');
  const backup = value as unknown as Backup;
  const sessionIds = new Set(backup.data.tables.sessions!.map((row) => row.id));
  if (backup.data.tables.session_items!.some((row) => !sessionIds.has(row.session_id!))) throw new Error('Orphan session item');
  if (preferences['onboarding.completed'] && backup.data.tables.profile!.length !== 1) throw new Error('Missing profile');
  const bestKeys = backup.data.tables.personal_bests!.map((row) => `${row.exercise_id}:${row.metric}`);
  if (new Set(bestKeys).size !== bestKeys.length) throw new Error('Duplicate personal best');
  if (backup.data.tables.sessions!.some((row) => row.ended_at !== null && Number(row.ended_at) < Number(row.started_at))) {
    throw new Error('Invalid session time');
  }
  if (backup.data.tables.streaks!.some((row) => Number(row.current) > Number(row.longest))) throw new Error('Invalid streak');
  return { ...backup, schemaVersion: 2 };
}

export function parseBackup(text: string): Backup {
  if (text.length > MAX_BACKUP_BYTES || new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) throw new Error('Backup too large');
  return validateBackup(JSON.parse(text));
}
