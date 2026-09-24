import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { radius, spacing, useTheme } from '../theme';
import { Button } from './Button';
import { Text } from './Text';

// Loading, empty and error states (RULES §14: every list needs all three).
// Empty and error share a layout, so they share an implementation.

export function LoadingState() {
  const { colors } = useTheme();
  return (
    <View style={styles.centre} accessible accessibilityRole="progressbar">
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export interface EmptyStateProps {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Illustration slot; the six generated illustrations arrive in phase 3. */
  illustration?: ReactNode;
}

export function EmptyState({ title, body, actionLabel, onAction, illustration }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.centre}>
      <View style={[styles.illustration, { backgroundColor: colors.surface.muted }]}>{illustration}</View>
      <Text variant="h3" style={styles.centreText}>
        {title}
      </Text>
      {body ? (
        <Text variant="body" tone="secondary" style={styles.centreText}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="small" />
      ) : null}
    </View>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      title={t('errors.generic.title')}
      body={t('errors.generic.body')}
      actionLabel={t('common.retry')}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[6],
  },
  illustration: { width: 120, height: 120, borderRadius: radius.lg },
  centreText: { textAlign: 'center' },
});
