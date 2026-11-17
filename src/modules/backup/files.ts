import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { MAX_BACKUP_BYTES, parseBackup, type Backup } from './format';
import { collectBackup } from './repository';

/** Remove the app's disposable export copy before replacing or resetting user data. */
export function clearCachedBackup(): void {
  const file = new File(Paths.cache, 'workout-backup.json');
  if (file.exists) file.delete();
}

/** Share a local JSON file only after the owner explicitly taps Export. */
export async function exportBackup(): Promise<void> {
  if (!await Sharing.isAvailableAsync()) throw new Error('Sharing unavailable');
  const text = JSON.stringify(collectBackup());
  parseBackup(text); // Never produce a backup that this app cannot import.
  const file = new File(Paths.cache, 'workout-backup.json');
  file.write(text);
  // Keep one private cache copy: recipients can read asynchronously after the chooser closes.
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json' });
}

/** Read only the explicitly selected local document; validate before asking to replace data. */
export async function pickBackup(): Promise<Backup | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain'], copyToCacheDirectory: true });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) throw new Error('Missing document');
  const file = new File(asset.uri);
  try {
    if ((asset.size ?? file.size) > MAX_BACKUP_BYTES || file.size > MAX_BACKUP_BYTES) throw new Error('Backup too large');
    return parseBackup(await file.text());
  } finally {
    // Delete only the picker-created copy in our cache, never the owner's source file.
    if (file.uri.startsWith(`${Paths.cache.uri.replace(/\/$/, '')}/`) && file.exists) file.delete();
  }
}
