import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { spacing, useTheme } from '../theme';
import { Text } from './Text';

const TICK_GAP = 8;
const MINOR = { height: 24, width: 1 };
const MAJOR = { height: 44, width: 2 };

// Horizontal ruler for the weight sheet (DESIGN §4.2): a minor tick every 0.1
// and a labelled major tick every 1.0, with a brand centre indicator.
export interface RulerPickerProps {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  /** Shown above the ruler next to the value, e.g. "kg" or "lbs". */
  unit: string;
  accessibilityLabel: string;
}

export function RulerPicker({ value, onChange, min, max, unit, accessibilityLabel }: RulerPickerProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  // One tick per 0.1 of a unit.
  const ticks = useMemo(() => Math.round((max - min) * 10) + 1, [max, min]);
  const offsetFor = useCallback((v: number) => Math.round((v - min) * 10) * TICK_GAP, [min]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: offsetFor(value), animated: false });
    // Only on mount: later changes come from the user scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / TICK_GAP);
      const next = Math.min(max, Math.max(min, min + index / 10));
      // Avoid 0.30000000000000004 from float arithmetic.
      const rounded = Math.round(next * 10) / 10;
      if (rounded !== value) onChange(rounded);
    },
    [max, min, onChange, value],
  );

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: `${value} ${unit}` }}
    >
      <View style={styles.valueRow}>
        <Text variant="metricXL">{value.toFixed(1)}</Text>
        <Text variant="button" tone="secondary">
          {unit}
        </Text>
      </View>

      <View style={styles.rulerRow}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_GAP}
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={{ paddingHorizontal: width / 2 }}
        >
          {Array.from({ length: ticks }, (_, index) => {
            const isMajor = index % 10 === 0;
            const shape = isMajor ? MAJOR : MINOR;
            return (
              <View key={index} style={styles.tickColumn}>
                {isMajor ? (
                  <Text variant="button" tone="secondary" style={styles.tickLabel}>
                    {(min + index / 10).toFixed(0)}
                  </Text>
                ) : (
                  <View style={styles.tickLabelSpacer} />
                )}
                <View
                  style={{ width: shape.width, height: shape.height, backgroundColor: colors.line.rulerTick }}
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.indicator, { backgroundColor: colors.primary }]} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: spacing[2] },
  rulerRow: { height: 80, justifyContent: 'flex-end' },
  tickColumn: { width: TICK_GAP, alignItems: 'center', justifyContent: 'flex-end' },
  tickLabel: { position: 'absolute', top: 0 },
  tickLabelSpacer: { height: 0 },
  indicator: { position: 'absolute', left: '50%', bottom: 0, width: 2, height: 56 },
});
