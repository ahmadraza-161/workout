import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { CircleHelp, Settings, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AchievementCelebration, refreshAchievements, type AchievementStatus } from '@/modules/achievements';
import { ExerciseDemo, getChallenge, getChallengeDayWorkout, getExercise } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { getKv } from '@/modules/core/kv';
import { useAndroidBack } from '@/modules/core/navigation';
import { loadWorkoutSettings, saveWorkoutSettings, type WorkoutSettings } from '@/modules/profile';
import { spacing, useTheme } from '@/modules/core/theme';
import { Button, EmptyState, IconButton, PlayerControls, ProgressBar, RestActions, Screen, Sheet, SheetHeader, StackHeader, Stepper, Text, TimerRing, WheelPicker } from '@/modules/core/ui';
import { REST_TIMER_OPTIONS } from '../timerOptions';

import {
  addRestSeconds,
  advancePlayer,
  finishExercise,
  goToPreviousExercise,
  pausePlayer,
  ratePlayerExercise,
  remainingSeconds,
  resumePlayer,
  skipPhase,
  startWorkout,
} from '../engine';
import {
  clearPlayerSnapshot,
  createSessionId,
  getResumableSnapshot,
  savePlayerSnapshot,
} from '../snapshot';
import { getCompletionProgress, getPlanDayOutcome, saveWorkoutFeedback, saveWorkoutSession, type CompletionProgress, type ExerciseRating, type WorkoutFeedback } from '../repository';
import type { PlanDayOutcome } from '../planDay';
import { resolveQuietWorkout, restoreWorkoutPlan } from '../plan';
import type { SessionSummary } from '../summary';
import { FinishScreen } from './FinishScreen';
import { WorkoutSettingsSheet } from './WorkoutSettingsSheet';
import { AwakeDuringWorkout, usePlayerFeedback } from '../usePlayerFeedback';
import { getPlayableWorkout } from '../workout';

export function PlayerScreen({ id, mode = 'new', challengeId, day }: {
  id: string; mode?: 'new' | 'resume'; challengeId?: string; day?: number;
}) {
  const workout = getPlayableWorkout(id);
  if (!workout) {
    return (
      <Screen background="plain">
        <StackHeader title={t('player.title')} onBack={() => router.back()} />
        <EmptyState title={t('browse.notFound')} />
      </Screen>
    );
  }
  const challenge = challengeId ? getChallenge(challengeId) : undefined;
  const validDay = Number.isInteger(day) && day! > 0 &&
    getChallengeDayWorkout(challenge?.id ?? '', day!)?.id === id;
  const context = validDay && challenge ? { id: challenge.id, day: day! } : undefined;
  return <ActivePlayer key={`${id}-${mode}`} workoutId={id} mode={mode} challenge={context} />;
}

/** The plan message is extra; a lookup failure must not affect the saved workout. */
function loadPlanDay(state: { challengeId?: string | null; challengeDay?: number | null }): PlanDayOutcome | null {
  if (!state.challengeId || !state.challengeDay) return null;
  try { return getPlanDayOutcome(state.challengeId, state.challengeDay); } catch { return null; }
}

function ActivePlayer({ workoutId, mode, challenge }: {
  workoutId: string; mode: 'new' | 'resume'; challenge?: { id: string; day: number };
}) {
  const [baseWorkout] = useState(() => getPlayableWorkout(workoutId)!);
  const { colors } = useTheme();
  const [initial] = useState(() => (mode === 'resume' ? getResumableSnapshot(getPlayableWorkout) : null));
  const [sessionId] = useState(() => initial?.state.workoutId === workoutId ? initial.sessionId : createSessionId());
  const [now, setNow] = useState(() => Date.now());
  const [state, setState] = useState(() => {
    if (initial?.state.workoutId === workoutId) return initial.state;
    const prep = getKv('settings.timers.prepSeconds');
    const rest = getKv('settings.timers.restEnabled') ? getKv('settings.timers.restSeconds') : 0;
    const workout = resolveQuietWorkout(baseWorkout, getKv('settings.quietMode'), getExercise);
    return startWorkout(workout, Date.now(), prep, rest, challenge);
  });
  const workout = useMemo(
    () => restoreWorkoutPlan(baseWorkout, state.plannedExerciseIds),
    [baseWorkout, state.plannedExerciseIds],
  );
  const [repsByIndex, setRepsByIndex] = useState<Record<number, number>>({});
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const [savedSummary, setSavedSummary] = useState<SessionSummary | null>(null);
  const [completionProgress, setCompletionProgress] = useState<CompletionProgress | null>(null);
  const [planDay, setPlanDay] = useState<PlanDayOutcome | null>(null);
  const [workoutFeedback, setWorkoutFeedback] = useState<WorkoutFeedback | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<AchievementStatus[]>([]);
  const saveAttempted = useRef(false);
  const confirmingQuit = useRef(false);
  const snapshotWarningShown = useRef(false);
  const restSheet = useRef<BottomSheetModal>(null);
  const settingsSheet = useRef<BottomSheetModal>(null);
  const [settings, setSettings] = useState(loadWorkoutSettings);

  function updateSettings(change: Partial<WorkoutSettings>) {
    const next = { ...settings, ...change };
    saveWorkoutSettings(next);
    setSettings(next);
  }

  function showNewAchievements() {
    // Badge reconciliation must never turn a successfully saved workout into a failed save.
    try {
      const result = refreshAchievements();
      setEarnedBadges(result.badges.filter((badge) => result.newIds.includes(badge.id)));
    } catch { /* The Report and Achievements screens retry reconciliation. */ }
  }

  const persistSnapshot = useCallback((current: typeof state) => {
    try {
      savePlayerSnapshot(sessionId, current);
    } catch {
      // Resume persistence is separate from the workout timer and final session.
      // Retry on subsequent state changes; warn once instead of on every tick.
      if (current.phase !== 'complete' && !snapshotWarningShown.current) {
        snapshotWarningShown.current = true;
        Alert.alert(t('player.saveFailed'));
      }
    }
  }, [sessionId]);

  useEffect(() => {
    if (state.phase === 'complete') return;
    const timer = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      setState((current) => advancePlayer(current, workout, currentTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [workout, state.phase]);

  useEffect(() => {
    persistSnapshot(state);
    if (state.phase !== 'complete') return;
    if (saveAttempted.current) return;
    saveAttempted.current = true;
    void Promise.resolve()
      .then(() => {
        const ratings = state.ratingsByIndex;
        const summary = ratings
          ? saveWorkoutSession(sessionId, state, workout, state.phaseStartedAt, ratings)
          : saveWorkoutSession(sessionId, state, workout, state.phaseStartedAt);
        clearPlayerSnapshot();
        setSavedSummary(summary);
        setSaveStatus('saved');
        try { setCompletionProgress(getCompletionProgress()); } catch { setCompletionProgress(null); }
        setPlanDay(loadPlanDay(state));
        showNewAchievements();
      })
      .catch(() => setSaveStatus('error'));
  }, [sessionId, state, workout, persistSnapshot]);

  useEffect(() => {
    if (state.phase !== 'rest') restSheet.current?.dismiss();
  }, [state.phase]);

  const item = workout.items[state.itemIndex];
  const exercise = item ? getExercise(item.exerciseId) : undefined;
  const nextItem = workout.items[state.itemIndex + 1];
  const nextExercise = nextItem ? getExercise(nextItem.exerciseId) : undefined;
  const remaining = remainingSeconds(state, workout, now);
  const paused = state.pausedAt !== null;
  const keepAwake = usePlayerFeedback({ phase: state.phase, index: state.itemIndex,
    remaining, active: !paused }, settings);
  const actualReps = repsByIndex[state.itemIndex] ?? item?.reps ?? 1;
  const isRest = state.phase === 'rest';
  const guideExercise = isRest ? nextExercise : exercise;
  const exerciseProgress = state.phase === 'exercise' && item?.seconds
    ? 1 - (remaining ?? 0) / item.seconds
    : 0;

  function leavePlayer() {
    if (state.challengeId) {
      router.replace({ pathname: '/challenge/[id]', params: { id: state.challengeId } });
    } else {
      router.replace('/(tabs)/discover');
    }
  }

  function confirmQuit() {
    if (state.phase === 'complete') {
      closeFinished();
      return;
    }
    if (confirmingQuit.current) return;
    confirmingQuit.current = true;
    // Freeze time before the native dialog. Waiting to choose Save must not
    // complete more exercises or inflate the saved active duration.
    const pausedState = pausePlayer(state, Date.now());
    setState(pausedState);
    Alert.alert(t('player.quitTitle'), t('player.quitBody'), [
      { text: t('common.cancel'), style: 'cancel', onPress: () => { confirmingQuit.current = false; } },
      { text: t('player.discard'), style: 'destructive', onPress: () => {
        confirmingQuit.current = false;
        clearPlayerSnapshot();
        leavePlayer();
      } },
      { text: t('player.saveExit'), onPress: () => {
        confirmingQuit.current = false;
        try {
          saveWorkoutSession(sessionId, pausedState, workout, Date.now());
          clearPlayerSnapshot();
          leavePlayer();
        } catch {
          Alert.alert(t('player.saveFailed'));
        }
      } },
    ], { cancelable: true, onDismiss: () => { confirmingQuit.current = false; } });
  }

  function closeFinished() {
    if (saveStatus !== 'saved') return;
    if (state.challengeId) leavePlayer();
    else router.replace('/(tabs)/report');
  }
  useAndroidBack(() => { confirmQuit(); return true; });

  function openGuide() {
    if (!guideExercise) return;
    const pausedState = pausePlayer(state, Date.now());
    persistSnapshot(pausedState);
    setState(pausedState);
    router.push({ pathname: '/exercise/[id]', params: { id: guideExercise.id } });
  }

  function retrySave() {
    setSaveStatus('saving');
    saveAttempted.current = false;
    try {
      saveFinishedSession();
      saveAttempted.current = true;
    } catch {
      saveAttempted.current = true;
      setSaveStatus('error');
    }
  }

  function saveFinishedSession(): SessionSummary {
    const ratings = state.ratingsByIndex;
    const summary = ratings
      ? saveWorkoutSession(sessionId, state, workout, state.phaseStartedAt, ratings)
      : saveWorkoutSession(sessionId, state, workout, state.phaseStartedAt);
    clearPlayerSnapshot();
    setSavedSummary(summary);
    setSaveStatus('saved');
    try { setCompletionProgress(getCompletionProgress()); } catch { setCompletionProgress(null); }
    setPlanDay(loadPlanDay(state));
    showNewAchievements();
    return summary;
  }

  function rateExercise(rating: ExerciseRating): void {
    if (!item) return;
    setState((current) => ratePlayerExercise(current, rating));
  }

  function saveFeedback(feedback: WorkoutFeedback): void {
    try {
      saveWorkoutFeedback(sessionId, feedback);
      setWorkoutFeedback(feedback);
    } catch {
      Alert.alert(t('player.saveFailed'));
    }
  }

  if (state.phase === 'complete') {
    return (
      <>
        <AchievementCelebration badges={earnedBadges} onClose={() => setEarnedBadges([])} />
        <FinishScreen completedCount={state.done.filter((played) => !played.skipped).length}
          summary={savedSummary} progress={completionProgress} planDay={planDay} feedback={workoutFeedback} saveStatus={saveStatus}
          returnToChallenge={Boolean(state.challengeId)} onRetry={retrySave} onFeedback={saveFeedback}
          onClose={closeFinished} />
      </>
    );
  }

  return (
    <Screen background="plain" scroll inset={false}>
      {keepAwake ? <AwakeDuringWorkout /> : null}
      <StackHeader title={t('player.title')} onBack={confirmQuit} actions={<>
        {guideExercise ? <IconButton icon={CircleHelp} onPress={openGuide} accessibilityLabel={t('player.openGuide')} /> : null}
        <IconButton icon={Settings} accessibilityLabel={t('settings.workout')} onPress={() => {
          setState((current) => pausePlayer(current, Date.now()));
          settingsSheet.current?.present();
        }} />
      </>} />
      <View style={styles.content}>
        <ExerciseDemo variant="player" playing={!paused}
          id={isRest ? nextExercise?.id ?? item?.exerciseId ?? '' : item?.exerciseId ?? ''} />
        <ProgressBar progress={state.done.filter((played) => !played.skipped).length / workout.items.length} />
        <View style={[styles.panel, isRest && { backgroundColor: colors.restBg }]}>
          <Text tone={isRest ? 'onPrimary' : 'secondary'}>
            {t('player.progress', { current: state.itemIndex + 1, total: workout.items.length })}
          </Text>
          {isRest ? (
            <>
              <Text variant="h2" tone="onPrimary">{t(nextExercise?.nameKey ?? 'player.next')}</Text>
              {paused ? (
                <View style={styles.actions}>
                  <Text variant="displayXL" tone="onPrimary">{formatCountdown(remaining ?? 0)}</Text>
                  <Button label={t('player.resume')} variant="cardCta"
                    onPress={() => setState((current) => resumePlayer(current, Date.now()))} />
                </View>
              ) : (
                <View style={styles.actions}>
                  <RestActions countdown={formatCountdown(remaining ?? 0)}
                    onAddTime={() => setState((current) => addRestSeconds(current, 20))}
                    onSkip={() => setState((current) => skipPhase(current, workout, Date.now()))}
                    onEditRestTime={() => restSheet.current?.present()}
                    labels={{ rest: t('player.phase.rest'), addTime: t('player.addRest'), skip: t('player.skip'), editRestTime: t('player.editRest') }} />
                  <Button label={t('player.pause')} variant="cardCta"
                    onPress={() => setState((current) => pausePlayer(current, Date.now()))} />
                </View>
              )}
            </>
          ) : (
            <>
              <Text variant="h1" tone="primary">{t(`player.phase.${state.phase}`)}</Text>
              <Text variant="h2">{t(exercise?.nameKey ?? 'player.next')}</Text>
              {state.phase === 'prep' ? (
                <View style={styles.prepRing}>
                  <TimerRing progress={state.prepSeconds > 0 ? 1 - (remaining ?? 0) / state.prepSeconds : 1}>
                    <Text variant="displayL">{remaining ?? 0}</Text>
                  </TimerRing>
                </View>
              ) : (
                <Text variant="displayXL">{remaining === null ? t('player.reps', { count: actualReps }) : formatCountdown(remaining)}</Text>
              )}
              {state.phase === 'exercise' && item?.reps !== undefined ? (
                <Stepper label={t('player.actualReps')} value={actualReps}
                  onChange={(count) => setRepsByIndex((current) => ({ ...current, [state.itemIndex]: count }))} />
              ) : null}
              {state.phase === 'exercise' && exercise ? <View style={styles.rating}>
                <Text tone="secondary">{t('player.exerciseFeedback')}</Text>
                <View style={styles.ratingActions}>
                  <IconButton icon={ThumbsUp} variant="thumbs" onPress={() => rateExercise(1)}
                    disabled={state.ratingsByIndex?.[state.itemIndex] === 1}
                    accessibilityLabel={t('player.rating.up')} />
                  <IconButton icon={ThumbsDown} variant="thumbs" onPress={() => rateExercise(-1)}
                    disabled={state.ratingsByIndex?.[state.itemIndex] === -1}
                    accessibilityLabel={t('player.rating.down')} />
                </View>
              </View> : null}
              {paused ? (
                <Button label={t('player.resume')} onPress={() => setState((current) => resumePlayer(current, Date.now()))} />
              ) : state.phase === 'exercise' ? (
                <View style={styles.actions}>
                  {item?.reps !== undefined ? (
                    <Button label={t('player.done')} onPress={() => setState((current) => finishExercise(current, workout, Date.now(), actualReps))} />
                  ) : null}
                  <PlayerControls paused={false} progress={exerciseProgress} hasPrevious={state.itemIndex > 0}
                    onTogglePause={() => setState((current) => pausePlayer(current, Date.now()))}
                    onPrevious={() => setState((current) => goToPreviousExercise(current, Date.now()))}
                    onNext={() => setState((current) => skipPhase(current, workout, Date.now()))}
                    labels={{ previous: t('player.previous'), next: t('player.skip'), pause: t('player.pause'), resume: t('player.resume') }} />
                </View>
              ) : (
                <View style={styles.actions}>
                  <Button label={t('player.pause')} variant="secondary" onPress={() => setState((current) => pausePlayer(current, Date.now()))} />
                  <Button label={t('player.skip')} variant="plainLink"
                    onPress={() => setState((current) => skipPhase(current, workout, Date.now()))} />
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <Sheet ref={restSheet}>
        <View style={styles.restSheet}>
          <SheetHeader title={t('player.editRest')} onClose={() => restSheet.current?.dismiss()} />
          <WheelPicker accessibilityLabel={t('settings.restSeconds')} value={state.restSeconds} options={REST_TIMER_OPTIONS}
            format={(count) => t('browse.seconds', { count })}
            onChange={(restSeconds) => setState((current) => ({ ...current, restSeconds }))} />
          <Button label={t('common.done')} onPress={() => restSheet.current?.dismiss()} />
        </View>
      </Sheet>
      <WorkoutSettingsSheet sheetRef={settingsSheet} settings={settings} onChange={updateSettings}
        onClose={() => settingsSheet.current?.dismiss()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing[0] },
  panel: { gap: spacing[4], paddingHorizontal: spacing[5], paddingVertical: spacing[6] },
  prepRing: { alignItems: 'center' },
  actions: { gap: spacing[3] },
  restSheet: { gap: spacing[5] },
  rating: { alignItems: 'center', gap: spacing[2] },
  ratingActions: { flexDirection: 'row', gap: spacing[3] },
});

function formatCountdown(seconds: number): string {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remaining = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}
