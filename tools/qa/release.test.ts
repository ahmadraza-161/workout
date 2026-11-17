import appConfig from '../../app.config';
import { sourceViolations, validateProductionConfig } from './release';

function fixture() {
  const names = new Set([...appConfig.android?.blockedPermissions ?? [],
    'android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE']);
  const manifest = {
    'uses-permission': [...names].map((name) => ({ $: { 'android:name': name, 'tools:node': 'remove' } })),
    application: [{ $: { 'android:allowBackup': 'false' },
      'meta-data': [{ $: { 'android:name': 'expo.modules.updates.ENABLED', 'android:value': 'false' } }] }],
  };
  return { manifest, config: { _internal: { modResults: { android: { manifest: { manifest } } } } } };
}

it('accepts production removal directives while allowing local haptics', () => {
  const { manifest, config } = fixture();
  manifest['uses-permission'].push({ $: { 'android:name': 'android.permission.VIBRATE', 'tools:node': 'merge' } });
  expect(validateProductionConfig(config)).toEqual([]);
});

it('rejects a missing network permission removal', () => {
  const { manifest, config } = fixture();
  manifest['uses-permission'] = manifest['uses-permission'].filter((item) => item.$['android:name'] !== 'android.permission.INTERNET');
  expect(validateProductionConfig(config)).toContain('Production must remove android.permission.INTERNET');
});

it('rejects active permission duplicates even when a removal directive exists', () => {
  const { manifest, config } = fixture();
  manifest['uses-permission'].push({ $: { 'android:name': 'android.permission.RECORD_AUDIO', 'tools:node': 'merge' } });
  expect(validateProductionConfig(config)).toContain('Production must remove android.permission.RECORD_AUDIO');
});

it('rejects enabled cloud backup and updates', () => {
  const { manifest, config } = fixture();
  manifest.application[0]!.$['android:allowBackup'] = 'true';
  manifest.application[0]!['meta-data'][0]!.$['android:value'] = 'true';
  expect(validateProductionConfig(config)).toEqual([
    'Android cloud backup must be disabled', 'Expo updates must be disabled',
  ]);
});

it('fails closed if Expo no longer supplies the introspected manifest', () => {
  expect(validateProductionConfig({})).toEqual(['Missing introspected Android manifest']);
});

it('detects remote SVG loaders, remote URLs and network calls, allowing bundled assets', () => {
  expect(sourceViolations("const image = require('./exercise.jpg');")).toEqual([]);
  expect(sourceViolations("fetch('/api');")).toContain('Network API or remote SVG loader');
  expect(sourceViolations('<SvgUri uri={url} />')).toContain('Network API or remote SVG loader');
  expect(sourceViolations("const url = 'https://example.com/image.png';")).toContain('Remote URL');
});
