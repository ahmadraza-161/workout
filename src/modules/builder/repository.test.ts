import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { Storage } from 'expo-sqlite/kv-store';

import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack } from '@/modules/content';
import { getKv, setKv } from '@/modules/core/kv';

import type { CustomDraft } from './model';
import { deleteCustomWorkout, getCustomPlayerWorkout, getCustomWorkout, listCustomWorkouts, saveCustomWorkout } from './repository';

let mockDatabase: DatabaseSync;
jest.mock('@/modules/core/db', () => ({ sqlite: {
  getFirstSync: (sql: string, params: (string | number | null)[]) => mockDatabase.prepare(sql).get(...params),
  getAllSync: (sql: string) => mockDatabase.prepare(sql).all(),
  runSync: (sql: string, params: (string | number | null)[]) => mockDatabase.prepare(sql).run(...params),
  withTransactionSync: (task: () => void) => {
    mockDatabase.exec('BEGIN');
    try { task(); mockDatabase.exec('COMMIT'); } catch (error) { mockDatabase.exec('ROLLBACK'); throw error; }
  },
} }));
const exercises = (rawPack as ContentPack).exercises;
const exerciseFor = (id: string) => exercises.find((exercise) => exercise.id === id);
const draft: CustomDraft = { title: "  Owner's workout  ", plan: { version: 1, bodyFocus: 'abs',
  items: [{ exerciseId: exercises[0]!.id, seconds: 30, rest: 5 }] } };

beforeEach(() => {
  Storage.clearSync(); mockDatabase = new DatabaseSync(':memory:');
  mockDatabase.exec(readFileSync('drizzle/0000_fast_excalibur.sql', 'utf8'));
});
afterEach(() => mockDatabase.close());

it('persists, reloads and edits a workout while preserving its identity and creation time', () => {
  const id = saveCustomWorkout(draft, exerciseFor, undefined, 1);
  expect(id).toMatch(/^custom_/);
  expect(getCustomWorkout(id)?.title).toBe("Owner's workout");
  expect(getCustomPlayerWorkout(id, exerciseFor)?.useItemRest).toBe(true);
  setKv('player.snapshot', { state: { workoutId: id } });
  saveCustomWorkout({ ...draft, title: 'Edited' }, exerciseFor, id, 2);
  expect(listCustomWorkouts()).toHaveLength(1);
  expect(getCustomWorkout(id)?.title).toBe('Edited');
  expect(mockDatabase.prepare('SELECT created_at FROM custom_workouts').get()?.created_at).toBe(1);
  expect(getKv('player.snapshot')).toBeNull();
});

it('rejects an invalid draft before writing and preserves other resumable workouts', () => {
  setKv('player.snapshot', { state: { workoutId: 'another' } });
  expect(() => saveCustomWorkout(draft, () => undefined)).toThrow();
  expect(listCustomWorkouts()).toEqual([]);
  const id = saveCustomWorkout(draft, exerciseFor);
  deleteCustomWorkout(id);
  expect(getKv('player.snapshot')).toEqual({ state: { workoutId: 'another' } });
});

it('deletes the template and favourite while keeping completed history', () => {
  const id = saveCustomWorkout(draft, exerciseFor);
  mockDatabase.prepare('INSERT INTO favorites (workout_id, added_at) VALUES (?, 1)').run(id);
  mockDatabase.prepare("INSERT INTO sessions (id, workout_id, started_at, local_date, created_at) VALUES ('history', ?, 1, '2026-09-30', 1)").run(id);
  deleteCustomWorkout(id);
  expect(getCustomWorkout(id)).toBeUndefined();
  expect(mockDatabase.prepare('SELECT count(*) AS n FROM favorites').get()?.n).toBe(0);
  expect(mockDatabase.prepare('SELECT workout_id FROM sessions').get()?.workout_id).toBe(id);
});
