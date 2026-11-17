import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';
import { INITIAL_ONBOARDING_DRAFT } from '../onboarding';
import { ChoiceStep, LEVEL_OPTIONS, ReadyStep } from './OnboardingSteps';

jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('@/modules/content', () => ({ CharacterArtwork: () => null }));

it('keeps level choices mutually exclusive when selecting a described card', async () => {
  function Harness() {
    const [value, setValue] = useState<'1' | '2' | '3'>('1');
    return <ChoiceStep options={LEVEL_OPTIONS} value={value} onChange={setValue} />;
  }
  await render(<ThemeProvider><Harness /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('radio', { name: t('level.intermediate') }));
  expect(screen.getByRole('radio', { name: t('level.intermediate'), checked: true })).toBeTruthy();
  expect(screen.getByRole('radio', { name: t('level.beginner'), checked: false })).toBeTruthy();
  expect(screen.getByText(t('onboarding.levelHint.2'))).toBeTruthy();
});

it('reviews selected preferences while retaining advice for a positive safety answer', async () => {
  await render(<ThemeProvider><ReadyStep draft={{ ...INITIAL_ONBOARDING_DRAFT,
    goal: 'build_muscle', level: 3, daysPerWeekTarget: 2, safetyAnswers: [true, false, false, false, false, false, false] }} /></ThemeProvider>);
  expect(screen.getByText(t('onboarding.goal.build_muscle'))).toBeTruthy();
  expect(screen.getByText(t('level.advanced'))).toBeTruthy();
  expect(screen.getByText(t('onboarding.daysPerWeek', { count: 2 }))).toBeTruthy();
  expect(screen.getByText(t('onboarding.medicalAdvice'))).toBeTruthy();
});
