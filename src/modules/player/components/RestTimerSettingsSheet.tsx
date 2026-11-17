import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Button, Row, SegmentedControl, Sheet, SheetHeader, Switch, WheelPicker } from '@/modules/core/ui';
import type { WorkoutSettings } from '@/modules/profile';
import { REST_TIMER_OPTIONS } from '../timerOptions';

export function RestTimerSettingsSheet({ sheetRef, settings, mode, onModeChange, onChange, onClose }: {
  sheetRef: Ref<BottomSheetModal>; settings: WorkoutSettings; mode: 'default' | 'custom';
  onModeChange: (mode: 'default' | 'custom') => void;
  onChange: (change: Partial<WorkoutSettings>) => void; onClose: () => void;
}) {
  return <Sheet ref={sheetRef}><View style={styles.content}>
    <SheetHeader title={t('player.editRest')} onClose={onClose} />
    <SegmentedControl value={mode} onChange={onModeChange} accessibilityLabel={t('restTimerUi.mode')}
      options={[{ value: 'default', label: t('restTimerUi.default') }, { value: 'custom', label: t('restTimerUi.custom') }]} />
    <Row inset={false} title={t('settings.restEnabled')} trailing={<Switch value={settings.restEnabled}
      accessibilityLabel={t('settings.restEnabled')} onValueChange={(restEnabled) => onChange({ restEnabled })} />} />
    {settings.restEnabled ? <WheelPicker options={REST_TIMER_OPTIONS} value={settings.restSeconds}
      format={(count) => t('browse.seconds', { count })} accessibilityLabel={t('settings.restSeconds')}
      onChange={(restSeconds) => { onModeChange('custom'); onChange({ restSeconds }); }} /> : null}
    <Button label={t('common.done')} onPress={onClose} />
  </View></Sheet>;
}
const styles = StyleSheet.create({ content: { gap: spacing[4] } });
