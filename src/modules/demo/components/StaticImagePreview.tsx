import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { radius, spacing, useTheme } from '@/modules/core/theme';
import { Card, Screen, Text } from '@/modules/core/ui';

// Original colour style study; the remaining exercise images are not yet mapped.
const SIDE_PLANK = require('../../../../assets/images/exercises/side-plank-color-study.png');

export function StaticImagePreview() {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="h1">{t('dev.staticImage.title')}</Text>
        <Text tone="secondary">{t('dev.staticImage.description')}</Text>
      </View>
      <Card style={styles.card}>
        <Text variant="h2">{t('dev.staticImage.sidePlank')}</Text>
        <View style={[styles.stage, { backgroundColor: colors.surface.stage }]}>
          {failed ? (
            <Text>{t('dev.staticImage.error')}</Text>
          ) : (
            <Image
              source={SIDE_PLANK}
              style={styles.image}
              resizeMode="contain"
              fadeDuration={0}
              accessible
              accessibilityLabel={t('dev.staticImage.alt')}
              onError={() => setFailed(true)}
            />
          )}
        </View>
        <Text variant="caption" tone="secondary">
          {t('dev.staticImage.credit')}
        </Text>
      </Card>
      <Text tone="secondary">{t('dev.staticImage.pending')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing[3], marginBottom: spacing[6] },
  card: { gap: spacing[3], marginBottom: spacing[6] },
  stage: { width: '100%', aspectRatio: 3 / 2, borderRadius: radius.lg, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
