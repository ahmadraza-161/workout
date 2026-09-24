import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../theme';

export interface ScreenProps {
  children: ReactNode;
  /** Tab screens use the grey page background; stack screens use plain white (DESIGN §2.2). */
  background?: 'page' | 'plain';
  scroll?: boolean;
}

export function Screen({ children, background = 'page', scroll = false }: ScreenProps) {
  const { colors, sizes } = useTheme();
  const padding = { paddingHorizontal: sizes.screenPadding };
  return (
    <SafeAreaView edges={['top']} style={[styles.fill, { backgroundColor: colors.bg[background] }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[padding, styles.scrollContent]}>{children}</ScrollView>
      ) : (
        <View style={[styles.fill, padding]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
});
