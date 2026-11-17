import { render } from '@testing-library/react-native';
import Constants from 'expo-constants';
import { Storage } from 'expo-sqlite/kv-store';

import { setKv } from '@/modules/core/kv';
import { darkColors, gradients, lightColors, ThemeProvider } from '@/modules/core/theme';
import { ShareCard, shareMessage, type ShareCardData } from './ShareCard';

jest.mock('expo-constants', () => ({ __esModule: true,
  default: { expoConfig: { name: 'Test fitness app' } } }));
jest.mock('react-native-svg', () => {
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { __esModule: true, default: Native.View, Circle: Native.View, Rect: Native.View,
    Defs: Native.View, LinearGradient: Native.View, Text: Native.Text,
    Stop: (props: Record<string, unknown>) => <Native.View {...props} testID="gradient-stop" /> };
});

const data: ShareCardData = { completedCount: 4,
  summary: { durationSec: 725, completionPct: 100, kcal: 83.4, localDate: '2026-10-01' },
  progress: { streak: 3, weeklyDone: 2, weeklyTarget: 4 } };

beforeEach(() => Storage.clearSync());

it.each(['light', 'dark'] as const)('exports readable %s theme text and accurate active-day copy', async (scheme) => {
  setKv('settings.theme', scheme);
  const screen = await render(<ThemeProvider><ShareCard {...data} /></ThemeProvider>);
  const colors = scheme === 'dark' ? darkColors : lightColors;
  expect(screen.getByText('Test fitness app').props.fill).toBe(colors.primary);
  expect(screen.getByText('Workout complete').props.fill).toBe(colors.text.strong);
  expect(screen.getByText('2 of 4 active days this week').props.fill).toBe(colors.text.secondary);
  expect(screen.getByText('83')).toBeTruthy();
  expect(screen.getAllByTestId('gradient-stop').map((node) => node.props.stopColor)).toEqual(
    scheme === 'dark' ? [...gradients.finishDark] : [...gradients.finishLight],
  );
});

it('reads the configured app name in the exported summary rather than a fixed brand', () => {
  expect(Constants.expoConfig?.name).toBe('Test fitness app');
  expect(shareMessage(data)).toBe('Test fitness app: 4 exercises in 12 min.');
});
