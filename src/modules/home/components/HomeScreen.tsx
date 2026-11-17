import { useIsFocused } from 'expo-router';
import { useState } from 'react';

import { getActivePlan } from '@/modules/challenges';
import { ErrorState, Screen } from '@/modules/core/ui';
import { getProfile } from '@/modules/profile';
import { buildReportSummary, listReportSessions, localDateOf } from '@/modules/report';

import { PlanHome } from './PlanHome';
import { WelcomeHome } from './WelcomeHome';

function loadHome() {
  const today = new Date();
  const profile = getProfile();
  const sessions = listReportSessions();
  const summary = buildReportSummary(sessions, 'week', profile?.daysPerWeekTarget ?? 4, today);
  const todayKey = localDateOf(today);
  return { today, profile, plan: getActivePlan(), sessions: sessions.length, streak: summary.streak.current,
    doneToday: sessions.some((session) => session.localDate === todayKey && session.completionPct === 100) };
}

/** New users get a welcome with one recommended plan; returning users get today's plan day. */
export function HomeScreen() {
  // Focus changes re-render Home, so a finished workout or a new plan shows on return.
  useIsFocused();
  const [, setRevision] = useState(0);
  const home = (() => { try { return loadHome(); } catch { return 'error' as const; } })();
  if (home === 'error') return <Screen><ErrorState onRetry={() => setRevision((value) => value + 1)} /></Screen>;
  return !home.plan && home.sessions === 0
    ? <WelcomeHome profile={home.profile} />
    : <PlanHome plan={home.plan} streak={home.streak} doneToday={home.doneToday} today={home.today} />;
}
