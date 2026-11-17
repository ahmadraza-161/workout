import { useLocalSearchParams } from 'expo-router';

import { ExerciseDetailScreen } from '@/modules/content';

export default function ExerciseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ExerciseDetailScreen id={id} />;
}
