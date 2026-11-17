import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { t } from '@/modules/core/i18n';
import { KV_DEFAULTS } from '@/modules/core/kv';
import { ThemeProvider } from '@/modules/core/theme';
import type { WorkoutSettings } from '@/modules/profile';
import { WorkoutSettingsSheet } from './WorkoutSettingsSheet';

jest.mock('@/modules/profile', () => ({ CueSettings: () => null }));
jest.mock('@/modules/core/ui/Sheet', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { Sheet: React.forwardRef(function MockSheet({ children }: { children: import('react').ReactNode }, ref) {
    React.useImperativeHandle(ref, () => ({ present: jest.fn(), dismiss: jest.fn() }));
    return React.createElement(Native.View, null, children);
  }) };
});

it('resets to default, persists an exact wheel value and can disable rest', async () => {
  const save = jest.fn();
  function Harness() {
    const [settings, setSettings] = useState<WorkoutSettings>({ beeps: false, haptics: false, quietMode: false,
      restEnabled: true, restSeconds: 25, prepSeconds: 15 });
    return <ThemeProvider><WorkoutSettingsSheet sheetRef={null} settings={settings} onClose={() => undefined}
      onChange={(change) => { save(change); setSettings((current) => ({ ...current, ...change })); }} /></ThemeProvider>;
  }
  await render(<Harness />);
  await fireEvent.press(screen.getByLabelText(t('player.editRest')));
  await fireEvent.press(screen.getByText(t('restTimerUi.default')));
  const initial = KV_DEFAULTS['settings.timers.restSeconds'];
  expect(save).toHaveBeenLastCalledWith({ restSeconds: initial });
  expect(screen.getByRole('adjustable').props.accessibilityValue.text).toBe(t('browse.seconds', { count: initial }));
  await fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
  expect(save).toHaveBeenLastCalledWith({ restSeconds: initial + 1 });
  await fireEvent(screen.getByLabelText(t('settings.restEnabled')), 'valueChange', false);
  expect(save).toHaveBeenLastCalledWith({ restEnabled: false });
  expect(screen.queryByRole('adjustable')).toBeNull();
});
