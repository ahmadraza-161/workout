import { derivePersonalBests, recordedDays, type RecordItem, type RecordSession } from './records';

const sessions: RecordSession[] = [
  { id: 'done', localDate: '2026-09-28', durationSec: 600, completionPct: 100 },
  { id: 'partial', localDate: '2026-09-29', durationSec: 900, completionPct: 50 },
  { id: 'other', localDate: '2026-09-29', durationSec: 700, completionPct: 100 },
];

const items: RecordItem[] = [
  { sessionId: 'done', exerciseId: 'ex_forearm_plank', doneSeconds: 40, doneReps: null, skipped: false },
  { sessionId: 'partial', exerciseId: 'ex_forearm_plank', doneSeconds: 80, doneReps: null, skipped: true },
  { sessionId: 'other', exerciseId: 'ex_forearm_plank', doneSeconds: 50, doneReps: null, skipped: false },
  { sessionId: 'other', exerciseId: 'ex_squat', doneSeconds: 25, doneReps: 24, skipped: false },
  { sessionId: 'done', exerciseId: 'ex_crunch', doneSeconds: 25, doneReps: 18, skipped: false },
];

describe('saved workout records', () => {
  it('shows one calendar mark per local day even with multiple sessions', () => {
    expect([...recordedDays(sessions)]).toEqual(['2026-09-28', '2026-09-29']);
  });

  it('ignores skipped items and partial workouts for the longest completed workout', () => {
    expect(derivePersonalBests(sessions, items)).toEqual({
      plank: { seconds: 50, sessionId: 'other' },
      reps: { count: 24, exerciseId: 'ex_squat', sessionId: 'other' },
      workout: { seconds: 700, sessionId: 'other' },
    });
  });

  it('shows empty records before the first workout', () => {
    expect(derivePersonalBests([], [])).toEqual({ plank: null, reps: null, workout: null });
  });
});
