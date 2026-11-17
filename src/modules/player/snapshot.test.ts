import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack } from '@/modules/content';
import { ratePlayerExercise, startWorkout } from './engine';
import { createSessionId, parseSnapshot } from './snapshot';

const workout = (rawPack as ContentPack).workouts[0]!;
const id = createSessionId();
const state = startWorkout(workout, 1000);
const snapshot = { version: 1, sessionId: id, savedAt: 2000, state };

describe('player snapshot', () => {
  it('preserves an exercise rating across snapshot restore and allows changing it', () => {
    const rated = ratePlayerExercise(startWorkout(workout, 1000, 0), -1);
    const restored = parseSnapshot({ ...snapshot, state: rated }, 3000, () => workout)!;
    expect(restored.state.ratingsByIndex).toEqual({ 0: -1 });
    expect(ratePlayerExercise(restored.state, 1).ratingsByIndex).toEqual({ 0: 1 });
    expect(ratePlayerExercise(state, 1)).toBe(state);
  });

  it.each([{ 0: 0 }, { '-1': 1 }, { 999: 1 }, { '0.5': -1 }, []])(
    'rejects malformed or out-of-range exercise ratings: %j', (ratingsByIndex) => {
      expect(parseSnapshot({ ...snapshot, state: { ...state, ratingsByIndex } }, 3000, () => workout)).toBeNull();
    },
  );
  it('restores a valid snapshot within the two-hour window', () => {
    expect(parseSnapshot(snapshot, 2000 + 60 * 60 * 1000, () => workout)).toEqual(snapshot);
  });

  it('rejects expired, future and malformed snapshots', () => {
    expect(parseSnapshot(snapshot, 2000 + 2 * 60 * 60 * 1000, () => workout)).toBeNull();
    expect(parseSnapshot(snapshot, 1999, () => workout)).toBeNull();
    expect(parseSnapshot({ ...snapshot, state: { ...state, itemIndex: 999 } }, 3000, () => workout)).toBeNull();
    expect(parseSnapshot({ ...snapshot, state: { ...state, done: [{ index: 0, exerciseId: 'wrong', doneSeconds: 10, doneReps: null, skipped: false }] } }, 3000, () => workout)).toBeNull();
  });

  it('creates RFC 4122 version 4 shaped local IDs', () => {
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(createSessionId()).not.toBe(id);
  });

  it('retains a challenge day across a resume and rejects malformed context', () => {
    const challenged = startWorkout(workout, 1000, 15, 20, { id: 'ch_example', day: 2 });
    const resumed = { ...snapshot, state: challenged };
    expect(parseSnapshot(resumed, 3000, () => workout)?.state.challengeDay).toBe(2);
    expect(parseSnapshot({ ...resumed, state: { ...challenged, challengeDay: -1 } }, 3000, () => workout)).toBeNull();
  });
});
