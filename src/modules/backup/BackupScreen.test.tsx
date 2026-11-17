import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { BackupScreen } from './BackupScreen';
import { replaceUserData } from './repository';

jest.mock('expo-router', () => ({ router: { back: jest.fn(), dismissAll: jest.fn(), replace: jest.fn() } }));
jest.mock('@/modules/core/theme', () => ({ spacing: { 4: 16 }, useTheme: () => ({ reloadPreference: jest.fn() }) }));
jest.mock('@/modules/reminders', () => ({ restoreReminders: jest.fn().mockResolvedValue(true) }));
jest.mock('./files', () => ({ exportBackup: jest.fn(), pickBackup: jest.fn(), clearCachedBackup: jest.fn() }));
jest.mock('./repository', () => ({ replaceUserData: jest.fn() }));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    Screen: Native.View, Card: Native.View, Text: Native.Text, StackHeader: () => null,
    Button: ({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) =>
      React.createElement(Native.Pressable, { onPress, disabled }, React.createElement(Native.Text, null, label)),
  };
});

afterEach(() => { jest.restoreAllMocks(); jest.clearAllMocks(); });

it('requires both reset confirmations before deleting data', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  await render(<BackupScreen />);
  await fireEvent.press(screen.getByText('Reset all data'));
  expect(replaceUserData).not.toHaveBeenCalled();
  await act(() => alert.mock.calls[0]?.[2]?.[1]?.onPress?.());
  expect(alert).toHaveBeenCalledTimes(2);
  expect(replaceUserData).not.toHaveBeenCalled();
  await act(() => alert.mock.calls[1]?.[2]?.[1]?.onPress?.());
  expect(replaceUserData).toHaveBeenCalledWith(null);
});

it('keeps data when reset is cancelled', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  await render(<BackupScreen />);
  await fireEvent.press(screen.getByText('Reset all data'));
  await act(() => alert.mock.calls[0]?.[2]?.[0]?.onPress?.());
  expect(replaceUserData).not.toHaveBeenCalled();
  expect(alert).toHaveBeenCalledTimes(1);
});
