import type { Workout } from '@/modules/content';

export type PlayerPhase = 'prep' | 'exercise' | 'rest' | 'complete';

export interface PlayedItem {
  index: number;
  exerciseId: string;
  doneSeconds: number;
  doneReps: number | null;
  skipped: boolean;
}

export interface PlayerState {
  workoutId: string;
  challengeId?: string | null;
  challengeDay?: number | null;
  plannedExerciseIds: string[];
  startedAt: number;
  phase: PlayerPhase;
  itemIndex: number;
  phaseStartedAt: number;
  pausedAt: number | null;
  prepSeconds: number;
  baseRestSeconds: number;
  restSeconds: number;
  pausedTotalMs: number;
  done: PlayedItem[];
  ratingsByIndex?: Record<number, -1 | 1>;
}

/** Keeps exercise feedback in the resumable state, including unfinished sessions. */
export function ratePlayerExercise(state: PlayerState, rating: -1 | 1): PlayerState {
  if (state.phase !== 'exercise') return state;
  return { ...state, ratingsByIndex: { ...state.ratingsByIndex, [state.itemIndex]: rating } };
}

export function startWorkout(
  workout: Workout,
  now: number,
  prepSeconds = 15,
  restSeconds = 20,
  challenge?: { id: string; day: number },
): PlayerState {
  return {
    workoutId: workout.id,
    challengeId: challenge?.id ?? null,
    challengeDay: challenge?.day ?? null,
    plannedExerciseIds: workout.items.map((item) => item.exerciseId),
    startedAt: now,
    phase: workout.items.length === 0 ? 'complete' : prepSeconds > 0 ? 'prep' : 'exercise',
    itemIndex: 0,
    phaseStartedAt: now,
    pausedAt: null,
    prepSeconds,
    baseRestSeconds: restSeconds,
    restSeconds,
    pausedTotalMs: 0,
    done: [],
  };
}

function durationSeconds(state: PlayerState, workout: Workout): number | null {
  if (state.phase === 'prep') return state.prepSeconds;
  if (state.phase === 'rest') return state.restSeconds;
  if (state.phase === 'exercise') return workout.items[state.itemIndex]?.seconds ?? null;
  return null;
}

export function remainingSeconds(state: PlayerState, workout: Workout, now: number): number | null {
  const duration = durationSeconds(state, workout);
  if (duration === null) return null;
  const elapsed = (Math.max(state.pausedAt ?? now, state.phaseStartedAt) - state.phaseStartedAt) / 1000;
  return Math.max(0, Math.ceil(duration - elapsed));
}

function nextPhase(
  state: PlayerState,
  workout: Workout,
  at: number,
  skipped = false,
  actualReps?: number,
): PlayerState {
  if (state.phase === 'prep') return { ...state, phase: 'exercise', phaseStartedAt: at };
  if (state.phase === 'exercise') {
    const item = workout.items[state.itemIndex];
    if (!item) return { ...state, phase: 'complete', phaseStartedAt: at };
    const elapsedSeconds = Math.max(0, Math.floor((at - state.phaseStartedAt) / 1000));
    const completed: PlayedItem = {
      index: state.itemIndex,
      exerciseId: item.exerciseId,
      doneSeconds: item.seconds === undefined ? elapsedSeconds : Math.min(item.seconds, elapsedSeconds),
      doneReps: item.reps === undefined ? null : Math.max(0, actualReps ?? (skipped ? 0 : item.reps)),
      skipped,
    };
    const done = [...state.done.filter((entry) => entry.index !== state.itemIndex), completed];
    if (state.itemIndex >= workout.items.length - 1) {
      return { ...state, done, phase: 'complete', phaseStartedAt: at };
    }
    // The global rest-off preference wins; custom templates otherwise use each item's saved rest.
    const restSeconds = state.baseRestSeconds === 0 ? 0 : workout.useItemRest ? item.rest : state.baseRestSeconds;
    if (restSeconds === 0) {
      return { ...state, done, phase: 'exercise', itemIndex: state.itemIndex + 1, phaseStartedAt: at };
    }
    return { ...state, done, phase: 'rest', phaseStartedAt: at, restSeconds };
  }
  if (state.phase === 'rest') {
    return { ...state, phase: 'exercise', itemIndex: state.itemIndex + 1, phaseStartedAt: at };
  }
  return state;
}

/** Advances timed phases from wall-clock timestamps, including time spent in the background. */
export function advancePlayer(state: PlayerState, workout: Workout, now: number): PlayerState {
  if (state.pausedAt !== null || state.phase === 'complete') return state;
  let current = state;
  const maxTransitions = workout.items.length * 2 + 2;
  for (let count = 0; count < maxTransitions; count += 1) {
    const duration = durationSeconds(current, workout);
    if (duration === null || now < current.phaseStartedAt + duration * 1000) return current;
    current = nextPhase(current, workout, current.phaseStartedAt + duration * 1000);
  }
  return current;
}

export function pausePlayer(state: PlayerState, now: number): PlayerState {
  return state.pausedAt !== null || state.phase === 'complete' ? state : { ...state, pausedAt: now };
}

export function resumePlayer(state: PlayerState, now: number): PlayerState {
  if (state.pausedAt === null) return state;
  return {
    ...state,
    phaseStartedAt: state.phaseStartedAt + Math.max(0, now - state.pausedAt),
    pausedTotalMs: state.pausedTotalMs + Math.max(0, now - state.pausedAt),
    pausedAt: null,
  };
}

export function skipPhase(state: PlayerState, workout: Workout, now: number): PlayerState {
  if (state.phase === 'complete') return state;
  return nextPhase({ ...state, pausedAt: null }, workout, now, state.phase === 'exercise');
}

export function finishExercise(
  state: PlayerState,
  workout: Workout,
  now: number,
  actualReps?: number,
): PlayerState {
  if (state.phase !== 'exercise' || state.pausedAt !== null) return state;
  return nextPhase(state, workout, now, false, actualReps);
}

/** Replays the preceding exercise and drops later results so the saved session stays consistent. */
export function goToPreviousExercise(state: PlayerState, now: number): PlayerState {
  if (state.phase !== 'exercise' || state.pausedAt !== null || state.itemIndex === 0) return state;
  const itemIndex = state.itemIndex - 1;
  return {
    ...state,
    itemIndex,
    phaseStartedAt: now,
    done: state.done.filter((item) => item.index < itemIndex),
  };
}

export const MAX_REST_SECONDS = 120;

export function addRestSeconds(state: PlayerState, seconds: number): PlayerState {
  if (state.phase !== 'rest' || seconds <= 0) return state;
  return { ...state, restSeconds: Math.min(MAX_REST_SECONDS, state.restSeconds + seconds) };
}
