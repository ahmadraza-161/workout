import { StyleSheet, View } from 'react-native';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Card, Divider, StreakFlame, Text, WeekStrip } from '@/modules/core/ui';
import { localDateOf, shiftLocalDate, type ReportSummary } from '../aggregates';

export function ReportHistoryCard({ summary, today }: { summary: ReportSummary; today: Date }) {
  const todayDate = localDateOf(today);
  const completed = new Set(summary.weeklyGoal.completedDates);
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((key, offset) => {
    const date = shiftLocalDate(summary.weeklyGoal.weekStart, offset);
    return { date: Number(date.slice(-2)), letter: t(`report.day.${key}`), isToday: date === todayDate,
      state: completed.has(date) ? 'done' as const : date === todayDate ? 'today' as const : date < todayDate ? 'past' as const : 'future' as const };
  });
  return <Card style={styles.card}>
    <WeekStrip days={days} accessibilityLabel={t('report.weeklyProgress', { done: summary.weeklyGoal.done, target: summary.weeklyGoal.target })} />
    <Divider />
    <View style={styles.row}>
      <View style={styles.metric}><Text variant="caption" tone="secondary">{t('report.currentStreak')}</Text><StreakFlame count={summary.streak.current} /></View>
      <View style={[styles.metric, styles.end]}><Text variant="caption" tone="secondary">{t('reportUi.bestStreak')}</Text>
        <Text variant="title">{t('reportUi.streakDays', { count: summary.streak.longest })}</Text></View>
    </View>
  </Card>;
}
const styles = StyleSheet.create({ card: { gap: spacing[6] }, row: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { gap: spacing[2] }, end: { alignItems: 'flex-end' } });
