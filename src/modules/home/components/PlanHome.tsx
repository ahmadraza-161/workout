import { router } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ChallengeProgress } from '@/modules/challenges';
import { challengeHeroKey, ExerciseImage, getChallenge, getChallengeDayWorkout, getExercise, HeroArtwork, SuggestedWorkouts,
  type Challenge } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, GradientCard, ProgressBar, Screen, Section, StreakFlame, TabHeader, Text, Touchable } from '@/modules/core/ui';

import { dayPart, planWeek, trainingDays } from '../plan';
import { FadeIn } from './FadeIn';
import { ExploreBanner, homeStyles, QuickActions } from './HomeSections';
import { PlanPath } from './PlanPath';
import { openPlan, startPlanDay } from './WelcomeHome';

const PREVIEW_COUNT = 4;

/** Home for people who already train: today's plan day first, then the week, options and suggestions. */
export function PlanHome({ plan, streak, doneToday, today }: {
  plan: { challengeId: string; progress: ChallengeProgress } | null; streak: number; doneToday: boolean; today: Date;
}) {
  const challenge = plan ? getChallenge(plan.challengeId) : undefined;
  return <Screen scroll><View style={homeStyles.content}>
    <TabHeader compact title={t(`home.greeting.${dayPart(today)}`)} actions={
      <Touchable onPress={() => router.push('/(tabs)/report')} accessibilityLabel={t('report.streak')}>
        <StreakFlame count={streak} />
      </Touchable>} />
    {plan && challenge ? <>
      <FadeIn order={0}><TodayCard challenge={challenge} progress={plan.progress} doneToday={doneToday} /></FadeIn>
      <FadeIn order={1}><WeekCard challenge={challenge} progress={plan.progress} /></FadeIn>
    </> : <FadeIn order={0}><NoPlanCard /></FadeIn>}
    <FadeIn order={2}><QuickActions /></FadeIn>
    <FadeIn order={3}><Section title={t('home.suggested')} headerPadding={spacing[0]} actionLabel={t('browseUi.more')}
      onAction={() => router.push('/(tabs)/discover')}><SuggestedWorkouts /></Section></FadeIn>
    <FadeIn order={4}><ExploreBanner /></FadeIn>
  </View></Screen>;
}

function TodayCard({ challenge, progress, doneToday }: { challenge: Challenge; progress: ChallengeProgress; doneToday: boolean }) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const day = progress.currentDay;
  const workout = getChallengeDayWorkout(challenge.id, day);
  const exercises = (workout?.items ?? []).flatMap((item) => {
    const exercise = getExercise(item.exerciseId);
    return exercise ? [exercise] : [];
  }).filter((exercise, index, list) => list.findIndex((other) => other.id === exercise.id) === index);
  function start(): void {
    try { startPlanDay(challenge.id); setFailed(false); } catch { setFailed(true); }
  }
  return <GradientCard gradient={challenge.gradient} title={workout ? t(workout.titleKey) : t(challenge.titleKey)}
    eyebrow={t('home.todayEyebrow', { plan: t(challenge.titleKey), day, total: challenge.days })}
    artwork={<HeroArtwork id={challengeHeroKey(challenge.id)} />}
    footer={workout ? <Button variant="cardCta" label={t('home.startDay', { day })} onPress={start} /> : null}>
    {workout ? <Text tone="onPrimary">{t('home.workoutMeta', { minutes: workout.estimatedMinutes, count: workout.items.length })}</Text> : null}
    {exercises.length ? <View style={styles.thumbs}>
      {exercises.slice(0, PREVIEW_COUNT).map((exercise) => <Touchable key={exercise.id}
        accessibilityLabel={t('home.previewExercise', { name: t(exercise.nameKey) })}
        onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: exercise.id } })}>
        <ExerciseImage id={exercise.id} variant="thumb" thumbSize="sm" />
      </Touchable>)}
      {exercises.length > PREVIEW_COUNT ? <View style={[styles.more, { backgroundColor: colors.onPrimarySoft }]}>
        <Text variant="title" tone="onPrimary">{t('home.moreExercises', { count: exercises.length - PREVIEW_COUNT })}</Text>
      </View> : null}
    </View> : null}
    {doneToday ? <View style={[styles.done, { backgroundColor: colors.onPrimarySoft }]}>
      <CircleCheck size={sizes.iconMd} color={colors.onPrimary} />
      <Text variant="caption" tone="onPrimary" style={styles.grow}>{t('home.doneToday', { day })}</Text>
    </View> : null}
    {failed ? <Text accessibilityRole="alert" tone="onPrimary">{t('errors.generic.title')}</Text> : null}
  </GradientCard>;
}

function WeekCard({ challenge, progress }: { challenge: Challenge; progress: ChallengeProgress }) {
  const total = trainingDays(challenge);
  const done = [...progress.completedDays].filter((day) => day <= challenge.days).length;
  return <Section title={t('home.journey')} headerPadding={spacing[0]} actionLabel={t('browseUi.more')} onAction={() => openPlan(challenge.id)}>
    <Card><View style={homeStyles.stack}>
      <PlanPath days={planWeek(challenge, progress.currentDay, progress.completedDays)} onPress={() => openPlan(challenge.id)} />
      <Text variant="caption" tone="secondary">{t('home.planProgress', { done, total })}</Text>
      <ProgressBar progress={total ? done / total : 0} height={spacing[2]} />
    </View></Card>
  </Section>;
}

function NoPlanCard() {
  return <Card><View style={homeStyles.stack}>
    <Text variant="h3">{t('home.noPlanTitle')}</Text>
    <Text tone="secondary">{t('home.noPlanBody')}</Text>
    <Button label={t('home.choosePlan')} onPress={() => router.push('/plan')} />
  </View></Card>;
}

const styles = StyleSheet.create({
  thumbs: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginTop: spacing[1] },
  more: { width: sizes.thumbSm, height: sizes.thumbSm, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  done: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], padding: spacing[2], borderRadius: radius.md },
  grow: { flex: 1 },
});
