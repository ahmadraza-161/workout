import { eq } from 'drizzle-orm';

import { getChallengeProgress } from '@/modules/challenges';
import { getChallenge, getChallengeDayWorkout, getExercise, type Workout } from '@/modules/content';
import { db, schema } from '@/modules/core/db';
import { getProfile } from '@/modules/profile';
import { buildReportSummary, listReportSessions } from '@/modules/report';

import type { PlayerState } from './engine';
import { createSessionId } from './snapshot';
import { planDayOutcome, type PlanDayOutcome } from './planDay';
import { summarizeSession, type SessionSummary } from './summary';

export type ExerciseRating = -1 | 1;
export type WorkoutFeedback = 'too_easy' | 'just_right' | 'too_hard';

export interface CompletionProgress {
  streak: number;
  weeklyDone: number;
  weeklyTarget: number;
}

/** Saves a workout attempt once, with its played exercises in one transaction. */
export function saveWorkoutSession(
  sessionId: string,
  state: PlayerState,
  workout: Workout,
  endedAt: number,
  ratings: Readonly<Record<number, ExerciseRating>> = state.ratingsByIndex ?? {},
): SessionSummary {
  const existing = db.select({
    durationSec: schema.sessions.durationSec,
    completionPct: schema.sessions.completionPct,
    kcal: schema.sessions.kcal,
    localDate: schema.sessions.localDate,
  }).from(schema.sessions).where(eq(schema.sessions.id, sessionId)).get();
  if (existing) return existing;

  // Save retries and finish-screen idle time must not extend a completed workout.
  if (state.phase === 'complete') endedAt = state.phaseStartedAt;
  const profile = db.select({ weightKg: schema.profile.weightKg }).from(schema.profile).limit(1).get();
  const summary = summarizeSession(state, workout, endedAt, profile?.weightKg ?? null, (id) => getExercise(id)?.met ?? 0);

  db.transaction((tx) => {
    tx.insert(schema.sessions).values({
      id: sessionId,
      workoutId: workout.id,
      challengeId: state.challengeId ?? null,
      day: state.challengeDay ?? null,
      startedAt: state.startedAt,
      endedAt,
      durationSec: summary.durationSec,
      completionPct: summary.completionPct,
      kcal: summary.kcal,
      localDate: summary.localDate,
      createdAt: endedAt,
    }).run();

    for (const played of state.done) {
      const target = workout.items[played.index];
      if (!target) continue;
      tx.insert(schema.sessionItems).values({
        id: createSessionId(),
        sessionId,
        exerciseId: played.exerciseId,
        orderIndex: played.index,
        targetSeconds: target.seconds ?? null,
        targetReps: target.reps ?? null,
        doneSeconds: played.doneSeconds,
        doneReps: played.doneReps,
        skipped: played.skipped,
        rating: ratings?.[played.index] ?? null,
      }).run();
      const rating = ratings?.[played.index];
      if (rating !== undefined) {
        tx.insert(schema.exercisePrefs).values({ exerciseId: played.exerciseId, rating })
          .onConflictDoUpdate({ target: schema.exercisePrefs.exerciseId, set: { rating } }).run();
      }
    }
  });
  return summary;
}

/** Stores the workout-level difficulty feedback after its session has been saved. */
export function saveWorkoutFeedback(sessionId: string, feedback: WorkoutFeedback): void {
  db.update(schema.sessions).set({ feedback }).where(eq(schema.sessions.id, sessionId)).run();
}

/** Returns completion details from local sessions after a successful save. */
export function getCompletionProgress(now = Date.now()): CompletionProgress {
  const summary = buildReportSummary(listReportSessions(), 'week', getProfile()?.daysPerWeekTarget ?? 4, new Date(now));
  return {
    streak: summary.streak.current,
    weeklyDone: summary.weeklyGoal.done,
    weeklyTarget: summary.weeklyGoal.target,
  };
}

/** After a saved plan-day session: the next day, or the plan-complete message. */
export function getPlanDayOutcome(challengeId: string, day: number): PlanDayOutcome | null {
  const challenge = getChallenge(challengeId);
  const progress = getChallengeProgress(challengeId);
  if (!challenge || !progress) return null;
  const outcome = planDayOutcome(challenge, day, progress);
  if (outcome?.kind !== 'next') return outcome;
  const next = getChallengeDayWorkout(challengeId, outcome.nextDay);
  return next ? { ...outcome, nextTitleKey: next.titleKey } : outcome;
}
