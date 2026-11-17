import type { UnitSystem } from '../kv';

const POUNDS_PER_KG = 2.2046226218;
const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;

export function displayWeight(kg: number, unit: UnitSystem): number {
  return unit === 'imperial' ? kg * POUNDS_PER_KG : kg;
}

export function weightToKg(value: number, unit: UnitSystem): number {
  return Math.round((unit === 'imperial' ? value / POUNDS_PER_KG : value) * 1000) / 1000;
}

export function displayHeight(cm: number): { feet: number; inches: number } {
  // Round total inches before splitting so 11.99 never renders as 12 inches.
  const total = Math.round(cm / CM_PER_INCH * 10) / 10;
  const feet = Math.floor(total / INCHES_PER_FOOT);
  return { feet, inches: Math.round((total - feet * INCHES_PER_FOOT) * 10) / 10 };
}

export function heightToCm(feet: number, inches: number): number {
  if (!Number.isInteger(feet) || feet < 0 || !Number.isFinite(inches) || inches < 0 || inches >= INCHES_PER_FOOT) return NaN;
  return Math.round((feet * INCHES_PER_FOOT + inches) * CM_PER_INCH * 1000) / 1000;
}
