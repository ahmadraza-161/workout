import { getCue, type CueFrame } from './cues';

const exercise: CueFrame = { phase: 'exercise', index: 0, remaining: 4, active: true };

it('plays only newly crossed countdown seconds', () => {
  expect(getCue(exercise, { ...exercise, remaining: 3 })).toBe('tick');
  expect(getCue({ ...exercise, remaining: 3 }, { ...exercise, remaining: 3 })).toBeNull();
  expect(getCue({ ...exercise, remaining: 1 }, { ...exercise, remaining: 3 })).toBeNull();
});

it('suppresses paused, background and resumed catch-up cues', () => {
  expect(getCue(exercise, { ...exercise, remaining: 3, active: false })).toBeNull();
  expect(getCue({ ...exercise, active: false }, { ...exercise, remaining: 1 })).toBeNull();
  expect(getCue(null, exercise)).toBeNull();
});

it('signals phase changes, consecutive exercises and completion once', () => {
  expect(getCue(exercise, { ...exercise, phase: 'rest' })).toBe('transition');
  expect(getCue(exercise, { ...exercise, index: 1 })).toBe('transition');
  const complete: CueFrame = { ...exercise, phase: 'complete', remaining: 0 };
  expect(getCue(exercise, complete)).toBe('complete');
  expect(getCue(complete, complete)).toBeNull();
});
