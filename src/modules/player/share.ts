import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type Svg from 'react-native-svg';
import { t } from '@/modules/core/i18n';

import type { ShareCardData } from './components/ShareCard';

const SHARE_RENDER_TIMEOUT_MS = 5000;

function dataUrl(svg: Svg): Promise<string> {
  return new Promise((resolve, reject) => {
    // Native export may never invoke its callback; let the user retry instead of hanging.
    const timeout = setTimeout(() => reject(new Error('Share card render timed out')), SHARE_RENDER_TIMEOUT_MS);
    try {
      svg.toDataURL((base64) => {
        clearTimeout(timeout);
        if (base64) resolve(base64);
        else reject(new Error('Empty share card'));
      });
    } catch (error) { clearTimeout(timeout); reject(error); }
  });
}

/** Exports the rendered local SVG to a private cache PNG, then opens the system share sheet. */
export async function shareWorkoutCard(svg: Svg | null, data: ShareCardData): Promise<void> {
  if (!svg || !data.summary || !await Sharing.isAvailableAsync()) throw new Error('Sharing unavailable');
  const base64 = await dataUrl(svg);
  const file = new File(Paths.cache, 'home-workout-complete.png');
  file.write(base64, { encoding: 'base64' });
  await Sharing.shareAsync(file.uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: t('player.finish.share') });
}
