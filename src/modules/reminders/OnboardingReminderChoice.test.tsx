import { render, screen, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import { OnboardingReminderChoice } from './OnboardingReminderChoice';
import { loadReminderSchedule } from './service';

jest.mock('expo-router', () => ({ router: { push: jest.fn() }, useIsFocused: () => true }));
jest.mock('expo-localization', () => ({ useCalendars: () => [{ uses24hourClock: false }] }));
jest.mock('./service', () => ({ loadReminderSchedule: jest.fn() }));
jest.mock('@/modules/core/i18n', () => ({ t: (key: string, options?: { time?: string }) => options?.time ? `${key} ${options.time}` : key }));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { Card: Native.View, Text: Native.Text, ErrorState: () => null,
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => React.createElement(Native.Pressable, { onPress }, React.createElement(Native.Text, null, label)) };
});

it('opens optional setup and reflects the saved reminder schedule on return', async () => {
  jest.mocked(loadReminderSchedule).mockReturnValue({ enabled: false, days: [2], hour: 18, minute: 0 });
  const view = await render(<OnboardingReminderChoice />);
  expect(screen.getByText('onboarding.reminderOff')).toBeTruthy();
  await fireEvent.press(screen.getByText('onboarding.reminderSetup'));
  expect(router.push).toHaveBeenCalledWith('/settings/reminders');
  jest.mocked(loadReminderSchedule).mockReturnValue({ enabled: true, days: [2], hour: 0, minute: 5 });
  await view.rerender(<OnboardingReminderChoice />);
  expect(screen.getByText('onboarding.reminderSummary 12:05 reminders.am')).toBeTruthy();
});
