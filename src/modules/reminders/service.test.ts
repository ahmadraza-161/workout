import * as Notifications from 'expo-notifications';
import { Storage } from 'expo-sqlite/kv-store';

import { DEFAULT_SCHEDULE, isReminderSchedule } from './schedule';
import { loadReminderSchedule, requestReminderPermission, restoreReminders, saveReminderSchedule } from './service';

jest.mock('expo-notifications', () => ({
  AndroidImportance: { DEFAULT: 3, NONE: 0 }, SchedulableTriggerInputTypes: { WEEKLY: 'weekly' },
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  getNotificationChannelAsync: jest.fn().mockResolvedValue({ importance: 3 }),
  getPermissionsAsync: jest.fn(), requestPermissionsAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(null),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('id'),
}));
jest.mock('@/modules/core/i18n', () => ({ t: (key: string) => key }));

beforeEach(() => {
  Storage.clearSync(); jest.clearAllMocks();
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Notifications.NotificationPermissionsStatus);
});

it('rejects invalid times, duplicate weekdays and enabled schedules without days', () => {
  for (const change of [{ hour: 24 }, { minute: 3 }, { days: [0] }, { days: [2, 2] }, { enabled: true, days: [] }]) {
    expect(isReminderSchedule({ ...DEFAULT_SCHEDULE, ...change })).toBe(false);
  }
  expect(isReminderSchedule(DEFAULT_SCHEDULE)).toBe(true);
});

it('schedules selected weekdays and cancels only owned unused identifiers', async () => {
  await saveReminderSchedule({ ...DEFAULT_SCHEDULE, enabled: true, days: [1, 7], hour: 0 });
  expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(2);
  expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
    identifier: 'workout-reminder-1', trigger: { type: 'weekly', weekday: 1, hour: 0, minute: 0, channelId: 'workout-reminders' },
  }));
  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(5);
});

it('turning off cancels every owned weekday and persists disabled state', async () => {
  await saveReminderSchedule(DEFAULT_SCHEDULE);
  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(7);
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  expect(loadReminderSchedule().enabled).toBe(false);
});

it('does not ask again after a permanent denial', async () => {
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: false, canAskAgain: false } as Notifications.NotificationPermissionsStatus);
  expect(await requestReminderPermission()).toBe(false);
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
});

it('attempts cancellation for all days even if one native operation fails', async () => {
  jest.mocked(Notifications.cancelScheduledNotificationAsync).mockRejectedValueOnce(new Error('Cancel failed'));
  await expect(saveReminderSchedule(DEFAULT_SCHEDULE)).rejects.toThrow('Cancel failed');
  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(7);
  expect(loadReminderSchedule().enabled).toBe(false);
  await restoreReminders();
  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(14);
});

it('reports a blocked notification channel even when app permission is granted', async () => {
  jest.mocked(Notifications.getNotificationChannelAsync).mockResolvedValueOnce({ importance: 0 } as Notifications.NotificationChannel);
  expect(await requestReminderPermission()).toBe(false);
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
});

it('does not report permission success when the native channel is missing', async () => {
  jest.mocked(Notifications.getNotificationChannelAsync).mockResolvedValueOnce(null);
  expect(await requestReminderPermission()).toBe(false);
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
});

it('keeps enabled intent for retry without scheduling or prompting after permission is revoked', async () => {
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: false } as Notifications.NotificationPermissionsStatus);
  await expect(saveReminderSchedule({ ...DEFAULT_SCHEDULE, enabled: true })).rejects.toThrow('Reminders blocked');
  expect(loadReminderSchedule().enabled).toBe(true);
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
});

it('serializes startup repair and a newer disabled schedule', async () => {
  await saveReminderSchedule({ ...DEFAULT_SCHEDULE, enabled: true });
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Notifications.NotificationPermissionsStatus);
  const restoring = restoreReminders();
  const disabling = saveReminderSchedule(DEFAULT_SCHEDULE);
  await Promise.all([restoring, disabling]);
  expect(loadReminderSchedule().enabled).toBe(false);
  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenLastCalledWith('workout-reminder-7');
});

it('keeps intent after a scheduling failure and retries with the same identifiers', async () => {
  jest.mocked(Notifications.scheduleNotificationAsync).mockRejectedValueOnce(new Error('native failure'));
  const schedule = { ...DEFAULT_SCHEDULE, enabled: true };
  await expect(saveReminderSchedule(schedule)).rejects.toThrow('native failure');
  expect(loadReminderSchedule()).toEqual(schedule);
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Notifications.NotificationPermissionsStatus);
  await restoreReminders();
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  expect(Notifications.scheduleNotificationAsync).toHaveBeenLastCalledWith(expect.objectContaining({ identifier: 'workout-reminder-6' }));
});
