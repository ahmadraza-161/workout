import * as Sharing from 'expo-sharing';
import { File } from 'expo-file-system';

import { shareMessage, type ShareCardData } from './components/ShareCard';
import { shareWorkoutCard } from './share';

const mockFile = { uri: 'file:///cache/home-workout-complete.png', write: jest.fn() };
jest.mock('expo-file-system', () => ({ File: jest.fn(() => mockFile), Paths: { cache: {} } }));
jest.mock('expo-sharing', () => ({ isAvailableAsync: jest.fn(), shareAsync: jest.fn() }));

const data: ShareCardData = { completedCount: 4, summary: { durationSec: 725, completionPct: 100, kcal: 83.4, localDate: '2026-10-01' },
  progress: { streak: 3, weeklyDone: 2, weeklyTarget: 4 } };

beforeEach(() => jest.clearAllMocks());

it('creates a body-data-free summary line for the share card', () => {
  expect(shareMessage(data)).toBe('WorkoutStride: 4 exercises in 12 min.');
  expect(shareMessage(data)).not.toContain('kg');
});

it('writes the SVG PNG payload to cache and shares it only after a tap', async () => {
  jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(true);
  jest.mocked(Sharing.shareAsync).mockResolvedValue(undefined);
  const svg = { toDataURL: (callback: (base64: string) => void) => callback('png-data') };
  await shareWorkoutCard(svg as never, data);
  expect(File).toHaveBeenCalled();
  expect(mockFile.write).toHaveBeenCalledWith('png-data', { encoding: 'base64' });
  expect(Sharing.shareAsync).toHaveBeenCalledWith(mockFile.uri, {
    mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'Share workout',
  });
});

it('does not attempt rendering when the system share sheet is unavailable', async () => {
  jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(false);
  const svg = { toDataURL: jest.fn() };
  await expect(shareWorkoutCard(svg as never, data)).rejects.toThrow('Sharing unavailable');
  expect(svg.toDataURL).not.toHaveBeenCalled();
});

it('allows retry when native PNG export never calls back', async () => {
  jest.useFakeTimers();
  try {
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(true);
    const svg = { toDataURL: jest.fn() };
    const result = shareWorkoutCard(svg as never, data);
    const rejected = expect(result).rejects.toThrow('Share card render timed out');
    await jest.advanceTimersByTimeAsync(5000);
    await rejected;
    expect(mockFile.write).not.toHaveBeenCalled();
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
  } finally { jest.useRealTimers(); }
});
