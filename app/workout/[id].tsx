import { useLocalSearchParams } from 'expo-router';

import { WorkoutDetailScreen } from '@/modules/content';

export default function WorkoutRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WorkoutDetailScreen id={id} />;
}
