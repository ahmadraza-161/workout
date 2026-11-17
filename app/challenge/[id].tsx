import { useLocalSearchParams } from 'expo-router';

import { ChallengeDetailScreen } from '@/modules/challenges';

export default function ChallengeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChallengeDetailScreen id={id} />;
}
