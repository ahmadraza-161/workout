import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, useTheme } from '../theme';
import { Text } from './Text';

export interface WeekDay {
  /** Day of month shown in the cell. */
  date: number;
  /** Single letter above the date (Report history only). */
  letter?: string;
  state: 'past' | 'today' | 'future' | 'done';
  isToday?: boolean;
}

// Seven day cells. The reference uses this twice with different trimmings:
// the Training weekly goal (dates only, today ringed with a pointer) and the
// Report history (letters above, completed days filled with a check).
// One component, two flags (DESIGN §4.3, §4.5).
export interface WeekStripProps {
  days: WeekDay[];
  /** Adds the small pointer under today, as on the Training weekly goal card. */
  showTodayPointer?: boolean;
  accessibilityLabel?: string;
}

export function WeekStrip({ days, showTodayPointer = false, accessibilityLabel }: WeekStripProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.strip} accessible accessibilityLabel={accessibilityLabel}>
      {days.map((day) => (
        <View key={day.date} style={styles.column}>
          {day.letter ? (
            <Text variant="caption" tone="secondary">
              {day.letter}
            </Text>
          ) : null}

          <View
            style={[
              styles.cell,
              (day.isToday ?? day.state === 'today') && { borderWidth: 2, borderColor: colors.primaryBorderSoft },
              day.state === 'done' && { backgroundColor: colors.primaryFill },
            ]}
          >
            {day.state === 'done' ? (
              <Check size={20} color={colors.onPrimary} />
            ) : (
              <Text
                variant="listTitle"
                tone={day.state === 'future' ? 'tertiary' : day.state === 'today' ? 'brand' : 'primary'}
              >
                {day.date}
              </Text>
            )}
          </View>

          {showTodayPointer && (day.isToday ?? day.state === 'today') ? (
            <View style={[styles.pointer, { borderTopColor: colors.primaryBorderSoft }]} />
          ) : (
            <View style={styles.pointer} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row' },
  column: { flex: 1, alignItems: 'center', gap: 4 },
  cell: { width: '100%', maxWidth: sizes.quickChip, aspectRatio: 1, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
});
