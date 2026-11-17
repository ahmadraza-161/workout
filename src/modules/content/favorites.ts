import { desc, eq } from 'drizzle-orm';

import { db, schema } from '@/modules/core/db';

import { getWorkout } from './repository';

export function isFavoriteWorkout(workoutId: string): boolean {
  return db.select({ id: schema.favorites.workoutId }).from(schema.favorites).where(eq(schema.favorites.workoutId, workoutId)).get() !== undefined;
}

export function setFavoriteWorkout(workoutId: string, favorite: boolean): void {
  if (favorite) {
    db.insert(schema.favorites).values({ workoutId, addedAt: Date.now() }).onConflictDoNothing().run();
  } else {
    db.delete(schema.favorites).where(eq(schema.favorites.workoutId, workoutId)).run();
  }
}

export function listFavoriteWorkouts() {
  const rows = db.select().from(schema.favorites).orderBy(desc(schema.favorites.addedAt)).all();
  return rows.flatMap((row) => {
    const workout = getWorkout(row.workoutId);
    return workout ? [workout] : [];
  });
}
