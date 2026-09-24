import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { gradients, radius, spacing } from '../theme';
import { GradientBackground } from './GradientBackground';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Discover body-focus tile (DESIGN §4.3): dark gradient, white silhouette icon
// top-right, label bottom-left. Two per row with a 10 dp gap.
export interface DarkTileProps {
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
}

export function DarkTile({ label, icon: Icon, onPress }: DarkTileProps) {
  return (
    <Touchable onPress={onPress} accessibilityLabel={label} style={styles.flex}>
      <View style={styles.tile}>
        <GradientBackground stops={gradients.darkTile} angle={135} />
        <View style={styles.icon}>
          <Icon size={48} color="rgba(255,255,255,0.90)" />
        </View>
        <Text variant="title" style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tile: { height: 110, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end', padding: spacing[3] },
  icon: { position: 'absolute', top: spacing[2], right: spacing[3] },
  // The tile gradient is dark in both themes, so the label is always white.
  label: { color: '#FFFFFF' },
});
