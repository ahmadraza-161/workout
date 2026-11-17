import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { t } from '@/modules/core/i18n';
import { spacing, useTheme } from '@/modules/core/theme';
import { Text } from '@/modules/core/ui';

import { displayWeight, type WeightEntry } from '../measurements';
import type { UnitSystem } from '@/modules/core/kv';

const CHART_WIDTH = 300;
const CHART_HEIGHT = 140;
const CHART_INSET = 12;

export function WeightChart({ entries, unit }: { entries: WeightEntry[]; unit: UnitSystem }) {
  const { colors } = useTheme();
  if (entries.length === 0) return <Text tone="secondary">{t('report.weight.noTrend')}</Text>;

  const values = entries.map((entry) => displayWeight(entry.weightKg, unit));
  const minimum = Math.min(...values) - 1;
  const maximum = Math.max(...values) + 1;
  const firstDay = Date.parse(`${entries[0]?.localDate}T00:00:00Z`);
  const lastDay = Date.parse(`${entries.at(-1)?.localDate}T00:00:00Z`);
  const points = entries.map((entry, index) => {
    const day = Date.parse(`${entry.localDate}T00:00:00Z`);
    const x = firstDay === lastDay ? CHART_WIDTH / 2 : CHART_INSET + (day - firstDay) / (lastDay - firstDay) * (CHART_WIDTH - CHART_INSET * 2);
    const y = CHART_HEIGHT - CHART_INSET - (values[index]! - minimum) / (maximum - minimum) * (CHART_HEIGHT - CHART_INSET * 2);
    return { x, y };
  });

  return (
    <View accessible accessibilityLabel={t('report.weight.trendA11y', { count: entries.length })} style={styles.chart}>
      <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <Line key={fraction} x1={0} x2={CHART_WIDTH} y1={fraction * CHART_HEIGHT} y2={fraction * CHART_HEIGHT}
            stroke={colors.line.grid} strokeWidth={1} />
        ))}
        {points.length > 1 ? <Polyline points={points.map((point) => `${point.x},${point.y}`).join(' ')}
          fill="none" stroke={colors.primary} strokeWidth={3} /> : null}
        {points.map((point, index) => <Circle key={entries[index]?.localDate} cx={point.x} cy={point.y}
          r={4} fill={colors.primary} />)}
      </Svg>
      <View style={styles.labels}>
        <Text variant="caption" tone="secondary">{entries[0]?.localDate}</Text>
        {entries.length > 1 ? <Text variant="caption" tone="secondary">{entries.at(-1)?.localDate}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { gap: spacing[2] },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
});
