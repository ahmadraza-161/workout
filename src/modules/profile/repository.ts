import { eq } from 'drizzle-orm';

import { db, schema } from '@/modules/core/db';
import { getKv, setKv } from '@/modules/core/kv';

import type { ProfileValues } from './onboarding';

export function isOnboardingComplete(): boolean {
  return getKv('onboarding.completed');
}

export function getProfile() {
  return db.select().from(schema.profile).where(eq(schema.profile.id, 1)).get();
}

export function saveOnboardingProfile(values: ProfileValues, now = Date.now()): void {
  db.insert(schema.profile)
    .values({ id: 1, ...values, createdAt: now })
    .onConflictDoUpdate({ target: schema.profile.id, set: values })
    .run();
  // Flag only after the row is durable. A failed KV write safely retries onboarding.
  setKv('onboarding.completed', true);
}

export function updateProfile(values: ProfileValues): void {
  if (!getProfile()) throw new Error('Profile is missing');
  db.update(schema.profile).set(values).where(eq(schema.profile.id, 1)).run();
}

export function updateWeeklyTarget(days: number): void {
  if (!Number.isInteger(days) || days < 1 || days > 7) throw new Error('Invalid weekly target');
  if (!getProfile()) throw new Error('Profile is missing');
  db.update(schema.profile).set({ daysPerWeekTarget: days }).where(eq(schema.profile.id, 1)).run();
}

export function updateHeightCm(heightCm: number): void {
  if (!Number.isFinite(heightCm) || heightCm < 90 || heightCm > 250) throw new Error('Invalid height');
  if (!getProfile()) throw new Error('Profile is missing');
  db.update(schema.profile).set({ heightCm }).where(eq(schema.profile.id, 1)).run();
}
