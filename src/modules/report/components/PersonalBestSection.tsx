import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getExercise } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Row, Section } from '@/modules/core/ui';

import type { PersonalBests } from '../records';

function openSession(id: string) {
  router.push({ pathname: '/session/[id]', params: { id } });
}

export function PersonalBestSection({ bests }: { bests: PersonalBests }) {
  const workoutMinutes = bests.workout ? Math.floor(bests.workout.seconds / 60) : 0;
  const workoutSeconds = bests.workout ? bests.workout.seconds % 60 : 0;
  return (
    <Section title={t('report.best.title')} headerPadding={spacing[0]}>
      <View style={styles.rows}>
        <Row title={t('report.best.plank')}
          meta={[bests.plank ? t('player.seconds', { count: bests.plank.seconds }) : t('report.best.none')]}
          container="card" onPress={bests.plank ? () => openSession(bests.plank!.sessionId) : undefined} />
        <Row title={t('report.best.reps')}
          meta={[bests.reps ? t('player.reps', { count: bests.reps.count }) : t('report.best.none'),
            bests.reps ? t(getExercise(bests.reps.exerciseId)?.nameKey ?? 'report.unknownExercise') : null]}
          container="card" onPress={bests.reps ? () => openSession(bests.reps!.sessionId) : undefined} />
        <Row title={t('report.best.workout')}
          meta={[bests.workout ? t('report.best.duration', { minutes: workoutMinutes, seconds: workoutSeconds }) : t('report.best.none')]}
          container="card" onPress={bests.workout ? () => openSession(bests.workout!.sessionId) : undefined} />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({ rows: { gap: spacing[2] } });
