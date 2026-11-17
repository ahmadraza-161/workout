import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import type { UnitSystem } from '@/modules/core/kv';
import { spacing } from '@/modules/core/theme';
import { Button, Card, DatePicker, RulerPicker, Section, SegmentedControl, Sheet, SheetHeader, Text, TextField, Touchable } from '@/modules/core/ui';

import { localDateOf } from '../aggregates';
import { displayWeight, summarizeWeight, weightToKg, type WeightEntry } from '../measurements';
import { saveWeightLog, setWeightUnit } from '../repository';
import { WeightChart } from './WeightChart';

const UNIT_OPTIONS = [
  { value: 'metric', label: 'kg' },
  { value: 'imperial', label: 'lbs' },
] as const;

function formatWeight(kg: number | null, unit: UnitSystem): string {
  return kg === null ? '--' : `${displayWeight(kg, unit).toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'}`;
}

export function WeightSection({
  entries,
  profileWeightKg,
  unit,
  onUpdated,
}: {
  entries: WeightEntry[];
  profileWeightKg: number | null;
  unit: UnitSystem;
  onUpdated: () => void;
}) {
  const sheet = useRef<BottomSheetModal>(null);
  const [date, setDate] = useState(new Date());
  const [choosingDate, setChoosingDate] = useState(false);
  const [draftUnit, setDraftUnit] = useState<UnitSystem>(unit);
  const [draftKg, setDraftKg] = useState(profileWeightKg ?? 70);
  const [input, setInput] = useState('');
  const [rulerBase, setRulerBase] = useState(70);
  const [error, setError] = useState(false);
  const summary = summarizeWeight(entries);

  const open = () => {
    const current = summary.currentKg ?? profileWeightKg ?? 70;
    const display = displayWeight(current, unit);
    setDate(new Date());
    setDraftUnit(unit);
    setDraftKg(current);
    setInput(display.toFixed(1));
    setRulerBase(display);
    setChoosingDate(false);
    setError(false);
    sheet.current?.present();
  };
  const chooseDate = (next: Date) => {
    const existing = entries.find((entry) => entry.localDate === localDateOf(next));
    const selectedKg = existing?.weightKg ?? summary.currentKg ?? profileWeightKg ?? 70;
    setDraftKg(selectedKg);
    const display = displayWeight(selectedKg, draftUnit);
    setInput(display.toFixed(1));
    setRulerBase(display);
    setDate(next);
    setChoosingDate(false);
  };
  const changeUnit = (next: UnitSystem) => {
    setDraftUnit(next);
    const display = displayWeight(draftKg, next);
    setInput(display.toFixed(1));
    setRulerBase(display);
  };
  const save = () => {
    try {
      const value = Number(input);
      if (!input.trim() || !Number.isFinite(value)) throw new Error('Invalid weight');
      saveWeightLog(localDateOf(date), weightToKg(value, draftUnit));
      setWeightUnit(draftUnit);
      setError(false);
      sheet.current?.dismiss();
      onUpdated();
    } catch {
      setError(true);
    }
  };
  const min = Math.max(draftUnit === 'metric' ? 20 : 44, Math.floor(rulerBase) - 10);
  const max = Math.min(draftUnit === 'metric' ? 400 : 882, Math.ceil(rulerBase) + 10);

  return (
    <Section title={t('report.weight.title')} actionLabel={t('report.weight.log')} onAction={open} headerPadding={spacing[0]}>
      <Card style={styles.card}>
        <View style={styles.summaryRow}>
          <View style={styles.metric}>
            <Text tone="secondary">{t('report.weight.current')}</Text>
            <Text variant="statValue">{formatWeight(summary.currentKg ?? profileWeightKg, unit)}</Text>
          </View>
          <View style={styles.metric}>
            <Text tone="secondary">{t('report.weight.heaviest')}</Text>
            <Text variant="bodyStrong">{formatWeight(summary.heaviestKg, unit)}</Text>
            <Text tone="secondary">{t('report.weight.lightest')}</Text>
            <Text variant="bodyStrong">{formatWeight(summary.lightestKg, unit)}</Text>
          </View>
        </View>
        <WeightChart entries={summary.trend} unit={unit} />
      </Card>
      <Sheet ref={sheet}>
        {choosingDate ? (
          <View style={styles.sheet}>
            <SheetHeader title={t('report.weight.selectDate')} onClose={() => setChoosingDate(false)} />
            <DatePicker value={date} onChange={chooseDate} disableFuture />
          </View>
        ) : (
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text variant="h2">{t('report.weight.title')}</Text>
              <Touchable onPress={() => setChoosingDate(true)} accessibilityLabel={t('report.weight.selectDate')}>
                <Text tone="brand">{format(date, 'MMM d, yyyy')}</Text>
              </Touchable>
            </View>
            <SegmentedControl options={UNIT_OPTIONS} value={draftUnit} onChange={changeUnit}
              appearance="primary" accessibilityLabel={t('report.weight.unit')} />
            <TextField value={input} onChangeText={setInput} label={t('report.weight.value')}
              keyboardType="decimal-pad" onSubmitEditing={() => {
                const value = Number(input);
                const kg = weightToKg(value, draftUnit);
                if (input.trim() && Number.isFinite(kg) && kg >= 20 && kg <= 400) {
                  setDraftKg(kg);
                  setRulerBase(value);
                  setError(false);
                } else {
                  setError(true);
                }
              }} />
            <RulerPicker key={`${draftUnit}-${rulerBase}`} value={Math.min(max, Math.max(min, displayWeight(draftKg, draftUnit)))}
              onChange={(next) => { setDraftKg(weightToKg(next, draftUnit)); setInput(next.toFixed(1)); }}
              min={min} max={max} unit={draftUnit === 'metric' ? 'kg' : 'lbs'}
              accessibilityLabel={t('report.weight.value')} />
            {error ? <Text tone="secondary">{t('report.weight.invalid')}</Text> : null}
            <View style={styles.buttons}>
              <View style={styles.button}><Button label={t('common.cancel')} variant="secondary" onPress={() => sheet.current?.dismiss()} /></View>
              <View style={styles.button}><Button label={t('common.save')} onPress={save} /></View>
            </View>
          </View>
        )}
      </Sheet>
    </Section>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing[6] },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { gap: spacing[1] },
  sheet: { gap: spacing[5] },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttons: { flexDirection: 'row', gap: spacing[3] },
  button: { flex: 1 },
});
