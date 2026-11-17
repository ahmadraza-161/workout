import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import { sourceViolations, validateProductionConfig } from './release.ts';

const ROOT = join(import.meta.dirname, '..', '..');
// Use the installed CLI directly, without downloading packages or invoking a shell.
const config = spawnSync(process.execPath, [join(ROOT, 'node_modules', 'expo', 'bin', 'cli'),
  'config', '--type', 'introspect', '--json'], {
  cwd: ROOT, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
  env: { ...process.env, APP_VARIANT: 'production', EXPO_OFFLINE: '1' },
});
if (config.error) throw config.error;
if (config.status !== 0) throw new Error(config.stderr || 'Expo configuration failed');
const errors = validateProductionConfig(JSON.parse(config.stdout));

function inspect(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) inspect(path);
    else if (/\.[jt]sx?$/.test(entry.name) && !/\.(?:test|spec)\.[jt]sx?$/.test(entry.name)) {
      for (const error of sourceViolations(readFileSync(path, 'utf8'))) {
        errors.push(`${relative(ROOT, path)}: ${error}`);
      }
    }
  }
}
inspect(join(ROOT, 'src'));
inspect(join(ROOT, 'app'));
if (errors.length) throw new Error(errors.join('\n'));
console.log('Release preflight passed: production permission removals, backup off, updates off, no network sources.');
console.log('Still required: inspect the merged APK manifest and test airplane mode on Android.');
