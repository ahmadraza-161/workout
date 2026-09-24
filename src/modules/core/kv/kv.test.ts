import { Storage } from 'expo-sqlite/kv-store';

import { KV_DEFAULTS } from './keys';
import { getKv, removeKv, setKv } from './kv';

describe('kv store', () => {
  beforeEach(() => {
    Storage.clearSync();
  });

  it('returns the default when a key was never written', () => {
    expect(getKv('settings.timers.prepSeconds')).toBe(KV_DEFAULTS['settings.timers.prepSeconds']);
    expect(getKv('settings.theme')).toBe('system');
  });

  it('round-trips typed values', () => {
    setKv('settings.theme', 'dark');
    setKv('search.recent', ['plank', 'squat']);
    expect(getKv('settings.theme')).toBe('dark');
    expect(getKv('search.recent')).toEqual(['plank', 'squat']);
  });

  it('falls back to the default when the stored value is corrupt', () => {
    Storage.setItemSync('settings.quietMode', '{not json');
    expect(getKv('settings.quietMode')).toBe(false);
  });

  it('removes a key so the default applies again', () => {
    setKv('settings.units', 'imperial');
    removeKv('settings.units');
    expect(getKv('settings.units')).toBe('metric');
  });
});
