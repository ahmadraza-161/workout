import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, AppState, type AppStateStatus } from 'react-native';
import { ThemeProvider } from '@/modules/core/theme';
import { ExerciseVideoStage } from './ExerciseVideoStage.native';

const mockPlayer = { status: 'loading', loop: false, muted: false, currentTime: 1.2,
  staysActiveInBackground: true, showNowPlayingNotification: true,
  play: jest.fn(), pause: jest.fn(), addListener: jest.fn() };
let mockFocused = true;
let mockReleased = false;
let mockStatus: (event: { status: string }) => void;
let motionChanged: (enabled: boolean) => void;
let appChanged: (state: AppStateStatus) => void;
const mockRemove = jest.fn();
jest.mock('expo-router', () => ({ useIsFocused: () => mockFocused }));
jest.mock('../videos.generated', () => ({ EXERCISE_VIDEOS: {},
  EXERCISE_VIDEO_PLAYBACK: { ex_floor_row_isometric: { loop: false } } }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('./ExerciseImage', () => ({ ExerciseImage: () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return <Text testID="pose">pose</Text>;
} }));
jest.mock('expo-video', () => ({
  useVideoPlayer: (_source: number, setup: (player: typeof mockPlayer) => void) => {
    const { useEffect } = jest.requireActual<typeof import('react')>('react');
    useEffect(() => { mockReleased = false; return () => { mockReleased = true; }; }, []);
    setup(mockPlayer); return mockPlayer;
  },
  VideoView: (props: object) => {
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    return <View testID="video" {...props} />;
  },
}));
const stage = (playing = true) => <ThemeProvider><ExerciseVideoStage id="ex_pike_push_up"
  variant="player" source={12} playing={playing} /></ThemeProvider>;

beforeEach(() => {
  jest.clearAllMocks(); mockPlayer.status = 'loading'; mockPlayer.currentTime = 1.2;
  mockReleased = false;
  mockPlayer.pause.mockImplementation(() => {
    if (mockReleased) throw new Error('Native SharedObject already released');
  });
  mockFocused = true; AppState.currentState = 'active';
  mockPlayer.addListener.mockImplementation((_event, handler) => { mockStatus = handler; return { remove: mockRemove }; });
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, handler) => {
    motionChanged = handler as unknown as (enabled: boolean) => void;
    return { remove: jest.fn() } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>;
  });
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, handler) => {
    appChanged = handler; return { remove: jest.fn() };
  });
});
afterEach(() => jest.restoreAllMocks());

it('waits for readiness and pauses for timer and background without restarting', async () => {
  await render(stage());
  expect(screen.getByTestId('pose')).toBeTruthy();
  expect(mockPlayer.play).not.toHaveBeenCalled();
  mockPlayer.status = 'readyToPlay';
  await act(() => mockStatus({ status: 'readyToPlay' }));
  expect(mockPlayer.play).toHaveBeenCalled();
  await fireEvent(screen.getByTestId('video'), 'firstFrameRender');
  expect(screen.queryByTestId('pose')).toBeNull();
  await screen.rerender(stage(false));
  expect(mockPlayer.pause).toHaveBeenCalled();
  mockPlayer.play.mockClear();
  await act(() => appChanged('background'));
  await screen.rerender(stage());
  expect(mockPlayer.play).not.toHaveBeenCalled();
  await act(() => appChanged('active'));
  expect(mockPlayer.play).toHaveBeenCalledTimes(1);
  expect(mockPlayer.currentTime).toBe(1.2);
  expect(mockPlayer.loop).toBe(true); expect(mockPlayer.muted).toBe(true);
  expect(mockPlayer.staysActiveInBackground).toBe(false);
  expect(mockPlayer.showNowPlayingNotification).toBe(false);
});

it('releases listeners and uses the original pose for Reduce Motion or decode failures', async () => {
  await render(stage());
  await act(() => motionChanged(true));
  expect(screen.queryByTestId('video')).toBeNull();
  expect(mockRemove).toHaveBeenCalled();
  await act(() => motionChanged(false));
  expect(screen.getByTestId('video')).toBeTruthy();
  mockPlayer.status = 'error';
  await act(() => mockStatus({ status: 'error' }));
  expect(screen.queryByTestId('video')).toBeNull();
  expect(screen.getByTestId('pose')).toBeTruthy();
});

it('releases the player when the screen loses focus and autoplays a fresh one on return', async () => {
  mockPlayer.status = 'readyToPlay';
  await render(stage());
  expect(mockPlayer.play).toHaveBeenCalledTimes(1);
  mockFocused = false;
  await screen.rerender(stage());
  expect(mockReleased).toBe(true);
  expect(screen.queryByTestId('video')).toBeNull();
  expect(screen.getByTestId('pose')).toBeTruthy();
  mockFocused = true;
  await screen.rerender(stage());
  expect(mockReleased).toBe(false);
  expect(screen.getByTestId('video')).toBeTruthy();
  expect(mockPlayer.play).toHaveBeenCalledTimes(2);
});

it('does not play a ready clip when the workout is paused', async () => {
  mockPlayer.status = 'readyToPlay';
  await render(stage(false));
  expect(mockPlayer.play).not.toHaveBeenCalled();
});

it('plays a hold entry once rather than looping the release', async () => {
  mockPlayer.status = 'readyToPlay';
  await render(<ThemeProvider><ExerciseVideoStage id="ex_floor_row_isometric" variant="guide" source={13} /></ThemeProvider>);
  expect(mockPlayer.loop).toBe(false);
  expect(mockPlayer.play).toHaveBeenCalled();
});

it('closes safely after the native hook releases the player and ignores queued events', async () => {
  mockPlayer.status = 'readyToPlay';
  await render(stage());
  mockPlayer.pause.mockClear();
  await screen.unmount();
  expect(mockReleased).toBe(true);
  expect(mockPlayer.pause).not.toHaveBeenCalled();
  expect(() => mockStatus({ status: 'readyToPlay' })).not.toThrow();
  expect(() => mockStatus({ status: 'error' })).not.toThrow();
});

it('repeats demos without a playback override while active', async () => {
  mockPlayer.status = 'readyToPlay';
  await render(<ThemeProvider><ExerciseVideoStage id="ex_superman_hold" variant="guide" source={14} /></ThemeProvider>);
  expect(mockPlayer.loop).toBe(true);
});
