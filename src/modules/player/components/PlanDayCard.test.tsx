import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { ThemeProvider } from '@/modules/core/theme';

import { PlanDayCard } from './PlanDayCard';

jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('@/modules/core/i18n', () => ({
  t: (key: string, params?: Record<string, unknown>) => (params ? `${key} ${JSON.stringify(params)}` : key),
}));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { Text: Native.Text, GradientBackground: () => null,
    Button: ({ label, onPress }: { label: string; onPress: () => void }) =>
      React.createElement(Native.Pressable, { onPress }, React.createElement(Native.Text, null, label)) };
});

const next = { kind: 'next', challengeId: 'ch', titleKey: 'plan.title', day: 2, doneDays: 2, trainingDays: 13,
  nextDay: 3, tomorrowRest: false } as const;

it('celebrates the day and names tomorrow\'s workout', async () => {
  await render(<ThemeProvider><PlanDayCard outcome={{ ...next, nextTitleKey: 'workout.title' }} /></ThemeProvider>);
  expect(screen.getByText('player.finish.dayDoneTitle {"day":2}')).toBeTruthy();
  expect(screen.getByText('player.finish.tomorrowDay {"day":3,"workout":"workout.title"}')).toBeTruthy();
});

it('mentions a rest day tomorrow', async () => {
  await render(<ThemeProvider><PlanDayCard outcome={{ ...next, tomorrowRest: true, nextDay: 4 }} /></ThemeProvider>);
  expect(screen.getByText('player.finish.tomorrowRest {"day":4}')).toBeTruthy();
});

it('shows plan complete and opens the plan picker', async () => {
  await render(<ThemeProvider><PlanDayCard outcome={{ kind: 'complete', challengeId: 'ch', titleKey: 'plan.title', trainingDays: 13 }} /></ThemeProvider>);
  expect(screen.getByText('player.finish.planCompleteTitle')).toBeTruthy();
  await fireEvent.press(screen.getByText('player.finish.chooseNextPlan'));
  expect(router.replace).toHaveBeenCalledWith('/plan');
});
