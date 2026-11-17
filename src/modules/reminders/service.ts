import { t } from '@/modules/core/i18n';
import { getKv, setKv } from '@/modules/core/kv';

import { DEFAULT_SCHEDULE, isReminderSchedule, type ReminderSchedule } from './schedule';
import { getNotifications, remindersAreAvailable } from './notifications';

const CHANNEL = 'workout-reminders';
const DAYS = [1, 2, 3, 4, 5, 6, 7];
const reminderId = (day: number) => `workout-reminder-${day}`;
// Serialize native scheduling so startup repair cannot overwrite a newer user save.
let scheduling: Promise<void> = Promise.resolve();

export function loadReminderSchedule(): ReminderSchedule {
  const saved = getKv('reminders.schedule');
  return isReminderSchedule(saved) ? saved : { ...DEFAULT_SCHEDULE, days: [...DEFAULT_SCHEDULE.days] };
}

/** Request permission only after the user confirms the in-app primer. */
async function ensureReminderChannel(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: t('reminders.title'), importance: Notifications.AndroidImportance.DEFAULT, sound: 'default',
  });
  const channel = await Notifications.getNotificationChannelAsync(CHANNEL);
  return channel !== null && channel.importance !== Notifications.AndroidImportance.NONE;
}

export async function requestReminderPermission(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications || !remindersAreAvailable()) return false;
  if (!await ensureReminderChannel()) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Fixed identifiers make retries replace schedules rather than create duplicates. */
export async function syncReminderSchedule(schedule: ReminderSchedule): Promise<void> {
  if (!isReminderSchedule(schedule)) throw new Error('Invalid reminder schedule');
  const Notifications = getNotifications();
  if (!Notifications) {
    if (schedule.enabled) throw new Error('Reminders unavailable');
    return;
  }
  // Recheck when the queued operation actually runs: permissions may have changed
  // since the primer or startup repair. Never prompt from reconciliation.
  if (schedule.enabled && (!(await Notifications.getPermissionsAsync()).granted ||
    !await ensureReminderChannel())) throw new Error('Reminders blocked');
  const failures: unknown[] = [];
  for (const day of DAYS) {
    const identifier = reminderId(day);
    try {
      if (!schedule.enabled || !schedule.days.includes(day)) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
      } else {
        await Notifications.scheduleNotificationAsync({
          identifier,
          content: { title: t('reminders.notificationTitle'), body: t('reminders.notificationBody'),
            data: { kind: 'workout-reminder' }, sound: 'default' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: day, hour: schedule.hour, minute: schedule.minute, channelId: CHANNEL },
        });
      }
    } catch (error) { failures.push(error); }
  }
  // A failed cancellation must not leave the other six days enabled.
  // Report failure after attempting every owned identifier; intent stays durable.
  if (failures.length) throw failures[0];
}

/** Persist intent first so a failed native operation can be retried on the next launch. */
export async function saveReminderSchedule(schedule: ReminderSchedule): Promise<void> {
  if (!isReminderSchedule(schedule)) throw new Error('Invalid reminder schedule');
  setKv('reminders.schedule', schedule);
  await enqueueSync();
}

function enqueueSync(): Promise<void> {
  const next = scheduling.catch(() => undefined).then(() => syncReminderSchedule(loadReminderSchedule()));
  scheduling = next;
  return next;
}

/** Reconcile saved intent without ever prompting for permissions at startup. */
export async function restoreReminders(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  const schedule = loadReminderSchedule();
  if (schedule.enabled && (!(await Notifications.getPermissionsAsync()).granted || !await ensureReminderChannel())) return false;
  await enqueueSync();
  return true;
}
