import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { t } from '@/modules/core/i18n';
import { radius, spacing, useTheme } from '@/modules/core/theme';
import { EmptyState, Screen, StackHeader } from '@/modules/core/ui';

import { getExercise } from '../repository';
import { ExerciseGuide } from './ExerciseGuide';
export function ExerciseDetailScreen({ id }: { id: string }) {
  const { colors } = useTheme();
  const exercise = getExercise(id);
  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/discover');
  };
  if (!exercise) {
    return (
      <Screen background="plain">
        <StackHeader title={t('browse.exercises')} onBack={close} />
        <EmptyState title={t('browse.notFound')} />
      </Screen>
    );
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
        onPress={close} accessible accessibilityRole="button" accessibilityLabel={t('a11y.close')} />
      <View style={[styles.sheet, { backgroundColor: colors.surface.default }]}>
        <ExerciseGuide key={id} exercise={exercise} onClose={close} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, paddingTop: spacing[12], justifyContent: 'flex-end' },
  sheet: { flex: 1, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, overflow: 'hidden' },
});
