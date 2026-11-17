import { useLocalSearchParams } from 'expo-router';

import { PlayerScreen } from '@/modules/player';

export default function PlayerRoute() {
  const { id, mode, challengeId, day } = useLocalSearchParams<{
    id: string; mode?: 'new' | 'resume'; challengeId?: string; day?: string;
  }>();
  return <PlayerScreen id={id} mode={mode === 'resume' ? 'resume' : 'new'} challengeId={challengeId} day={Number(day)} />;
}
