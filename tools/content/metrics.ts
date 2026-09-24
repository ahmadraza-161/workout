// Per-exercise data the catalog does not record: which muscles the move works,
// its MET value, and the default duration or rep count (T2.2).
//
// Keyed by the catalog's exercise number, which is the join key everywhere.
//
// MET values follow the Compendium of Physical Activities (ADR-048), rounded
// to its published bands rather than invented per exercise:
//   2.3  gentle stretching and lying holds
//   2.5–3.0  mobility drills and easy standing movement
//   3.3  isometric holds
//   3.5–4.0  light calisthenics
//   5.0  moderate calisthenics, squats and lunges
//   8.0  vigorous calisthenics: push-ups, sit-up variants, jumping, running in place
//
// Defaults are the un-tuned starting point. The workout generator overrides
// them per workout from the level rules in PRD §8.2, so these matter mainly
// for the exercise guide and for custom workouts.

export const MUSCLE_GROUPS = [
  'neck',
  'traps',
  'deltoids',
  'rear_deltoids',
  'chest',
  'biceps',
  'triceps',
  'forearms',
  'upper_back',
  'lats',
  'erector_spinae',
  'abs',
  'obliques',
  'hip_flexors',
  'glutes',
  'adductors',
  'quads',
  'hamstrings',
  'calves',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export interface ExerciseMetrics {
  /** Muscles the exercise is chosen for; highlighted strongly on the map. */
  primary: MuscleGroup[];
  /** Muscles that assist; highlighted faintly. */
  secondary: MuscleGroup[];
  met: number;
  /** For `time` and `hold` exercises. */
  seconds?: number;
  /** For `reps` exercises. One-sided exercises count one side. */
  reps?: number;
}

export const METRICS: Record<number, ExerciseMetrics> = {
  // Warm-Up
  1: { primary: ['quads', 'hip_flexors'], secondary: ['calves', 'abs'], met: 3.5, seconds: 40 },
  2: { primary: ['deltoids'], secondary: ['traps', 'rear_deltoids'], met: 2.8, seconds: 30 },
  3: { primary: ['traps'], secondary: ['deltoids', 'neck'], met: 2.5, seconds: 30 },
  4: { primary: ['hip_flexors'], secondary: ['obliques', 'glutes'], met: 2.8, seconds: 30 },
  5: { primary: ['hip_flexors'], secondary: ['hamstrings', 'glutes'], met: 3.0, seconds: 30 },
  6: { primary: ['adductors'], secondary: ['glutes', 'hip_flexors'], met: 3.0, seconds: 30 },
  7: { primary: ['obliques'], secondary: ['abs', 'erector_spinae'], met: 2.8, seconds: 40 },
  8: { primary: ['neck'], secondary: ['traps'], met: 2.3, seconds: 25 },
  9: { primary: ['erector_spinae'], secondary: ['abs', 'traps'], met: 2.5, seconds: 40 },
  10: { primary: ['abs'], secondary: ['hamstrings', 'deltoids'], met: 4.0, reps: 8 },

  // Core & Abs
  11: { primary: ['abs'], secondary: ['hip_flexors'], met: 3.8, reps: 15 },
  12: { primary: ['abs'], secondary: ['hip_flexors'], met: 4.0, reps: 12 },
  13: { primary: ['obliques', 'abs'], secondary: ['hip_flexors'], met: 5.0, reps: 16 },
  14: { primary: ['abs'], secondary: ['hip_flexors'], met: 5.0, reps: 12 },
  15: { primary: ['abs', 'hip_flexors'], secondary: ['quads'], met: 4.0, reps: 12 },
  16: { primary: ['abs', 'hip_flexors'], secondary: ['quads'], met: 4.0, seconds: 30 },
  17: { primary: ['abs', 'hip_flexors'], secondary: ['adductors'], met: 4.0, seconds: 30 },
  18: { primary: ['obliques'], secondary: ['abs'], met: 3.5, reps: 20 },
  19: { primary: ['obliques'], secondary: ['abs', 'hip_flexors'], met: 4.0, reps: 20 },
  20: { primary: ['abs'], secondary: ['deltoids', 'erector_spinae'], met: 3.3, seconds: 30 },
  21: { primary: ['obliques'], secondary: ['abs', 'deltoids'], met: 3.3, seconds: 25 },
  22: { primary: ['abs'], secondary: ['deltoids', 'obliques'], met: 4.0, reps: 16 },
  23: { primary: ['abs'], secondary: ['hip_flexors'], met: 3.5, reps: 12 },
  24: { primary: ['abs'], secondary: ['hip_flexors'], met: 4.0, seconds: 25 },
  25: { primary: ['abs'], secondary: ['hip_flexors', 'deltoids', 'quads'], met: 8.0, seconds: 30 },
  26: { primary: ['abs'], secondary: ['hip_flexors', 'quads'], met: 5.0, reps: 12 },
  27: { primary: ['abs'], secondary: ['hamstrings'], met: 4.0, reps: 15 },
  28: { primary: ['obliques'], secondary: ['abs', 'hamstrings'], met: 3.5, seconds: 40 },
  29: { primary: ['obliques'], secondary: ['abs'], met: 3.5, reps: 16 },

  // Chest & Push
  30: { primary: ['chest'], secondary: ['triceps', 'deltoids'], met: 3.5, reps: 12 },
  31: { primary: ['chest'], secondary: ['triceps', 'deltoids'], met: 4.0, reps: 12 },
  32: { primary: ['chest'], secondary: ['triceps', 'deltoids'], met: 5.0, reps: 12 },
  33: { primary: ['chest'], secondary: ['triceps', 'deltoids', 'abs'], met: 8.0, reps: 12 },
  34: { primary: ['chest'], secondary: ['deltoids', 'triceps'], met: 8.0, reps: 12 },
  35: { primary: ['triceps'], secondary: ['chest', 'deltoids'], met: 8.0, reps: 10 },
  36: { primary: ['chest', 'deltoids'], secondary: ['triceps'], met: 8.0, reps: 10 },
  37: { primary: ['chest'], secondary: ['triceps', 'deltoids', 'abs'], met: 8.0, reps: 8 },
  38: { primary: ['chest'], secondary: ['triceps', 'abs'], met: 4.0, seconds: 25 },
  39: { primary: ['chest'], secondary: ['triceps', 'abs', 'deltoids'], met: 8.0, reps: 10 },
  40: { primary: ['chest'], secondary: ['deltoids'], met: 3.3, seconds: 25 },
  41: { primary: ['chest'], secondary: ['abs', 'deltoids', 'triceps'], met: 8.0, reps: 10 },

  // Shoulders & Arms
  42: { primary: ['deltoids'], secondary: ['triceps', 'traps'], met: 8.0, reps: 10 },
  43: { primary: ['rear_deltoids', 'traps'], secondary: ['upper_back'], met: 3.0, reps: 12 },
  44: { primary: ['triceps'], secondary: ['deltoids', 'chest'], met: 5.0, reps: 12 },
  45: { primary: ['triceps'], secondary: ['deltoids'], met: 4.0, reps: 12 },
  46: { primary: ['deltoids'], secondary: ['traps', 'forearms'], met: 3.5, reps: 12 },
  47: { primary: ['deltoids'], secondary: ['traps', 'forearms'], met: 3.5, reps: 12 },
  48: { primary: ['deltoids'], secondary: ['triceps', 'traps'], met: 3.5, seconds: 25 },
  49: { primary: ['abs'], secondary: ['triceps', 'deltoids', 'chest'], met: 8.0, reps: 12 },
  50: { primary: ['abs'], secondary: ['deltoids', 'quads'], met: 4.0, seconds: 25 },
  51: { primary: ['deltoids'], secondary: ['triceps', 'traps', 'abs'], met: 5.0, seconds: 20 },
  52: { primary: ['deltoids'], secondary: ['chest', 'obliques'], met: 4.0, seconds: 40 },
  53: { primary: ['deltoids'], secondary: ['traps'], met: 3.0, seconds: 30 },

  // Back & Pull
  54: { primary: ['erector_spinae'], secondary: ['glutes', 'rear_deltoids'], met: 3.3, seconds: 25 },
  55: { primary: ['erector_spinae'], secondary: ['glutes', 'hamstrings'], met: 3.8, reps: 12 },
  56: { primary: ['rear_deltoids', 'upper_back'], secondary: ['traps'], met: 3.5, reps: 12 },
  57: { primary: ['traps', 'rear_deltoids'], secondary: ['upper_back'], met: 3.5, reps: 12 },
  58: { primary: ['rear_deltoids'], secondary: ['upper_back', 'traps'], met: 3.5, reps: 12 },
  59: { primary: ['upper_back', 'rear_deltoids'], secondary: ['traps'], met: 3.5, reps: 12 },
  60: { primary: ['erector_spinae'], secondary: ['glutes', 'rear_deltoids'], met: 4.0, seconds: 30 },
  61: { primary: ['erector_spinae', 'abs'], secondary: ['glutes'], met: 3.5, reps: 12 },
  62: { primary: ['lats', 'upper_back'], secondary: ['biceps', 'forearms'], met: 3.5, seconds: 25 },
  63: { primary: ['erector_spinae'], secondary: ['glutes', 'hamstrings'], met: 3.8, reps: 12 },

  // Legs & Glutes
  64: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'calves'], met: 5.0, reps: 15 },
  65: { primary: ['adductors', 'quads'], secondary: ['glutes'], met: 5.0, reps: 15 },
  66: { primary: ['quads'], secondary: ['glutes', 'adductors'], met: 5.0, seconds: 30 },
  67: { primary: ['quads'], secondary: ['glutes', 'calves'], met: 4.0, seconds: 30 },
  68: { primary: ['quads', 'glutes'], secondary: ['hamstrings'], met: 5.0, reps: 12 },
  69: { primary: ['glutes', 'quads'], secondary: ['hamstrings'], met: 5.0, reps: 12 },
  70: { primary: ['adductors', 'quads'], secondary: ['glutes'], met: 5.0, reps: 12 },
  71: { primary: ['glutes'], secondary: ['quads', 'adductors'], met: 5.0, reps: 12 },
  72: { primary: ['quads', 'glutes'], secondary: ['hamstrings'], met: 5.0, reps: 10 },
  73: { primary: ['glutes'], secondary: ['hamstrings', 'erector_spinae'], met: 3.8, reps: 15 },
  74: { primary: ['glutes'], secondary: ['hamstrings', 'abs'], met: 4.0, reps: 10 },
  75: { primary: ['glutes'], secondary: ['hamstrings'], met: 4.0, reps: 15 },
  76: { primary: ['glutes'], secondary: ['hamstrings', 'erector_spinae'], met: 3.5, reps: 12 },
  77: { primary: ['glutes'], secondary: ['hip_flexors', 'obliques'], met: 3.5, reps: 12 },
  78: { primary: ['calves'], secondary: ['quads'], met: 3.5, reps: 20 },
  79: { primary: ['calves'], secondary: ['quads'], met: 3.8, reps: 12 },
  80: { primary: ['hamstrings', 'erector_spinae'], secondary: ['glutes'], met: 4.0, reps: 12 },
  81: { primary: ['quads', 'glutes'], secondary: ['calves', 'hamstrings'], met: 5.0, reps: 12 },

  // Full Body
  82: { primary: ['quads', 'abs'], secondary: ['chest', 'deltoids'], met: 8.0, reps: 10 },
  83: { primary: ['quads', 'chest'], secondary: ['abs', 'deltoids', 'calves'], met: 8.0, reps: 10 },
  84: { primary: ['abs', 'quads'], secondary: ['deltoids', 'chest'], met: 8.0, reps: 12 },
  85: { primary: ['abs', 'deltoids'], secondary: ['quads', 'triceps'], met: 5.0, seconds: 30 },
  86: { primary: ['triceps', 'glutes'], secondary: ['abs', 'hamstrings'], met: 5.0, seconds: 30 },
  87: { primary: ['quads', 'deltoids'], secondary: ['glutes'], met: 5.0, reps: 12 },
  88: { primary: ['abs', 'quads'], secondary: ['glutes', 'deltoids'], met: 5.0, reps: 8 },
  89: { primary: ['abs'], secondary: ['adductors', 'deltoids'], met: 8.0, reps: 16 },
  90: { primary: ['abs'], secondary: ['deltoids', 'hamstrings'], met: 5.0, reps: 10 },
  91: { primary: ['quads', 'glutes'], secondary: ['calves', 'adductors'], met: 8.0, reps: 12 },

  // Cardio & Conditioning
  92: { primary: ['calves', 'deltoids'], secondary: ['adductors', 'quads'], met: 8.0, seconds: 40 },
  93: { primary: ['calves', 'deltoids'], secondary: ['adductors', 'quads'], met: 4.5, seconds: 40 },
  94: { primary: ['hip_flexors', 'quads'], secondary: ['calves', 'abs'], met: 8.0, seconds: 30 },
  95: { primary: ['hip_flexors', 'quads'], secondary: ['calves', 'abs'], met: 4.0, seconds: 40 },
  96: { primary: ['hamstrings'], secondary: ['calves', 'quads'], met: 8.0, seconds: 30 },
  97: { primary: ['hamstrings'], secondary: ['calves'], met: 3.5, seconds: 40 },
  98: { primary: ['glutes', 'quads'], secondary: ['adductors', 'calves'], met: 8.0, seconds: 30 },
  99: { primary: ['adductors', 'glutes'], secondary: ['quads'], met: 4.0, seconds: 40 },
  100: { primary: ['quads', 'glutes'], secondary: ['calves', 'hamstrings'], met: 8.0, reps: 12 },
  101: { primary: ['calves', 'quads'], secondary: ['hip_flexors'], met: 8.0, seconds: 25 },
  102: { primary: ['deltoids', 'obliques'], secondary: ['chest', 'abs'], met: 5.0, seconds: 40 },
  103: { primary: ['obliques', 'abs'], secondary: ['hip_flexors'], met: 4.0, seconds: 40 },

  // Stretch & Cool-Down
  104: { primary: ['erector_spinae'], secondary: ['lats', 'glutes'], met: 2.3, seconds: 30 },
  105: { primary: ['abs'], secondary: ['erector_spinae', 'chest'], met: 2.3, seconds: 25 },
  106: { primary: ['hamstrings', 'calves'], secondary: ['deltoids', 'lats'], met: 2.8, seconds: 30 },
  107: { primary: ['hamstrings'], secondary: ['erector_spinae', 'calves'], met: 2.3, seconds: 30 },
  108: { primary: ['hamstrings'], secondary: ['erector_spinae', 'calves'], met: 2.3, seconds: 30 },
  109: { primary: ['hamstrings'], secondary: ['calves'], met: 2.3, seconds: 25 },
  110: { primary: ['quads'], secondary: ['hip_flexors'], met: 2.3, seconds: 25 },
  111: { primary: ['hip_flexors'], secondary: ['quads', 'glutes'], met: 2.3, seconds: 25 },
  112: { primary: ['glutes'], secondary: ['hip_flexors'], met: 2.3, seconds: 25 },
  113: { primary: ['adductors'], secondary: ['glutes'], met: 2.3, seconds: 30 },
  114: { primary: ['chest'], secondary: ['deltoids', 'biceps'], met: 2.3, seconds: 25 },
  115: { primary: ['triceps'], secondary: ['traps', 'lats'], met: 2.3, seconds: 20 },
  116: { primary: ['neck'], secondary: ['traps'], met: 2.3, seconds: 20 },
  117: { primary: ['erector_spinae', 'obliques'], secondary: ['upper_back'], met: 2.5, reps: 10 },
  118: { primary: ['glutes'], secondary: ['erector_spinae', 'hamstrings'], met: 2.3, seconds: 25 },
  119: { primary: ['obliques'], secondary: ['erector_spinae', 'glutes'], met: 2.3, seconds: 25 },
};
