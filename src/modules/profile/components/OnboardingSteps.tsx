import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { CharacterArtwork } from '@/modules/content';

import { t } from '@/modules/core/i18n';
import { radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Chip, Stepper, Text, TextField, Touchable } from '@/modules/core/ui';

import type { OnboardingDraft } from '../onboarding';
import { loadUnitSystem } from '../settings';
import { HeightField, WeightField } from './MeasurementFields';

export const GENDER_OPTIONS = (['female', 'male', 'unspecified'] as const).map((value) =>
  ({ value, label: t(`onboarding.gender.${value}`) }));
export const GOAL_OPTIONS = (['keep_fit', 'build_muscle', 'burn_fat', 'flexibility'] as const).map((value) =>
  ({ value, label: t(`onboarding.goal.${value}`), hint: t(`onboarding.goalHint.${value}`) }));
export const LEVEL_OPTIONS = (['1', '2', '3'] as const).map((value) =>
  ({ value, label: t(`level.${value === '1' ? 'beginner' : value === '2' ? 'intermediate' : 'advanced'}`), hint: t(`onboarding.levelHint.${value}`) }));

export function ChoiceStep<T extends string>({ options, value, onChange }: {
  options: readonly { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return <View style={styles.choices}>{options.map((option) => (
    <Touchable key={option.value} onPress={() => onChange(option.value)} accessibilityRole="radio"
      accessibilityLabel={option.label} accessibilityState={{ checked: value === option.value }}
      accessibilityHint={option.hint}
      style={[styles.choice, { backgroundColor: value === option.value ? colors.primaryTint : colors.surface.muted,
        borderColor: value === option.value ? colors.primary : colors.line.divider }]}>
      <View style={[styles.grow, styles.question]}><Text variant="title">{option.label}</Text>
        {option.hint ? <Text variant="caption" tone="secondary">{option.hint}</Text> : null}</View>
      {value === option.value ? <CheckCircle2 size={sizes.iconLg} color={colors.primary} /> : <Circle size={sizes.iconLg} color={colors.text.tertiary} />}
    </Touchable>
  ))}</View>;
}

export function GenderStep({ value, onChange }: { value: OnboardingDraft['gender']; onChange: (value: OnboardingDraft['gender']) => void }) {
  const { colors } = useTheme();
  return <View style={styles.fields}>
    <Text tone="secondary">{t('onboarding.characterNote')}</Text>
    <View style={styles.answer}>{(['male', 'female'] as const).map((gender) => <Touchable key={gender}
      accessibilityRole="radio" accessibilityLabel={t(`onboarding.gender.${gender}`)} accessibilityState={{ checked: value === gender }}
      onPress={() => onChange(gender)} style={[styles.portraitCard, { backgroundColor: value === gender ? colors.primaryTint : colors.surface.muted,
        borderColor: value === gender ? colors.primary : colors.line.divider }]}>
      <View style={styles.portrait}><CharacterArtwork pose={gender === 'male' ? 'trainer' : 'female'} /></View>
      <Text variant="title" style={styles.center}>{t(`onboarding.gender.${gender}`)}</Text>
    </Touchable>)}</View>
    <ChoiceStep options={GENDER_OPTIONS.filter((option) => option.value === 'unspecified')} value={value} onChange={onChange} />
  </View>;
}

export function BodyStep({ draft, onChange }: {
  draft: OnboardingDraft;
  onChange: (change: Partial<OnboardingDraft>) => void;
}) {
  const unit = loadUnitSystem();
  return (
    <View style={styles.fields}>
      <Text tone="secondary">{t('onboarding.bodyOptional')}</Text>
      <HeightField value={draft.heightCm} unit={unit} onChange={(heightCm) => onChange({ heightCm })} />
      <WeightField value={draft.weightKg} unit={unit} onChange={(weightKg) => onChange({ weightKg })} />
      <TextField label={t('onboarding.birthYear')} value={draft.birthYear} keyboardType="number-pad" maxLength={4}
        onChangeText={(birthYear) => onChange({ birthYear })} />
    </View>
  );
}

export function ScheduleStep({ target, onChange }: { target: number; onChange: (value: number) => void }) {
  return <View style={styles.fields}>
    <Text tone="secondary">{t('onboarding.scheduleBody')}</Text>
    <Stepper label={t('onboarding.weeklyTarget')} value={target} onChange={onChange} min={1} max={7} />
  </View>;
}

const SAFETY_QUESTIONS = [0, 1, 2, 3, 4, 5, 6];

export function SafetyStep({ answers, onChange, adultConfirmed, onAdultConfirm }: {
  answers: (boolean | null)[];
  onChange: (index: number, answer: boolean) => void;
  adultConfirmed: boolean;
  onAdultConfirm: () => void;
}) {
  const { colors } = useTheme();
  return <View style={styles.fields}>
    <Text tone="secondary">{t('onboarding.safetyIntro')}</Text>
    <Chip label={t('onboarding.adultConfirm')} selected={adultConfirmed} onPress={onAdultConfirm} />
    {SAFETY_QUESTIONS.map((index) => <View key={index} style={[styles.safetyCard, { backgroundColor: colors.surface.muted }]}>
      <Text>{t(`onboarding.safety.${index}`)}</Text>
      <View style={styles.answer}>
        <Chip label={t('onboarding.no')} selected={answers[index] === false} onPress={() => onChange(index, false)} />
        <Chip label={t('onboarding.yes')} selected={answers[index] === true} onPress={() => onChange(index, true)} />
      </View>
    </View>)}
  </View>;
}

export function ReadyStep({ draft }: { draft: OnboardingDraft }) {
  const { colors } = useTheme();
  const needsAdvice = draft.safetyAnswers.some((answer) => answer === true);
  return <View style={styles.fields}>
    <Text>{t('onboarding.readyBody')}</Text>
    <View style={[styles.review, { backgroundColor: colors.primaryTint }]}>
      <CheckCircle2 size={sizes.touchMin} color={colors.primary} />
      {([
        ['reviewGoal', t(`onboarding.goal.${draft.goal}`)],
        ['reviewLevel', t(`level.${draft.level === 1 ? 'beginner' : draft.level === 2 ? 'intermediate' : 'advanced'}`)],
        ['reviewSchedule', t('onboarding.daysPerWeek', { count: draft.daysPerWeekTarget })],
      ] as const).map(([key, value]) => <View key={key} style={styles.question}>
        <Text variant="caption" tone="secondary">{t(`onboarding.${key}`)}</Text><Text variant="title">{value}</Text>
      </View>)}
    </View>
    {needsAdvice ? <Text tone="secondary">{t('onboarding.medicalAdvice')}</Text> : null}
    <Text tone="secondary">{t('onboarding.disclaimer')}</Text>
  </View>;
}

export function StepFrame({ title, children }: { title: string; children: ReactNode }) {
  return <View style={styles.fields}><Text variant="h1">{title}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  fields: { gap: spacing[5] },
  choices: { gap: spacing[3] },
  choice: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[4], minHeight: sizes.onboardingChoice, borderWidth: 1, borderRadius: radius.lg },
  grow: { flex: 1 },
  portraitCard: { flex: 1, padding: spacing[3], borderWidth: 1, borderRadius: radius.xl },
  portrait: { height: sizes.onboardingPortrait }, center: { textAlign: 'center' },
  question: { gap: spacing[2] },
  safetyCard: { gap: spacing[3], padding: spacing[4], borderRadius: radius.lg },
  review: { gap: spacing[5], padding: spacing[5], borderRadius: radius.xxl },
  answer: { flexDirection: 'row', gap: spacing[3] },
});
