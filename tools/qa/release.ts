const BLOCKED_PERMISSIONS = [
  'INTERNET', 'ACCESS_NETWORK_STATE', 'RECORD_AUDIO', 'CAMERA',
  'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE', 'READ_MEDIA_IMAGES',
  'READ_MEDIA_VIDEO', 'READ_MEDIA_AUDIO', 'ACCESS_FINE_LOCATION',
  'ACCESS_COARSE_LOCATION', 'SYSTEM_ALERT_WINDOW', 'SCHEDULE_EXACT_ALARM',
  'USE_EXACT_ALARM',
];

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function attributes(value: unknown): Record<string, unknown> {
  return record(record(value).$);
}

/** Checks Expo's generated manifest directives; a merged APK still needs inspection. */
export function validateProductionConfig(value: unknown): string[] {
  const internal = record(record(value)._internal);
  const android = record(record(internal.modResults).android);
  const manifest = record(record(android.manifest).manifest);
  if (!Array.isArray(manifest['uses-permission']) || !Array.isArray(manifest.application)) {
    return ['Missing introspected Android manifest'];
  }
  const errors: string[] = [];
  const permissions = manifest['uses-permission'].map(attributes);
  for (const name of BLOCKED_PERMISSIONS) {
    const entries = permissions.filter((entry) => entry['android:name'] === `android.permission.${name}`);
    if (!entries.some((entry) => entry['tools:node'] === 'remove') ||
      entries.some((entry) => entry['tools:node'] !== 'remove')) {
      errors.push(`Production must remove android.permission.${name}`);
    }
  }
  const application = record(manifest.application[0]);
  if (attributes(application)['android:allowBackup'] !== 'false') {
    errors.push('Android cloud backup must be disabled');
  }
  const metadata = Array.isArray(application['meta-data']) ? application['meta-data'].map(attributes) : [];
  if (!metadata.some((entry) => entry['android:name'] === 'expo.modules.updates.ENABLED' &&
    entry['android:value'] === 'false')) {
    errors.push('Expo updates must be disabled');
  }
  return errors;
}

/** Flags network-capable code and remote URLs in application sources. */
export function sourceViolations(source: string): string[] {
  const errors: string[] = [];
  if (/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|SvgUri|SvgCssUri)\b/.test(source)) {
    errors.push('Network API or remote SVG loader');
  }
  if (/https?:\/\//.test(source)) errors.push('Remote URL');
  return errors;
}
