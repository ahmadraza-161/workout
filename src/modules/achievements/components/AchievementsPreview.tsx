import { router } from 'expo-router';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Card, Section } from '@/modules/core/ui';

import type { AchievementStatus } from '../repository';
import { BadgeGrid } from './BadgeGrid';

export function AchievementsPreview({ badges }: { badges: AchievementStatus[] }) {
  const featured = [...badges.filter((badge) => badge.unlockedAt !== null),
    ...badges.filter((badge) => badge.unlockedAt === null)].slice(0, 3);
  return (
    <Section title={t('achievements.title')} actionLabel={t('achievements.more')}
      onAction={() => router.push('/achievements')} headerPadding={spacing[0]}>
      <Card><BadgeGrid badges={featured} /></Card>
    </Section>
  );
}
