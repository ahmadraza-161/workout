import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Button, EmptyState, Screen, StackHeader, Text } from '@/modules/core/ui';

import { INITIAL_ONBOARDING_DRAFT, validateOnboarding, type OnboardingDraft } from '../onboarding';
import { getProfile, updateProfile } from '../repository';
import { BodyStep, ChoiceStep, GENDER_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS, ScheduleStep } from './OnboardingSteps';

function loadDraft(): OnboardingDraft | null {
  const profile = getProfile();
  if (!profile) return null;
  return {
    ...INITIAL_ONBOARDING_DRAFT,
    gender: profile.gender ?? 'unspecified',
    goal: profile.goal ?? 'keep_fit',
    level: profile.level === 2 || profile.level === 3 ? profile.level : 1,
    heightCm: profile.heightCm?.toString() ?? '',
    weightKg: profile.weightKg?.toString() ?? '',
    birthYear: profile.birthYear?.toString() ?? '',
    daysPerWeekTarget: profile.daysPerWeekTarget,
    adultConfirmed: true,
    safetyAnswers: Array.from({ length: 7 }, () => false),
  };
}

export function ProfileScreen() {
  const [draft, setDraft] = useState(loadDraft);
  const [error, setError] = useState<string | null>(null);

  function update(change: Partial<OnboardingDraft>) {
    setDraft((current) => current ? { ...current, ...change } : null);
    setError(null);
  }

  function save() {
    if (!draft) return;
    const result = validateOnboarding(draft, new Date().getFullYear());
    if (!result.value) {
      setError(t(`onboarding.error.${result.error}`));
      return;
    }
    try {
      updateProfile(result.value);
      router.back();
    } catch {
      setError(t('errors.generic.body'));
    }
  }

  return <Screen background="plain" scroll>
    <StackHeader title={t('settings.profile')} onBack={() => router.back()} />
    {!draft ? <EmptyState title={t('errors.generic.title')} body={t('errors.generic.body')} /> : (
      <View style={styles.content}>
        <Text variant="h3">{t('onboarding.genderTitle')}</Text>
        <ChoiceStep options={GENDER_OPTIONS} value={draft.gender} onChange={(gender) => update({ gender })} />
        <Text variant="h3">{t('onboarding.goalTitle')}</Text>
        <ChoiceStep options={GOAL_OPTIONS} value={draft.goal} onChange={(goal) => update({ goal })} />
        <Text variant="h3">{t('onboarding.levelTitle')}</Text>
        <ChoiceStep options={LEVEL_OPTIONS} value={String(draft.level) as '1' | '2' | '3'}
          onChange={(value) => update({ level: Number(value) as 1 | 2 | 3 })} />
        <BodyStep draft={draft} onChange={update} />
        <ScheduleStep target={draft.daysPerWeekTarget} onChange={(daysPerWeekTarget) => update({ daysPerWeekTarget })} />
        {error ? <Text tone="secondary">{error}</Text> : null}
        <Button label={t('common.save')} onPress={save} />
      </View>
    )}
  </Screen>;
}

const styles = StyleSheet.create({ content: { gap: spacing[5], paddingBottom: spacing[8] } });
