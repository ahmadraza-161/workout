import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { ExerciseImage, getExercise, getWorkout, listExercises, type Exercise, type WorkoutItem } from '@/modules/content';
import { refreshAchievements } from '@/modules/achievements';
import { t } from '@/modules/core/i18n';
import { useAndroidBack } from '@/modules/core/navigation';
import { spacing } from '@/modules/core/theme';
import { Button, Chip, EmptyState, ErrorState, Row, Screen, StackHeader, Text, TextField } from '@/modules/core/ui';

import { ItemEditor } from './ItemEditor';
import { emptyDraft, FOCUS_OPTIONS, MAX_CUSTOM_ITEMS, moveItem, validateDraft, type CustomDraft } from './model';
import { getCustomWorkout, saveCustomWorkout } from './repository';

function loadDraft(editId?: string, sourceId?: string): CustomDraft | null {
  if (editId) return getCustomWorkout(editId) ?? null;
  const source = sourceId ? getWorkout(sourceId) : undefined;
  if (sourceId && !source) return null;
  return source ? { title: t('builder.copyName', { name: t(source.titleKey) }),
    plan: { version: 1, bodyFocus: source.bodyFocus, items: source.items.map((item) => ({ ...item })) } } : emptyDraft();
}

export function BuilderScreen({ editId, sourceId }: { editId?: string; sourceId?: string }) {
  const [initial, setInitial] = useState(() => {
    try { return loadDraft(editId, sourceId); } catch { return 'error' as const; }
  });
  if (initial === 'error' || !initial) return <Screen>
    <StackHeader title={t('builder.title')} onBack={() => router.back()} />
    {initial === 'error' ? <ErrorState onRetry={() => { try { setInitial(loadDraft(editId, sourceId)); } catch { /* Keep retry available. */ } }} />
      : <EmptyState title={t('browse.notFound')} />}
  </Screen>;
  return <ActiveBuilder initial={initial} editId={editId} />;
}

function ActiveBuilder({ initial, editId }: { initial: CustomDraft; editId?: string }) {
  const [draft, setDraft] = useState(initial);
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const saving = useRef(false);
  const confirmingDiscard = useRef(false);
  const items = draft.plan.items;
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const exercises = listExercises().filter((exercise) => t(exercise.nameKey).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  function setItems(next: WorkoutItem[]) {
    setError(''); setDraft((current) => ({ ...current, plan: { ...current.plan, items: next } }));
  }
  function add(exercise: Exercise) {
    if (items.length >= MAX_CUSTOM_ITEMS) { setError(t('builder.limit', { count: MAX_CUSTOM_ITEMS })); return; }
    setItems([...items, { exerciseId: exercise.id, rest: 20,
      ...(exercise.type === 'reps' ? { reps: exercise.defaultReps ?? 10 } : { seconds: exercise.defaultSeconds ?? 30 }) }]);
  }
  function back() {
    if (saving.current || confirmingDiscard.current) return;
    if (step > 0) { setStep(step - 1); setError(''); return; }
    if (!dirty) { router.back(); return; }
    confirmingDiscard.current = true;
    Alert.alert(t('builder.discardTitle'), t('builder.discardBody'), [
      { text: t('common.cancel'), style: 'cancel', onPress: () => { confirmingDiscard.current = false; } },
      { text: t('player.discard'), style: 'destructive', onPress: () => { confirmingDiscard.current = false; router.back(); } },
    ], { cancelable: true, onDismiss: () => { confirmingDiscard.current = false; } });
  }
  useAndroidBack(() => { back(); return true; });
  function next() {
    if (saving.current) return;
    if (step === 0 && (!draft.title.trim() || draft.title.trim().length > 120)) { setError(t('builder.nameError')); return; }
    if (step === 1 && !items.length) { setError(t('builder.itemsError')); return; }
    if (step < 2) { setError(''); setStep(step + 1); return; }
    const invalid = validateDraft(draft, getExercise);
    if (invalid) { setError(t(invalid === 'name' ? 'builder.nameError' : 'builder.itemsError')); return; }
    saving.current = true;
    try {
      saveCustomWorkout(draft, getExercise, editId);
      try { refreshAchievements(); } catch { /* Report retries badge reconciliation. */ }
      router.replace('/custom-workouts');
    } catch { saving.current = false; setError(t('builder.saveError')); }
  }

  return <Screen background="plain">
    <StackHeader title={t('builder.title')} onBack={back} />
    <Text variant="h3">{t('builder.step', { current: step + 1 })}</Text>
    {step === 1 ? <>
      <TextField value={query} onChangeText={setQuery} label={t('builder.search')} />
      <Text>{t('builder.selected', { count: items.length })}</Text>
      <FlatList data={exercises} keyExtractor={(exercise) => exercise.id} keyboardShouldPersistTaps="handled"
        renderItem={({ item: exercise }) => <Row title={t(exercise.nameKey)}
          leading={<ExerciseImage id={exercise.id} variant="thumb" />}
          meta={[t('builder.added', { count: items.filter((item) => item.exerciseId === exercise.id).length })]}
          onPress={() => add(exercise)} accessibilityHint={t('builder.addHint')} />}
        ListEmptyComponent={<EmptyState title={t('builder.noResults')} />} />
    </> : <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      {step === 0 ? <>
        <TextField label={t('builder.name')} value={draft.title} maxLength={120}
          onChangeText={(title) => setDraft({ ...draft, title })} />
        <Text variant="h3">{t('builder.focus')}</Text>
        <View style={styles.focus}>{FOCUS_OPTIONS.map((bodyFocus) => <Chip key={bodyFocus}
          label={t(`training.focus.${bodyFocus}`)} selected={bodyFocus === draft.plan.bodyFocus}
          onPress={() => setDraft({ ...draft, plan: { ...draft.plan, bodyFocus } })} />)}</View>
      </> : <>
        <Text>{t('builder.orderNote')}</Text>
        {items.map((item, index) => <ItemEditor key={`${index}-${item.exerciseId}`} item={item} index={index} count={items.length}
          onChange={(nextItem) => setItems(items.map((current, at) => at === index ? nextItem : current))}
          onMove={(direction) => setItems(moveItem(items, index, direction))}
          onRemove={() => setItems(items.filter((_, at) => at !== index))} />)}
        {!items.length ? <EmptyState title={t('builder.itemsError')} /> : null}
        <Button variant="secondary" label={t('builder.addExercises')} onPress={() => setStep(1)} />
      </>}
    </ScrollView>}
    <View style={styles.footer}>
      {error ? <Text accessibilityLiveRegion="polite">{error}</Text> : null}
      <Button label={t(step === 2 ? 'builder.save' : 'builder.next')} onPress={next} />
    </View>
  </Screen>;
}

const styles = StyleSheet.create({ content: { gap: spacing[4], paddingVertical: spacing[4] },
  focus: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }, footer: { gap: spacing[3], paddingVertical: spacing[4] } });
