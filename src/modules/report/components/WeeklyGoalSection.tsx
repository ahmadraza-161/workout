import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState, type ReactNode } from 'react';
import { Pencil } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, ProgressBar, Section, Sheet, SheetHeader, Stepper, Text, Touchable, WeekStrip, type WeekDay } from '@/modules/core/ui';
import { updateWeeklyTarget } from '@/modules/profile';

import { localDateOf, shiftLocalDate, type ReportSummary } from '../aggregates';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function WeeklyGoalSection({
  summary,
  today,
  onUpdated,
  showTodayPointer = false,
  coach,
}: {
  summary: ReportSummary;
  today: Date;
  onUpdated: () => void;
  showTodayPointer?: boolean;
  coach?: ReactNode;
}) {
  const sheet = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const [draftTarget, setDraftTarget] = useState(summary.weeklyGoal.target);
  const [error, setError] = useState(false);
  const { weeklyGoal } = summary;
  const todayDate = localDateOf(today);
  const doneDates = new Set(weeklyGoal.completedDates);
  const days: WeekDay[] = WEEKDAY_KEYS.map((key, offset) => {
    const date = shiftLocalDate(weeklyGoal.weekStart, offset);
    return {
      date: Number(date.slice(-2)),
      letter: showTodayPointer ? undefined : t(`report.day.${key}`),
      isToday: date === todayDate,
      state: doneDates.has(date) ? 'done' : date === todayDate ? 'today' : date < todayDate ? 'past' : 'future',
    };
  });

  const save = () => {
    try {
      updateWeeklyTarget(draftTarget);
      setError(false);
      sheet.current?.dismiss();
      onUpdated();
    } catch {
      setError(true);
    }
  };

  const edit = () => {
      setDraftTarget(weeklyGoal.target);
      setError(false);
      sheet.current?.present();
    };
  const content = showTodayPointer ? <Card style={styles.trainingCard}>
    <View style={styles.row}>
      <Text variant="h3" style={styles.grow}>{t('report.weeklyGoal')}</Text>
      <Touchable onPress={edit} accessibilityLabel={t('report.editWeeklyGoal')}>
        <View style={styles.row}><Text variant="bodyStrong" tone="brand">{weeklyGoal.done}/{weeklyGoal.target}</Text>
          <Pencil size={sizes.iconSm} color={colors.text.secondary} /></View>
      </Touchable>
    </View>
    <WeekStrip days={days} showTodayPointer accessibilityLabel={t('report.weeklyProgress', { done: weeklyGoal.done, target: weeklyGoal.target })} />
    {coach ? <View style={[styles.coach, { backgroundColor: colors.surface.muted }]}>{coach}
      <Text variant="bodyStrong" style={styles.grow}>{t('reportUi.motivation')}</Text></View> : null}
  </Card> : <Section title={t('report.weeklyGoal')} actionLabel={t('common.edit')} onAction={edit} headerPadding={spacing[0]}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="h3">{t('report.weeklyProgress', { done: weeklyGoal.done, target: weeklyGoal.target })}</Text>
          <Text variant="bodyStrong" tone="brand">{Math.round(weeklyGoal.done / weeklyGoal.target * 100)}%</Text>
        </View>
        <ProgressBar progress={weeklyGoal.done / weeklyGoal.target} height={spacing[1]} />
        <WeekStrip days={days} showTodayPointer={showTodayPointer} accessibilityLabel={t('report.weeklyProgress', { done: weeklyGoal.done, target: weeklyGoal.target })} />
      </Card>
    </Section>;
  return <>
    {content}
    <Sheet ref={sheet}>
        <View style={styles.sheet}>
          <SheetHeader title={t('report.editWeeklyGoal')} onClose={() => sheet.current?.dismiss()} />
          <Text tone="secondary">{t('report.goalHint')}</Text>
          <Stepper value={draftTarget} onChange={setDraftTarget} min={1} max={7} label={t('report.daysPerWeek')} />
          {error ? <Text tone="secondary">{t('report.saveFailed')}</Text> : null}
          <Button label={t('common.save')} onPress={save} />
        </View>
      </Sheet>
  </>;
}

const styles = StyleSheet.create({
  card: { gap: spacing[5] },
  trainingCard: { gap: spacing[2], padding: spacing[4] },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grow: { flex: 1 }, coach: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[3], borderRadius: radius.lg },
  sheet: { gap: spacing[5] },
});
