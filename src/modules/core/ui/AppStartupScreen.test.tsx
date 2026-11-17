import { act, fireEvent, render } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { motion } from '../theme';
import { t } from '../i18n';
import { AppStartupScreen } from './AppStartupScreen';

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

function mockAnimation() {
  const completions: ((result: { finished: boolean }) => void)[] = [];
  const timing = jest.spyOn(Animated, 'timing').mockImplementation(() => ({
    start: (callback) => { if (callback) completions.push(callback); },
    stop: jest.fn(), reset: jest.fn(),
  }));
  return { timing, complete: (finished = true) => completions.at(-1)!({ finished }) };
}

it('keeps a fast startup visible after layout and finishes only once', async () => {
  const animation = mockAnimation();
  const onFinished = jest.fn();
  const onLayout = jest.fn();
  const view = await render(<AppStartupScreen fontsReady storageReady onFinished={onFinished} onLayout={onLayout} />);
  await act(() => jest.advanceTimersByTime(motion.startupMinVisible));
  expect(onFinished).not.toHaveBeenCalled();
  await fireEvent(view.getByTestId('app-startup'), 'layout');
  expect(onLayout).toHaveBeenCalledTimes(1);
  await act(() => animation.complete());
  await act(() => jest.advanceTimersByTime(motion.startupMinVisible - 1));
  expect(onFinished).not.toHaveBeenCalled();
  await act(() => jest.advanceTimersByTime(1));
  expect(onFinished).toHaveBeenCalledTimes(1);
  await fireEvent(view.getByTestId('app-startup'), 'layout');
  await act(() => jest.advanceTimersByTime(motion.startupMinVisible));
  expect(onFinished).toHaveBeenCalledTimes(1);
});

it('waits beyond the minimum until fonts, storage and the animation complete', async () => {
  const animation = mockAnimation();
  const onFinished = jest.fn();
  const onLayout = jest.fn();
  const view = await render(<AppStartupScreen fontsReady={false} storageReady={false} onFinished={onFinished} onLayout={onLayout} />);
  await fireEvent(view.getByTestId('app-startup'), 'layout');
  await act(() => animation.complete());
  await act(() => jest.advanceTimersByTime(motion.startupMinVisible));
  expect(onFinished).not.toHaveBeenCalled();
  await view.rerender(<AppStartupScreen fontsReady storageReady={false} onFinished={onFinished} onLayout={onLayout} />);
  await act(() => animation.complete());
  expect(onFinished).not.toHaveBeenCalled();
  await view.rerender(<AppStartupScreen fontsReady storageReady onFinished={onFinished} onLayout={onLayout} />);
  await act(() => animation.complete(false));
  expect(onFinished).not.toHaveBeenCalled();
  await act(() => animation.complete());
  expect(onFinished).toHaveBeenCalledTimes(1);
});

it('respects reduced motion while retaining the visible startup and readiness gate', async () => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  const animation = mockAnimation();
  const onFinished = jest.fn();
  const onLayout = jest.fn();
  const view = await render(<AppStartupScreen fontsReady storageReady={false} onFinished={onFinished} onLayout={onLayout} />);
  await fireEvent(view.getByTestId('app-startup'), 'layout');
  await act(() => jest.advanceTimersByTime(motion.startupMinVisible));
  expect(onFinished).not.toHaveBeenCalled();
  await view.rerender(<AppStartupScreen fontsReady storageReady onFinished={onFinished} onLayout={onLayout} />);
  expect(animation.timing).not.toHaveBeenCalled();
  expect(onFinished).toHaveBeenCalledTimes(1);
});

it('uses the system font after a font failure without trapping the startup gate', async () => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  const onFinished = jest.fn();
  const view = await render(<AppStartupScreen fontsReady fontsLoaded={false} storageReady onFinished={onFinished} onLayout={jest.fn()} />);
  expect(view.getByText(t('startup.body'))).toHaveStyle({ fontFamily: undefined });
  await fireEvent(view.getByTestId('app-startup'), 'layout');
  await act(() => jest.advanceTimersByTime(motion.startupMinVisible));
  expect(onFinished).toHaveBeenCalledTimes(1);
});
