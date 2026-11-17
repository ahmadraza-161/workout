import { router, useIsFocused } from 'expo-router';
import { Clock3, Dumbbell, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AchievementsPreview, refreshAchievements } from '@/modules/achievements';
import { sessionWorkoutTitle } from '../workoutTitle';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Card, EmptyState, ErrorState, Row, Screen, Section, SegmentedControl, StatCard, StreakFlame, TabHeader, Text } from '@/modules/core/ui';
import { getProfile } from '@/modules/profile';

import { buildReportSummary, type ReportPeriod } from '../aggregates';
import { summarizeWeight } from '../measurements';
import { derivePersonalBests } from '../records';
import { getWeightUnit, listRecentSessions, listRecordItems, listReportSessions, listWeightLogs } from '../repository';
import { BmiSection } from './BmiSection';
import { PersonalBestSection } from './PersonalBestSection';
import { WeeklyGoalSection } from './WeeklyGoalSection';
import { WeightSection } from './WeightSection';
import { ReportHistoryCard } from './ReportHistoryCard';

const PERIODS: ReportPeriod[] = ['week', 'month', 'total'];

export function ReportScreen() {
  const focused = useIsFocused();
  const [period, setPeriod] = useState<ReportPeriod>('total');
  const [, setRevision] = useState(0);
  const data = (() => {
      if (!focused) return null;
      try {
        const today = new Date();
        const rows = listReportSessions();
        const profile = getProfile();
        const weightLogs = listWeightLogs();
        const achievements = refreshAchievements();
        return {
          today,
          summary: buildReportSummary(rows, period, profile?.daysPerWeekTarget ?? 4, today),
          bests: derivePersonalBests(rows, listRecordItems()),
          sessions: listRecentSessions(),
          weightLogs,
          weightUnit: getWeightUnit(),
          profile,
          achievements: achievements.badges,
        };
      } catch {
        return 'error' as const;
      }
  })();
  if (!data) return <Screen>{null}</Screen>;
  if (data === 'error') return <Screen><ErrorState onRetry={() => setRevision((value) => value + 1)} /></Screen>;

  return (
    <Screen scroll>
      <View style={styles.content}>
        <TabHeader title={t('tabs.report')} />
        <StatCard stats={[
          { icon: Dumbbell, value: String(data.summary.totals.workouts), label: t('report.workouts') },
          { icon: Flame, value: String(data.summary.totals.kcal), label: t('report.kcal') },
          { icon: Clock3, value: String(data.summary.totals.minutes), label: t('report.minutes') },
        ]} />
        <Section title={t('report.history.title')} actionLabel={t('report.history.allRecords')}
          onAction={() => router.push('/history')} headerPadding={spacing[0]}>
          <ReportHistoryCard summary={data.summary} today={data.today} />
        </Section>
        <WeightSection entries={data.weightLogs} profileWeightKg={data.profile?.weightKg ?? null}
          unit={data.weightUnit} onUpdated={() => setRevision((value) => value + 1)} />
        <BmiSection weightKg={summarizeWeight(data.weightLogs).currentKg ?? data.profile?.weightKg ?? null}
          heightCm={data.profile?.heightCm ?? null} unit={data.weightUnit} onUpdated={() => setRevision((value) => value + 1)} />
        <View style={styles.period}>
          <Text variant="h3">{t('report.periodLabel')}</Text>
          <SegmentedControl options={PERIODS.map((value) => ({ value, label: t(`report.period.${value}`) }))}
            value={period} onChange={setPeriod} accessibilityLabel={t('report.periodLabel')} />
        </View>
        <WeeklyGoalSection summary={data.summary} today={data.today} onUpdated={() => setRevision((value) => value + 1)} />
        <Section title={t('report.streak')} headerPadding={spacing[0]}>
          <Card style={styles.streakCard}>
            <StreakFlame count={data.summary.streak.current} />
            <Text tone="secondary">{t('report.currentStreak')}</Text>
            <Text tone="secondary">{t('report.longestStreak', { count: data.summary.streak.longest })}</Text>
          </Card>
        </Section>
        <PersonalBestSection bests={data.bests} />
        <Section title={t('reportUi.recent')} actionLabel={t('report.history.allRecords')}
          onAction={() => router.push('/history')} headerPadding={spacing[0]}>
          {data.sessions.length === 0 ? (
            <EmptyState title={t('report.emptyTitle')} body={t('report.emptyBody')} />
          ) : (
            data.sessions.map((session) => (
              <Row
                key={session.id}
                title={sessionWorkoutTitle(session.workoutId)}
                meta={[session.localDate, t('browse.minutes', { count: Math.round(session.durationSec / 60) })]}
                container="card"
                onPress={() => router.push({ pathname: '/session/[id]', params: { id: session.id } })}
              />
            ))
          )}
        </Section>
        <AchievementsPreview badges={data.achievements} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing[6], paddingBottom: spacing[8] },
  period: { gap: spacing[3] },
  streakCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
