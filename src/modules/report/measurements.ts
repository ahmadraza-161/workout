export { displayWeight, weightToKg } from '@/modules/core/units';

export interface WeightEntry {
  localDate: string;
  recordedAt: number;
  weightKg: number;
}

export type BmiCategory = 'severelyUnderweight' | 'underweight' | 'healthy' | 'overweight' | 'classI' | 'classII' | 'classIII';

export function summarizeWeight(rows: WeightEntry[]): {
  currentKg: number | null;
  heaviestKg: number | null;
  lightestKg: number | null;
  trend: WeightEntry[];
} {
  const sorted = rows
    .filter((row) => Number.isFinite(row.weightKg) && row.weightKg > 0)
    .sort((a, b) => a.localDate.localeCompare(b.localDate) || a.recordedAt - b.recordedAt);
  const latestByDay = new Map<string, WeightEntry>();
  for (const row of sorted) latestByDay.set(row.localDate, row);
  const daily = [...latestByDay.values()];
  return {
    currentKg: sorted.at(-1)?.weightKg ?? null,
    heaviestKg: sorted.length ? Math.max(...sorted.map((row) => row.weightKg)) : null,
    lightestKg: sorted.length ? Math.min(...sorted.map((row) => row.weightKg)) : null,
    trend: daily.slice(-7),
  };
}

export function calculateBmi(weightKg: number | null, heightCm: number | null): number | null {
  if (!weightKg || !heightCm || !Number.isFinite(weightKg) || !Number.isFinite(heightCm) || heightCm <= 0) return null;
  return weightKg / (heightCm / 100) ** 2;
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 16) return 'severelyUnderweight';
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'healthy';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'classI';
  if (bmi < 40) return 'classII';
  return 'classIII';
}
