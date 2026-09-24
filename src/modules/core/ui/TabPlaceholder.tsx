import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { spacing } from '../theme';
import { Card } from './Card';
import { Screen } from './Screen';
import { Text } from './Text';

// Temporary tab body used until each tab is built in its phase (TASKS.md).
export function TabPlaceholder({ title, phase, children }: { title: string; phase: number; children?: ReactNode }) {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="tabHeader" accessibilityRole="header">
          {title}
        </Text>
      </View>
      <Card>
        <Text variant="title">{t('placeholder.comingSoon')}</Text>
        <Text tone="secondary">{t('placeholder.phase', { phase })}</Text>
      </Card>
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 56, justifyContent: 'center', marginBottom: spacing[4] },
});
