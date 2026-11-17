import type { ChallengeGradientName } from '@/modules/core/theme';

// Content pack model: spec v3 §6.1 plus the additions in DOC/CONTENT_MAP.md
// (equipment values, props, views, quiet swaps, collections – ADR-040…050).

export type Level = 1 | 2 | 3;
export type ExerciseType = 'time' | 'reps' | 'hold';
export type BodyFocus = 'abs' | 'arm' | 'chest' | 'shoulder' | 'back' | 'leg' | 'butt' | 'full_body';
export type Goal = 'build_muscle' | 'burn_fat' | 'keep_fit' | 'flexibility';
export type WorkoutType = 'strength' | 'hiit' | 'stretch' | 'warmup' | 'cooldown';
export type Equipment = 'none' | 'household' | 'optional_weight';
export type RigView = 'side' | 'front' | 'top';
export type Prop = 'wall' | 'chair' | 'doorway' | 'bottles';
export type MuscleGroup =
  | 'neck'
  | 'traps'
  | 'deltoids'
  | 'rear_deltoids'
  | 'chest'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'upper_back'
  | 'lats'
  | 'erector_spinae'
  | 'abs'
  | 'obliques'
  | 'hip_flexors'
  | 'glutes'
  | 'adductors'
  | 'quads'
  | 'hamstrings'
  | 'calves';

export interface Exercise {
  id: string;
  slug: string;
  nameKey: string;
  type: ExerciseType;
  defaultSeconds: number | null;
  defaultReps: number | null;
  oneSided: boolean;
  difficulty: Level;
  quietSafe: boolean;
  /** Replacement used when Quiet Mode is on (ADR-041); null for quiet-safe exercises. */
  quietSwapId: string | null;
  equipment: Equipment;
  props: Prop[];
  view: RigView;
  focusAreaKeys: string[];
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  /** From the Compendium of Physical Activities (ADR-048). */
  met: number;
  instructionsKey: string;
  mistakesKey: string;
  breathingKey: string;
  easierId: string | null;
  harderId: string | null;
}

export interface WorkoutItem {
  exerciseId: string;
  seconds?: number;
  reps?: number;
  rest: number;
  side?: 'left' | 'right';
}

export interface Workout {
  /** Custom workouts keep the rest assigned to each exercise. */
  useItemRest?: boolean;
  id: string;
  titleKey: string;
  introKey: string;
  bodyFocus: BodyFocus;
  goal: Goal;
  type: WorkoutType;
  level: Level;
  estimatedMinutes: number;
  quietSafe: boolean;
  gradient: ChallengeGradientName;
  items: WorkoutItem[];
}

export interface ChallengeDay {
  day: number;
  rest?: boolean;
  workoutId?: string;
  exerciseId?: string;
  seconds?: number;
  reps?: number;
  sets?: number;
}

export interface Challenge {
  id: string;
  titleKey: string;
  descKey: string;
  days: 14 | 21 | 28 | 30;
  level: Level;
  bodyFocus: BodyFocus;
  goal: Goal;
  dailyMinutes: string;
  gradient: ChallengeGradientName;
  schedule: ChallengeDay[];
}

export interface Category {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  workoutIds: string[];
}

export interface Collection {
  id: string;
  titleKey: string;
  goal: Goal;
  workoutIds: string[];
}

export interface Achievement {
  id: string;
  titleKey: string;
  group: string;
  metric: 'workouts' | 'challenge_days' | 'streak' | 'distinct_days' | 'minutes' |
    'best_reps' | 'best_hold' | 'distinct_exercises' | 'distinct_focuses' |
    'custom_workouts_saved' | 'challenges_by_length' | 'weekly_goals_in_a_row' |
    'session_before_hour' | 'session_after_hour' | 'days_within_window';
  threshold: number;
  scope?: { exercises?: number[]; minDays?: number; windowDays?: number };
}

export interface ContentPack {
  contentVersion: number;
  exercises: Exercise[];
  workouts: Workout[];
  challenges: Challenge[];
  categories: Category[];
  collections: Collection[];
  achievements: Achievement[];
}
