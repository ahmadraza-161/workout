import { router } from 'expo-router';
import { Check, Coffee, Lock } from 'lucide-react-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { getChallengeDayWorkout, type Challenge } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Text, Touchable } from '@/modules/core/ui';

import type { ChallengeProgress } from '../repository';

export function ChallengeDayGrid({ challenge, progress, disabled, onStart }: {
  challenge: Challenge; progress: ChallengeProgress | null; disabled: boolean; onStart: () => void;
}) {
  const { colors } = useTheme();
  const { width: windowWidth, fontScale } = useWindowDimensions();
  const width = Math.min(windowWidth, sizes.contentMax) - sizes.screenPadding * 2;
  const minimumCell = sizes.touchMin * Math.max(1, fontScale);
  const columns = Math.max(1, Math.floor((width + spacing[2]) / (minimumCell + spacing[2])));
  const cellWidth = (width - (columns - 1) * spacing[2]) / columns;
  const current = progress?.currentDay ?? 1;
  return <View style={styles.grid}>{challenge.schedule.map((day) => {
    const done = progress?.completedDays.has(day.day) ?? false;
    const isCurrent = day.day === current && !day.rest && (!progress || progress.status === 'active');
    const workout = getChallengeDayWorkout(challenge.id, day.day);
    const unlocked = !disabled && (isCurrent || done) && !!workout;
    const status = day.rest ? t('challengeUi.rest') : done ? t('challengeUi.completed') : isCurrent ? t('challengeUi.current') : t('challengeUi.locked');
    const Icon = day.rest ? Coffee : done ? Check : !isCurrent ? Lock : null;
    return <Touchable key={day.day} disabled={!unlocked} accessibilityLabel={`${t('challengeUi.day', { count: day.day })}, ${status}`}
      accessibilityHint={unlocked ? workout ? t(workout.titleKey) : undefined : undefined}
      onPress={isCurrent ? onStart : workout ? () => router.push({ pathname: '/workout/[id]', params: { id: workout.id } }) : undefined}
      style={[styles.cell, { width: cellWidth, minHeight: minimumCell + spacing[6], backgroundColor: isCurrent ? colors.primaryTint : colors.surface.row,
        borderColor: isCurrent ? colors.primary : colors.line.divider }]}>
      <Text variant="title" tone={isCurrent ? 'brand' : 'primary'}>{String(day.day)}</Text>
      {Icon ? <Icon size={sizes.iconSm} color={done ? colors.semantic.successText : colors.text.secondary} /> : <Text variant="micro" tone="brand">{t('challengeUi.current')}</Text>}
    </Touchable>;
  })}</View>;
}
const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }, cell: { borderWidth: 1, borderRadius: radius.md, padding: spacing[1], alignItems: 'center', justifyContent: 'center', gap: spacing[1] } });
