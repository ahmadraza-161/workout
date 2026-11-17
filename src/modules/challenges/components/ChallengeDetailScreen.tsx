import { router, useIsFocused } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { ChallengeCard, getChallenge, getChallengeDayWorkout } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { sizes, spacing } from '@/modules/core/theme';
import { Button, EmptyState, ErrorState, Screen, StackHeader, Text } from '@/modules/core/ui';

import { abandonChallenge, getChallengeProgress, restartChallenge, selectPlan } from '../repository';
import { ChallengeDayGrid } from './ChallengeDayGrid';

export function ChallengeDetailScreen({ id }: { id: string }) {
  const focused = useIsFocused();
  const [, setRevision] = useState(0);
  const [writeError, setWriteError] = useState(false);
  const progress = (() => { try { return focused ? getChallengeProgress(id) : null; } catch { return 'error' as const; } })();
  const challenge = getChallenge(id);
  if (!challenge) return <Screen background="plain"><StackHeader title={t('browse.challenges')} onBack={() => router.back()} /><EmptyState title={t('browse.notFound')} /></Screen>;
  const currentDay = progress && progress !== 'error' ? progress.currentDay : 1;
  const currentWorkout = getChallengeDayWorkout(id, currentDay);
  const active = progress !== 'error' && (!progress || progress.status === 'active');
  function mutate(action: () => void): void {
    try { action(); setWriteError(false); setRevision((value) => value + 1); } catch { setWriteError(true); }
  }
  function startDay(): void {
    mutate(() => {
      // Starting a challenge makes it the plan Home follows.
      const started = selectPlan(id);
      const workout = started ? getChallengeDayWorkout(id, started.currentDay) : undefined;
      if (!started || !workout || started.status !== 'active') return;
      router.push({ pathname: '/player/[id]', params: { id: workout.id, challengeId: id, day: String(started.currentDay) } });
    });
  }
  function leave(): void {
    Alert.alert(t('challengeUi.leaveTitle'), t('challengeUi.leaveBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('challengeUi.leave'), style: 'destructive', onPress: () => mutate(() => abandonChallenge(id)) },
    ]);
  }
  const footer = progress === 'error' ? <Text>{t('errors.generic.title')}</Text>
    : active && currentWorkout ? <Button variant="cardCta" label={t('challengeUi.startDay', { count: currentDay })} onPress={startDay} />
      : <Button variant="cardCta" label={t('challengeUi.restart')} onPress={() => mutate(() => { restartChallenge(id); })} />;
  return <Screen background="plain" scroll><View style={{ width: '100%', maxWidth: sizes.contentMax - sizes.screenPadding * 2, alignSelf: 'center', gap: sizes.sectionGap, paddingBottom: spacing[8] }}>
    <StackHeader title={t(challenge.titleKey)} onBack={() => router.back()} />
    <ChallengeCard challenge={challenge} featured footer={footer} />
    <Text tone="secondary">{t(challenge.descKey)}</Text>
    {progress === 'error' || writeError ? <ErrorState onRetry={() => { setWriteError(false); setRevision((value) => value + 1); }} /> : null}
    {progress && progress !== 'error' && progress.status === 'completed' ? <Text variant="h3">{t('challengeUi.complete')}</Text> : null}
    <Text variant="h3">{t('browseUi.schedule')}</Text>
    <ChallengeDayGrid challenge={challenge} progress={progress === 'error' ? null : progress} disabled={progress === 'error'} onStart={startDay} />
    {progress && progress !== 'error' && progress.status === 'active' ? <Button variant="secondary" label={t('challengeUi.leave')} onPress={leave} /> : null}
  </View></Screen>;
}
