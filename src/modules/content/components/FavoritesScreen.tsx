import { router, useIsFocused } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { EmptyState, Row, Screen, StackHeader } from '@/modules/core/ui';

import { listFavoriteWorkouts } from '../favorites';
import { ExerciseImage } from './ExerciseImage';

export function FavoritesScreen() {
  const focused = useIsFocused();
  const workouts = useMemo(() => (focused ? listFavoriteWorkouts() : []), [focused]);
  return (
    <Screen background="plain" scroll>
      <StackHeader title={t('favorites.title')} onBack={() => router.back()} />
      <View style={styles.content}>
        {workouts.length === 0 ? (
          <EmptyState title={t('favorites.emptyTitle')} body={t('favorites.emptyBody')} />
        ) : (
          workouts.map((workout) => (
            <Row
              key={workout.id}
              title={t(workout.titleKey)}
              meta={[t('browse.minutes', { count: workout.estimatedMinutes })]}
              leading={workout.items[0] ? <ExerciseImage id={workout.items[0].exerciseId} variant="thumb" /> : undefined}
              onPress={() => router.push({ pathname: '/workout/[id]', params: { id: workout.id } })}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing[2] } });
