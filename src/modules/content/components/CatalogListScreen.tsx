import { router, useIsFocused } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { sizes, spacing } from '@/modules/core/theme';
import { CategoryHero, Chip, EmptyState, ErrorState, HScroll, IconButton, Row, Screen, StackHeader } from '@/modules/core/ui';

import { browseWorkouts, DEFAULT_BROWSE_CONTEXT, rankWorkouts, recentWorkouts, type BrowseFilter } from '../browse';
import { loadBrowseContext } from '../browseRepository';
import { getContentPack, listExercises } from '../repository';
import type { Challenge } from '../types';
import { browseStyles, WorkoutRows } from './BrowseCards';
import { ChallengeCard } from './ChallengeCard';
import { ExerciseImage } from './ExerciseImage';
import { HeroArtwork } from './HeroArtwork';
import { useBrowseNow } from './useBrowseNow';

type ChallengeFilter = 'all' | 'build_muscle' | 'burn_fat' | 'full_body' | 'flexibility';
const CHALLENGE_FILTERS: ChallengeFilter[] = ['all', 'build_muscle', 'burn_fat', 'full_body', 'flexibility'];
function matchesChallengeFilter(challenge: Challenge, filter: ChallengeFilter): boolean {
  return filter === 'all' || (filter === 'full_body' ? challenge.bodyFocus === 'full_body' : challenge.goal === filter);
}

export function CatalogListScreen({ type, quick = false, ...filter }: BrowseFilter & { type: string; quick?: boolean }) {
  const [challengeFilter, setChallengeFilter] = useState<ChallengeFilter>('all');
  const [, setRevision] = useState(0);
  const focused = useIsFocused();
  const now = useBrowseNow();
  const pack = getContentPack();
  const group = quick ? 'quick' : filter.group;
  const needsContext = group === 'recommended' || group === 'recent';
  const context = (() => { try { return focused && needsContext ? loadBrowseContext() : DEFAULT_BROWSE_CONTEXT; } catch { return null; } })();
  const category = group === 'category' ? pack.categories.find((item) => item.id === filter.id) : undefined;
  const collection = group === 'collection' ? pack.collections.find((item) => item.id === filter.id) : undefined;
  const title = type === 'exercises' ? t('browse.exercises') : type === 'challenges' ? t('browse.challenges')
    : category ? t(category.titleKey) : collection ? t(collection.titleKey)
      : filter.focus ? t(`training.focus.${filter.focus}`) : filter.goal ? t(`browseUi.goal.${filter.goal}`)
        : filter.duration ? t(`browseUi.duration.${filter.duration}`) : group ? t(`browseUi.group.${group}`) : t('browse.workouts');
  const candidates = browseWorkouts(pack, { ...filter, group });
  const workouts = type !== 'workouts' ? [] : group === 'recommended'
    ? rankWorkouts(candidates, context ?? DEFAULT_BROWSE_CONTEXT, now)
    : group === 'recent' ? recentWorkouts(pack, context ?? DEFAULT_BROWSE_CONTEXT)
      : group === 'beginners' ? [...candidates].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes) : candidates;
  const exercises = type === 'exercises' ? listExercises() : [];
  const challenges = type === 'challenges' ? pack.challenges.filter((item) => matchesChallengeFilter(item, challengeFilter))
    : type === 'workouts' && filter.goal ? pack.challenges.filter((item) => item.goal === filter.goal) : [];
  return <Screen background="plain" scroll inset={!category}>
    {category ? <CategoryHero title={t(category.titleKey)} description={t(category.descKey)}
      artwork={<HeroArtwork id={`category-${category.id}`} portrait={category.id === 'core' || category.id === 'back-posture'} />}
      back={<IconButton icon={ArrowLeft} variant="floating" accessibilityLabel={t('a11y.back')} onPress={() => router.back()} />} /> : null}
    <View style={[browseStyles.content, category ? styles.categoryBody : undefined]}>
      {!category ? <StackHeader title={title} onBack={() => router.back()} /> : null}
      {type === 'challenges' ? <HScroll padding={spacing[0]}>{CHALLENGE_FILTERS.map((option) =>
        <Chip key={option} label={t(`challengeUi.filter.${option}`)} variant="filter" selected={challengeFilter === option}
          onPress={() => setChallengeFilter(option)} />)}</HScroll> : null}
      {!context ? <ErrorState onRetry={() => setRevision((value) => value + 1)} />
        : !workouts.length && !exercises.length && !challenges.length ? <EmptyState title={t('browse.noResults')} /> : null}
      {challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
      <View style={{ gap: category ? spacing[0] : spacing[2] }}><WorkoutRows workouts={workouts} card={!category} compact={!!category} /></View>
      {exercises.map((item) => <Row key={item.id} title={t(item.nameKey)} leading={<ExerciseImage id={item.id} variant="thumb" />}
        onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.id } })} />)}
    </View>
  </Screen>;
}
const styles = StyleSheet.create({ categoryBody: { paddingHorizontal: sizes.screenPadding, paddingTop: spacing[4] } });
