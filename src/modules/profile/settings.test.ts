import { Storage } from 'expo-sqlite/kv-store';

import { loadUnitSystem, loadWorkoutSettings, saveUnitSystem, saveWorkoutSettings } from './settings';

beforeEach(() => Storage.clearSync());

it('provides cue defaults for existing installations and persists changes', () => {
  const settings = loadWorkoutSettings();
  expect(settings.beeps).toBe(true);
  expect(settings.haptics).toBe(true);
  const changed = { ...settings, beeps: false, haptics: false, prepSeconds: 0 };
  saveWorkoutSettings(changed);
  expect(loadWorkoutSettings()).toEqual(changed);
});

it('shares a durable unit preference and rejects unsupported unit values', () => {
  expect(loadUnitSystem()).toBe('metric');
  saveUnitSystem('imperial');
  expect(loadUnitSystem()).toBe('imperial');
  expect(() => saveUnitSystem('other' as 'metric')).toThrow();
  expect(loadUnitSystem()).toBe('imperial');
});
