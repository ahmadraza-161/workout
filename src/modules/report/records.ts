export interface RecordSession {
  id: string;
  localDate: string;
  durationSec: number;
  completionPct: number;
}

export interface RecordItem {
  sessionId: string;
  exerciseId: string;
  doneSeconds: number;
  doneReps: number | null;
  skipped: boolean;
}

export interface PersonalBests {
  plank: { seconds: number; sessionId: string } | null;
  reps: { count: number; exerciseId: string; sessionId: string } | null;
  workout: { seconds: number; sessionId: string } | null;
}

/** Derives records from durable sessions so workouts saved before this feature also count. */
export function derivePersonalBests(sessions: RecordSession[], items: RecordItem[]): PersonalBests {
  const result: PersonalBests = { plank: null, reps: null, workout: null };
  for (const session of sessions) {
    if (session.completionPct === 100 && session.durationSec > (result.workout?.seconds ?? 0)) {
      result.workout = { seconds: session.durationSec, sessionId: session.id };
    }
  }
  for (const item of items) {
    if (item.skipped) continue;
    if (item.exerciseId === 'ex_forearm_plank' && item.doneSeconds > (result.plank?.seconds ?? 0)) {
      result.plank = { seconds: item.doneSeconds, sessionId: item.sessionId };
    }
    if (item.doneReps !== null && item.doneReps > (result.reps?.count ?? 0)) {
      result.reps = { count: item.doneReps, exerciseId: item.exerciseId, sessionId: item.sessionId };
    }
  }
  return result;
}

export function recordedDays(sessions: Pick<RecordSession, 'localDate'>[]): Set<string> {
  return new Set(sessions.map((session) => session.localDate));
}
