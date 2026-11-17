import { useLocalSearchParams } from 'expo-router';

import { SessionDetailScreen } from '@/modules/report';

export default function SessionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SessionDetailScreen id={id} />;
}
