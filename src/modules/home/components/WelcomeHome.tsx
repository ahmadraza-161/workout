import { router } from 'expo-router';
import { CircleCheck, House, SlidersHorizontal, Timer } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getActivePlan, selectPlan } from '@/modules/challenges';
import { ChallengeCard, CharacterArtwork, getChallenge, getChallengeDayWorkout, type Challenge } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { challengeGradients, radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, GradientBackground, Screen, Section, Text } from '@/modules/core/ui';
import type { getProfile } from '@/modules/profile';

import { planWeek, recommendPlanId, toLevel } from '../plan';
import { FadeIn } from './FadeIn';
import { ExploreBanner, HowItWorks, homeStyles } from './HomeSections';
import { PlanPath } from './PlanPath';

export type HomeProfile = ReturnType<typeof getProfile>;
export const LEVEL_KEYS = { 1: 'beginner', 2: 'intermediate', 3: 'advanced' } as const;

/** Opens the plan's next day in the player; starting it makes the plan the one Home follows. */
export function startPlanDay(challengeId: string): void {
  const active = getActivePlan();
  const progress = active?.challengeId === challengeId ? active.progress : selectPlan(challengeId);
  const workout = progress?.status === 'active' ? getChallengeDayWorkout(challengeId, progress.currentDay) : undefined;
  if (!progress || !workout) throw new Error('Plan day is unavailable');
  router.push({ pathname: '/player/[id]', params: { id: workout.id, challengeId, day: String(progress.currentDay) } });
}

export function openPlan(challengeId: string): void {
  router.push({ pathname: '/challenge/[id]', params: { id: challengeId } });
}

/** First-run Home: a friendly welcome, one recommended plan and a clear first step. */
export function WelcomeHome({ profile }: { profile: HomeProfile }) {
  const goal = profile?.goal ?? 'keep_fit';
  const level = toLevel(profile?.level);
  const plan = getChallenge(recommendPlanId(goal, level))!;
  const [failed, setFailed] = useState(false);
  function start(): void {
    try { startPlanDay(plan.id); setFailed(false); } catch { setFailed(true); }
  }
  return <Screen scroll><View style={homeStyles.content}>
    <FadeIn order={0}><WelcomeHero gender={profile?.gender} minutes={plan.dailyMinutes} /></FadeIn>
    <FadeIn order={1}><Section title={t('home.yourPlan')} headerPadding={spacing[0]}><View style={homeStyles.stack}>
      <Text tone="secondary">{t('home.pickedFor', { goal: t(`onboarding.goal.${goal}`), level: t(`level.${LEVEL_KEYS[level]}`) })}</Text>
      <ChallengeCard challenge={plan} featured footer={<Button variant="cardCta" label={t('home.startDayOne')} onPress={start} />} />
      {failed ? <Text accessibilityRole="alert" tone="secondary">{t('errors.generic.title')}</Text> : null}
      <Button variant="secondary" icon={SlidersHorizontal} label={t('home.customize')} onPress={() => router.push('/plan')} />
    </View></Section></FadeIn>
    <FadeIn order={2}><HowItWorks /></FadeIn>
    <FadeIn order={3}><FirstWeek plan={plan} /></FadeIn>
    <FadeIn order={4}><ExploreBanner /></FadeIn>
  </View></Screen>;
}

function WelcomeHero({ gender, minutes }: { gender: string | null | undefined; minutes: string }) {
  const { colors } = useTheme();
  const perks = [[CircleCheck, t('home.perkEquipment')], [Timer, t('home.perkMinutes', { minutes })], [House, t('home.perkHome')]] as const;
  return <View style={styles.hero}>
    <GradientBackground stops={challengeGradients.blue} angle={135} />
    <View style={styles.heroArt}>
      <CharacterArtwork pose={gender === 'female' ? 'female' : gender === 'male' ? 'trainer' : 'mixed'} />
    </View>
    <View style={styles.heroText}>
      <Text variant="micro" tone="onPrimary">{t('home.welcomeEyebrow')}</Text>
      <Text variant="h1" tone="onPrimary" accessibilityRole="header">{t('home.welcomeTitle')}</Text>
      <Text tone="onPrimary">{t('home.welcomeBody')}</Text>
    </View>
    <View style={styles.perks}>{perks.map(([Icon, label]) => <View key={label}
      style={[styles.perk, { backgroundColor: colors.onPrimarySoft }]}>
      <Icon size={sizes.iconSm} color={colors.onPrimary} />
      <Text variant="caption" tone="onPrimary">{label}</Text>
    </View>)}</View>
  </View>;
}

function FirstWeek({ plan }: { plan: Challenge }) {
  return <Section title={t('home.firstWeek')} headerPadding={spacing[0]} actionLabel={t('browseUi.more')} onAction={() => openPlan(plan.id)}>
    <Card><PlanPath days={planWeek(plan, 1, new Set())} onPress={() => openPlan(plan.id)} /></Card>
  </Section>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xxl, overflow: 'hidden', padding: spacing[5], gap: spacing[4], minHeight: sizes.challengeCard },
  heroArt: { position: 'absolute', right: 0, bottom: 0, width: '42%', height: '78%' },
  heroText: { width: '62%', gap: spacing[2] },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], width: '62%' },
  perk: { flexDirection: 'row', alignItems: 'center', gap: spacing[1], paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radius.pill },
});
