import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack } from '@/modules/content';

import { customAsWorkout, moveItem, parseCustomPlan, validateDraft, type CustomDraft } from './model';

const exercises = (rawPack as ContentPack).exercises;
const exerciseFor = (id: string) => exercises.find((exercise) => exercise.id === id);
const first = exercises[0]!;
const second = exercises[1]!;
const draft: CustomDraft = { title: 'My routine', plan: { version: 1, bodyFocus: 'full_body',
  items: [{ exerciseId: first.id, seconds: 30, rest: 10 }, { exerciseId: second.id, reps: 10, rest: 120 }] } };

it('validates names, required exercises, references and exclusive reps/time targets', () => {
  expect(validateDraft(draft, exerciseFor)).toBeNull();
  expect(validateDraft({ ...draft, title: ' ' }, exerciseFor)).toBe('name');
  expect(validateDraft({ ...draft, plan: { ...draft.plan, items: [] } }, exerciseFor)).toBe('items');
  expect(validateDraft(draft, () => undefined)).toBe('items');
  expect(parseCustomPlan({ ...draft.plan, items: [{ ...draft.plan.items[0], reps: 2 }] })).toBeNull();
  expect(parseCustomPlan({ ...draft.plan, items: [{ ...draft.plan.items[0], rest: 121 }] })).toBeNull();
});

it('reorders repeated exercises without changing targets or the original draft', () => {
  const moved = moveItem(draft.plan.items, 0, 1);
  expect(moved).toEqual([draft.plan.items[1], draft.plan.items[0]]);
  expect(draft.plan.items[0]?.seconds).toBe(30);
  expect(moveItem(draft.plan.items, 0, -1)).toBe(draft.plan.items);
});

it('resolves a playable workout with item rests and excludes final rest from the estimate', () => {
  const workout = customAsWorkout('custom', draft.plan, exerciseFor);
  expect(workout?.estimatedMinutes).toBe(2); // 30 + 10 + (10 reps × 3 seconds), not the final 120-second rest.
  expect(workout?.useItemRest).toBe(true);
  expect(workout?.items).toEqual(draft.plan.items);
  expect(customAsWorkout('custom', draft.plan, () => undefined)).toBeUndefined();
});

it('reads earlier backup arrays with default rests', () => {
  expect(parseCustomPlan([{ exerciseId: first.id, reps: 5 }])?.items[0]?.rest).toBe(20);
});
