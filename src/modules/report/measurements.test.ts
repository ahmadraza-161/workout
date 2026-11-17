import { bmiCategory, calculateBmi, displayWeight, summarizeWeight, weightToKg } from './measurements';

describe('weight and BMI', () => {
  it('round-trips a one-decimal pound entry through kg storage', () => {
    const kg = weightToKg(164.7, 'imperial');
    expect(displayWeight(kg, 'imperial').toFixed(1)).toBe('164.7');
    expect(weightToKg(70, 'metric')).toBe(70);
  });

  it('uses the latest calendar measurement and keeps daily trend points unique', () => {
    const summary = summarizeWeight([
      { localDate: '2026-09-28', recordedAt: 1, weightKg: 72 },
      { localDate: '2026-09-29', recordedAt: 2, weightKg: 71.5 },
      { localDate: '2026-09-29', recordedAt: 3, weightKg: 71 },
    ]);
    expect(summary.currentKg).toBe(71);
    expect(summary.heaviestKg).toBe(72);
    expect(summary.lightestKg).toBe(71);
    expect(summary.trend.map((row) => row.weightKg)).toEqual([72, 71]);
  });

  it('calculates BMI and assigns every boundary to the higher category', () => {
    expect(calculateBmi(70, 175)?.toFixed(1)).toBe('22.9');
    expect(calculateBmi(70, null)).toBeNull();
    expect(bmiCategory(15.99)).toBe('severelyUnderweight');
    expect(bmiCategory(16)).toBe('underweight');
    expect(bmiCategory(18.5)).toBe('healthy');
    expect(bmiCategory(25)).toBe('overweight');
    expect(bmiCategory(30)).toBe('classI');
    expect(bmiCategory(35)).toBe('classII');
    expect(bmiCategory(40)).toBe('classIII');
  });
});
