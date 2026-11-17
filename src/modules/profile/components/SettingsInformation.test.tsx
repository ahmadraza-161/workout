import { render, screen, fireEvent } from '@testing-library/react-native';
import { SettingsInformation } from './SettingsInformation';

jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { name: 'Test app', version: '9.8.7' } } }));
jest.mock('@/modules/core/i18n', () => ({ t: (key: string, options?: { version?: string }) => options?.version ? `${key} ${options.version}` : key }));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  const button = (label: string, onPress: () => void) => React.createElement(Native.Pressable, { onPress }, React.createElement(Native.Text, null, label));
  return { Sheet: Native.View, Text: Native.Text,
    SheetHeader: ({ title, onClose }: { title: string; onClose: () => void }) => button(title, onClose),
    Row: ({ title, onPress }: { title: string; onPress: () => void }) => button(title, onPress),
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => button(label, onPress),
    TextField: ({ label, ...props }: { label: string }) => React.createElement(Native.TextInput, { ...props, accessibilityLabel: label }),
  };
});

it('reads app identity from config and exposes offline privacy/reset information', async () => {
  const props = { sheetRef: { current: null }, onClose: jest.fn() };
  const view = await render(<SettingsInformation {...props} kind="about" />);
  expect(screen.getByText('Test app')).toBeTruthy();
  expect(screen.getByText('settings.info.about.version 9.8.7')).toBeTruthy();
  await view.rerender(<SettingsInformation {...props} kind="privacy" />);
  expect(screen.getByText('settings.info.privacy.deleteBody')).toBeTruthy();
  await fireEvent.press(screen.getByText('settings.info.privacy.title'));
  expect(props.onClose).toHaveBeenCalledTimes(1);
});

it('searches bundled notices and opens the complete Poppins licence without a network link', async () => {
  await render(<SettingsInformation sheetRef={{ current: null }} onClose={() => {}} kind="credits" />);
  await fireEvent.changeText(screen.getByLabelText('settings.info.credits.search'), 'Poppins');
  await fireEvent.press(screen.getByText('Poppins'));
  expect(screen.getByText(/Copyright 2020 The Poppins Project Authors/)).toBeTruthy();
  await fireEvent.press(screen.getByText('common.back'));
  await fireEvent.changeText(screen.getByLabelText('settings.info.credits.search'), 'no-matching-package');
  expect(screen.getByText('settings.info.credits.empty')).toBeTruthy();
}, 15000);
