import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { challengeGradients, sizes, spacing } from '@/modules/core/theme';
import { Banner, Bolts, Divider, HScroll, MediaCard, Row, Text, type ThumbSize } from '@/modules/core/ui';

import { getWorkout } from '../repository';
import { selectWorkoutArtwork } from '../artwork';
import type { Collection, Workout } from '../types';
import { ExerciseImage } from './ExerciseImage';
import { CharacterArtwork } from './CharacterArtwork';
import { HeroArtwork } from './HeroArtwork';

export function openBrowse(params: Record<string, string>): void {
  router.push({ pathname: '/list/[type]', params: { type: 'workouts', ...params } });
}
export function openWorkout(id: string): void { router.push({ pathname: '/workout/[id]', params: { id } }); }
export function useBrowseWidth(): number { return Math.min(useWindowDimensions().width, sizes.contentMax) - sizes.screenPadding * 2; }
export function WorkoutArtwork({ workout, variant = 'banner', thumbSize = 'lg' }: { workout: Workout | undefined; variant?: 'banner' | 'card' | 'thumb'; thumbSize?: ThumbSize }) {
  const id = selectWorkoutArtwork(workout);
  return id ? <ExerciseImage id={id} variant={variant === 'banner' ? 'art' : variant} thumbSize={thumbSize} /> : null;
}
export function WorkoutRows({ workouts, card = true, compact = false, dense = false }: { workouts: Workout[]; card?: boolean; compact?: boolean; dense?: boolean }) {
  return workouts.map((workout, index) => <View key={workout.id}>
    <Row title={t(workout.titleKey)} titleVariant={compact && !dense ? 'list' : 'card'} container={card ? 'card' : 'plain'} inset={card} dense={dense}
    accessibilityLabel={`${t(workout.titleKey)}, ${t('browse.workoutMeta', { minutes: workout.estimatedMinutes, count: workout.items.length })}, ${t(`level.${workout.level === 1 ? 'beginner' : workout.level === 2 ? 'intermediate' : 'advanced'}`)}`}
    leading={<WorkoutArtwork workout={workout} variant="thumb" thumbSize={dense ? 'md' : compact ? 'sm' : 'lg'} />}
    meta={compact ? <Text variant="captionSm" tone="secondary">{t('browseUi.durationLevel', { minutes: workout.estimatedMinutes,
      level: t(`level.${workout.level === 1 ? 'beginner' : workout.level === 2 ? 'intermediate' : 'advanced'}`) })}</Text>
      : <View style={styles.meta}><Text variant="captionSm" tone="secondary">{t('browse.workoutMeta', { minutes: workout.estimatedMinutes, count: workout.items.length })}</Text><Bolts level={workout.level} /></View>}
    onPress={() => openWorkout(workout.id)} />
    {!card && index < workouts.length - 1 ? <Divider inset={compact ? spacing[0] : sizes.thumbLg + spacing[3]} /> : null}
  </View>);
}
export function WorkoutCarousel({ workouts, twoRows = false, media = false, below = false, plain = false }: {
  workouts: Workout[]; twoRows?: boolean; media?: boolean; below?: boolean; plain?: boolean;
}) {
  const width = useBrowseWidth();
  const columnWidth = media ? sizes.browseCard : width - spacing[8];
  const columns = Array.from({ length: Math.ceil(workouts.length / (twoRows ? 2 : 1)) }, (_, index) => workouts.slice(index * (twoRows ? 2 : 1), (index + 1) * (twoRows ? 2 : 1)));
  return <HScroll padding={spacing[0]} snapWidth={columnWidth + spacing[3]}>{columns.map((column) => <View key={column[0]!.id} style={{ width: columnWidth, gap: spacing[3] }}>
    {media ? column.map((workout) => <MediaCard key={workout.id} width={columnWidth} aspect={below ? 1.4 : 1} title={t(workout.titleKey)}
      titlePlacement={below ? 'below' : 'overlay'} artwork={<WorkoutArtwork workout={workout} variant={below ? 'banner' : 'card'} />} onPress={() => openWorkout(workout.id)} />)
      : <WorkoutRows workouts={column} card={false} compact={plain || twoRows} dense />}
  </View>)}</HScroll>;
}
export function CollectionBanner({ collection }: { collection: Collection }) {
  const workout = getWorkout(collection.workoutIds[0]!);
  return <Banner title={t(collection.titleKey)} gradient={challengeGradients[workout?.gradient ?? 'blue']}
    countLabel={t('browseUi.workoutCount', { count: collection.workoutIds.length })}
    artwork={collection.id === 'c4' ? <HeroArtwork id="collection-move-better" /> : <CharacterArtwork pose={collection.id === 'c1' ? 'trainer' : collection.id === 'c2' ? 'female' : 'mixed'} variant="banner" />} onPress={() => openBrowse({ group: 'collection', id: collection.id })} />;
}
export const browseStyles = StyleSheet.create({ content: { width: '100%', maxWidth: sizes.contentMax - sizes.screenPadding * 2, alignSelf: 'center', gap: sizes.sectionGap, paddingBottom: spacing[8] }, row: { flexDirection: 'row', gap: spacing[3] } });
const styles = StyleSheet.create({ meta: { gap: spacing[1] } });
