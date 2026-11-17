import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../theme';

export interface ScreenProps {
  children: ReactNode;
  /** Tab screens use the grey page background; stack screens use plain white (DESIGN §2.2). */
  background?: 'page' | 'plain';
  scroll?: boolean;
  /** Full-bleed stages supply their own horizontal padding. */
  inset?: boolean;
}

export function Screen({ children, background = 'page', scroll = false, inset = true }: ScreenProps) {
  const { colors, sizes } = useTheme();
  const padding = inset ? { paddingHorizontal: sizes.screenPadding } : undefined;
  return (
    <SafeAreaView edges={['top']} style={[styles.fill, { backgroundColor: colors.bg[background] }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[padding, styles.scrollContent, !inset && styles.noInsetScroll]}>{children}</ScrollView>
      ) : (
        <View style={[styles.fill, padding]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  noInsetScroll: { paddingBottom: 0 },
});
