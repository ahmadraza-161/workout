import { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { radius, useTheme } from '../theme';
import { Text } from './Text';

const ROW = 64;
const VISIBLE = 3;

// Wheel picker (DESIGN §4.2): three visible rows of 64 dp, the middle one
// highlighted. Used for rest and prep times and for the time picker.
//
// Callers can opt into haptic feedback through onTick.
export interface WheelPickerProps<T extends string | number> {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  format?: (option: T) => string;
  /** Called on every settled change, so the player can add its haptic tick. */
  onTick?: () => void;
  accessibilityLabel: string;
}

export function WheelPicker<T extends string | number>({
  options,
  value,
  onChange,
  format = (option) => String(option),
  onTick,
  accessibilityLabel,
}: WheelPickerProps<T>) {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, options.indexOf(value));
  const lastIndex = useRef(selectedIndex);

  // Android ignores ScrollView's contentOffset, so scroll to the selected row
  // once the list is laid out.
  useEffect(() => {
    lastIndex.current = selectedIndex;
    scrollRef.current?.scrollTo({ y: selectedIndex * ROW, animated: false });
  }, [selectedIndex]);

  const onMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.min(
        options.length - 1,
        Math.max(0, Math.round(event.nativeEvent.contentOffset.y / ROW)),
      );
      const next = options[index];
      if (next !== undefined && index !== lastIndex.current) {
        lastIndex.current = index;
        onTick?.();
        onChange(next);
      }
    },
    [onChange, onTick, options],
  );

  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: format(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const delta = event.nativeEvent.actionName === 'increment' ? 1 : -1;
        const nextIndex = Math.min(options.length - 1, Math.max(0, selectedIndex + delta));
        const next = options[nextIndex];
        if (nextIndex === selectedIndex || next === undefined) return;
        lastIndex.current = nextIndex;
        scrollRef.current?.scrollTo({ y: nextIndex * ROW, animated: false });
        onChange(next);
        onTick?.();
      }}
    >
      <View style={[styles.highlight, { backgroundColor: colors.surface.picker }]} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ROW}
        decelerationRate="fast"
        contentContainerStyle={styles.content}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {options.map((option) => {
          const selected = option === value;
          return (
            <View key={String(option)} style={styles.row}>
              <Text variant={selected ? 'statValue' : 'h2'} tone={selected ? 'brand' : 'tertiary'}>
                {format(option)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: ROW * VISIBLE, justifyContent: 'center' },
  highlight: { position: 'absolute', left: 0, right: 0, height: ROW, top: ROW, borderRadius: radius.lg },
  content: { paddingVertical: ROW },
  row: { height: ROW, alignItems: 'center', justifyContent: 'center' },
});
