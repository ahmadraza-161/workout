import type { Workout } from '@/modules/content';
import { getKv, removeKv, setKv } from '@/modules/core/kv';
import { createLocalId } from '@/modules/core/ids';

import type { PlayerPhase, PlayerState } from './engine';

export interface PlayerSnapshot {
  version: 1;
  sessionId: string;
  savedAt: number;
  state: PlayerState;
}

const RESUME_WINDOW_MS = 2 * 60 * 60 * 1000;
const PHASES: readonly PlayerPhase[] = ['prep', 'exercise', 'rest', 'complete'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Rejects stale or malformed snapshots before they can affect the player. */
export function parseSnapshot(
  value: unknown,
  now: number,
  workoutFor: (id: string) => Workout | undefined,
): PlayerSnapshot | null {
  if (!isRecord(value) || value.version !== 1 || typeof value.sessionId !== 'string') return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.sessionId)) return null;
  if (!Number.isFinite(value.savedAt) || typeof value.savedAt !== 'number') return null;
  if (value.savedAt > now || now - value.savedAt >= RESUME_WINDOW_MS) return null;
  const state = value.state;
  if (!isRecord(state) || typeof state.workoutId !== 'string') return null;
  const workout = workoutFor(state.workoutId);
  if (!workout || !PHASES.includes(state.phase as PlayerPhase)) return null;
  const challengeId = state.challengeId;
  const challengeDay = state.challengeDay;
  if ((challengeId !== undefined || challengeDay !== undefined) &&
    !((challengeId === null && challengeDay === null) ||
      (typeof challengeId === 'string' && challengeId.length > 0 &&
        Number.isInteger(challengeDay) && (challengeDay as number) > 0))) return null;
  if (
    !Number.isInteger(state.itemIndex) ||
    (state.itemIndex as number) < 0 ||
    (state.itemIndex as number) >= workout.items.length ||
    !Number.isFinite(state.startedAt) ||
    !Number.isFinite(state.phaseStartedAt) ||
    !Number.isFinite(state.prepSeconds) ||
    !Number.isFinite(state.baseRestSeconds) ||
    !Number.isFinite(state.restSeconds) ||
    !Number.isFinite(state.pausedTotalMs) ||
    !Array.isArray(state.plannedExerciseIds) ||
    state.plannedExerciseIds.length !== workout.items.length ||
    !state.plannedExerciseIds.every((id: unknown) => typeof id === 'string' && id.length > 0) ||
    (state.startedAt as number) > now ||
    (state.phaseStartedAt as number) < (state.startedAt as number) ||
    (state.phaseStartedAt as number) > now ||
    (state.pausedAt !== null && (!Number.isFinite(state.pausedAt) || (state.pausedAt as number) > now)) ||
    !Array.isArray(state.done)
  ) return null;
  if (state.ratingsByIndex !== undefined) {
    if (!isRecord(state.ratingsByIndex)) return null;
    for (const [key, rating] of Object.entries(state.ratingsByIndex)) {
      const index = Number(key);
      if (!Number.isInteger(index) || String(index) !== key || index < 0 ||
        index >= workout.items.length || (rating !== -1 && rating !== 1)) return null;
    }
  }
  const seen = new Set<number>();
  for (const item of state.done) {
    if (!isRecord(item) || !Number.isInteger(item.index) || !Number.isFinite(item.doneSeconds)) return null;
    if (typeof item.exerciseId !== 'string' || typeof item.skipped !== 'boolean') return null;
    const index = item.index as number;
    if (index < 0 || index >= workout.items.length || seen.has(index)) return null;
    if (state.plannedExerciseIds[index] !== item.exerciseId || (item.doneSeconds as number) < 0) return null;
    if (item.doneReps !== null && (!Number.isInteger(item.doneReps) || (item.doneReps as number) < 0)) return null;
    seen.add(index);
  }
  return value as unknown as PlayerSnapshot;
}

export function getResumableSnapshot(
  workoutFor: (id: string) => Workout | undefined,
  now = Date.now(),
): PlayerSnapshot | null {
  const snapshot = parseSnapshot(getKv('player.snapshot'), now, workoutFor);
  if (!snapshot) removeKv('player.snapshot');
  return snapshot;
}

export function savePlayerSnapshot(sessionId: string, state: PlayerState, now = Date.now()): void {
  const snapshot: PlayerSnapshot = { version: 1, sessionId, savedAt: now, state };
  setKv('player.snapshot', snapshot);
}

export function clearPlayerSnapshot(): void {
  removeKv('player.snapshot');
}

/** Local UUID v4 for on-device session rows; no external service is involved. */
export function createSessionId(): string {
  return createLocalId();
}
