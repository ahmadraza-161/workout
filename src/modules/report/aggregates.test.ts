import { buildReportSummary, getWeekStart, shiftLocalDate, type ReportSession } from './aggregates';

function session(localDate: string, completionPct = 100, durationSec = 600, kcal = 40): ReportSession {
  return { localDate, completionPct, durationSec, kcal };
}

describe('report aggregates', () => {
  it('uses a Sunday-start week across the year boundary', () => {
    const today = new Date(2027, 0, 2, 12);
    const rows = [session('2026-12-26'), session('2026-12-27'), session('2026-12-31'), session('2027-01-02')];
    expect(getWeekStart(today)).toBe('2026-12-27');
    expect(buildReportSummary(rows, 'week', 4, today).totals.workouts).toBe(3);
    expect(buildReportSummary(rows, 'month', 4, today).totals.workouts).toBe(1);
    expect(buildReportSummary(rows, 'total', 4, today).totals.workouts).toBe(4);
  });

  it('counts qualifying days once and ignores attempts under 50 percent for goals and streaks', () => {
    const today = new Date(2026, 8, 29, 12);
    const rows = [
      session('2026-09-27'), session('2026-09-27'), session('2026-09-28', 49), session('2026-09-29'),
    ];
    const summary = buildReportSummary(rows, 'week', 3, today);
    expect(summary.weeklyGoal.done).toBe(2);
    expect(summary.weeklyGoal.completedDates).toEqual(['2026-09-27', '2026-09-29']);
    expect(summary.streak).toEqual({ current: 1, longest: 1 });
    expect(summary.totals).toEqual({ workouts: 4, minutes: 40, kcal: 160 });
  });

  it('keeps a streak through yesterday and resets it after a missed day', () => {
    const rows = [session('2026-09-25'), session('2026-09-26'), session('2026-09-27')];
    expect(buildReportSummary(rows, 'total', 4, new Date(2026, 8, 28, 12)).streak).toEqual({ current: 3, longest: 3 });
    expect(buildReportSummary(rows, 'total', 4, new Date(2026, 8, 29, 12)).streak).toEqual({ current: 0, longest: 3 });
  });

  it('crosses leap-day and month boundaries without time-of-day arithmetic', () => {
    expect(shiftLocalDate('2028-02-28', 1)).toBe('2028-02-29');
    expect(shiftLocalDate('2028-02-29', 1)).toBe('2028-03-01');
    const rows = [session('2028-02-28'), session('2028-02-29'), session('2028-03-01')];
    expect(buildReportSummary(rows, 'month', 4, new Date(2028, 2, 1, 12)).streak).toEqual({ current: 3, longest: 3 });
    expect(buildReportSummary(rows, 'month', 4, new Date(2028, 2, 1, 12)).totals.workouts).toBe(1);
  });

  it('excludes future records and caps an invalid stored weekly target', () => {
    const summary = buildReportSummary([session('2026-09-30')], 'total', 99, new Date(2026, 8, 29, 12));
    expect(summary.totals.workouts).toBe(0);
    expect(summary.streak.current).toBe(0);
    expect(summary.weeklyGoal).toMatchObject({ done: 0, target: 7 });
  });
});
