import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack, Workout } from '@/modules/content';
import {
  addRestSeconds,
  advancePlayer,
  finishExercise,
  goToPreviousExercise,
  MAX_REST_SECONDS,
  pausePlayer,
  remainingSeconds,
  resumePlayer,
  skipPhase,
  startWorkout,
} from './engine';

const base = (rawPack as ContentPack).workouts[0]!;
const workout: Workout = {
  ...base,
  items: [
    { exerciseId: 'ex_a', seconds: 10, rest: 0 },
    { exerciseId: 'ex_b', reps: 12, rest: 0 },
  ],
};

describe('player engine', () => {
  it('uses custom per-exercise rests and respects the global rest-off setting', () => {
    const custom: Workout = { ...workout, useItemRest: true,
      items: [{ ...workout.items[0]!, rest: 7 }, workout.items[1]!] };
    const state = advancePlayer(startWorkout(custom, 0, 0, 20), custom, 10000);
    expect(state.phase).toBe('rest');
    expect(state.restSeconds).toBe(7);
    expect(advancePlayer(state, custom, 17000).itemIndex).toBe(1);
    expect(advancePlayer(startWorkout(custom, 0, 0, 0), custom, 10000).phase).toBe('exercise');
  });
  it('moves through prep, timed exercise, rest and manual reps', () => {
    let state = startWorkout(workout, 1000, 5, 4);
    state = advancePlayer(state, workout, 6000);
    expect(state.phase).toBe('exercise');
    expect(state.itemIndex).toBe(0);
    state = advancePlayer(state, workout, 16000);
    expect(state.phase).toBe('rest');
    expect(state.done[0]).toEqual({
      index: 0,
      exerciseId: 'ex_a',
      doneSeconds: 10,
      doneReps: null,
      skipped: false,
    });
    state = advancePlayer(state, workout, 20000);
    expect(state.phase).toBe('exercise');
    expect(state.itemIndex).toBe(1);
    expect(advancePlayer(state, workout, 100000)).toEqual(state);
    expect(skipPhase(state, workout, 100000).phase).toBe('complete');
  });

  it('catches up from background time without counting timer ticks', () => {
    const state = advancePlayer(startWorkout(workout, 0, 5, 4), workout, 21000);
    expect(state.phase).toBe('exercise');
    expect(state.itemIndex).toBe(1);
  });

  it('freezes time while paused and shifts the deadline on resume', () => {
    let state = startWorkout(workout, 0, 5);
    state = pausePlayer(state, 2000);
    expect(remainingSeconds(state, workout, 100000)).toBe(3);
    expect(advancePlayer(state, workout, 100000)).toEqual(state);
    state = resumePlayer(state, 12000);
    expect(remainingSeconds(state, workout, 12000)).toBe(3);
    expect(advancePlayer(state, workout, 15000).phase).toBe('exercise');
  });

  it('lets the user skip prep and extend rest', () => {
    let state = skipPhase(startWorkout(workout, 0), workout, 1000);
    expect(state.phase).toBe('exercise');
    state = skipPhase(state, workout, 2000);
    expect(state.phase).toBe('rest');
    state = addRestSeconds(state, 20);
    expect(remainingSeconds(state, workout, 2000)).toBe(40);
    expect(state.done[0]?.skipped).toBe(true);
    state = addRestSeconds(state, 200);
    expect(state.restSeconds).toBe(MAX_REST_SECONDS);
  });

  it('records actual reps and skips rest when the rest setting is off', () => {
    let state = startWorkout(workout, 0, 0, 0);
    state = finishExercise(state, workout, 8000);
    expect(state.phase).toBe('exercise');
    expect(state.itemIndex).toBe(1);
    state = finishExercise(state, workout, 16000, 9);
    expect(state.phase).toBe('complete');
    expect(state.done[1]?.doneReps).toBe(9);
  });

  it('replays the previous exercise without keeping its old result', () => {
    let state = startWorkout(workout, 0, 0, 4);
    expect(goToPreviousExercise(state, 1000)).toEqual(state);
    state = finishExercise(state, workout, 10000);
    expect(goToPreviousExercise(state, 11000)).toEqual(state);
    state = skipPhase(state, workout, 14000);
    expect(state.itemIndex).toBe(1);
    state = goToPreviousExercise(state, 15000);
    expect(state.itemIndex).toBe(0);
    expect(state.phaseStartedAt).toBe(15000);
    expect(state.done).toEqual([]);
    state = finishExercise(state, workout, 25000);
    expect(state.done).toHaveLength(1);
    expect(state.done[0]?.index).toBe(0);
  });
});
