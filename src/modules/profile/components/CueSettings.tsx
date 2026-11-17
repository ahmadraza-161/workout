import { t } from '@/modules/core/i18n';
import { Row, Switch } from '@/modules/core/ui';

import type { WorkoutSettings } from '../settings';

export function CueSettings({ settings, onChange }: {
  settings: WorkoutSettings;
  onChange: (change: Partial<WorkoutSettings>) => void;
}) {
  return <>{(['beeps', 'haptics'] as const).map((key) => (
    <Row key={key} title={t(`settings.${key}`)} trailing={
      <Switch value={settings[key]} onValueChange={(value) => onChange({ [key]: value })}
        accessibilityLabel={t(`settings.${key}`)} />
    } />
  ))}</>;
}
