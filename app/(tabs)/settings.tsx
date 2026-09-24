import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import type { ThemePreference } from '@/modules/core/kv';
import { spacing, useTheme } from '@/modules/core/theme';
import { Card, SegmentedControl, TabPlaceholder, Text } from '@/modules/core/ui';

const THEME_OPTIONS = [
  { value: 'system', label: t('settings.theme.system') },
  { value: 'light', label: t('settings.theme.light') },
  { value: 'dark', label: t('settings.theme.dark') },
] as const satisfies readonly { value: ThemePreference; label: string }[];

export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();
  return (
    <TabPlaceholder title={t('tabs.settings')} phase={6}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="title">{t('settings.appearance')}</Text>
          <SegmentedControl
            accessibilityLabel={t('settings.appearance')}
            options={THEME_OPTIONS}
            value={preference}
            onChange={setPreference}
          />
        </View>
      </Card>
    </TabPlaceholder>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing[3] },
  row: { gap: spacing[3] },
});
