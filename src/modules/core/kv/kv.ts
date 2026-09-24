import { Storage } from 'expo-sqlite/kv-store';

import { KV_DEFAULTS, type KvKey, type KvSchema } from './keys';

// Synchronous, typed access to the SQLite-backed key-value store (ADR-016).
// Values are JSON-encoded; unreadable values fall back to the default so a
// corrupt entry can never crash the app.

export function getKv<K extends KvKey>(key: K): KvSchema[K] {
  const raw = Storage.getItemSync(key);
  if (raw === null) return KV_DEFAULTS[key];
  try {
    return JSON.parse(raw) as KvSchema[K];
  } catch {
    return KV_DEFAULTS[key];
  }
}

export function setKv<K extends KvKey>(key: K, value: KvSchema[K]): void {
  Storage.setItemSync(key, JSON.stringify(value));
}

export function removeKv(key: KvKey): void {
  Storage.removeItemSync(key);
}
