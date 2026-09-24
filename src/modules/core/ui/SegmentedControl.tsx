import { Pressable, StyleSheet, View } from 'react-native';

import { radius, sizes, useTheme } from '../theme';
import { Text } from './Text';

// DESIGN §4.2: "primary" = selected segment filled with the brand colour;
// "neutral" = selected segment is a white pill.
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  appearance?: 'primary' | 'neutral';
  accessibilityLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  appearance = 'neutral',
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: colors.surface.muted }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const selectedBg = appearance === 'primary' ? colors.primaryFill : colors.surface.default;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && { backgroundColor: selectedBg }]}
          >
            <Text
              variant={selected ? 'bodyStrong' : 'body'}
              tone={selected ? (appearance === 'primary' ? 'onPrimary' : 'primary') : 'secondary'}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.pill, padding: 3, minHeight: sizes.segmented },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
});
