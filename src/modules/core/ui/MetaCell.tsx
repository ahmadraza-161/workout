import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '../theme';
import { Text } from './Text';

// Icon + value + label. Two layouts, same data:
//   tile – challenge card meta cells, icon in a translucent white tile on the left
//   stat – Report summary card, duotone icon centred above the value
// (DESIGN §4.3 challenge card and stat card.)
export interface MetaCellProps {
  icon: ComponentType<{ size?: number; color?: string }>;
  value: string;
  label: string;
  layout?: 'tile' | 'stat';
  compact?: boolean;
}

export function MetaCell({ icon: Icon, value, label, layout = 'tile', compact = false }: MetaCellProps) {
  const { colors } = useTheme();

  if (layout === 'stat') {
    return (
      <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
        <Icon size={28} color={colors.primary} />
        <Text variant="statValue">{value}</Text>
        <Text variant="body" tone="secondary">
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tileRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.tile}>
        <Icon size={18} color="#FFFFFF" />
      </View>
      <View style={styles.tileText}>
        <Text variant={compact ? 'captionSm' : 'bodyStrong'} style={styles.onCard}>
          {value}
        </Text>
        <Text variant={compact ? 'micro' : 'captionSm'} style={styles.onCardMuted}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { flex: 1, alignItems: 'center', gap: spacing[1] },
  tileRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  tile: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { flex: 1 },
  // Challenge cards are always a saturated gradient, so card text is solid white.
  onCard: { color: '#FFFFFF' },
  onCardMuted: { color: 'rgba(255,255,255,0.80)' },
});
