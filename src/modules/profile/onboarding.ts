import type { Goal, Level } from '@/modules/content';

export type Gender = 'male' | 'female' | 'unspecified';

export interface OnboardingDraft {
  gender: Gender;
  goal: Goal;
  level: Level;
  heightCm: string;
  weightKg: string;
  birthYear: string;
  daysPerWeekTarget: number;
  adultConfirmed: boolean;
  safetyAnswers: (boolean | null)[];
}

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
  gender: 'unspecified', goal: 'keep_fit', level: 1,
  heightCm: '', weightKg: '', birthYear: '', daysPerWeekTarget: 4,
  adultConfirmed: false,
  safetyAnswers: Array.from({ length: 7 }, () => null),
};

export interface ProfileValues {
  gender: Gender;
  goal: Goal;
  level: Level;
  heightCm: number | null;
  weightKg: number | null;
  birthYear: number | null;
  daysPerWeekTarget: number;
}

function optionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

/** Returns the field that needs correction before profile data is stored. */
export function validateOnboarding(draft: OnboardingDraft, currentYear: number):
  { value: ProfileValues; error: null } | { value: null; error: 'height' | 'weight' | 'birthYear' | 'weeklyTarget' | 'adult' | 'safety' } {
  const heightCm = optionalNumber(draft.heightCm);
  const weightKg = optionalNumber(draft.weightKg);
  const birthYear = optionalNumber(draft.birthYear);
  if (heightCm !== null && (!Number.isFinite(heightCm) || heightCm < 90 || heightCm > 250)) {
    return { value: null, error: 'height' };
  }
  if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 400)) {
    return { value: null, error: 'weight' };
  }
  if (birthYear !== null && (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear - 18)) {
    return { value: null, error: 'birthYear' };
  }
  if (!Number.isInteger(draft.daysPerWeekTarget) || draft.daysPerWeekTarget < 1 || draft.daysPerWeekTarget > 7) {
    return { value: null, error: 'weeklyTarget' };
  }
  if (!draft.adultConfirmed) return { value: null, error: 'adult' };
  if (draft.safetyAnswers.length !== 7 || draft.safetyAnswers.some((answer) => answer === null)) {
    return { value: null, error: 'safety' };
  }
  return {
    value: { gender: draft.gender, goal: draft.goal, level: draft.level,
      heightCm, weightKg, birthYear, daysPerWeekTarget: draft.daysPerWeekTarget },
    error: null,
  };
}
