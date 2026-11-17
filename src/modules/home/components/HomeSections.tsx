import { router } from 'expo-router';
import { CalendarCheck, CirclePlay, CirclePlus, PersonStanding, SlidersHorizontal, TrendingUp, Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { CharacterArtwork, openBrowse } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { challengeGradients, radius, sizes, spacing, useTheme, type ChallengeGradientName } from '@/modules/core/theme';
import { Banner, Card, GradientBackground, Section, Text, Touchable } from '@/modules/core/ui';

type Icon = typeof Zap;

/** A gradient icon well; each step and action gets its own colour so Home reads at a glance. */
export function IconBadge({ icon: IconComponent, gradient }: { icon: Icon; gradient: ChallengeGradientName }) {
  const { colors } = useTheme();
  return <View style={styles.badge}>
    <GradientBackground stops={challengeGradients[gradient]} angle={135} />
    <IconComponent size={sizes.iconLg} color={colors.onPrimary} />
  </View>;
}

const STEPS: { key: string; icon: Icon; gradient: ChallengeGradientName }[] = [
  { key: 'Plan', icon: CalendarCheck, gradient: 'blue' },
  { key: 'Watch', icon: CirclePlay, gradient: 'orange' },
  { key: 'Grow', icon: TrendingUp, gradient: 'mint' },
];

export function HowItWorks() {
  return <Section title={t('home.howTitle')} headerPadding={spacing[0]}><Card><View style={styles.steps}>
    {STEPS.map((step, index) => <View key={step.key} style={styles.step}>
      <IconBadge icon={step.icon} gradient={step.gradient} />
      <View style={styles.grow}>
        <Text variant="title">{`${index + 1}. ${t(`home.step${step.key}Title`)}`}</Text>
        <Text variant="caption" tone="secondary">{t(`home.step${step.key}Body`)}</Text>
      </View>
    </View>)}
  </View></Card></Section>;
}

const ACTIONS: { key: string; icon: Icon; gradient: ChallengeGradientName; open: () => void }[] = [
  { key: 'Plan', icon: SlidersHorizontal, gradient: 'blue', open: () => router.push('/plan') },
  { key: 'Quick', icon: Zap, gradient: 'orange', open: () => openBrowse({ group: 'quick' }) },
  { key: 'Stretch', icon: PersonStanding, gradient: 'mint', open: () => openBrowse({ group: 'stretch' }) },
  { key: 'Create', icon: CirclePlus, gradient: 'violet', open: () => router.push('/custom-workouts') },
];

export function QuickActions() {
  const { colors } = useTheme();
  return <Section title={t('home.customizeTitle')} headerPadding={spacing[0]}>
    {[ACTIONS.slice(0, 2), ACTIONS.slice(2)].map((row) => <View key={row[0]!.key} style={styles.actionRow}>
      {row.map((action) => <Touchable key={action.key} onPress={action.open} accessibilityRole="button"
        accessibilityLabel={t(`home.action${action.key}`)} style={[styles.action, { backgroundColor: colors.surface.default }]}>
        <IconBadge icon={action.icon} gradient={action.gradient} />
        <Text variant="title" style={styles.grow} numberOfLines={2}>{t(`home.action${action.key}`)}</Text>
      </Touchable>)}
    </View>)}
  </Section>;
}

export function ExploreBanner() {
  return <Banner title={t('home.exploreAll')} gradient={challengeGradients.violet} height={sizes.exploreBanner}
    artwork={<CharacterArtwork pose="mixed" variant="banner" />} trailingLabel={t('browseUi.go')}
    onPress={() => router.push('/(tabs)/discover')} />;
}

export const homeStyles = StyleSheet.create({
  content: { width: '100%', maxWidth: sizes.contentMax - sizes.screenPadding * 2, alignSelf: 'center',
    gap: sizes.sectionGap, paddingBottom: spacing[8] },
  stack: { gap: spacing[3] },
});

const styles = StyleSheet.create({
  badge: { width: sizes.iconButton + spacing[2], height: sizes.iconButton + spacing[2], borderRadius: radius.md,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  steps: { gap: spacing[4] },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  grow: { flex: 1 },
  actionRow: { flexDirection: 'row', gap: spacing[3] },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[3],
    borderRadius: radius.lg, minHeight: sizes.buttonLg + spacing[4] },
});
