import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/modules/core/i18n';
import { radius, spacing, useTheme } from '@/modules/core/theme';
import { Button, SegmentedControl, Text } from '@/modules/core/ui';

import type { Exercise } from '../types';
import { ExerciseDemo } from './ExerciseDemo';
import { MuscleMap } from './MuscleMap';

type GuideTab = 'pose' | 'muscle' | 'how';

export function ExerciseGuide({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const { colors } = useTheme();
  const [tab, setTab] = useState<GuideTab>('pose');
  const instructions = translatedLines(exercise.instructionsKey);
  const mistakes = translatedLines(exercise.mistakesKey);
  const breathing = translatedLines(exercise.breathingKey);
  const tabs: { value: GuideTab; label: string }[] = [
    { value: 'pose', label: t('guide.pose') },
    { value: 'muscle', label: t('guide.muscle') },
    { value: 'how', label: t('guide.how') },
  ];

  return (
    <View style={styles.sheetBody}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="sheetTitle">{t(exercise.nameKey)}</Text>
        {tab === 'muscle' ? (
          <View style={[styles.mapStage, { backgroundColor: colors.surface.stage }]}>
            <MuscleMap primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} />
          </View>
        ) : tab === 'how' ? (
          <View style={[styles.howStage, { backgroundColor: colors.surface.stage }]}>
            {instructions.map((line, index) => <Text key={line}>{index + 1}. {line}</Text>)}
          </View>
        ) : <ExerciseDemo id={exercise.id} variant="guide" />}
        <SegmentedControl options={tabs} value={tab} onChange={setTab}
          appearance="primary" accessibilityLabel={t('guide.tabs')} />

        <View style={styles.duration}>
          <Text variant="guideHeading" tone="brand">{t('guide.duration')}</Text>
          <Text variant="guideValue" tone="secondary">{exercise.defaultSeconds !== null
            ? t('guide.seconds', { count: exercise.defaultSeconds })
            : t('guide.reps', { count: exercise.defaultReps ?? 0 })}</Text>
        </View>

        <GuideSection title={t('guide.instructions')} lines={instructions} />
        <View style={styles.section}>
          <Text variant="guideHeading" tone="brand">{t('guide.focus')}</Text>
          <View style={styles.chips}>
            {exercise.focusAreaKeys.map((key) => (
              <View key={key} style={[styles.chip, { backgroundColor: colors.surface.focusChip }]}>
                <View style={[styles.dot, { backgroundColor: colors.primaryFill }]} />
                <Text variant="body">{t(key)}</Text>
              </View>
            ))}
          </View>
          <MuscleMap primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} />
        </View>

        <View style={styles.section}>
          <Text variant="guideHeading" tone="brand">{t('guide.mistakes')}</Text>
          {mistakes.map((line, index) => (
            <View key={line} style={styles.numbered}>
              <View style={[styles.number, { backgroundColor: colors.primaryTint }]}>
                <Text tone="brand" variant="caption">{index + 1}</Text>
              </View>
              <Text style={styles.grow}>{line}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text variant="guideHeading" tone="brand">{t('guide.breathing')}</Text>
          {breathing.map((line) => <Text key={line}>• {line}</Text>)}
        </View>
        <Text tone="secondary" variant="caption">{t('guide.safety')}</Text>
        {exercise.easierId || exercise.harderId ? (
          <View style={styles.variations}>
            {exercise.easierId ? <Button label={t('guide.easier')} variant="secondary"
              onPress={() => router.replace({ pathname: '/exercise/[id]', params: { id: exercise.easierId! } })} /> : null}
            {exercise.harderId ? <Button label={t('guide.harder')} variant="secondary"
              onPress={() => router.replace({ pathname: '/exercise/[id]', params: { id: exercise.harderId! } })} /> : null}
          </View>
        ) : null}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Button label={t('guide.close')} onPress={onClose} />
      </SafeAreaView>
    </View>
  );
}

function GuideSection({ title, lines }: { title: string; lines: string[] }) {
  return (
    <View style={styles.section}>
      <Text variant="guideHeading" tone="brand">{title}</Text>
      {lines.map((line) => <Text key={line}>{line}</Text>)}
    </View>
  );
}

function translatedLines(key: string): string[] {
  const value: unknown = t(key);
  return Array.isArray(value)
    ? value.filter((line): line is string => typeof line === 'string' && line.trim().length > 0)
    : [];
}

const styles = StyleSheet.create({
  sheetBody: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[6], paddingBottom: spacing[8] },
  mapStage: { borderRadius: radius.lg, padding: spacing[4] },
  howStage: { borderRadius: radius.lg, padding: spacing[4], gap: spacing[3] },
  duration: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { gap: spacing[4] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radius.pill },
  dot: { width: spacing[2], height: spacing[2], borderRadius: radius.pill },
  numbered: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] },
  number: { width: spacing[6], height: spacing[6], borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1 },
  variations: { gap: spacing[3] },
  footer: { paddingHorizontal: spacing[4], paddingTop: spacing[3] },
});
