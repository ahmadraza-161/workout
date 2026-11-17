import type { Exercise, Workout } from '@/modules/content';
import { sqlite } from '@/modules/core/db';
import { createLocalId } from '@/modules/core/ids';
import { getKv, removeKv } from '@/modules/core/kv';

import { customAsWorkout, parseCustomPlan, validateDraft, type CustomDraft } from './model';

interface CustomRow { id: string; title: string; items_json: string; created_at: number; updated_at: number }
export interface SavedCustom extends CustomDraft { id: string }

function decode(row: CustomRow): SavedCustom | undefined {
  try {
    const plan = parseCustomPlan(JSON.parse(row.items_json));
    return plan ? { id: row.id, title: row.title, plan } : undefined;
  } catch { return undefined; }
}

export function getCustomWorkout(id: string): SavedCustom | undefined {
  const row = sqlite.getFirstSync<CustomRow>('SELECT * FROM custom_workouts WHERE id = ?', [id]);
  return row ? decode(row) : undefined;
}

export function listCustomWorkouts(): SavedCustom[] {
  return sqlite.getAllSync<CustomRow>('SELECT * FROM custom_workouts ORDER BY updated_at DESC, id')
    .flatMap((row) => { const item = decode(row); return item ? [item] : []; });
}

/** Resolve saved workouts for the existing timestamp player without copying catalog data. */
export function getCustomPlayerWorkout(id: string, exerciseFor: (id: string) => Exercise | undefined): Workout | undefined {
  const saved = getCustomWorkout(id);
  return saved ? customAsWorkout(id, saved.plan, exerciseFor) : undefined;
}

function invalidateResume(id: string) {
  const snapshot = getKv('player.snapshot') as { state?: { workoutId?: string } } | null;
  if (snapshot?.state?.workoutId === id) removeKv('player.snapshot');
}

/** Save validates exercise references; edits preserve identity and historical sessions. */
export function saveCustomWorkout(draft: CustomDraft, exerciseFor: (id: string) => Exercise | undefined, id?: string, now = Date.now()): string {
  const error = validateDraft(draft, exerciseFor);
  if (error) throw new Error(`Invalid custom workout: ${error}`);
  if (id && !getCustomWorkout(id)) throw new Error('Custom workout missing');
  const workoutId = id ?? `custom_${createLocalId()}`;
  const plan = JSON.stringify(parseCustomPlan(draft.plan));
  if (id) {
    sqlite.runSync('UPDATE custom_workouts SET title = ?, items_json = ?, updated_at = ? WHERE id = ?',
      [draft.title.trim(), plan, now, id]);
    invalidateResume(id);
  } else {
    sqlite.runSync('INSERT INTO custom_workouts (id, title, items_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [workoutId, draft.title.trim(), plan, now, now]);
  }
  return workoutId;
}

/** Remove the saved template and its favourite while retaining completed workout history. */
export function deleteCustomWorkout(id: string): void {
  sqlite.withTransactionSync(() => {
    sqlite.runSync('DELETE FROM favorites WHERE workout_id = ?', [id]);
    sqlite.runSync('DELETE FROM custom_workouts WHERE id = ?', [id]);
  });
  invalidateResume(id);
}
