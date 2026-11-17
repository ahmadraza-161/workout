import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack, Workout } from '@/modules/content';
import { finishExercise, startWorkout } from './engine';
import { summarizeSession } from './summary';

const base = (rawPack as ContentPack).workouts[0]!;
const workout: Workout = { ...base, items: [{ exerciseId: 'ex_test', seconds: 600, rest: 0 }] };

describe('session summary', () => {
  it('calculates 98 kcal for MET 8, 70 kg and 10 minutes', () => {
    const state = finishExercise(startWorkout(workout, 1000, 0), workout, 601000);
    const result = summarizeSession(state, workout, 601000, null, () => 8);
    expect(result.kcal).toBe(98);
    expect(result.durationSec).toBe(600);
    expect(result.completionPct).toBe(100);
  });

  it('excludes paused time from duration', () => {
    const state = { ...startWorkout(workout, 1000, 0), pausedAt: 3000, done: [] };
    const result = summarizeSession(state, workout, 13000, 70, () => 8);
    expect(result.durationSec).toBe(2);
    expect(result.completionPct).toBe(0);
  });
});
