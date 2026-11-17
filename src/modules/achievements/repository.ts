import { getContentPack } from '@/modules/content';
import { db, schema } from '@/modules/core/db';

import { evaluateAchievements } from './evaluator';

export interface AchievementStatus {
  id: string;
  titleKey: string;
  group: string;
  unlockedAt: number | null;
}

/** Reconciles badge unlocks from saved data, including workouts from older app sessions. */
export function refreshAchievements(now = Date.now()): { badges: AchievementStatus[]; newIds: string[] } {
  const pack = getContentPack();
  const profile = db.select({ target: schema.profile.daysPerWeekTarget }).from(schema.profile).limit(1).get();
  const met = evaluateAchievements(pack.achievements, {
    sessions: db.select().from(schema.sessions).all(),
    items: db.select().from(schema.sessionItems).all(),
    runs: db.select().from(schema.challengeState).all(),
    customWorkoutCount: db.select({ id: schema.customWorkouts.id }).from(schema.customWorkouts).all().length,
    weeklyTarget: profile?.target ?? 4,
    exercises: pack.exercises,
    workouts: pack.workouts,
    challenges: pack.challenges,
    today: new Date(now),
  });
  const existing = new Map(db.select().from(schema.achievements).all().map((row) => [row.id, row.unlockedAt]));
  const newIds = pack.achievements.filter((badge) => met.has(badge.id) && !existing.has(badge.id)).map((badge) => badge.id);
  if (newIds.length) {
    db.transaction((tx) => {
      for (const id of newIds) tx.insert(schema.achievements).values({ id, unlockedAt: now }).onConflictDoNothing().run();
    });
    for (const id of newIds) existing.set(id, now);
  }
  return {
    badges: pack.achievements.map((badge) => ({ id: badge.id, titleKey: badge.titleKey, group: badge.group, unlockedAt: existing.get(badge.id) ?? null })),
    newIds,
  };
}
