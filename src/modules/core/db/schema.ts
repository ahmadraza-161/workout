import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// User data only (ADR-023): content lives in the read-only content pack.
// Conventions (DOC/ARCHITECTURE.md §6.3): epoch-ms timestamps, SI units,
// UUID string ids, singleton rows use id = 1, day logic uses `local_date`.
// Any change here needs `npm run db:generate` – never edit applied migrations.

export const profile = sqliteTable('profile', {
  id: integer('id').primaryKey(),
  gender: text('gender', { enum: ['male', 'female', 'unspecified'] }),
  goal: text('goal', { enum: ['build_muscle', 'burn_fat', 'keep_fit', 'flexibility'] }),
  level: integer('level'),
  heightCm: real('height_cm'),
  weightKg: real('weight_kg'),
  birthYear: integer('birth_year'),
  daysPerWeekTarget: integer('days_per_week_target').notNull().default(4),
  createdAt: integer('created_at').notNull(),
});

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    workoutId: text('workout_id').notNull(),
    challengeId: text('challenge_id'),
    day: integer('day'),
    startedAt: integer('started_at').notNull(),
    endedAt: integer('ended_at'),
    durationSec: integer('duration_sec').notNull().default(0),
    completionPct: integer('completion_pct').notNull().default(0),
    kcal: real('kcal').notNull().default(0),
    feedback: text('feedback', { enum: ['too_easy', 'just_right', 'too_hard'] }),
    localDate: text('local_date').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => [
    index('sessions_started_at_idx').on(t.startedAt),
    index('sessions_local_date_idx').on(t.localDate),
    index('sessions_workout_id_idx').on(t.workoutId),
  ],
);

export const sessionItems = sqliteTable(
  'session_items',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id').notNull(),
    orderIndex: integer('order_index').notNull(),
    targetSeconds: integer('target_seconds'),
    targetReps: integer('target_reps'),
    doneSeconds: integer('done_seconds').notNull().default(0),
    doneReps: integer('done_reps'),
    skipped: integer('skipped', { mode: 'boolean' }).notNull().default(false),
    rating: integer('rating'),
  },
  (t) => [index('session_items_session_id_idx').on(t.sessionId)],
);

export const challengeState = sqliteTable('challenge_state', {
  challengeId: text('challenge_id').primaryKey(),
  currentDay: integer('current_day').notNull().default(1),
  startedAt: integer('started_at').notNull(),
  lastCompletedAt: integer('last_completed_at'),
  status: text('status', { enum: ['active', 'completed', 'abandoned'] })
    .notNull()
    .default('active'),
});

export const weightLog = sqliteTable(
  'weight_log',
  {
    id: text('id').primaryKey(),
    recordedAt: integer('recorded_at').notNull(),
    localDate: text('local_date').notNull(),
    weightKg: real('weight_kg').notNull(),
  },
  (t) => [index('weight_log_recorded_at_idx').on(t.recordedAt)],
);

export const streaks = sqliteTable('streaks', {
  id: integer('id').primaryKey(),
  current: integer('current').notNull().default(0),
  longest: integer('longest').notNull().default(0),
  lastWorkoutDate: text('last_workout_date'),
});

export const personalBests = sqliteTable(
  'personal_bests',
  {
    id: text('id').primaryKey(),
    exerciseId: text('exercise_id').notNull(),
    metric: text('metric', { enum: ['hold_seconds', 'reps_in_set', 'workout_seconds'] }).notNull(),
    value: real('value').notNull(),
    achievedAt: integer('achieved_at').notNull(),
  },
  (t) => [uniqueIndex('personal_bests_exercise_metric_idx').on(t.exerciseId, t.metric)],
);

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  unlockedAt: integer('unlocked_at').notNull(),
});

export const customWorkouts = sqliteTable('custom_workouts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  itemsJson: text('items_json').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const favorites = sqliteTable('favorites', {
  workoutId: text('workout_id').primaryKey(),
  addedAt: integer('added_at').notNull(),
});

export const exercisePrefs = sqliteTable('exercise_prefs', {
  exerciseId: text('exercise_id').primaryKey(),
  // 1 = thumbs up, -1 = thumbs down
  rating: integer('rating').notNull(),
});
