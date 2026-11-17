import { useEffect } from 'react';
import { AppState } from 'react-native';

import { getNotifications } from './notifications';
import { restoreReminders } from './service';

export function ReminderLifecycle() {
  useEffect(() => {
    const Notifications = getNotifications();
    if (!Notifications) return;
    // Local reminders only: no token registration or remote notification service.
    Notifications.setNotificationHandler({ handleNotification: async (notification) => ({
      shouldShowBanner: true, shouldShowList: true,
      shouldPlaySound: notification.request.content.data?.kind === 'workout-reminder', shouldSetBadge: false,
    }) });
    void restoreReminders().catch(() => { /* The reminder screen offers retry. */ });
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') void restoreReminders().catch(() => { /* Retry from Settings. */ });
    });
    return () => { listener.remove(); Notifications.setNotificationHandler(null); };
  }, []);
  return null;
}
