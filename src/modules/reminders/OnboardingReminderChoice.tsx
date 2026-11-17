import { useCalendars } from 'expo-localization';
import { router, useIsFocused } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Button, Card, ErrorState, Text } from '@/modules/core/ui';

import { loadReminderSchedule } from './service';

/** Optional first-run entry uses the same saved schedule and permission primer as Settings. */
export function OnboardingReminderChoice() {
  const focused = useIsFocused();
  const use24Hours = useCalendars()[0]?.uses24hourClock !== false;
  const [, setRevision] = useState(0);
  const schedule = (() => {
    if (!focused) return null;
    try { return loadReminderSchedule(); } catch { return 'error' as const; }
  })();
  if (!schedule) return null;
  return <Card style={styles.content}>
    <Text variant="h3">{t('onboarding.reminderTitle')}</Text>
    <Text tone="secondary">{t('onboarding.reminderBody')}</Text>
    {schedule === 'error' ? <ErrorState onRetry={() => setRevision((value) => value + 1)} />
      : <Text>{schedule.enabled ? t('onboarding.reminderSummary', {
        days: schedule.days.map((day) => t(`reminders.weekdays.${day}`)).join(', '),
        time: `${String(use24Hours ? schedule.hour : schedule.hour % 12 || 12).padStart(2, '0')}:${String(schedule.minute).padStart(2, '0')}${use24Hours ? '' : ` ${t(schedule.hour < 12 ? 'reminders.am' : 'reminders.pm')}`}`,
      }) : t('onboarding.reminderOff')}</Text>}
    <Button variant="secondary" label={t('onboarding.reminderSetup')}
      onPress={() => router.push('/settings/reminders')} />
  </Card>;
}

const styles = StyleSheet.create({ content: { gap: spacing[3] } });
