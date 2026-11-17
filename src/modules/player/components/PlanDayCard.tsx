import { router } from 'expo-router';
import { CalendarCheck, Moon, PartyPopper, Trophy } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { challengeGradients, radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, GradientBackground, Text } from '@/modules/core/ui';

import type { PlanDayOutcome } from '../planDay';

/** A small pop-in celebration; Reduce Motion shows it at once. */
function usePop(): Animated.Value {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let alive = true;
    const animation = Animated.spring(progress, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true });
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!alive) return;
      if (reduce) progress.setValue(1);
      else animation.start();
    }).catch(() => progress.setValue(1));
    return () => { alive = false; animation.stop(); };
  }, [progress]);
  return progress;
}

/** Finish-screen card for a plan day: "Day X done" with tomorrow, or "Plan complete". */
export function PlanDayCard({ outcome }: { outcome: PlanDayOutcome }) {
  const { colors } = useTheme();
  const pop = usePop();
  const plan = t(outcome.titleKey);
  const complete = outcome.kind === 'complete';
  const Icon = complete ? Trophy : PartyPopper;
  const title = complete ? t('player.finish.planCompleteTitle') : t('player.finish.dayDoneTitle', { day: outcome.day });
  const body = complete
    ? t('player.finish.planCompleteBody', { total: outcome.trainingDays, plan })
    : t('player.finish.dayDoneProgress', { done: outcome.doneDays, total: outcome.trainingDays, plan });
  return (
    <Animated.View accessible accessibilityLiveRegion="polite" accessibilityLabel={`${title}. ${body}`}
      style={[styles.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
      <GradientBackground stops={complete ? challengeGradients.orange : challengeGradients.blue} angle={135} />
      <View style={styles.head}>
        <View style={[styles.icon, { backgroundColor: colors.onPrimarySoft }]}>
          <Icon size={sizes.iconMd} color={colors.onPrimary} />
        </View>
        <View style={styles.grow}>
          <Text variant="h3" tone="onPrimary">{title}</Text>
          <Text tone="onPrimary">{body}</Text>
        </View>
      </View>
      {outcome.kind === 'next' ? <View style={[styles.next, { backgroundColor: colors.onPrimarySoft }]}>
        {outcome.tomorrowRest ? <Moon size={sizes.iconSm} color={colors.onPrimary} /> : <CalendarCheck size={sizes.iconSm} color={colors.onPrimary} />}
        <Text variant="bodyStrong" tone="onPrimary" style={styles.grow}>
          {outcome.tomorrowRest
            ? t('player.finish.tomorrowRest', { day: outcome.nextDay })
            : outcome.nextTitleKey
              ? t('player.finish.tomorrowDay', { day: outcome.nextDay, workout: t(outcome.nextTitleKey) })
              : t('player.finish.tomorrowDayOnly', { day: outcome.nextDay })}
        </Text>
      </View> : <Button label={t('player.finish.chooseNextPlan')} variant="secondary" onPress={() => router.replace('/plan')} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', borderRadius: radius.lg, overflow: 'hidden', padding: spacing[4], gap: spacing[3] },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  icon: { width: sizes.touchMin, height: sizes.touchMin, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1, gap: spacing[1] },
  next: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.md, padding: spacing[3] },
});
