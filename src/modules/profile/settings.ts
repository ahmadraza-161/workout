import { getKv, setKv, type UnitSystem } from '@/modules/core/kv';

export function loadUnitSystem(): UnitSystem { return getKv('settings.units'); }
export function saveUnitSystem(unit: UnitSystem): void {
  if (unit !== 'metric' && unit !== 'imperial') throw new Error('Invalid unit system');
  setKv('settings.units', unit);
}

export interface WorkoutSettings {
  beeps: boolean;
  haptics: boolean;
  quietMode: boolean;
  restEnabled: boolean;
  restSeconds: number;
  prepSeconds: number;
}

export function loadWorkoutSettings(): WorkoutSettings {
  return {
    beeps: getKv('settings.sound.beeps'),
    haptics: getKv('settings.haptics'),
    quietMode: getKv('settings.quietMode'),
    restEnabled: getKv('settings.timers.restEnabled'),
    restSeconds: getKv('settings.timers.restSeconds'),
    prepSeconds: getKv('settings.timers.prepSeconds'),
  };
}

export function saveWorkoutSettings(settings: WorkoutSettings): void {
  setKv('settings.sound.beeps', settings.beeps);
  setKv('settings.haptics', settings.haptics);
  setKv('settings.quietMode', settings.quietMode);
  setKv('settings.timers.restEnabled', settings.restEnabled);
  setKv('settings.timers.restSeconds', settings.restSeconds);
  setKv('settings.timers.prepSeconds', settings.prepSeconds);
}
