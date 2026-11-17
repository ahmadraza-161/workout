import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState, type Ref } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { KV_DEFAULTS } from '@/modules/core/kv';
import { sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, Row, SegmentedControl, Sheet, SheetHeader, Text } from '@/modules/core/ui';
import { CueSettings, type WorkoutSettings } from '@/modules/profile';
import { RestTimerSettingsSheet } from './RestTimerSettingsSheet';

export function WorkoutSettingsSheet({ sheetRef, settings, onChange, onClose }: {
  sheetRef: Ref<BottomSheetModal>;
  settings: WorkoutSettings;
  onChange: (change: Partial<WorkoutSettings>) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const restSheet = useRef<BottomSheetModal>(null);
  const defaultRest = KV_DEFAULTS['settings.timers.restSeconds'];
  const [mode, setMode] = useState<'default' | 'custom'>('default');
  return <><Sheet ref={sheetRef} muted scroll>
      <View style={styles.content}>
        <SheetHeader title={t('settings.workout')} onClose={onClose} />
        <Card><Text tone="secondary">{t('settings.musicNote')}</Text></Card>
        <Card><CueSettings settings={settings} onChange={onChange} /></Card>
        <Card>
          <Row inset={false} title={t('player.editRest')}
            meta={[settings.restEnabled ? t('browse.seconds', { count: settings.restSeconds }) : t('restTimerUi.off')]}
            trailing={<ChevronRight size={sizes.iconMd} color={colors.text.secondary} />}
            onPress={() => { setMode(settings.restSeconds === defaultRest ? 'default' : 'custom'); restSheet.current?.present(); }} />
        </Card>
        <Card>
          <Text>{t('settings.prepSeconds')}</Text>
          <SegmentedControl accessibilityLabel={t('settings.prepSeconds')}
            options={[0, 5, 10, 15, 20, 30].map((value) => ({ value: String(value), label: String(value) }))}
            value={String(settings.prepSeconds)} onChange={(value) => onChange({ prepSeconds: Number(value) })} />
        </Card>
        <Text variant="caption" tone="secondary">{t('settings.timerNote')}</Text>
        <Button label={t('common.done')} onPress={onClose} />
      </View>
  </Sheet>
  <RestTimerSettingsSheet sheetRef={restSheet} settings={settings} mode={mode}
    onModeChange={(next) => { setMode(next); if (next === 'default') onChange({ restSeconds: defaultRest }); }}
    onChange={onChange} onClose={() => restSheet.current?.dismiss()} />
  </>;
}

const styles = StyleSheet.create({
  content: { gap: spacing[4] },
});
