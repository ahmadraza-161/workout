import { router, useIsFocused } from 'expo-router';
import { Clock, Search } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { challengeGradients, sizes, spacing } from '@/modules/core/theme';
import { Banner, DarkTile, ErrorState, HScroll, IconButton, MediaCard, Screen, Section, TabHeader } from '@/modules/core/ui';

import { browseWorkouts, DEFAULT_BROWSE_CONTEXT, featuredWorkout, rankWorkouts } from '../browse';
import { loadBrowseContext } from '../browseRepository';
import { getContentPack } from '../repository';
import { HeroArtwork, challengeHeroKey } from './HeroArtwork';
import { browseStyles, CollectionBanner, openBrowse, openWorkout, WorkoutArtwork, WorkoutCarousel } from './BrowseCards';
import { useBrowseNow } from './useBrowseNow';
import { CATEGORY_ICONS } from './BodyFocusArtwork';
import { ExerciseImage } from './ExerciseImage';
import { FeedbackSection } from './FeedbackSection';

export function DiscoverScreen() {
  const focused = useIsFocused();
  const [, setRevision] = useState(0);
  const pack = getContentPack();
  const loaded = (() => { try { return focused ? loadBrowseContext() : DEFAULT_BROWSE_CONTEXT; } catch { return null; } })();
  const context = loaded ?? DEFAULT_BROWSE_CONTEXT;
  const now = useBrowseNow();
  const recommendations = rankWorkouts(pack.workouts, context, now).slice(2, 10);
  const featured = featuredWorkout(pack, context, now);
  const collection = pack.collections.find((item) => item.id === 'c3');
  const beginners = browseWorkouts(pack, { group: 'beginners' }).sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
  const challenges = [...pack.challenges].sort((a, b) => a.days - b.days);
  const equipmentExercise = pack.exercises.find((exercise) => exercise.props.includes('chair'));
  return <Screen background="plain" scroll><View style={browseStyles.content}>
    <View style={{ gap: spacing[4] }}>
    <TabHeader compact title={t('tabs.discover')} actions={<>
      <IconButton icon={Search} accessibilityLabel={t('browse.search')} onPress={() => router.push('/search')} />
      <IconButton icon={Clock} accessibilityLabel={t('browseUi.recent')} onPress={() => openBrowse({ group: 'recent' })} />
    </>} />
    {!loaded ? <ErrorState onRetry={() => setRevision((value) => value + 1)} /> : null}
    {featured ? <Banner title={t(featured.titleKey)} subtitle={t('browseUi.featured')} gradient={challengeGradients[featured.gradient]} artworkPlacement="background"
      artwork={<WorkoutArtwork workout={featured} />} onPress={() => openWorkout(featured.id)} /> : null}
    </View>
    <Section title={t('browseUi.picks')} headerPadding={spacing[0]}>
      <WorkoutCarousel workouts={recommendations} twoRows plain />
    </Section>
    {collection ? <CollectionBanner collection={collection} /> : null}
    <Section title={t('browseUi.beginners')} headerPadding={spacing[0]}>
      <WorkoutCarousel workouts={beginners} media />
    </Section>
    <Section title={t('browseUi.fast')} headerPadding={spacing[0]}>
      <WorkoutCarousel workouts={browseWorkouts(pack, { group: 'quick' })} twoRows plain />
    </Section>
    <Section title={t('browse.challenges')} headerPadding={spacing[0]}>
      <HScroll padding={spacing[0]}>{challenges.map((challenge) => {
        return <MediaCard key={challenge.id} title={t(challenge.titleKey)} width={sizes.browseCard} aspect={1}
          titlePlacement="overlay" artwork={<HeroArtwork id={challengeHeroKey(challenge.id)} />}
          onPress={() => router.push({ pathname: '/challenge/[id]', params: { id: challenge.id } })} />;
      })}</HScroll>
    </Section>
    <Section title={t('browseUi.equipment')} headerPadding={spacing[0]}>
      <Banner title={t('browseUi.equipment')} subtitle={t('browseUi.equipmentHint')} artworkPlacement="background" trailingLabel={t('browseUi.go')}
        gradient={challengeGradients.slate} artwork={equipmentExercise ? <ExerciseImage id={equipmentExercise.id} variant="art" /> : undefined}
        onPress={() => openBrowse({ group: 'equipment' })} />
    </Section>
    <Section title={t('browseUi.stretch')} headerPadding={spacing[0]}>
      <WorkoutCarousel workouts={browseWorkouts(pack, { group: 'stretch' })} twoRows media below />
    </Section>
    <Section title={t('training.bodyFocus')} headerPadding={spacing[0]}>
      {Array.from({ length: Math.ceil(pack.categories.length / 2) }, (_, index) => <View key={index} style={browseStyles.row}>
        {pack.categories.slice(index * 2, index * 2 + 2).map((category) => <DarkTile key={category.id} label={t(category.titleKey)} icon={CATEGORY_ICONS[category.id] ?? CATEGORY_ICONS['full-body']!}
          onPress={() => openBrowse({ group: 'category', id: category.id })} />)}
      </View>)}
    </Section>
    <FeedbackSection />
  </View></Screen>;
}
