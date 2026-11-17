import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ExerciseImage, getExercise, type WorkoutItem } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Card, IconButton, Row, Stepper, Text } from '@/modules/core/ui';

export function ItemEditor({ item, index, count, onChange, onMove, onRemove }: {
  item: WorkoutItem; index: number; count: number;
  onChange: (item: WorkoutItem) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void;
}) {
  const exercise = getExercise(item.exerciseId);
  return <Card style={styles.content}>
    <Row title={t(exercise?.nameKey ?? 'browse.notFound')} leading={<ExerciseImage id={item.exerciseId} variant="thumb" />} />
    <Text>{t(item.seconds !== undefined ? 'builder.seconds' : 'builder.reps')}</Text>
    <Stepper label={t(item.seconds !== undefined ? 'builder.seconds' : 'builder.reps')}
      value={item.seconds ?? item.reps ?? 1} min={1} max={item.seconds !== undefined ? 3600 : 1000}
      onChange={(value) => onChange({ ...item, ...(item.seconds !== undefined ? { seconds: value } : { reps: value }) })} />
    <Text>{t('builder.rest')}</Text>
    <Stepper label={t('builder.rest')} value={item.rest} min={0} max={120}
      onChange={(rest) => onChange({ ...item, rest })} />
    <View style={styles.actions}>
      <IconButton icon={ArrowUp} accessibilityLabel={t('builder.moveUp')} disabled={index === 0} onPress={() => onMove(-1)} />
      <IconButton icon={ArrowDown} accessibilityLabel={t('builder.moveDown')} disabled={index === count - 1} onPress={() => onMove(1)} />
      <IconButton icon={Trash2} accessibilityLabel={t('builder.remove')} onPress={onRemove} />
    </View>
  </Card>;
}

const styles = StyleSheet.create({ content: { gap: spacing[3] }, actions: { flexDirection: 'row', gap: spacing[3] } });
