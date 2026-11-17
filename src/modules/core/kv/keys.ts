// Typed KV keys and defaults (DOC/ARCHITECTURE.md §6.4).
// Every key is namespaced; values are stored as JSON strings.

export type ThemePreference = 'system' | 'light' | 'dark';
export type UnitSystem = 'metric' | 'imperial';
export type RestMode = 'default' | 'custom';

export interface KvSchema {
  'reminders.schedule': unknown | null;
  'settings.units': UnitSystem;
  'settings.theme': ThemePreference;
  'settings.quietMode': boolean;
  'settings.sound.voice': boolean;
  'settings.sound.beeps': boolean;
  'settings.haptics': boolean;
  'settings.sound.announceName': boolean;
  'settings.timers.restMode': RestMode;
  'settings.timers.restSeconds': number;
  'settings.timers.restEnabled': boolean;
  'settings.timers.prepSeconds': number;
  'onboarding.completed': boolean;
  'search.recent': string[];
  'player.snapshot': unknown | null;
  'app.lastVersionSeen': string | null;
  'feedback.note': string;
}

export type KvKey = keyof KvSchema;

export const KV_DEFAULTS: KvSchema = {
  'reminders.schedule': null,
  // Replaced at first launch from the device locale (profile module, Phase 6).
  'settings.units': 'metric',
  'settings.theme': 'system',
  'settings.quietMode': false,
  'settings.sound.voice': true,
  'settings.sound.beeps': true,
  'settings.haptics': true,
  'settings.sound.announceName': true,
  'settings.timers.restMode': 'default',
  'settings.timers.restSeconds': 20,
  'settings.timers.restEnabled': true,
  'settings.timers.prepSeconds': 15,
  'onboarding.completed': false,
  'search.recent': [],
  'player.snapshot': null,
  'app.lastVersionSeen': null,
  'feedback.note': '',
};
