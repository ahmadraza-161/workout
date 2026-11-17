import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';
import { SettingsScreen } from './SettingsScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn() }, useIsFocused: () => true }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('./SettingsInformation', () => ({ SettingsInformation: () => null }));
jest.mock('./CueSettings', () => ({ CueSettings: () => null }));
jest.mock('../settings', () => ({ loadUnitSystem: () => 'metric', saveUnitSystem: jest.fn(), saveWorkoutSettings: jest.fn(),
  loadWorkoutSettings: () => ({ beeps: true, haptics: true, quietMode: false, restEnabled: true, restSeconds: 25, prepSeconds: 15 }) }));

it('keeps each grouped Settings action connected to its correct screen', async () => {
  await render(<ThemeProvider><SettingsScreen /></ThemeProvider>);
  for (const [key, path] of [['settings.profile', '/profile'], ['reminders.title', '/settings/reminders'], ['backup.title', '/settings/backup'], ['favorites.title', '/favorites']]) {
    await fireEvent.press(screen.getByLabelText(t(key!)));
    expect(router.push).toHaveBeenLastCalledWith(path);
  }
});
