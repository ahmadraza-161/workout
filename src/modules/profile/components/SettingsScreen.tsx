import { router, useIsFocused } from 'expo-router';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Bell, ChevronRight, Database, Heart, UserRound } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import type { ThemePreference } from '@/modules/core/kv';
import { spacing, useTheme } from '@/modules/core/theme';
import { Card, Row, Screen, SegmentedControl, SettingsGroup, Stepper, Switch, TabHeader, Text } from '@/modules/core/ui';

import { loadUnitSystem, loadWorkoutSettings, saveUnitSystem, saveWorkoutSettings, type WorkoutSettings } from '../settings';
import { CueSettings } from './CueSettings';
import { SettingsInformation, type InformationKind } from './SettingsInformation';

const THEME_OPTIONS = [
  { value: 'system', label: t('settings.theme.system') },
  { value: 'light', label: t('settings.theme.light') },
  { value: 'dark', label: t('settings.theme.dark') },
] as const satisfies readonly { value: ThemePreference; label: string }[];

const PREP_OPTIONS = [0, 5, 10, 15, 20, 30].map((seconds) => ({
  value: String(seconds),
  label: String(seconds),
}));
const UNIT_OPTIONS = (['metric', 'imperial'] as const).map((value) => ({ value, label: t(`settings.units.${value}`) }));
const INFORMATION: InformationKind[] = ['credits', 'privacy', 'disclaimer', 'about'];

export function SettingsScreen() {
  const focused = useIsFocused();
  return focused ? <ActiveSettingsScreen /> : null;
}

function ActiveSettingsScreen() {
  const { preference, setPreference, colors } = useTheme();
  const [settings, setSettings] = useState(loadWorkoutSettings);
  const [unit, setUnit] = useState(loadUnitSystem);
  const [error, setError] = useState(false);
  const [information, setInformation] = useState<InformationKind>('about');
  const informationSheet = useRef<BottomSheetModal>(null);

  function update(change: Partial<WorkoutSettings>) {
    const next = { ...settings, ...change };
    try { saveWorkoutSettings(next); setSettings(next); setError(false); }
    catch { setError(true); }
  }

  return (
    <Screen scroll>
      <View style={styles.content}>
        <TabHeader title={t('tabs.settings')} />
        <SettingsGroup rows={[
          { key: 'profile', icon: UserRound, label: t('settings.profile'), onPress: () => router.push('/profile') },
          { key: 'reminders', icon: Bell, label: t('reminders.title'), onPress: () => router.push('/settings/reminders') },
          { key: 'backup', icon: Database, label: t('backup.title'), onPress: () => router.push('/settings/backup') },
          { key: 'favorites', icon: Heart, label: t('favorites.title'), onPress: () => router.push('/favorites') },
        ]} />
        <Card style={styles.group}>
          <Text variant="h3">{t('settings.units.title')}</Text>
          <SegmentedControl accessibilityLabel={t('settings.units.title')} options={UNIT_OPTIONS} value={unit}
            onChange={(next) => { try { saveUnitSystem(next); setUnit(next); setError(false); } catch { setError(true); } }} />
          <Text tone="secondary">{t('settings.units.note')}</Text>
        </Card>
        <Card style={styles.group}>
          <Text variant="h3">{t('settings.appearance')}</Text>
          <SegmentedControl
            accessibilityLabel={t('settings.appearance')}
            options={THEME_OPTIONS}
            value={preference}
            onChange={setPreference}
          />
        </Card>
        <Card style={styles.group}>
          <Text variant="h3">{t('settings.workout')}</Text>
          <CueSettings settings={settings} onChange={update} />
          <Row
            title={t('settings.quietMode')}
            trailing={<Switch value={settings.quietMode} onValueChange={(quietMode) => update({ quietMode })} accessibilityLabel={t('settings.quietMode')} />}
          />
          <Row
            title={t('settings.restEnabled')}
            trailing={<Switch value={settings.restEnabled} onValueChange={(restEnabled) => update({ restEnabled })} accessibilityLabel={t('settings.restEnabled')} />}
          />
          {settings.restEnabled ? (
            <View style={styles.control}>
              <Text>{t('settings.restSeconds')}</Text>
              <Stepper
                label={t('settings.restSeconds')}
                value={settings.restSeconds}
                onChange={(restSeconds) => update({ restSeconds })}
                min={5}
                max={120}
              />
            </View>
          ) : null}
          <View style={styles.control}>
            <Text>{t('settings.prepSeconds')}</Text>
            <SegmentedControl
              accessibilityLabel={t('settings.prepSeconds')}
              options={PREP_OPTIONS}
              value={String(settings.prepSeconds)}
              onChange={(value) => update({ prepSeconds: Number(value) })}
            />
          </View>
        </Card>
        <Card style={styles.group}>
          <Text variant="h3">{t('settings.information')}</Text>
          {INFORMATION.map((kind) => <Row key={kind} title={t(`settings.info.${kind}.title`)}
            trailing={<ChevronRight size={spacing[5]} color={colors.text.secondary} />}
            onPress={() => { setInformation(kind); informationSheet.current?.present(); }} />)}
        </Card>
        {error ? <Text accessibilityLiveRegion="polite">{t('errors.generic.body')}</Text> : null}
      </View>
      <SettingsInformation kind={information} sheetRef={informationSheet}
        onClose={() => informationSheet.current?.dismiss()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing[6], paddingBottom: spacing[8] },
  group: { gap: spacing[3] },
  control: { gap: spacing[3], padding: spacing[4] },
});
