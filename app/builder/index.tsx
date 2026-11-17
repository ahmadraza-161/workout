import { useLocalSearchParams } from 'expo-router';

import { BuilderScreen } from '@/modules/builder';

export default function BuilderRoute() {
  const { editId, sourceId } = useLocalSearchParams<{ editId?: string; sourceId?: string }>();
  return <BuilderScreen key={`${editId ?? ''}-${sourceId ?? ''}`} editId={editId} sourceId={sourceId} />;
}
