import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { act, render } from '@testing-library/react-native';
import { createRef } from 'react';
import { BackHandler, Text } from 'react-native';

import { Sheet } from './Sheet';

jest.mock('expo-router', () => ({ useIsFocused: () => true }));
jest.mock('../theme', () => ({ radius: { xxl: 24 }, spacing: { 4: 16, 8: 32 },
  useTheme: () => ({ isDark: false, colors: { surface: { default: 'white', row: 'gray' } } }),
}));
jest.mock('@gorhom/bottom-sheet', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { BottomSheetBackdrop: () => null, BottomSheetView: Native.View, BottomSheetScrollView: Native.View,
    BottomSheetModal: ({ ref, children, onChange, onDismiss }: {
      ref: import('react').Ref<unknown>; children: import('react').ReactNode; onChange: (index: number) => void; onDismiss: () => void;
    }) => {
      React.useImperativeHandle(ref, () => ({ present: () => onChange(0), dismiss: () => onDismiss() }));
      return React.createElement(Native.View, null, children);
    },
  };
});

it('forwards the modal ref and consumes Back only while the sheet is open', async () => {
  const ref = createRef<BottomSheetModal>();
  let handler: Parameters<typeof BackHandler.addEventListener>[1] | undefined;
  const remove = jest.fn();
  const listener = jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, callback) => {
    handler = callback;
    return { remove };
  });
  const view = await render(<Sheet ref={ref}><Text>Sheet content</Text></Sheet>);
  expect(listener).not.toHaveBeenCalled();
  await act(() => { ref.current?.present(); });
  expect(listener).toHaveBeenCalledTimes(1);
  await act(() => { expect(handler?.({ type: 'hardwareBackPress', timeStamp: 0 })).toBe(true); });
  expect(remove).toHaveBeenCalledTimes(1);
  await view.unmount();
  expect(ref.current).toBeNull();
  listener.mockRestore();
});
