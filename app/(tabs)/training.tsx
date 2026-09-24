import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

import { getContentPack } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { Card, TabPlaceholder, Text } from '@/modules/core/ui';

export default function TrainingScreen() {
  // App name comes from app.config.ts (ADR-012), with the i18n name as fallback.
  const appName = Constants.expoConfig?.name ?? t('app.name');
  const pack = getContentPack();
  return (
    <TabPlaceholder title={appName} phase={7}>
      {__DEV__ ? (
        <Card style={styles.devCard}>
          <Text variant="caption" tone="secondary">
            {t('dev.contentPack', {
              version: pack.contentVersion,
              exercises: pack.exercises.length,
              workouts: pack.workouts.length,
              challenges: pack.challenges.length,
            })}
          </Text>
        </Card>
      ) : null}
    </TabPlaceholder>
  );
}

const styles = StyleSheet.create({
  devCard: { marginTop: 12 },
});
