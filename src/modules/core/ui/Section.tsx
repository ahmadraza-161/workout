import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { spacing, useTheme } from '../theme';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Section heading with an optional "More >" link (DESIGN §4.6). Training and
// Discover are built almost entirely out of these.
export interface SectionProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
  /** Section headings sit inside the screen padding; full-bleed rows do not. */
  headerPadding?: number;
}

export function Section({
  title,
  actionLabel,
  onAction,
  children,
  headerPadding = spacing[4],
}: SectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={[styles.header, { paddingHorizontal: headerPadding }]}>
        <Text variant="h3" style={styles.title}>{title}</Text>
        {actionLabel && onAction ? (
          <Touchable onPress={onAction} accessibilityLabel={`${actionLabel}: ${title}`}>
            <View style={styles.action}>
              <Text variant="body" tone="brand">
                {actionLabel}
              </Text>
              <ChevronRight size={18} color={colors.primary} />
            </View>
          </Touchable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing[3] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] },
  title: { flex: 1 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
