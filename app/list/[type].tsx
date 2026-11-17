import { useLocalSearchParams } from 'expo-router';

import { CatalogListScreen } from '@/modules/content';

export default function CatalogListRoute() {
  const { type, focus, quick, duration, goal, group, id } = useLocalSearchParams<{
    type: string; focus?: string; quick?: string; duration?: string; goal?: string; group?: string; id?: string;
  }>();
  return <CatalogListScreen type={type} focus={focus} quick={quick === '1'} duration={duration} goal={goal} group={group} id={id} />;
}
