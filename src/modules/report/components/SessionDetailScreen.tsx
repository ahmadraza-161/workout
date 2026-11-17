import { format } from 'date-fns';
import { router } from 'expo-router';
import { Clock3, Dumbbell, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getExercise } from '@/modules/content';
import { sessionWorkoutTitle } from '../workoutTitle';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { EmptyState, ErrorState, Row, Screen, Section, StackHeader, StatCard, Text } from '@/modules/core/ui';

import { getSession, listSessionItems } from '../repository';

export function SessionDetailScreen({ id }: { id: string | undefined }) {
  const [, setRevision] = useState(0);
  const data = (() => {
    if (!id) return null;
    try {
      const session = getSession(id);
      return session ? { session, items: listSessionItems(id) } : null;
    } catch {
      return 'error' as const;
    }
  })();

  return (
    <Screen scroll>
      <View style={styles.content}>
        <StackHeader title={t('report.sessionDetail')} onBack={() => router.back()} />
        {data === 'error' ? <ErrorState onRetry={() => setRevision((value) => value + 1)} /> : !data ? (
          <EmptyState title={t('report.sessionMissing')} body={t('report.sessionMissingBody')} />
        ) : (
          <>
            <Text variant="h2">{sessionWorkoutTitle(data.session.workoutId)}</Text>
            <Text tone="secondary">{format(new Date(data.session.startedAt), 'MMMM d, yyyy · h:mm a')}</Text>
            <StatCard stats={[
              { icon: Dumbbell, value: `${data.session.completionPct}%`, label: t('report.complete') },
              { icon: Clock3, value: String(Math.round(data.session.durationSec / 60)), label: t('report.minutes') },
              { icon: Flame, value: String(Math.round(data.session.kcal)), label: t('report.kcal') },
            ]} />
            <Section title={t('report.exercises')} headerPadding={spacing[0]}>
              {data.items.length === 0 ? <EmptyState title={t('report.noExercises')} /> : data.items.map((item) => (
                <Row key={item.id}
                  title={t(getExercise(item.exerciseId)?.nameKey ?? 'report.unknownExercise')}
                  meta={[item.skipped ? t('report.skipped') : item.doneReps !== null
                    ? t('player.reps', { count: item.doneReps })
                    : t('player.seconds', { count: item.doneSeconds })]}
                  container="card"
                  onPress={getExercise(item.exerciseId)
                    ? () => router.push({ pathname: '/exercise/[id]', params: { id: item.exerciseId } })
                    : undefined} />
              ))}
            </Section>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing[6], paddingBottom: spacing[8] } });
