import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

// Keep ranking stable while browsing, and refresh its time window on each visit.
export function useBrowseNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => { setNow(Date.now()); }, []));
  return now;
}
