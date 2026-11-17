import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack, Workout } from '@/modules/content';
import { resolveQuietWorkout, restoreWorkoutPlan } from './plan';

const pack = rawPack as ContentPack;
const exerciseById = new Map(pack.exercises.map((exercise) => [exercise.id, exercise]));
const original: Workout = {
  ...pack.workouts[0]!,
  items: [{ exerciseId: 'ex_jumping_jack', seconds: 40, rest: 20 }],
};

it('uses the authored quiet swap without changing duration or the source workout', () => {
  const resolved = resolveQuietWorkout(original, true, (id) => exerciseById.get(id));
  expect(resolved.items[0]).toEqual({ exerciseId: 'ex_step_jack', seconds: 40, rest: 20 });
  expect(original.items[0]?.exerciseId).toBe('ex_jumping_jack');
  expect(restoreWorkoutPlan(original, ['ex_step_jack']).items[0]?.exerciseId).toBe('ex_step_jack');
  expect(resolveQuietWorkout(original, false, (id) => exerciseById.get(id))).toBe(original);
});
