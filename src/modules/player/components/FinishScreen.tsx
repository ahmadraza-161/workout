import { router } from 'expo-router';
import { Clock3, Dumbbell, Flame, Trophy } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type Svg from 'react-native-svg';

import { t } from '@/modules/core/i18n';
import { gradients, radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, GradientBackground, StackHeader, StatCard, Text, TimerRing } from '@/modules/core/ui';

import type { SessionSummary } from '../summary';
import type { PlanDayOutcome } from '../planDay';
import type { CompletionProgress, WorkoutFeedback } from '../repository';
import { shareWorkoutCard } from '../share';
import { PlanDayCard } from './PlanDayCard';
import { ShareCard } from './ShareCard';

export function FinishScreen({ completedCount, summary, progress, planDay = null, feedback, saveStatus, returnToChallenge, onRetry, onFeedback, onClose }: {
  completedCount: number;
  summary: SessionSummary | null;
  progress: CompletionProgress | null;
  /** Set after a fully completed plan day. */
  planDay?: PlanDayOutcome | null;
  feedback: WorkoutFeedback | null;
  saveStatus: 'saving' | 'saved' | 'error';
  returnToChallenge: boolean;
  onRetry: () => void;
  onFeedback: (feedback: WorkoutFeedback) => void;
  onClose: () => void;
}) {
  const { colors, isDark } = useTheme();
  const shareCard = useRef<Svg>(null);
  const shareInProgress = useRef(false);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState(false);
  const minutes = summary ? Math.round(summary.durationSec / 60) : 0;
  const kcal = summary ? Math.round(summary.kcal) : 0;
  async function share(): Promise<void> {
    if (!summary || shareInProgress.current) return;
    shareInProgress.current = true;
    setSharing(true); setShareError(false);
    try { await shareWorkoutCard(shareCard.current, { completedCount, summary, progress }); }
    catch { setShareError(true); }
    finally { shareInProgress.current = false; setSharing(false); }
  }
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.fill}>
      <GradientBackground stops={isDark ? gradients.finishDark : gradients.finishLight} angle={180} />
      {summary ? <ShareCard ref={shareCard} completedCount={completedCount} summary={summary} progress={progress} /> : null}
      <ScrollView contentContainerStyle={styles.scroll}>
        <StackHeader title={t('player.title')} onBack={onClose} />
        <View style={styles.body}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface.default }]}>
            <Trophy size={sizes.touchMin} color={colors.primary} />
          </View>
          <Text variant="h1" style={styles.center}>{t('player.complete')}</Text>
          <Text tone="secondary" style={styles.center}>{t('player.finish.completed', { count: completedCount })}</Text>
          {planDay && saveStatus === 'saved' ? <PlanDayCard outcome={planDay} /> : null}
          <View style={styles.stats}>
            <StatCard stats={[
              { icon: Dumbbell, value: String(completedCount), label: t('player.finish.exercises') },
              { icon: Clock3, value: String(minutes), label: t('report.minutes') },
              { icon: Flame, value: String(kcal), label: t('report.kcal') },
            ]} />
          </View>
          {progress ? <View style={styles.progress}>
            <TimerRing progress={progress.weeklyDone / Math.max(1, progress.weeklyTarget)}>
              <Text variant="h3">{`${progress.weeklyDone}/${progress.weeklyTarget}`}</Text>
            </TimerRing>
            <Text variant="bodyStrong">{t('player.finish.streak', { count: progress.streak })}</Text>
            <Text tone="secondary">{t('player.finish.weeklyGoal', { done: progress.weeklyDone, target: progress.weeklyTarget })}</Text>
          </View> : null}
          <Text variant="caption" tone="secondary" style={styles.center}>{t(`player.saveStatus.${saveStatus}`)}</Text>
        </View>
        <View style={styles.actions}>
          {saveStatus === 'error' ? <Button label={t('common.retry')} onPress={onRetry} /> : null}
          {saveStatus === 'saved' ? <Button label={t('player.finish.share')} loading={sharing} onPress={() => { void share(); }} /> : null}
          {shareError ? <Text tone="secondary" accessibilityLiveRegion="polite">{t('player.finish.shareError')}</Text> : null}
          {saveStatus === 'saved' ? <View style={styles.feedback}>
            <Text variant="bodyStrong">{t('player.finish.feedbackTitle')}</Text>
            <View style={styles.feedbackActions}>
              {(['too_easy', 'just_right', 'too_hard'] as const).map((option) => <Button key={option}
                label={t(`player.finish.feedback.${option}`)} variant="secondary" disabled={feedback === option}
                onPress={() => onFeedback(option)} />)}
            </View>
          </View> : null}
          <Button label={t(returnToChallenge ? 'player.finish.viewChallenge' : 'player.finish.viewReport')}
            onPress={onClose} disabled={saveStatus !== 'saved'} />
          <Button label={t('player.finish.browse')} variant="secondary"
            onPress={() => router.replace('/(tabs)/discover')} disabled={saveStatus !== 'saved'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: sizes.screenPadding, paddingBottom: spacing[8] },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[5], paddingVertical: spacing[8] },
  iconCircle: { width: sizes.finishIcon, height: sizes.finishIcon, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  stats: { width: '100%' },
  progress: { alignItems: 'center', gap: spacing[1] },
  actions: { gap: spacing[3] },
  feedback: { gap: spacing[2] },
  feedbackActions: { gap: spacing[2] },
});
