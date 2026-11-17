import { Check, Moon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Text, Touchable } from '@/modules/core/ui';

import type { PathDay, PathState } from '../plan';

const STATE_KEYS: Record<PathState, string> = { done: 'home.pathDone', today: 'home.pathToday', rest: 'home.pathRest', upcoming: 'home.pathUpcoming' };

/** A connected row of plan days so beginners can see where they are and what comes next. */
export function PlanPath({ days, onPress }: { days: PathDay[]; onPress?: () => void }) {
  const { colors } = useTheme();
  const nodes = <View style={styles.row}>{days.map((day, index) => {
    const today = day.state === 'today';
    const fill = day.state === 'done' ? colors.semantic.success : today ? colors.primary : colors.surface.muted;
    return <View key={day.day} style={[styles.cell, index === 0 && styles.first]}>
      {index > 0 ? <View style={[styles.line, { backgroundColor: days[index - 1]!.state === 'done'
        ? colors.semantic.success : colors.line.divider }]} /> : null}
      <View accessible accessibilityLabel={t('home.pathDay', { day: day.day, state: t(STATE_KEYS[day.state]) })}
        style={[styles.node, today && [styles.today, { borderColor: colors.primaryBorderSoft }], { backgroundColor: fill }]}>
        {day.state === 'done' ? <Check size={sizes.iconMd} color={colors.onPrimary} strokeWidth={3} />
          : day.state === 'rest' ? <Moon size={sizes.iconSm} color={colors.text.secondary} />
            : <Text variant="title" style={{ color: today ? colors.onPrimary : colors.text.secondary }}>{day.day}</Text>}
      </View>
    </View>;
  })}</View>;
  return onPress ? <Touchable onPress={onPress} accessibilityRole="button" accessibilityLabel={t('home.seePlan')}>{nodes}</Touchable> : nodes;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  first: { flex: 0 },
  line: { flex: 1, height: spacing[1], borderRadius: radius.pill, marginHorizontal: spacing[0.5] },
  node: { width: sizes.buttonSm, height: sizes.buttonSm, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  today: { width: sizes.touchMin, height: sizes.touchMin, borderWidth: spacing[1] },
});
