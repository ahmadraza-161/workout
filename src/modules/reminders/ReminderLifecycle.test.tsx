import { render } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';

import { ReminderLifecycle } from './ReminderLifecycle';

jest.mock('expo-notifications', () => ({ setNotificationHandler: jest.fn() }));
jest.mock('./notifications', () => ({ getNotifications: () => jest.requireMock('expo-notifications') }));
jest.mock('./service', () => ({ restoreReminders: jest.fn().mockResolvedValue(true) }));

it('allows the system sound for owned reminders and removes its handler on unmount', async () => {
  const view = await render(<ReminderLifecycle />);
  const handler = jest.mocked(Notifications.setNotificationHandler).mock.calls.at(-1)![0]!;
  const reminder: Notifications.Notification = { date: 0, request: {
    identifier: 'workout-reminder-1', trigger: null,
    content: { title: 'Workout', subtitle: null, body: null, categoryIdentifier: null,
      sound: 'default', data: { kind: 'workout-reminder' } },
  } };
  expect(await handler.handleNotification(reminder)).toEqual({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
  });
  const other: Notifications.Notification = { ...reminder, request: { ...reminder.request,
    content: { ...reminder.request.content, data: undefined } } };
  expect((await handler.handleNotification(other)).shouldPlaySound).toBe(false);
  await view.unmount();
  expect(Notifications.setNotificationHandler).toHaveBeenLastCalledWith(null);
});
