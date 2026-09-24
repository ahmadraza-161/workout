import { Redirect } from 'expo-router';

// Bootstrap route. Onboarding and the "Resume workout?" check arrive in Phase 6 (T6.1).
export default function Index() {
  return <Redirect href="/training" />;
}
