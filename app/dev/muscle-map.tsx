import { Redirect } from 'expo-router';

// Preserve the old preview link using the bundled guide and muscle map.
export default function MuscleMapPreview() {
  return <Redirect href={__DEV__
    ? { pathname: '/exercise/[id]', params: { id: 'ex_standard_push_up' } }
    : '/'} />;
}
