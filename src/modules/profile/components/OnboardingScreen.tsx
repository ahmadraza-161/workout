import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/modules/core/i18n';
import { useAndroidBack } from '@/modules/core/navigation';
import { sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, IconButton, ProgressBar, Screen, Text } from '@/modules/core/ui';
import { OnboardingReminderChoice } from '@/modules/reminders';

import { INITIAL_ONBOARDING_DRAFT, validateOnboarding, type Gender, type OnboardingDraft } from '../onboarding';
import { saveOnboardingProfile } from '../repository';
import {
  BodyStep, ChoiceStep, GenderStep, GOAL_OPTIONS, LEVEL_OPTIONS,
  ReadyStep, SafetyStep, ScheduleStep, StepFrame,
} from './OnboardingSteps';
import { OnboardingWelcome } from './OnboardingWelcome';

const LAST_STEP = 7;

export function OnboardingScreen() {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL_ONBOARDING_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const finishing = useRef(false);

  function update(change: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...change }));
    setError(null);
  }

  function next() {
    const validation = validateOnboarding({ ...draft, adultConfirmed: true, safetyAnswers: Array(7).fill(false) }, new Date().getFullYear());
    if (step === 4 && validation.error && validation.error !== 'safety') {
      setError(t(`onboarding.error.${validation.error}`));
      return;
    }
    if (step === 6 && draft.safetyAnswers.some((answer) => answer === null)) {
      setError(t('onboarding.error.safety'));
      return;
    }
    if (step === 6 && !draft.adultConfirmed) {
      setError(t('onboarding.error.adult'));
      return;
    }
    setError(null);
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }

  function finish() {
    if (finishing.current) return;
    const validation = validateOnboarding(draft, new Date().getFullYear());
    if (!validation.value) {
      setError(t(`onboarding.error.${validation.error}`));
      return;
    }
    try {
      finishing.current = true;
      saveOnboardingProfile(validation.value);
      // Home welcomes the new user with a recommended plan and a clear first day.
      router.replace('/training');
    } catch {
      finishing.current = false;
      setError(t('errors.generic.body'));
    }
  }
  function back() {
    if (finishing.current) return true;
    if (!step) return false;
    setError(null);
    setStep((current) => current - 1);
    return true;
  }
  useAndroidBack(back);

  return <Screen background="plain">
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {step > 0 ? <IconButton icon={ArrowLeft} onPress={back} accessibilityLabel={t('onboarding.back')} />
          : <Image source={require('../../../../assets/images/splash-icon.png')} accessible={false} style={styles.brand} />}
        <Text variant="caption" style={styles.grow}>{t('app.name')}</Text>
        <Text variant="caption" tone="secondary">{t('onboarding.progress', { current: step + 1, total: LAST_STEP + 1 })}</Text>
      </View>
      <ProgressBar progress={(step + 1) / (LAST_STEP + 1)} />
    </View>
    <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView key={step} style={styles.fill} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {step === 0 ? <OnboardingWelcome /> : null}
      {step === 1 ? <StepFrame title={t('onboarding.genderTitle')}>
        <GenderStep value={draft.gender} onChange={(gender: Gender) => update({ gender })} />
      </StepFrame> : null}
      {step === 2 ? <StepFrame title={t('onboarding.goalTitle')}>
        <ChoiceStep options={GOAL_OPTIONS} value={draft.goal} onChange={(goal) => update({ goal })} />
      </StepFrame> : null}
      {step === 3 ? <StepFrame title={t('onboarding.levelTitle')}>
        <ChoiceStep options={LEVEL_OPTIONS} value={String(draft.level) as '1' | '2' | '3'}
          onChange={(value) => update({ level: Number(value) as 1 | 2 | 3 })} />
      </StepFrame> : null}
      {step === 4 ? <StepFrame title={t('onboarding.bodyTitle')}><BodyStep draft={draft} onChange={update} /></StepFrame> : null}
      {step === 5 ? <StepFrame title={t('onboarding.scheduleTitle')}>
        <ScheduleStep target={draft.daysPerWeekTarget} onChange={(daysPerWeekTarget) => update({ daysPerWeekTarget })} />
        <OnboardingReminderChoice />
      </StepFrame> : null}
      {step === 6 ? <StepFrame title={t('onboarding.safetyTitle')}>
        <SafetyStep answers={draft.safetyAnswers} adultConfirmed={draft.adultConfirmed}
          onAdultConfirm={() => update({ adultConfirmed: !draft.adultConfirmed })}
          onChange={(index, answer) => {
          const safetyAnswers = [...draft.safetyAnswers];
          safetyAnswers[index] = answer;
          update({ safetyAnswers });
        }} />
      </StepFrame> : null}
      {step === 7 ? <StepFrame title={t('onboarding.readyTitle')}><ReadyStep draft={draft} /></StepFrame> : null}
    </ScrollView>
    <SafeAreaView edges={['bottom']} style={[styles.footer, { borderTopColor: colors.line.divider }]}>
      {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: colors.semantic.errorText }}>{error}</Text> : null}
      <Button label={step === LAST_STEP ? t('onboarding.seePlan')
        : t(step === 0 ? 'onboarding.getStarted' : 'onboarding.continue')} onPress={step === LAST_STEP ? finish : next} />
    </SafeAreaView>
    </KeyboardAvoidingView>
  </Screen>;
}

const styles = StyleSheet.create({ fill: { flex: 1 }, header: { gap: spacing[3], paddingVertical: spacing[3] },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], minHeight: sizes.touchMin },
  brand: { width: sizes.onboardingBrand, height: sizes.onboardingBrand }, grow: { flex: 1 },
  content: { gap: spacing[6], paddingTop: spacing[5], paddingBottom: spacing[8] },
  footer: { gap: spacing[3], paddingVertical: spacing[4], borderTopWidth: StyleSheet.hairlineWidth } });
