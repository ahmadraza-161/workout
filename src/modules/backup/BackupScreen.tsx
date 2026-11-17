import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, Screen, StackHeader, Text } from '@/modules/core/ui';
import { restoreReminders } from '@/modules/reminders';

import { clearCachedBackup, exportBackup, pickBackup } from './files';
import type { Backup } from './format';
import { replaceUserData } from './repository';

export function BackupScreen() {
  const { reloadPreference } = useTheme();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const working = useRef(false);

  async function run(task: () => Promise<void>) {
    if (working.current) return;
    working.current = true; setBusy(true); setMessage('');
    try { await task(); }
    catch { setMessage(t('backup.error')); }
    finally { working.current = false; setBusy(false); }
  }

  async function replace(backup: Backup | null) {
    clearCachedBackup();
    replaceUserData(backup);
    reloadPreference();
    try {
      if (!await restoreReminders()) Alert.alert(t('backup.reminderWarning'));
    }
    catch { Alert.alert(t('backup.reminderWarning')); }
    router.dismissAll();
    router.replace('/');
  }

  function confirmReset() {
    Alert.alert(t('backup.reset'), t('backup.resetBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('backup.continue'), style: 'destructive', onPress: () => {
        Alert.alert(t('backup.resetFinal'), t('backup.resetBody'), [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('backup.reset'), style: 'destructive', onPress: () => { void run(() => replace(null)); } },
        ]);
      } },
    ]);
  }

  return <Screen scroll>
    <StackHeader title={t('backup.title')} onBack={() => { if (!busy) router.back(); }} />
    <View style={styles.content}>
      <Card style={styles.content}>
        <Text>{t('backup.description')}</Text>
        <Button label={t('backup.export')} disabled={busy} onPress={() => { void run(exportBackup); }} />
      </Card>
      <Card style={styles.content}>
        <Text>{t('backup.importBody')}</Text>
        <Button label={t('backup.import')} disabled={busy} onPress={() => { void run(async () => {
          const backup = await pickBackup();
          if (!backup) return;
          Alert.alert(t('backup.replaceTitle'), t('backup.replaceBody', { count: backup.data.tables.sessions!.length }), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('backup.replace'), style: 'destructive', onPress: () => { void run(() => replace(backup)); } },
          ]);
        }); }} />
      </Card>
      <Card style={styles.content}>
        <Text>{t('backup.resetBody')}</Text>
        <Button label={t('backup.reset')} variant="secondary" disabled={busy} onPress={confirmReset} />
      </Card>
      {busy ? <Text>{t('backup.working')}</Text> : null}
      {message ? <Text accessibilityLiveRegion="polite">{message}</Text> : null}
    </View>
  </Screen>;
}

const styles = StyleSheet.create({ content: { gap: spacing[4], paddingBottom: spacing[4] } });
