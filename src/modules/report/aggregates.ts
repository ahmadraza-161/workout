export type ReportPeriod = 'week' | 'month' | 'total';

export interface ReportSession {
  localDate: string;
  completionPct: number;
  durationSec: number;
  kcal: number;
}

export interface ReportSummary {
  totals: { workouts: number; minutes: number; kcal: number };
  streak: { current: number; longest: number };
  weeklyGoal: { done: number; target: number; completedDates: string[]; weekStart: string };
}

const QUALIFYING_COMPLETION = 50;

export function localDateOf(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calendar arithmetic runs in UTC after extracting the device's local date,
// so a daylight-saving transition cannot shorten or repeat a streak day.
export function shiftLocalDate(localDate: string, days: number): string {
  const year = Number(localDate.slice(0, 4));
  const month = Number(localDate.slice(5, 7));
  const day = Number(localDate.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function getWeekStart(today: Date): string {
  const date = localDateOf(today);
  return shiftLocalDate(date, -today.getDay());
}

export function buildReportSummary(
  rows: ReportSession[],
  period: ReportPeriod,
  target: number,
  today: Date,
): ReportSummary {
  const todayDate = localDateOf(today);
  const weekStart = getWeekStart(today);
  const periodStart = period === 'week'
    ? weekStart
    : period === 'month'
      ? `${todayDate.slice(0, 7)}-01`
      : null;
  const visible = rows.filter((row) => row.localDate <= todayDate && (!periodStart || row.localDate >= periodStart));
  const completedDates = [...new Set(rows
    .filter((row) => row.completionPct >= QUALIFYING_COMPLETION && row.localDate <= todayDate)
    .map((row) => row.localDate))].sort();
  const completedSet = new Set(completedDates);
  let longest = 0;
  let run = 0;
  let previous = '';
  for (const date of completedDates) {
    run = previous && shiftLocalDate(previous, 1) === date ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  const yesterday = shiftLocalDate(todayDate, -1);
  let cursor = completedSet.has(todayDate) ? todayDate : yesterday;
  let current = 0;
  while (completedSet.has(cursor)) {
    current += 1;
    cursor = shiftLocalDate(cursor, -1);
  }
  const weekEnd = shiftLocalDate(weekStart, 6);
  const weeklyDates = completedDates.filter((date) => date >= weekStart && date <= weekEnd);

  return {
    totals: {
      workouts: visible.filter((row) => row.completionPct > 0).length,
      minutes: Math.round(visible.reduce((sum, row) => sum + row.durationSec, 0) / 60),
      kcal: Math.round(visible.reduce((sum, row) => sum + row.kcal, 0)),
    },
    streak: { current, longest },
    weeklyGoal: { done: weeklyDates.length, target: Math.min(7, Math.max(1, target)), completedDates: weeklyDates, weekStart },
  };
}
