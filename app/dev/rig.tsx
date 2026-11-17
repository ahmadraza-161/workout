import { Redirect } from 'expo-router';

import { StaticImagePreview } from '@/modules/demo';

// ADR-056 pauses animation work in favor of bundled static exercise images.
export default function RigPreview() {
  if (!__DEV__) return <Redirect href="/" />;
  return <StaticImagePreview />;
}
