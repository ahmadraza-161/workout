import { Award, CalendarCheck, Clock3, Compass, Dumbbell, Flame, Target, Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { challengeGradients, spacing } from '@/modules/core/theme';
import { AchievementBadge, GradientBackground } from '@/modules/core/ui';

import type { AchievementStatus } from '../repository';

const GROUPS = {
  'Getting started': { icon: Award, gradient: challengeGradients.green, key: 'gettingStarted' },
  Consistency: { icon: Flame, gradient: challengeGradients.orange, key: 'consistency' },
  Volume: { icon: Dumbbell, gradient: challengeGradients.blue, key: 'volume' },
  Time: { icon: Clock3, gradient: challengeGradients.cyan, key: 'time' },
  Strength: { icon: Target, gradient: challengeGradients.red, key: 'strength' },
  Exploration: { icon: Compass, gradient: challengeGradients.violet, key: 'exploration' },
  Challenges: { icon: Trophy, gradient: challengeGradients.purple, key: 'challenges' },
  Habits: { icon: CalendarCheck, gradient: challengeGradients.indigo, key: 'habits' },
} as const;

export const BADGE_GROUPS = Object.keys(GROUPS);

export function badgeGroupTitle(group: string): string {
  const definition = GROUPS[group as keyof typeof GROUPS];
  return definition ? t(`achievements.group.${definition.key}`) : group;
}

export function BadgeGrid({ badges }: { badges: AchievementStatus[] }) {
  return (
    <View style={styles.grid}>
      {badges.map((badge) => {
        const definition = GROUPS[badge.group as keyof typeof GROUPS] ?? GROUPS['Getting started'];
        return (
          <AchievementBadge key={badge.id} name={t(badge.titleKey)} icon={definition.icon}
            unlocked={badge.unlockedAt !== null}
            statusLabel={t(badge.unlockedAt !== null ? 'achievements.unlocked' : 'achievements.locked')}
            gradientChild={<GradientBackground stops={definition.gradient} angle={135} />} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', columnGap: spacing[2], rowGap: spacing[5] },
});
