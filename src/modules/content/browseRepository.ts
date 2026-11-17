import { desc, eq } from 'drizzle-orm';

import { db, schema } from '@/modules/core/db';
import { getKv, setKv } from '@/modules/core/kv';
import { getProfile } from '@/modules/profile';

import { DEFAULT_BROWSE_CONTEXT, type BrowseContext } from './browse';

export function loadBrowseContext(): BrowseContext {
  const profile = getProfile();
  const sessions = db.select().from(schema.sessions).orderBy(desc(schema.sessions.endedAt)).all();
  return {
    goal: profile?.goal ?? DEFAULT_BROWSE_CONTEXT.goal,
    level: profile?.level === 2 || profile?.level === 3 ? profile.level : 1,
    recent: sessions.filter((item) => item.endedAt !== null && item.completionPct >= 100)
      .map((item) => ({ workoutId: item.workoutId, endedAt: item.endedAt! })),
    disliked: db.select().from(schema.exercisePrefs).where(eq(schema.exercisePrefs.rating, -1)).all().map((item) => item.exerciseId),
  };
}

export function readFeedbackNote(): string { return getKv('feedback.note'); }
export function saveFeedbackNote(note: string): void {
  if (note.length > 10000) throw new Error('Feedback note is too long');
  setKv('feedback.note', note);
}
