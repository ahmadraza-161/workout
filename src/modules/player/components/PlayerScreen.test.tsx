import { act, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Storage } from 'expo-sqlite/kv-store';
import { Alert } from 'react-native';

import { setKv } from '@/modules/core/kv';
import { PlayerScreen } from './PlayerScreen';
import { saveWorkoutSession } from '../repository';
import { clearPlayerSnapshot, savePlayerSnapshot } from '../snapshot';
import { FinishScreen } from './FinishScreen';

let mockBack: () => boolean;
jest.mock('@/modules/core/navigation', () => ({ useAndroidBack: (handler: () => boolean) => { mockBack = handler; } }));
jest.mock('expo-router', () => ({ router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() } }));
jest.mock('@/modules/core/i18n', () => ({ t: (key: string) => key }));
jest.mock('@/modules/content', () => ({ getExercise: () => ({ id: 'exercise', nameKey: 'exercise.name', quietSafe: true }),
  ExerciseDemo: () => null, getChallengeDayWorkout: () => undefined }));
jest.mock('@/modules/achievements', () => ({ AchievementCelebration: () => null, refreshAchievements: () => ({ badges: [], newIds: [] }) }));
jest.mock('@/modules/profile', () => ({ loadWorkoutSettings: () => ({ beeps: false, haptics: false }), saveWorkoutSettings: jest.fn() }));
jest.mock('@/modules/core/theme', () => ({ spacing: { 0: 0, 3: 12, 4: 16, 5: 20, 6: 24 }, useTheme: () => ({ colors: { restBg: 'blue' } }) }));
jest.mock('../workout', () => ({ getPlayableWorkout: () => ({ id: 'workout', items: [{ exerciseId: 'exercise', seconds: 1, rest: 0 }] }) }));
jest.mock('../snapshot', () => ({ createSessionId: () => 'session', getResumableSnapshot: () => null,
  savePlayerSnapshot: jest.fn(), clearPlayerSnapshot: jest.fn() }));
jest.mock('../repository', () => ({ saveWorkoutSession: jest.fn() }));
jest.mock('../usePlayerFeedback', () => ({ usePlayerFeedback: () => false, AwakeDuringWorkout: () => null }));
jest.mock('./WorkoutSettingsSheet', () => ({ WorkoutSettingsSheet: () => null }));
jest.mock('./FinishScreen', () => ({ FinishScreen: jest.fn(() => null) }));
jest.mock('@/modules/core/ui', () => {
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  return { Screen: Native.View, Text: Native.Text, TimerRing: Native.View, StackHeader: () => null,
    Button: () => null, IconButton: () => null, PlayerControls: () => null, ProgressBar: () => null,
    RestActions: () => null, Sheet: () => null, SheetHeader: () => null, Stepper: () => null, WheelPicker: () => null };
});

beforeEach(() => {
  jest.clearAllMocks();
  Storage.clearSync();
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-09-30T12:00:00Z'));
  jest.mocked(saveWorkoutSession).mockReset();
  jest.mocked(savePlayerSnapshot).mockReset();
});
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

it('Back pauses once before confirming and waiting in the dialog cannot finish extra sets', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await render(<PlayerScreen id="workout" />);
  const quitAt = Date.now();
  await act(() => { mockBack!(); mockBack!(); });
  expect(alert).toHaveBeenCalledTimes(1);
  expect(router.replace).not.toHaveBeenCalled();
  await act(() => { jest.advanceTimersByTime(60_000); });
  expect(saveWorkoutSession).not.toHaveBeenCalled();
  const snapshot = jest.mocked(savePlayerSnapshot).mock.calls.at(-1)![1];
  expect(snapshot.pausedAt).toBe(quitAt);
  expect(snapshot.phase).toBe('prep');
  await act(() => { alert.mock.calls[0]![2]![2]!.onPress?.(); });
  expect(saveWorkoutSession).toHaveBeenCalledWith('session', expect.objectContaining({ pausedAt: quitAt }), expect.any(Object), Date.now());
  expect(clearPlayerSnapshot).toHaveBeenCalledTimes(1);
  expect(router.replace).toHaveBeenCalledTimes(1);
});

it('Back cannot leave the finish screen after a session-save failure', async () => {
  setKv('settings.timers.prepSeconds', 0);
  jest.mocked(saveWorkoutSession).mockImplementation(() => { throw new Error('Database failure'); });
  await render(<PlayerScreen id="workout" />);
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(saveWorkoutSession).toHaveBeenCalledTimes(1);
  await act(() => { mockBack!(); });
  expect(router.replace).not.toHaveBeenCalled();
  expect(clearPlayerSnapshot).not.toHaveBeenCalled();
});

it('keeps the saved summary visible and saves a completed workout only once', async () => {
  setKv('settings.timers.prepSeconds', 0);
  const summary = { durationSec: 1, completionPct: 100, kcal: 0, localDate: '2026-09-30' };
  jest.mocked(saveWorkoutSession).mockReturnValue(summary);
  await render(<PlayerScreen id="workout" />);
  await act(async () => { jest.advanceTimersByTime(1000); });
  const props = jest.mocked(FinishScreen).mock.calls.at(-1)![0];
  expect(props.summary).toEqual(summary);
  expect(props.saveStatus).toBe('saved');
  expect(clearPlayerSnapshot).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(60_000); });
  expect(saveWorkoutSession).toHaveBeenCalledTimes(1);
  await act(() => { mockBack!(); });
  expect(router.replace).toHaveBeenCalledWith('/(tabs)/report');
});

it('retrying a failed completion preserves its original finish time', async () => {
  setKv('settings.timers.prepSeconds', 0);
  jest.mocked(saveWorkoutSession).mockImplementationOnce(() => { throw new Error('Database failure'); });
  await render(<PlayerScreen id="workout" />);
  await act(async () => { jest.advanceTimersByTime(1000); });
  const endedAt = jest.mocked(saveWorkoutSession).mock.calls[0]![3];
  jest.mocked(saveWorkoutSession).mockReturnValue({ durationSec: 1, completionPct: 100, kcal: 0, localDate: '2026-09-30' });
  await act(async () => { jest.advanceTimersByTime(60_000); });
  await act(() => { jest.mocked(FinishScreen).mock.calls.at(-1)![0].onRetry(); });
  expect(jest.mocked(saveWorkoutSession).mock.calls[1]![3]).toBe(endedAt);
  expect(jest.mocked(FinishScreen).mock.calls.at(-1)![0].saveStatus).toBe('saved');
});

it('keeps the workout running and warns once when resume storage fails', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  jest.mocked(savePlayerSnapshot).mockImplementation(() => { throw new Error('Storage full'); });
  const summary = { durationSec: 1, completionPct: 100, kcal: 0, localDate: '2026-09-30' };
  jest.mocked(saveWorkoutSession).mockReturnValue(summary);
  await render(<PlayerScreen id="workout" />);
  expect(alert).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(60_000); });
  expect(jest.mocked(savePlayerSnapshot).mock.calls.length).toBeGreaterThan(1);
  expect(alert).toHaveBeenCalledTimes(1);
  expect(saveWorkoutSession).toHaveBeenCalledTimes(1);
  expect(jest.mocked(FinishScreen).mock.calls.at(-1)![0].summary).toEqual(summary);
});
