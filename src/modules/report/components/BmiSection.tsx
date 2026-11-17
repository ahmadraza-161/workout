import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import type { UnitSystem } from '@/modules/core/kv';
import { displayHeight } from '@/modules/core/units';
import { bmiScale, radius, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, GradientBackground, Section, Sheet, SheetHeader, Text } from '@/modules/core/ui';
import { HeightField, updateHeightCm } from '@/modules/profile';

import { bmiCategory, calculateBmi } from '../measurements';

const SCALE_MIN = 15;
const SCALE_MAX = 40;

export function BmiSection({
  weightKg,
  heightCm,
  unit,
  onUpdated,
}: {
  weightKg: number | null;
  heightCm: number | null;
  unit: UnitSystem;
  onUpdated: () => void;
}) {
  const { colors } = useTheme();
  const sheet = useRef<BottomSheetModal>(null);
  const [input, setInput] = useState(heightCm?.toString() ?? '');
  const [error, setError] = useState(false);
  const [editRevision, setEditRevision] = useState(0);
  const height = heightCm === null ? null : displayHeight(heightCm);
  const bmi = calculateBmi(weightKg, heightCm);
  const marker = bmi === null ? null : Math.min(100, Math.max(0, (bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN) * 100));

  const save = () => {
    try {
      const value = Number(input);
      if (!input.trim()) throw new Error('Missing height');
      updateHeightCm(value);
      setError(false);
      sheet.current?.dismiss();
      onUpdated();
    } catch {
      setError(true);
    }
  };

  return (
    <Section title={t('report.bmi.title')} actionLabel={t('common.edit')} onAction={() => {
      setInput(heightCm?.toString() ?? '');
      setEditRevision((value) => value + 1);
      setError(false);
      sheet.current?.present();
    }} headerPadding={spacing[0]}>
      <Card style={styles.card}>
        <Text variant="statValue">{bmi === null ? '--' : bmi.toFixed(1)}</Text>
        {bmi === null ? (
          <Text tone="secondary">{t(heightCm === null ? 'report.bmi.needHeight' : 'report.bmi.needWeight')}</Text>
        ) : (
          <Text tone="secondary">{t(`report.bmi.category.${bmiCategory(bmi)}`)}</Text>
        )}
        <View style={styles.scaleWrap}>
          <View style={styles.scale}>
            {bmiScale.map((segment) => (
              <View key={segment.from} style={[styles.segment, { flex: segment.to - segment.from }]}>
                <GradientBackground stops={segment.stops} />
              </View>
            ))}
          </View>
          {marker !== null ? <View style={[styles.marker, { left: `${marker}%`, backgroundColor: colors.text.primary }]} /> : null}
        </View>
        <View style={styles.labels}>
          {['15', '16', '18.5', '25', '30', '35', '40'].map((label) => (
            <Text key={label} variant="captionSm" tone="secondary">{label}</Text>
          ))}
        </View>
        <Text tone="secondary">{t('report.bmi.screening')}</Text>
        <Text tone="secondary">{unit === 'imperial' && height ? t('settings.heightValue', height)
          : t('report.bmi.height', { value: heightCm === null ? '--' : heightCm })}</Text>
      </Card>
      <Sheet ref={sheet}>
        <View style={styles.sheet}>
          <SheetHeader title={t('report.bmi.editHeight')} onClose={() => sheet.current?.dismiss()} />
          <HeightField key={`${unit}-${editRevision}`} value={input} onChange={setInput} unit={unit} />
          {error ? <Text tone="secondary">{t('onboarding.error.height')}</Text> : null}
          <Button label={t('common.save')} onPress={save} />
        </View>
      </Sheet>
    </Section>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing[3] },
  scaleWrap: { height: spacing[5], justifyContent: 'center' },
  scale: { height: spacing[4], flexDirection: 'row', borderRadius: radius.xs, overflow: 'hidden' },
  segment: { height: '100%', overflow: 'hidden' },
  marker: { position: 'absolute', top: 0, height: spacing[5], width: 2 },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  sheet: { gap: spacing[5] },
});
