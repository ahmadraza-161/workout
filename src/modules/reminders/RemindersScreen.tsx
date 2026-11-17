import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCalendars } from 'expo-localization';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { useAndroidBack } from '@/modules/core/navigation';
import { spacing } from '@/modules/core/theme';
import { Button, Card, Chip, Row, Screen, Sheet, SheetHeader, StackHeader, Switch, Text, WheelPicker } from '@/modules/core/ui';

import { remindersAreAvailable } from './notifications';
import { loadReminderSchedule, requestReminderPermission, saveReminderSchedule } from './service';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const CLOCK_HOURS = Array.from({ length: 12 }, (_, hour) => hour + 1);
const MINUTES = Array.from({ length: 12 }, (_, minute) => minute * 5);
const DAYS = [2, 3, 4, 5, 6, 7, 1];
const pad = (value: number) => String(value).padStart(2, '0');

export function RemindersScreen() {
  const use24Hours = useCalendars()[0]?.uses24hourClock !== false;
  const [savedSchedule, setSavedSchedule] = useState(loadReminderSchedule);
  const [schedule, setSchedule] = useState(savedSchedule);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const saving = useRef(false);
  const confirmingDiscard = useRef(false);
  const timeSheet = useRef<BottomSheetModal>(null);

  async function save() {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setMessage('');
    try {
      if (!remindersAreAvailable()) {
        setMessage(t('reminders.unavailable'));
        return;
      }
      if (schedule.enabled && !await requestReminderPermission()) {
        Alert.alert(t('reminders.deniedTitle'), t('reminders.deniedBody'), [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('reminders.openSettings'), onPress: () => {
            void Linking.openSettings().catch(() => setMessage(t('reminders.error')));
          } },
        ]);
        return;
      }
      await saveReminderSchedule(schedule);
      setSavedSchedule(schedule);
      setMessage(t(schedule.enabled ? 'reminders.saved' : 'reminders.disabled'));
    } catch {
      setMessage(t('reminders.error'));
      // Native scheduling can fail after intent is already durable. Back must
      // describe the stored schedule, rather than promise an older one remains.
      try { setSavedSchedule(loadReminderSchedule()); } catch { /* Leave the last readable baseline. */ }
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  function back() {
    if (saving.current || confirmingDiscard.current) return;
    if (JSON.stringify(schedule) === JSON.stringify(savedSchedule)) { router.back(); return; }
    confirmingDiscard.current = true;
    Alert.alert(t('reminders.discardTitle'), t('reminders.discardBody'), [
      { text: t('common.cancel'), style: 'cancel', onPress: () => { confirmingDiscard.current = false; } },
      { text: t('player.discard'), style: 'destructive', onPress: () => { confirmingDiscard.current = false; router.back(); } },
    ], { cancelable: true, onDismiss: () => { confirmingDiscard.current = false; } });
  }
  useAndroidBack(() => { back(); return true; });

  function confirmSave() {
    if (!schedule.enabled) { void save(); return; }
    Alert.alert(t('reminders.primerTitle'), t('reminders.primerBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('reminders.allow'), onPress: () => { void save(); } },
    ]);
  }

  return <Screen scroll>
    <StackHeader title={t('reminders.title')} onBack={back} />
    <View style={styles.content}>
      <Card>
        <Row title={t('reminders.enabled')} trailing={<Switch value={schedule.enabled}
          accessibilityLabel={t('reminders.enabled')}
          onValueChange={(enabled) => { if (!busy) setSchedule({ ...schedule, enabled }); }} />} />
        <Text tone="secondary">{t('reminders.description')}</Text>
      </Card>
      <Card style={styles.content}>
        <Text variant="h3">{t('reminders.days')}</Text>
        <View style={styles.days}>{DAYS.map((day) => <Chip key={day}
          label={t(`reminders.weekdays.${day}`)} selected={schedule.days.includes(day)} onPress={() => {
            if (busy) return;
            setSchedule({ ...schedule, days: schedule.days.includes(day)
              ? schedule.days.filter((value) => value !== day) : [...schedule.days, day] });
          }} />)}</View>
        <Button variant="secondary" label={`${t('reminders.time')}: ${pad(use24Hours ? schedule.hour : schedule.hour % 12 || 12)}:${pad(schedule.minute)}${use24Hours ? '' : ` ${t(schedule.hour < 12 ? 'reminders.am' : 'reminders.pm')}`}`}
          disabled={busy} onPress={() => timeSheet.current?.present()} />
      </Card>
      <Text tone="secondary">{t('reminders.timingNote')}</Text>
      {schedule.enabled && !schedule.days.length ? <Text>{t('reminders.chooseDay')}</Text> : null}
      {message ? <Text accessibilityLiveRegion="polite">{message}</Text> : null}
      <Button label={t('reminders.save')} loading={busy} disabled={busy || (schedule.enabled && !schedule.days.length)}
        onPress={confirmSave} />
    </View>
    <Sheet ref={timeSheet}>
      <SheetHeader title={t('reminders.time')} onClose={() => timeSheet.current?.dismiss()} />
      <View style={styles.wheels}>
        <View style={styles.wheel}><WheelPicker key={String(use24Hours)} options={use24Hours ? HOURS : CLOCK_HOURS}
          value={use24Hours ? schedule.hour : schedule.hour % 12 || 12} format={pad}
          accessibilityLabel={t('reminders.hour')} onChange={(hour) => setSchedule((current) => ({ ...current,
            hour: use24Hours ? hour : hour % 12 + (current.hour >= 12 ? 12 : 0) }))} /></View>
        <View style={styles.wheel}><WheelPicker options={MINUTES} value={schedule.minute} format={pad}
          accessibilityLabel={t('reminders.minute')} onChange={(minute) => setSchedule((current) => ({ ...current, minute }))} /></View>
        {!use24Hours ? <View style={styles.wheel}><WheelPicker options={[0, 12]} value={schedule.hour < 12 ? 0 : 12}
          format={(value) => t(value === 0 ? 'reminders.am' : 'reminders.pm')}
          accessibilityLabel={t('reminders.period')}
          onChange={(period) => setSchedule((current) => ({ ...current, hour: current.hour % 12 + period }))} /></View> : null}
      </View>
      <Button label={t('common.done')} onPress={() => timeSheet.current?.dismiss()} />
    </Sheet>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { gap: spacing[4], paddingBottom: spacing[4] },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  wheels: { flexDirection: 'row', gap: spacing[4] },
  wheel: { flex: 1 },
});
