// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// The app is 100% offline (ADR-003): any network API in app code is an error.
const NETWORK_GLOBALS = ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'].map((name) => ({
  name,
  message: 'Network access is not allowed: the app is fully offline (DOC/SECURITY.md §6).',
}));

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'drizzle/*', 'android/*', 'ios/*', '.expo/*', 'coverage/*'],
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': ['error', ...NETWORK_GLOBALS],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
