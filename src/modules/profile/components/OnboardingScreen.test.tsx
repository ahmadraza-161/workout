import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { ThemeProvider } from '@/modules/core/theme';

import { OnboardingScreen } from './OnboardingScreen';
import { saveOnboardingProfile } from '../repository';

let mockBack: () => boolean;
jest.mock('@/modules/core/navigation', () => ({ useAndroidBack: (handler: () => boolean) => { mockBack = handler; } }));
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('@/modules/core/i18n', () => ({ t: (key: string) => key }));
jest.mock('@/modules/content', () => ({ getWorkout: () => ({ id: 'first' }), CharacterArtwork: () => null }));
jest.mock('../repository', () => ({ saveOnboardingProfile: jest.fn() }));
jest.mock('@/modules/reminders', () => ({ OnboardingReminderChoice: () => null }));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { Screen: Native.View, Text: Native.Text, ProgressBar: () => null,
    IconButton: ({ accessibilityLabel, onPress }: { accessibilityLabel: string; onPress: () => void }) =>
      React.createElement(Native.Pressable, { accessibilityLabel, onPress }),
    Button: ({ label, onPress }: { label: string; onPress: () => void }) =>
    React.createElement(Native.Pressable, { onPress }, React.createElement(Native.Text, null, label)) };
});
jest.mock('./OnboardingSteps', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  const button = (label: string, onPress: () => void) => React.createElement(Native.Pressable, { onPress }, React.createElement(Native.Text, null, label));
  return { GENDER_OPTIONS: [], GOAL_OPTIONS: [], LEVEL_OPTIONS: [],
    StepFrame: ({ title, children }: { title: string; children: import('react').ReactNode }) => React.createElement(Native.View, null, React.createElement(Native.Text, null, title), children),
    BodyStep: () => null, ChoiceStep: () => null, GenderStep: () => null, ReadyStep: () => null, ScheduleStep: () => null,
    SafetyStep: ({ onAdultConfirm, onChange }: { onAdultConfirm: () => void; onChange: (index: number, value: boolean) => void }) =>
      React.createElement(Native.View, null, button('Confirm adult', onAdultConfirm),
        ...Array.from({ length: 7 }, (_, index) => button(`Answer ${index}`, () => onChange(index, false))),
        button('Yes to first question', () => onChange(0, true))),
  };
});
beforeEach(() => jest.clearAllMocks());

it('Back moves within onboarding and a repeated finish saves only one profile', async () => {
  await render(<ThemeProvider><OnboardingScreen /></ThemeProvider>);
  expect(mockBack!()).toBe(false);
  await fireEvent.press(screen.getByText('onboarding.getStarted'));
  await fireEvent.press(screen.getByLabelText('onboarding.back'));
  expect(screen.getByText('onboarding.welcome')).toBeTruthy();
  await fireEvent.press(screen.getByText('onboarding.getStarted'));
  await act(() => { expect(mockBack!()).toBe(true); });
  expect(screen.getByText('onboarding.welcome')).toBeTruthy();
  await fireEvent.press(screen.getByText('onboarding.getStarted'));
  for (let step = 1; step < 6; step++) await fireEvent.press(screen.getByText('onboarding.continue'));
  await fireEvent.press(screen.getByText('Confirm adult'));
  for (let index = 0; index < 7; index++) await fireEvent.press(screen.getByText(`Answer ${index}`));
  await fireEvent.press(screen.getByText('onboarding.continue'));
  await fireEvent.press(screen.getByText('onboarding.seePlan'));
  await fireEvent.press(screen.getByText('onboarding.seePlan'));
  expect(saveOnboardingProfile).toHaveBeenCalledTimes(1);
  expect(router.replace).toHaveBeenCalledTimes(1);
  expect(router.replace).toHaveBeenCalledWith('/training');
});

it('requires safety answers and adult confirmation, then opens Home with the plan', async () => {
  await render(<ThemeProvider><OnboardingScreen /></ThemeProvider>);
  await fireEvent.press(screen.getByText('onboarding.getStarted'));
  for (let step = 1; step < 6; step++) await fireEvent.press(screen.getByText('onboarding.continue'));
  await fireEvent.press(screen.getByText('onboarding.continue'));
  expect(screen.getByText('onboarding.error.safety')).toBeTruthy();
  for (let index = 0; index < 7; index++) await fireEvent.press(screen.getByText(`Answer ${index}`));
  await fireEvent.press(screen.getByText('onboarding.continue'));
  expect(screen.getByText('onboarding.error.adult')).toBeTruthy();
  await fireEvent.press(screen.getByText('Confirm adult'));
  await fireEvent.press(screen.getByText('Yes to first question'));
  await fireEvent.press(screen.getByText('onboarding.continue'));
  await fireEvent.press(screen.getByText('onboarding.seePlan'));
  expect(router.replace).toHaveBeenCalledWith('/training');
});
