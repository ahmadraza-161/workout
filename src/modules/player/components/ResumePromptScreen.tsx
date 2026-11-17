import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Button, Screen, Text } from '@/modules/core/ui';

import { clearPlayerSnapshot, getResumableSnapshot } from '../snapshot';
import { getPlayableWorkout, playableWorkoutTitle } from '../workout';

export function ResumePromptScreen() {
  const [snapshot] = useState(() => getResumableSnapshot(getPlayableWorkout));
  if (!snapshot) return <Redirect href="/training" />;
  const workout = getPlayableWorkout(snapshot.state.workoutId);
  if (!workout) return <Redirect href="/training" />;

  return (
    <Screen background="plain">
      <View style={styles.content}>
        <Text variant="h1">{t('player.resumeTitle')}</Text>
        <Text tone="secondary">{playableWorkoutTitle(workout)}</Text>
        <Button
          label={t('player.resume')}
          onPress={() => router.replace({ pathname: '/player/[id]', params: { id: workout.id, mode: 'resume' } })}
        />
        <Button
          label={t('player.discard')}
          variant="secondary"
          onPress={() => {
            clearPlayerSnapshot();
            router.replace('/training');
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { flex: 1, justifyContent: 'center', gap: spacing[5] } });
