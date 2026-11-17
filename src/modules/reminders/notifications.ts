import Constants, { ExecutionEnvironment } from 'expo-constants';
import type * as ExpoNotifications from 'expo-notifications';

type NotificationsModule = typeof ExpoNotifications;

/**
 * Expo Go does not load the full Android notifications native module in SDK 57.
 * Avoid importing it there so the rest of the offline app remains usable.
 */
export function getNotifications(): NotificationsModule | null {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return null;
  // This guarded require is evaluated only in a development or installed build.
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Expo Go must not evaluate this native module.
  return require('expo-notifications') as NotificationsModule;
}

export function remindersAreAvailable(): boolean {
  return getNotifications() !== null;
}
