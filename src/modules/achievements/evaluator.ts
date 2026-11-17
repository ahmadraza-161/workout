import type { Achievement, Challenge, Exercise, Workout } from '@/modules/content';

function shiftDate(localDate: string, days: number): string {
  const year = Number(localDate.slice(0, 4));
  const month = Number(localDate.slice(5, 7));
  const day = Number(localDate.slice(8, 10));
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export interface AchievementSession {
  id: string;
  workoutId: string;
  challengeId: string | null;
  day: number | null;
  startedAt: number;
  endedAt: number | null;
  localDate: string;
  completionPct: number;
  durationSec: number;
}

export interface AchievementItem {
  sessionId: string;
  exerciseId: string;
  doneSeconds: number;
  doneReps: number | null;
  skipped: boolean;
}

export interface AchievementRun {
  challengeId: string;
  startedAt: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface AchievementFacts {
  sessions: AchievementSession[];
  items: AchievementItem[];
  runs: AchievementRun[];
  customWorkoutCount: number;
  weeklyTarget: number;
  exercises: Exercise[];
  workouts: Workout[];
  challenges: Challenge[];
  today: Date;
}

function longestRun(dates: string[], step = 1): number {
  let longest = 0;
  let current = 0;
  let previous = '';
  for (const date of dates) {
    current = previous && shiftDate(previous, step) === date ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = date;
  }
  return longest;
}

function weeklyGoalRun(dates: string[], target: number): number {
  const weekly = new Map<string, Set<string>>();
  for (const date of dates) {
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    const start = shiftDate(date, -day);
    if (!weekly.has(start)) weekly.set(start, new Set());
    weekly.get(start)!.add(date);
  }
  return longestRun([...weekly.entries()].filter(([, days]) => days.size >= target)
    .map(([start]) => start).sort(), 7);
}

function completedChallengeLengths(facts: AchievementFacts): number[] {
  const byId = new Map(facts.challenges.map((challenge) => [challenge.id, challenge]));
  return facts.runs.flatMap((run) => {
    if (run.status === 'abandoned') return [];
    const challenge = byId.get(run.challengeId);
    if (!challenge) return [];
    const days = new Set(facts.sessions.filter((session) => session.challengeId === run.challengeId &&
      session.startedAt >= run.startedAt && session.completionPct === 100 && session.endedAt !== null)
      .map((session) => session.day));
    return challenge.schedule.every((entry) => entry.rest || days.has(entry.day)) ? [challenge.days] : [];
  });
}

/** Evaluates all authored badge rules against saved, local workout data. */
export function evaluateAchievements(rules: readonly Achievement[], facts: AchievementFacts): Set<string> {
  const today = `${facts.today.getFullYear()}-${String(facts.today.getMonth() + 1).padStart(2, '0')}-${String(facts.today.getDate()).padStart(2, '0')}`;
  const sessions = facts.sessions.filter((row) => row.localDate <= today);
  const qualifying = sessions.filter((row) => row.completionPct >= 50 && row.endedAt !== null);
  const dates = [...new Set(qualifying.map((row) => row.localDate))].sort();
  const played = new Set(sessions.map((row) => row.id));
  const items = facts.items.filter((item) => played.has(item.sessionId) && !item.skipped &&
    (item.doneSeconds > 0 || (item.doneReps ?? 0) > 0));
  const exerciseIds = new Set(items.map((item) => item.exerciseId));
  const workoutFocus = new Map(facts.workouts.map((workout) => [workout.id, workout.bodyFocus]));
  const challengeFocus = new Map(facts.challenges.map((challenge) => [challenge.id, challenge.bodyFocus]));
  const focuses = new Set(qualifying.map((row) => workoutFocus.get(row.workoutId) ??
    (row.challengeId ? challengeFocus.get(row.challengeId) : undefined)).filter(Boolean));
  const challengeLengths = completedChallengeLengths(facts);
  const firstWeek = dates.length ? dates.filter((date) => date < shiftDate(dates[0]!, 7)).length : 0;
  const goalRun = weeklyGoalRun(dates, Math.min(7, Math.max(1, facts.weeklyTarget)));

  function value(rule: Achievement): number {
    const ids = new Set(rule.scope?.exercises?.map((number) => facts.exercises[number - 1]?.id));
    switch (rule.metric) {
      case 'workouts': return qualifying.length;
      case 'challenge_days': return sessions.filter((row) => row.challengeId && row.day === 1 && row.completionPct === 100).length;
      case 'streak': return longestRun(dates);
      case 'distinct_days': return dates.length;
      case 'minutes': return Math.floor(qualifying.reduce((sum, row) => sum + row.durationSec, 0) / 60);
      case 'best_reps': return Math.max(0, ...items.filter((item) => ids.has(item.exerciseId)).map((item) => item.doneReps ?? 0));
      case 'best_hold': return Math.max(0, ...items.filter((item) => ids.has(item.exerciseId)).map((item) => item.doneSeconds));
      case 'distinct_exercises': return exerciseIds.size;
      case 'distinct_focuses': return focuses.size;
      case 'custom_workouts_saved': return facts.customWorkoutCount;
      case 'challenges_by_length': return challengeLengths.filter((days) => rule.scope?.minDays === 14 ? days <= 21 : days >= (rule.scope?.minDays ?? 28)).length;
      case 'weekly_goals_in_a_row': return goalRun;
      case 'session_before_hour': return qualifying.some((row) => new Date(row.endedAt!).getHours() < rule.threshold) ? rule.threshold : 0;
      case 'session_after_hour': return qualifying.some((row) => new Date(row.endedAt!).getHours() >= rule.threshold) ? rule.threshold : 0;
      case 'days_within_window': return rule.scope?.windowDays === 7 ? firstWeek : 0;
    }
  }

  return new Set(rules.filter((rule) => value(rule) >= rule.threshold).map((rule) => rule.id));
}
