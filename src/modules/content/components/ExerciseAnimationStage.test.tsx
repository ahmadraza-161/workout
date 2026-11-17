import { act, fireEvent, render, screen } from '@testing-library/react-native';
import type LottieView from 'lottie-react-native';
import { AccessibilityInfo, AppState, type AppStateStatus } from 'react-native';

import { ThemeProvider } from '@/modules/core/theme';
import { EXERCISE_ANIMATIONS } from '../animations.generated';
import { ExerciseAnimationStage } from './ExerciseAnimationStage.native';

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();
let mockFocused = true;
let motionChanged: (enabled: boolean) => void;
let appChanged: (state: AppStateStatus) => void;
jest.mock('expo-router', () => ({ useIsFocused: () => mockFocused }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('./ExerciseImage', () => ({ ExerciseImage: () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return <Text testID="pose">pose</Text>;
} }));
jest.mock('lottie-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { __esModule: true, default: React.forwardRef(function MockLottie(props: React.ComponentProps<typeof LottieView>, ref) {
    React.useImperativeHandle(ref, () => ({ play: mockPlay, pause: mockPause, resume: mockResume }));
    return <View testID="animation" {...props} />;
  }) };
});
const source = EXERCISE_ANIMATIONS.ex_standard_push_up!;
const stage = (playing = true) => <ThemeProvider>
  <ExerciseAnimationStage id="ex_standard_push_up" variant="player" source={source} playing={playing} />
</ThemeProvider>;

beforeEach(() => {
  jest.clearAllMocks();
  mockFocused = true;
  AppState.currentState = 'active';
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, handler) => {
    motionChanged = handler as unknown as (enabled: boolean) => void;
    return { remove: jest.fn() } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>;
  });
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, handler) => {
    appChanged = handler;
    return { remove: jest.fn() };
  });
});
afterEach(() => jest.restoreAllMocks());

it('keeps the pose until loaded and resumes the same loop after pause, background or lost focus', async () => {
  await render(stage());
  expect(screen.getByTestId('pose')).toBeTruthy();
  expect(mockPlay).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId('animation'), 'animationLoaded');
  expect(screen.queryByTestId('pose')).toBeNull();
  expect(mockPlay).toHaveBeenCalledTimes(1);
  await screen.rerender(stage(false));
  expect(mockPause).toHaveBeenCalledTimes(1);
  await screen.rerender(stage());
  expect(mockResume).toHaveBeenCalledTimes(1);
  await act(() => appChanged('background'));
  expect(mockPause).toHaveBeenCalledTimes(2);
  await act(() => appChanged('active'));
  expect(mockResume).toHaveBeenCalledTimes(2);
  mockFocused = false;
  await screen.rerender(stage());
  expect(mockPause).toHaveBeenCalledTimes(3);
  expect(mockPlay).toHaveBeenCalledTimes(1);
});

it('uses the static pose for Reduce Motion and when native decoding fails', async () => {
  await render(stage());
  await act(() => motionChanged(true));
  expect(screen.queryByTestId('animation')).toBeNull();
  await act(() => motionChanged(false));
  await fireEvent(screen.getByTestId('animation'), 'animationFailure', 'decode failed');
  expect(screen.queryByTestId('animation')).toBeNull();
  expect(screen.getByTestId('pose')).toBeTruthy();
});

it('does not start when the composition loads while paused', async () => {
  await render(stage(false));
  await fireEvent(screen.getByTestId('animation'), 'animationLoaded');
  expect(mockPlay).not.toHaveBeenCalled();
  await screen.rerender(stage());
  expect(mockPlay).toHaveBeenCalledTimes(1);
});

it('plays the cobra entry once and keeps its completed hold through pause and background changes', async () => {
  await render(<ThemeProvider><ExerciseAnimationStage id="ex_cobra_stretch" variant="player"
    source={EXERCISE_ANIMATIONS.ex_cobra_stretch!} /></ThemeProvider>);
  expect(screen.getByTestId('animation').props.loop).toBe(false);
  await fireEvent(screen.getByTestId('animation'), 'animationLoaded');
  expect(mockPlay).toHaveBeenCalledWith(40, 60);
  await fireEvent(screen.getByTestId('animation'), 'animationFinish', false);
  await act(() => appChanged('background'));
  await act(() => appChanged('active'));
  expect(mockPlay).toHaveBeenCalledTimes(1);
  expect(mockResume).not.toHaveBeenCalled();
});
