import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { t } from '@/modules/core/i18n';
import type { UnitSystem } from '@/modules/core/kv';
import { spacing } from '@/modules/core/theme';
import { displayHeight, displayWeight, heightToCm, weightToKg } from '@/modules/core/units';
import { TextField } from '@/modules/core/ui';

// Draft values remain canonical. Local text avoids reformatting partially typed decimals.
export function HeightField({ value, unit, onChange }: { value: string; unit: UnitSystem; onChange: (cm: string) => void }) {
  const [parts, setParts] = useState(() => {
    const display = value ? displayHeight(Number(value)) : null;
    return { feet: display?.feet.toString() ?? '', inches: display?.inches.toString() ?? '' };
  });
  if (unit === 'metric') return <TextField label={t('onboarding.height')} value={value}
    keyboardType="decimal-pad" onChangeText={onChange} />;
  function update(next: typeof parts) {
    setParts(next);
    onChange(!next.feet.trim() && !next.inches.trim() ? '' : String(heightToCm(Number(next.feet), Number(next.inches))));
  }
  return <View style={styles.fields}>
    <TextField label={t('settings.heightFeet')} value={parts.feet} keyboardType="number-pad"
      onChangeText={(feet) => update({ ...parts, feet })} />
    <TextField label={t('settings.heightInches')} value={parts.inches} keyboardType="decimal-pad"
      onChangeText={(inches) => update({ ...parts, inches })} />
  </View>;
}

export function WeightField({ value, unit, onChange }: { value: string; unit: UnitSystem; onChange: (kg: string) => void }) {
  const [input, setInput] = useState(() => value ? displayWeight(Number(value), unit).toFixed(1) : '');
  return <TextField label={t(unit === 'metric' ? 'onboarding.weight' : 'settings.weightLbs')}
    value={unit === 'metric' ? value : input} keyboardType="decimal-pad" onChangeText={(text) => {
      setInput(text);
      onChange(unit === 'metric' || !text.trim() ? text : String(weightToKg(Number(text), unit)));
    }} />;
}

const styles = StyleSheet.create({ fields: { gap: spacing[5] } });
