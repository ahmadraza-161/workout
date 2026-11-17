import { and, desc, eq, ne } from 'drizzle-orm';

import { getChallenge } from '@/modules/content';
import { db, schema } from '@/modules/core/db';

import { completedChallengeDays, nextChallengeDay } from './progression';

export interface ChallengeProgress {
  currentDay: number;
  completedDays: ReadonlySet<number>;
  status: 'active' | 'completed' | 'abandoned';
}

export function startChallenge(challengeId: string, now = Date.now()): ChallengeProgress | null {
  if (!getChallenge(challengeId)) return null;
  db.insert(schema.challengeState)
    .values({ challengeId, currentDay: 1, startedAt: now, status: 'active' })
    .onConflictDoNothing()
    .run();
  return getChallengeProgress(challengeId);
}

/** Home follows one plan: the most recently started run that is still active. */
export function getActivePlan(): { challengeId: string; progress: ChallengeProgress } | null {
  const markers = db.select({ challengeId: schema.challengeState.challengeId }).from(schema.challengeState)
    .where(eq(schema.challengeState.status, 'active')).orderBy(desc(schema.challengeState.startedAt)).all();
  for (const { challengeId } of markers) {
    const progress = getChallengeProgress(challengeId);
    if (progress?.status === 'active') return { challengeId, progress };
  }
  return null;
}

/** Makes one plan the only active plan; its earlier progress is kept unless that run was finished. */
export function selectPlan(challengeId: string, now = Date.now()): ChallengeProgress | null {
  if (!getChallenge(challengeId)) return null;
  db.update(schema.challengeState).set({ status: 'abandoned' })
    .where(and(eq(schema.challengeState.status, 'active'), ne(schema.challengeState.challengeId, challengeId))).run();
  if (!getChallengeProgress(challengeId)) return startChallenge(challengeId, now);
  db.update(schema.challengeState).set({ status: 'active' })
    .where(eq(schema.challengeState.challengeId, challengeId)).run();
  const resumed = getChallengeProgress(challengeId);
  return resumed?.status === 'completed' ? restartChallenge(challengeId, now) : resumed;
}

export function abandonChallenge(challengeId: string): void {
  db.update(schema.challengeState).set({ status: 'abandoned' })
    .where(eq(schema.challengeState.challengeId, challengeId)).run();
}

export function restartChallenge(challengeId: string, now = Date.now()): ChallengeProgress | null {
  if (!getChallenge(challengeId)) return null;
  db.insert(schema.challengeState)
    .values({ challengeId, currentDay: 1, startedAt: now, status: 'active' })
    .onConflictDoUpdate({ target: schema.challengeState.challengeId,
      set: { currentDay: 1, startedAt: now, lastCompletedAt: null, status: 'active' } })
    .run();
  return getChallengeProgress(challengeId);
}

/** Reconciles the marker from saved sessions so a crash cannot lose a completed day. */
export function getChallengeProgress(challengeId: string): ChallengeProgress | null {
  const challenge = getChallenge(challengeId);
  if (!challenge) return null;
  const marker = db.select().from(schema.challengeState)
    .where(eq(schema.challengeState.challengeId, challengeId)).get();
  if (!marker) return null;
  const sessions = db.select({
    day: schema.sessions.day, completionPct: schema.sessions.completionPct,
    endedAt: schema.sessions.endedAt, startedAt: schema.sessions.startedAt,
  })
    .from(schema.sessions).where(eq(schema.sessions.challengeId, challengeId)).all();
  const currentRunSessions = sessions.filter((row) => row.startedAt >= marker.startedAt);
  const completedDays = completedChallengeDays(sessions, marker.startedAt);
  const currentDay = nextChallengeDay(challenge, completedDays);
  const status = marker.status === 'abandoned' ? 'abandoned' : currentDay > challenge.days ? 'completed' : 'active';
  if (currentDay !== marker.currentDay || status !== marker.status) {
    db.update(schema.challengeState)
      .set({ currentDay, status, lastCompletedAt: currentRunSessions.reduce<number | null>((latest, row) =>
        row.completionPct === 100 && row.endedAt !== null ? Math.max(latest ?? 0, row.endedAt) : latest, null) })
      .where(eq(schema.challengeState.challengeId, challengeId)).run();
  }
  return { currentDay, completedDays, status };
}
