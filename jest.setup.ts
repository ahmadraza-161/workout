// In-memory stand-in for the SQLite-backed KV store, so tests never need the
// native module.
jest.mock('expo-sqlite/kv-store', () => {
  const store = new Map<string, string>();
  const Storage = {
    getItemSync: (key: string) => store.get(key) ?? null,
    setItemSync: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItemSync: (key: string) => store.delete(key),
    clearSync: () => {
      store.clear();
      return true;
    },
  };
  return { __esModule: true, Storage, default: Storage };
});
