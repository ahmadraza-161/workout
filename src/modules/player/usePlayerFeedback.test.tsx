import { act, renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';

import type { WorkoutSettings } from '@/modules/profile';
import type { CueFrame } from './cues';
import { usePlayerFeedback } from './usePlayerFeedback';

const mockPlayers = Array.from({ length: 3 }, () => ({
  pause: jest.fn(), play: jest.fn(), seekTo: jest.fn().mockResolvedValue(undefined),
}));
let mockPlayerIndex = 0;
let mockFocused = true;
const mockAudioMode = jest.fn().mockResolvedValue(undefined);
const mockHaptic = jest.fn().mockResolvedValue(undefined);
jest.mock('expo-audio', () => ({
  setAudioModeAsync: (...args: unknown[]) => mockAudioMode(...args),
  useAudioPlayer: () => mockPlayers[mockPlayerIndex++ % 3],
}));
jest.mock('expo-haptics', () => ({ AndroidHaptics: { Confirm: 'confirm' },
  performAndroidHapticsAsync: (...args: unknown[]) => mockHaptic(...args) }));
jest.mock('expo-router', () => ({ useIsFocused: () => mockFocused }));
jest.mock('expo-keep-awake', () => ({ useKeepAwake: jest.fn() }));

const settings: WorkoutSettings = { beeps: true, haptics: true, quietMode: false,
  restEnabled: true, restSeconds: 20, prepSeconds: 15 };
const frame: CueFrame = { phase: 'exercise', index: 0, remaining: 4, active: true };
type FeedbackProps = { current: CueFrame; options: WorkoutSettings };
let changeState: (status: AppStateStatus) => void;

beforeEach(() => {
  jest.clearAllMocks(); mockPlayerIndex = 0; mockFocused = true;
  AppState.currentState = 'active';
  for (const player of mockPlayers) player.seekTo.mockReset().mockResolvedValue(undefined);
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, handler) => {
    changeState = handler;
    return { remove: jest.fn() };
  });
});
afterEach(() => jest.restoreAllMocks());

it('plays local countdown and completion sounds with independent phase haptics', async () => {
  const hook = await renderHook(({ current, options }: FeedbackProps) => usePlayerFeedback(current, options),
    { initialProps: { current: frame, options: settings } });
  await act(async () => {});
  await hook.rerender({ current: { ...frame, remaining: 3 }, options: settings });
  await act(async () => {});
  expect(mockPlayers[0]!.play).toHaveBeenCalledTimes(1);
  expect(mockHaptic).not.toHaveBeenCalled();
  await hook.rerender({ current: { ...frame, phase: 'complete', remaining: null }, options: settings });
  await act(async () => {});
  expect(mockPlayers[2]!.play).toHaveBeenCalledTimes(1);
  expect(mockHaptic).toHaveBeenCalledTimes(1);
  expect(hook.result.current).toBe(false);
});

it('cancels a pending sound when the app locks and suppresses catch-up on return', async () => {
  let finishSeek!: () => void;
  mockPlayers[0]!.seekTo.mockImplementation(() => new Promise<void>((resolve) => { finishSeek = resolve; }));
  const hook = await renderHook((current: CueFrame) => usePlayerFeedback(current, settings),
    { initialProps: frame });
  await act(async () => {});
  await hook.rerender({ ...frame, remaining: 3 });
  await act(async () => {});
  await act(() => { AppState.currentState = 'background'; changeState('background'); });
  expect(mockPlayers[0]!.pause).toHaveBeenCalled();
  await act(() => { finishSeek(); });
  expect(mockPlayers[0]!.play).not.toHaveBeenCalled();
  await act(() => { AppState.currentState = 'active'; changeState('active'); });
  expect(mockPlayers[0]!.play).not.toHaveBeenCalled();
});

it('turning off sound cancels an in-flight cue while vibration remains independent', async () => {
  let finishSeek!: () => void;
  mockPlayers[1]!.seekTo.mockImplementation(() => new Promise<void>((resolve) => { finishSeek = resolve; }));
  const hook = await renderHook(({ current, options }: FeedbackProps) => usePlayerFeedback(current, options),
    { initialProps: { current: frame, options: settings } });
  await act(async () => {});
  await hook.rerender({ current: { ...frame, phase: 'rest' }, options: settings });
  await act(async () => {});
  expect(mockHaptic).toHaveBeenCalledTimes(1);
  await hook.rerender({ current: { ...frame, phase: 'rest' }, options: { ...settings, beeps: false } });
  await act(() => { finishSeek(); });
  expect(mockPlayers[1]!.play).not.toHaveBeenCalled();
});

it('native audio failures do not break the workout hook', async () => {
  mockPlayers[0]!.seekTo.mockRejectedValue(new Error('Audio unavailable'));
  const hook = await renderHook((current: CueFrame) => usePlayerFeedback(current, settings),
    { initialProps: frame });
  await act(async () => {});
  await hook.rerender({ ...frame, remaining: 3 });
  await act(async () => {});
  expect(mockPlayers[0]!.play).not.toHaveBeenCalled();
  expect(hook.result.current).toBe(true);
});

it('leaving the player cancels a pending cue without replaying it on return', async () => {
  let finishSeek!: () => void;
  mockPlayers[0]!.seekTo.mockImplementation(() => new Promise<void>((resolve) => { finishSeek = resolve; }));
  const hook = await renderHook((current: CueFrame) => usePlayerFeedback(current, settings),
    { initialProps: frame });
  await act(async () => {});
  await hook.rerender({ ...frame, remaining: 3 });
  await act(async () => {});
  mockFocused = false;
  await hook.rerender({ ...frame, remaining: 3 });
  await act(() => finishSeek());
  expect(mockPlayers[0]!.play).not.toHaveBeenCalled();
  expect(hook.result.current).toBe(false);
  mockFocused = true;
  await hook.rerender({ ...frame, remaining: 1 });
  expect(mockPlayers[0]!.play).not.toHaveBeenCalled();
});

it('keeps phase sound enabled when vibration is disabled', async () => {
  const hook = await renderHook((current: CueFrame) => usePlayerFeedback(current, { ...settings, haptics: false }),
    { initialProps: frame });
  await act(async () => {});
  await hook.rerender({ ...frame, phase: 'rest' });
  await act(async () => {});
  expect(mockPlayers[1]!.play).toHaveBeenCalledTimes(1);
  expect(mockHaptic).not.toHaveBeenCalled();
});
