import { desc, eq } from 'drizzle-orm';

import { db, schema } from '@/modules/core/db';
import { createLocalId } from '@/modules/core/ids';
import { getKv, setKv, type UnitSystem } from '@/modules/core/kv';

import { localDateOf } from './aggregates';

export function listRecentSessions(limit = 10) {
  return db.select().from(schema.sessions).orderBy(desc(schema.sessions.startedAt)).limit(limit).all();
}

export function getReportTotals(): { workouts: number; minutes: number; kcal: number } {
  const rows = db.select({ durationSec: schema.sessions.durationSec, kcal: schema.sessions.kcal, completionPct: schema.sessions.completionPct }).from(schema.sessions).all();
  return {
    workouts: rows.filter((row) => row.completionPct > 0).length,
    minutes: Math.round(rows.reduce((sum, row) => sum + row.durationSec, 0) / 60),
    kcal: Math.round(rows.reduce((sum, row) => sum + row.kcal, 0)),
  };
}

export function listReportSessions() {
  return db.select({
    id: schema.sessions.id,
    localDate: schema.sessions.localDate,
    completionPct: schema.sessions.completionPct,
    durationSec: schema.sessions.durationSec,
    kcal: schema.sessions.kcal,
  }).from(schema.sessions).all();
}

export function getSession(id: string) {
  return db.select().from(schema.sessions).where(eq(schema.sessions.id, id)).get();
}

export function listSessionItems(sessionId: string) {
  return db.select().from(schema.sessionItems)
    .where(eq(schema.sessionItems.sessionId, sessionId))
    .orderBy(schema.sessionItems.orderIndex).all();
}

export function listSessionsOnDate(localDate: string) {
  return db.select().from(schema.sessions)
    .where(eq(schema.sessions.localDate, localDate))
    .orderBy(desc(schema.sessions.startedAt)).all();
}

export function listRecordItems() {
  return db.select({
    sessionId: schema.sessionItems.sessionId,
    exerciseId: schema.sessionItems.exerciseId,
    doneSeconds: schema.sessionItems.doneSeconds,
    doneReps: schema.sessionItems.doneReps,
    skipped: schema.sessionItems.skipped,
  }).from(schema.sessionItems).all();
}

export function listWeightLogs() {
  return db.select().from(schema.weightLog)
    .orderBy(desc(schema.weightLog.localDate), desc(schema.weightLog.recordedAt)).all();
}

export function getWeightUnit(): UnitSystem {
  return getKv('settings.units');
}

export function setWeightUnit(unit: UnitSystem): void {
  setKv('settings.units', unit);
}

export function saveWeightLog(localDate: string, weightKg: number, now = Date.now()): void {
  const parsed = new Date(`${localDate}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate) || localDateOf(parsed) !== localDate || localDate > localDateOf(new Date(now))) {
    throw new Error('Invalid weight date');
  }
  if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 400) {
    throw new Error('Invalid weight');
  }
  db.transaction((tx) => {
    const existing = tx.select().from(schema.weightLog)
      .where(eq(schema.weightLog.localDate, localDate))
      .orderBy(desc(schema.weightLog.recordedAt)).limit(1).get();
    const latest = tx.select({ localDate: schema.weightLog.localDate }).from(schema.weightLog)
      .orderBy(desc(schema.weightLog.localDate)).limit(1).get();
    if (existing) {
      tx.update(schema.weightLog).set({ weightKg, recordedAt: now })
        .where(eq(schema.weightLog.id, existing.id)).run();
    } else {
      tx.insert(schema.weightLog).values({ id: createLocalId(), localDate, weightKg, recordedAt: now }).run();
    }
    if (!latest || localDate >= latest.localDate) {
      tx.update(schema.profile).set({ weightKg }).where(eq(schema.profile.id, 1)).run();
    }
  });
}
