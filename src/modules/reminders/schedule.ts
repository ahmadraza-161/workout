export interface ReminderSchedule {
  enabled: boolean;
  days: number[];
  hour: number;
  minute: number;
}

export const DEFAULT_SCHEDULE: ReminderSchedule = {
  enabled: false, days: [2, 4, 6], hour: 18, minute: 0,
};

/** Native weekly triggers use Sunday=1 through Saturday=7. */
export function isReminderSchedule(value: unknown): value is ReminderSchedule {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as ReminderSchedule;
  return typeof candidate.enabled === 'boolean' && Array.isArray(candidate.days) &&
    candidate.days.length <= 7 && (!candidate.enabled || candidate.days.length > 0) &&
    candidate.days.every((day) => Number.isInteger(day) && day >= 1 && day <= 7) &&
    new Set(candidate.days).size === candidate.days.length &&
    Number.isInteger(candidate.hour) && candidate.hour >= 0 && candidate.hour <= 23 &&
    Number.isInteger(candidate.minute) && candidate.minute >= 0 && candidate.minute <= 55 &&
    candidate.minute % 5 === 0;
}
