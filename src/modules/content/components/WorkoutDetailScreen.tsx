import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Clock, Dumbbell, Heart, Layers } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { challengeGradients, radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, EmptyState, GradientBackground, IconButton, Row, Screen, Section, StackHeader, Text, Touchable } from '@/modules/core/ui';

import { isFavoriteWorkout, setFavoriteWorkout } from '../favorites';
import { getExercise, getRelatedWorkouts, getWorkout } from '../repository';
import { ExerciseImage } from './ExerciseImage';
import { WorkoutArtwork } from './BrowseCards';
export function WorkoutDetailScreen({ id }: { id: string }) {
  const workout = getWorkout(id);
  const { colors } = useTheme();
  const [favorite, setFavorite] = useState(() => isFavoriteWorkout(id));
  if (!workout) {
    return (
      <Screen background="plain">
        <StackHeader title={t('browse.workouts')} onBack={() => router.back()} />
        <EmptyState title={t('browse.notFound')} />
      </Screen>
    );
  }

  const related = getRelatedWorkouts(id, 3);
  const intro = t(workout.introKey);

  return (
    <Screen background="plain" scroll inset={false}>
      <View style={[styles.hero, { backgroundColor: colors.surface.muted }]}>
        <WorkoutArtwork workout={workout} variant="banner" />
        <View style={styles.back}><IconButton icon={ArrowLeft} variant="floating" accessibilityLabel={t('a11y.back')} onPress={() => router.back()} /></View>
      </View>
      <View style={[styles.content, { backgroundColor: colors.bg.plain }]}>
        <View style={styles.titleRow}>
          <Text variant="h1" style={styles.title}>{t(workout.titleKey)}</Text>
          <Touchable
            onPress={() => {
              setFavoriteWorkout(id, !favorite);
              setFavorite(!favorite);
            }}
            accessibilityLabel={t(favorite ? 'favorites.remove' : 'favorites.add')}
            accessibilityState={{ selected: favorite }}
            visualSize={sizes.iconXl}
          >
            <Heart
              size={sizes.iconXl}
              color={favorite ? colors.flame : colors.text.secondary}
              fill={favorite ? colors.flame : 'none'}
            />
          </Touchable>
        </View>
        <View style={styles.meta}>
          <View style={styles.metric}><Layers size={sizes.iconSm} color={colors.text.secondary} /><Text variant="caption" tone="secondary">{t(`level.${workout.level === 1 ? 'beginner' : workout.level === 2 ? 'intermediate' : 'advanced'}`)}</Text></View>
          <View style={styles.metric}><Clock size={sizes.iconSm} color={colors.text.secondary} /><Text variant="caption" tone="secondary">{t('browse.minutes', { count: workout.estimatedMinutes })}</Text></View>
          <View style={styles.metric}><Dumbbell size={sizes.iconSm} color={colors.text.secondary} /><Text variant="caption" tone="secondary">{t('browseUi.exerciseCount', { count: workout.items.length })}</Text></View>
        </View>
        {intro.trim() ? <View style={styles.intro}><Text variant="h3">{t('browseUi.introduction')}</Text><Text tone="secondary">{intro}</Text></View> : null}
        <Button
          label={t('player.start')}
          variant="cta"
          onPress={() => router.push({ pathname: '/player/[id]', params: { id, mode: 'new' } })}
        />
        <Section title={t('browse.exercises')} headerPadding={spacing[0]}>
          {workout.items.map((item, index) => {
            const exercise = getExercise(item.exerciseId);
            return exercise ? (
              <Row
                inset={false}
                key={`${index}-${item.exerciseId}`}
                title={t(exercise.nameKey)}
                meta={[item.seconds ? t('browse.seconds', { count: item.seconds }) : null]}
                leading={<ExerciseImage id={exercise.id} variant="thumb" />}
                onPress={() =>
                  router.push({ pathname: '/exercise/[id]', params: { id: exercise.id } })
                }
              />
            ) : null;
          })}
        </Section>
        {related.length > 0 ? (
          <Section title={t('browse.related')} headerPadding={spacing[0]}>
            <View style={styles.relatedCards}>{related.map((item, index) => (
              <Touchable key={item.id} accessibilityLabel={t(item.titleKey)}
                onPress={() => router.push({ pathname: '/workout/[id]', params: { id: item.id } })}>
                <View style={styles.relatedCard}>
                  <GradientBackground stops={RELATED_COLORS[index % RELATED_COLORS.length]!} angle={135} />
                  <WorkoutArtwork workout={item} variant="thumb" />
                  <View style={styles.title}>
                    <Text variant="title" tone="onPrimary">{t(item.titleKey)}</Text>
                    <Text variant="caption" tone="onPrimary">{t('browseUi.durationLevel', { minutes: item.estimatedMinutes,
                      level: t(`level.${item.level === 1 ? 'beginner' : item.level === 2 ? 'intermediate' : 'advanced'}`) })}</Text>
                  </View>
                  <ChevronRight size={sizes.iconLg} color={colors.onPrimary} />
                </View>
              </Touchable>
            ))}</View>
          </Section>
        ) : null}
        <Button label={t('builder.customize')} variant="plainLink"
          onPress={() => router.push({ pathname: '/builder', params: { sourceId: id } })} />
      </View>
    </Screen>
  );
}

const RELATED_COLORS = [challengeGradients.blue, challengeGradients.purple, challengeGradients.slate] as const;

const styles = StyleSheet.create({
  relatedCards: { gap: spacing[3] },
  relatedCard: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[4], borderRadius: radius.xl, overflow: 'hidden' },
  hero: { height: sizes.workoutHero },
  back: { position: 'absolute', top: spacing[4], left: spacing[4] },
  content: { gap: spacing[5], padding: spacing[5], paddingBottom: spacing[8], marginTop: -spacing[4], borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    maxWidth: sizes.contentMax, width: '100%', alignSelf: 'center' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }, metric: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  intro: { gap: spacing[3] },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  title: { flex: 1 },
});
