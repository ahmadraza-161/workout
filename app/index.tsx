import { Redirect } from 'expo-router';
import { useState } from 'react';

import { ResumePromptScreen } from '@/modules/player';
import { isOnboardingComplete } from '@/modules/profile';

export default function Index() {
  const [complete] = useState(isOnboardingComplete);
  return complete ? <ResumePromptScreen /> : <Redirect href="/onboarding" />;
}
