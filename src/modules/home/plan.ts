import type { Challenge, Goal, Level } from '@/modules/content';

// Beginners start with the gentle two-week plan whose first days use level-one workouts.
const PLAN_BY_GOAL: Record<Goal, readonly [string, string, string]> = {
  keep_fit: ['ch_beginner_start_challenge', 'ch_full_body_challenge', 'ch_full_body_challenge'],
  build_muscle: ['ch_beginner_start_challenge', 'ch_full_body_challenge', 'ch_calisthenics_plan'],
  burn_fat: ['ch_beginner_start_challenge', 'ch_lose_weight_challenge', 'ch_lose_weight_challenge'],
  flexibility: ['ch_flexibility_mobility_challenge', 'ch_flexibility_mobility_challenge', 'ch_posture_stand_tall_challenge'],
};

export function recommendPlanId(goal: Goal, level: Level): string {
  const [beginner, intermediate, advanced] = PLAN_BY_GOAL[goal];
  return level === 3 ? advanced : level === 2 ? intermediate : beginner;
}

/** Profile rows store the level as a plain integer. */
export function toLevel(value: number | null | undefined): Level {
  return value === 2 || value === 3 ? value : 1;
}

export type PathState = 'done' | 'today' | 'rest' | 'upcoming';
export interface PathDay { day: number; state: PathState }

/** The seven-day block of a plan that contains its current day. */
export function planWeek(challenge: Challenge, currentDay: number, completed: ReadonlySet<number>): PathDay[] {
  const first = Math.floor((Math.min(currentDay, challenge.days) - 1) / 7) * 7 + 1;
  const days: PathDay[] = [];
  for (let day = first; day < first + 7 && day <= challenge.days; day += 1) {
    const rest = challenge.schedule.find((entry) => entry.day === day)?.rest === true;
    days.push({ day, state: completed.has(day) ? 'done' : day === currentDay ? 'today' : rest ? 'rest' : 'upcoming' });
  }
  return days;
}

export function trainingDays(challenge: Challenge): number {
  return challenge.schedule.filter((entry) => !entry.rest).length;
}

export type DayPart = 'morning' | 'afternoon' | 'evening';
export function dayPart(date: Date): DayPart {
  const hour = date.getHours();
  return hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
}
