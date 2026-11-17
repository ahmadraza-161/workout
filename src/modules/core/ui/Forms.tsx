import { useState } from 'react';
import { Minus, Plus } from 'lucide-react-native';
import { Switch as RNSwitch, StyleSheet, TextInput, View } from 'react-native';

import { t } from '../i18n';
import { radius, spacing, useTheme } from '../theme';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Form controls from DESIGN §4.2.
//
// There is deliberately no Slider: the design doc lists one, but its only use
// was the in-app music volume, and §12.4 drops the in-app music player because
// the app has no music library and no network. Rest and prep times use the
// wheel picker, weight uses the ruler picker and reps use the stepper.

/** Themed wrapper over the platform switch so colours come from tokens. */
export function Switch({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      trackColor={{ false: colors.line.divider, true: colors.control.switchTrack }}
      thumbColor={value ? colors.primary : '#FFFFFF'}
    />
  );
}

export interface TextFieldProps {
  value: string;
  onChangeText: (next: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  maxLength?: number;
  onSubmitEditing?: () => void;
}

export function TextField({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  keyboardType = 'default',
  maxLength,
  onSubmitEditing,
}: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      {label ? (
        <Text variant="captionSm" tone="secondary">
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={onSubmitEditing ? 'search' : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label ?? placeholder}
        style={[
          styles.input,
          { backgroundColor: colors.surface.muted, color: colors.text.primary },
          focused && { borderWidth: 2, borderColor: colors.primary },
        ]}
      />
      {error ? (
        <Text variant="captionSm" style={{ color: colors.semantic.errorText }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/** − value + for the reps adjuster (DESIGN §4.2). */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  const { colors } = useTheme();

  const step = (delta: number) => () => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) onChange(next);
  };

  return (
    <View style={styles.stepper} accessible accessibilityLabel={`${label}: ${value}`}>
      <Touchable
        onPress={step(-1)}
        disabled={value <= min}
        visualSize={44}
        accessibilityLabel={t('a11y.decrease')}
      >
        <View style={[styles.stepperButton, { backgroundColor: colors.surface.muted }]}>
          <Minus size={20} color={colors.primary} />
        </View>
      </Touchable>

      <Text variant="statValue">{value}</Text>

      <Touchable
        onPress={step(1)}
        disabled={value >= max}
        visualSize={44}
        accessibilityLabel={t('a11y.increase')}
      >
        <View style={[styles.stepperButton, { backgroundColor: colors.surface.muted }]}>
          <Plus size={20} color={colors.primary} />
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing[1] },
  input: { height: 52, borderRadius: radius.md + 2, paddingHorizontal: spacing[4], fontSize: 15 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing[5] },
  stepperButton: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
