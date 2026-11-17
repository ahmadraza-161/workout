import { router, useIsFocused } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Card, ErrorState, Screen, Section, StackHeader, Text } from '@/modules/core/ui';

import { refreshAchievements } from '../repository';
import { BADGE_GROUPS, BadgeGrid, badgeGroupTitle } from './BadgeGrid';

export function AchievementsScreen() {
  const focused = useIsFocused();
  const [, setRevision] = useState(0);
  let data: ReturnType<typeof refreshAchievements> | null = null;
  let error = false;
  if (focused) {
    try { data = refreshAchievements(); } catch { error = true; }
  }
  if (error) return <Screen background="plain"><StackHeader title={t('achievements.title')} onBack={() => router.back()} />
    <ErrorState onRetry={() => setRevision((value) => value + 1)} /></Screen>;
  if (!data) return <Screen background="plain">{null}</Screen>;
  const unlocked = data.badges.filter((badge) => badge.unlockedAt !== null).length;
  return (
    <Screen scroll background="plain">
      <View style={styles.content}>
        <StackHeader title={t('achievements.title')} onBack={() => router.back()} />
        <Text variant="body" tone="secondary">{t('achievements.progress', { unlocked, total: data.badges.length })}</Text>
        {BADGE_GROUPS.map((group) => (
          <Section key={group} title={badgeGroupTitle(group)} headerPadding={spacing[0]}>
            <Card><BadgeGrid badges={data.badges.filter((badge) => badge.group === group)} /></Card>
          </Section>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing[6], paddingBottom: spacing[8] } });
