import { router, useIsFocused } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ExerciseImage, getExercise } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { gradients, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Pencil } from 'lucide-react-native';
import { Banner, Button, Card, EmptyState, ErrorState, Row, Screen, Section, StackHeader, Text } from '@/modules/core/ui';

import { customAsWorkout } from './model';
import { deleteCustomWorkout, listCustomWorkouts, type SavedCustom } from './repository';

function CustomCard({ saved, onDeleted }: { saved: SavedCustom; onDeleted: () => void }) {
  const playable = customAsWorkout(saved.id, saved.plan, getExercise);
  return <Card style={styles.content}>
    <Row title={saved.title} leading={<ExerciseImage id={saved.plan.items[0]!.exerciseId} variant="thumb" />}
      meta={[t('builder.selected', { count: saved.plan.items.length })]} />
    <Button label={t('player.start')} disabled={!playable}
      onPress={() => router.push({ pathname: '/player/[id]', params: { id: saved.id, mode: 'new' } })} />
    <Button variant="secondary" label={t('builder.edit')}
      onPress={() => router.push({ pathname: '/builder', params: { editId: saved.id } })} />
    <Button variant="plainLink" label={t('builder.delete')} onPress={() => {
      Alert.alert(t('builder.deleteTitle'), t('builder.deleteBody'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('builder.delete'), style: 'destructive', onPress: () => {
          try { deleteCustomWorkout(saved.id); onDeleted(); }
          catch { Alert.alert(t('builder.saveError')); }
        } },
      ]);
    }} />
  </Card>;
}

export function CustomWorkoutsScreen() {
  return <Screen scroll>
    <StackHeader title={t('builder.myWorkouts')} onBack={() => router.back()} />
    <CustomWorkoutSection full />
  </Screen>;
}

export function CustomWorkoutSection({ full = false }: { full?: boolean }) {
  const { colors } = useTheme();
  const focused = useIsFocused();
  const [, setRevision] = useState(0);
  const saved = (() => {
    if (!focused) return [];
    try { return listCustomWorkouts(); } catch { return null; }
  })();
  return <Section title={t('builder.myWorkouts')} headerPadding={spacing[0]}
    actionLabel={full ? undefined : t('common.viewAll')} onAction={full ? undefined : () => router.push('/custom-workouts')}>
    <View style={styles.content}>
      <Banner title={t('builder.create')} subtitle={full ? t('browseUi.createHint') : undefined} gradient={gradients.create}
        countLabel={t('browseUi.go')} artwork={<View style={styles.createIcon}><Pencil size={sizes.finishIcon} color={colors.onPrimary} /></View>}
        onPress={() => router.push('/builder')} />
      {saved === null ? <ErrorState onRetry={() => setRevision((value) => value + 1)} />
        : full && !saved.length ? <EmptyState title={t('builder.emptyTitle')} body={t('builder.emptyBody')} />
          : full ? saved.map((item) => <CustomCard key={item.id} saved={item}
            onDeleted={() => setRevision((value) => value + 1)} />) : saved.length ? <Text tone="secondary">{t('browseUi.savedWorkouts', { count: saved.length })}</Text> : null}
    </View>
  </Section>;
}

const styles = StyleSheet.create({ content: { gap: spacing[3], paddingBottom: spacing[3] }, createIcon: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
