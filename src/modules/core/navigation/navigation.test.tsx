import { act, render } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

import { useAndroidBack } from './index';

let mockFocused = true;
jest.mock('expo-router', () => ({ useIsFocused: () => mockFocused }));
let handlers: Parameters<typeof BackHandler.addEventListener>[1][];
beforeEach(() => {
  mockFocused = true;
  handlers = [];
  jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, callback) => {
    handlers.push(callback);
    return { remove: () => { handlers = handlers.filter((handler) => handler !== callback); } };
  });
});
afterEach(() => jest.restoreAllMocks());

function Route({ onBack, enabled = true }: { onBack: () => boolean; enabled?: boolean }) {
  useAndroidBack(onBack, enabled);
  return null;
}
function back() {
  for (const handler of [...handlers].reverse()) if (handler({ type: 'hardwareBackPress', timeStamp: 0 })) return true;
  return false;
}

it('uses fresh draft state without changing registration priority and removes listeners on blur', async () => {
  const first = jest.fn(() => true);
  const latest = jest.fn(() => true);
  const view = await render(<Route onBack={first} />);
  await act(() => { back(); });
  expect(first).toHaveBeenCalledTimes(1);
  await view.rerender(<Route onBack={latest} />);
  expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
  await act(() => { back(); });
  expect(latest).toHaveBeenCalledTimes(1);
  mockFocused = false;
  await view.rerender(<Route onBack={latest} />);
  expect(handlers).toHaveLength(0);
  mockFocused = true;
  await view.rerender(<Route onBack={latest} />);
  expect(handlers).toHaveLength(1);
  await view.unmount();
  expect(handlers).toHaveLength(0);
});

it('gives an open overlay priority over a changing screen and releases it after closing', async () => {
  const screen = jest.fn(() => true);
  const overlay = jest.fn(() => true);
  const tree = (open: boolean) => <><Route onBack={() => screen()} /><Route enabled={open} onBack={overlay} /></>;
  const view = await render(tree(false));
  await view.rerender(tree(true));
  await view.rerender(tree(true));
  await act(() => { back(); });
  expect(overlay).toHaveBeenCalledTimes(1);
  expect(screen).not.toHaveBeenCalled();
  await view.rerender(tree(false));
  await act(() => { back(); });
  expect(screen).toHaveBeenCalledTimes(1);
});
