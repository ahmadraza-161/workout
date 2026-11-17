import type { BodyFocus, Exercise, Workout, WorkoutItem } from '@/modules/content';

export const MAX_CUSTOM_ITEMS = 200;
export const FOCUS_OPTIONS: BodyFocus[] = ['full_body', 'abs', 'arm', 'chest', 'shoulder', 'back', 'leg', 'butt'];
export interface CustomPlan { version: 1; bodyFocus: BodyFocus; items: WorkoutItem[] }
export interface CustomDraft { title: string; plan: CustomPlan }
export const emptyDraft = (): CustomDraft => ({ title: '', plan: { version: 1, bodyFocus: 'full_body', items: [] } });

/** Read modern plans and earlier backup arrays without changing their exercise order. */
export function parseCustomPlan(value: unknown): CustomPlan | null {
  const legacy = Array.isArray(value);
  if (!legacy && (!value || typeof value !== 'object')) return null;
  const record = value as Partial<CustomPlan>;
  if (!legacy && (record.version !== 1 || !FOCUS_OPTIONS.includes(record.bodyFocus!) ||
      Object.keys(value!).some((key) => !['version', 'bodyFocus', 'items'].includes(key)))) return null;
  const items: unknown = legacy ? value : record.items;
  if (!Array.isArray(items) || !items.length || items.length > MAX_CUSTOM_ITEMS) return null;
  const parsed: WorkoutItem[] = [];
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return null;
    const item = raw as Partial<WorkoutItem>;
    if (typeof item.exerciseId !== 'string' || !item.exerciseId.trim() || item.exerciseId.length > 200 ||
        Object.keys(item).some((key) => !['exerciseId', 'seconds', 'reps', 'rest', 'side'].includes(key))) return null;
    const seconds = item.seconds;
    const reps = item.reps;
    const validSeconds = Number.isInteger(seconds) && seconds! > 0 && seconds! <= 86400;
    const validReps = Number.isInteger(reps) && reps! > 0 && reps! <= 10000;
    if (!((validSeconds && reps === undefined) || (validReps && seconds === undefined))) return null;
    const rest = legacy && item.rest === undefined ? 20 : item.rest;
    if (!Number.isInteger(rest) || rest! < 0 || rest! > 120 ||
        (item.side !== undefined && item.side !== 'left' && item.side !== 'right')) return null;
    parsed.push({ exerciseId: item.exerciseId, ...(validSeconds ? { seconds } : { reps }), rest: rest!,
      ...(item.side ? { side: item.side } : {}) });
  }
  return { version: 1, bodyFocus: legacy ? 'full_body' : record.bodyFocus!, items: parsed };
}

export function validateDraft(draft: CustomDraft, exerciseFor: (id: string) => Exercise | undefined): 'name' | 'items' | null {
  if (!draft.title.trim() || draft.title.trim().length > 120) return 'name';
  const plan = parseCustomPlan(draft.plan);
  if (!plan || plan.items.some((item) => !exerciseFor(item.exerciseId))) return 'items';
  return null;
}

export function moveItem(items: WorkoutItem[], index: number, direction: -1 | 1): WorkoutItem[] {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
}

export function customAsWorkout(id: string, plan: CustomPlan, exerciseFor: (id: string) => Exercise | undefined): Workout | undefined {
  const exercises = plan.items.map((item) => exerciseFor(item.exerciseId));
  if (exercises.some((exercise) => !exercise)) return undefined;
  const seconds = plan.items.reduce((sum, item, index) => sum + (item.seconds ?? (item.reps ?? 0) * 3) +
    (index < plan.items.length - 1 ? item.rest : 0), 0);
  return { id, titleKey: 'builder.customTitle', introKey: 'builder.intro', bodyFocus: plan.bodyFocus,
    goal: 'keep_fit', type: 'strength', level: 1, estimatedMinutes: Math.max(1, Math.ceil(seconds / 60)),
    quietSafe: exercises.every((exercise) => exercise!.quietSafe), gradient: 'blue', items: plan.items, useItemRest: true };
}
