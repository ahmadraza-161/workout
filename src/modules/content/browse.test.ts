import rawPack from '../../../assets/data/content-pack.json';
import en from '../../../assets/i18n/en.json';
import { BROWSE_STRINGS, CHALLENGE_UI_STRINGS } from '../../../tools/content/browseStrings';
import { browseWorkouts, DEFAULT_BROWSE_CONTEXT, DURATION_OPTIONS, featuredWorkout, QUICK_IDS, rankWorkouts, recentWorkouts, STRETCH_IDS } from './browse';
import type { ContentPack } from './types';

const pack = rawPack as ContentPack;
const now = Date.UTC(2026, 8, 30, 12);
it('suggests only routines within experience and without required props', () => {
  for (const goal of ['build_muscle', 'burn_fat', 'keep_fit'] as const) {
    const selected = featuredWorkout(pack, { ...DEFAULT_BROWSE_CONTEXT, goal,
      recent: [{ workoutId: pack.workouts[0]!.id, endedAt: now }] }, now);
    expect(selected).toBeDefined();
    expect(selected!.level).toBe(1);
    expect(['strength', 'hiit']).toContain(selected!.type);
    for (const item of selected!.items) {
      expect(pack.exercises.find((exercise) => exercise.id === item.exerciseId)?.equipment).toBe('none');
    }
  }
});
it('equipment banner opens only routines containing actual equipment exercises', () => {
  const result = browseWorkouts(pack, { group: 'equipment' });
  const equipment = new Set(pack.exercises.filter((exercise) => exercise.equipment !== 'none').map((exercise) => exercise.id));
  expect(result.length).toBeGreaterThan(0);
  expect(result.length).toBeLessThan(pack.workouts.length);
  expect(result.every((workout) => workout.items.some((item) => equipment.has(item.exerciseId)))).toBe(true);
});
it('partitions durations at 7 and 15 minutes with no gaps or overlaps', () => {
  const groups = DURATION_OPTIONS.map((duration) => browseWorkouts(pack, { duration }));
  expect(groups[0]!.every((item) => item.estimatedMinutes < 7)).toBe(true);
  expect(groups[1]!.some((item) => item.estimatedMinutes === 7)).toBe(true);
  expect(groups[1]!.some((item) => item.estimatedMinutes === 15)).toBe(true);
  expect(groups[2]!.every((item) => item.estimatedMinutes > 15)).toBe(true);
  const ids = groups.flat().map((item) => item.id);
  expect(ids.length).toBe(pack.workouts.length);
  expect(new Set(ids).size).toBe(ids.length);
});
it('uses all five approved quick workouts and exactly twelve stretch/warm-up placements', () => {
  expect(browseWorkouts(pack, { group: 'quick' }).map((item) => item.id)).toEqual(QUICK_IDS);
  expect(browseWorkouts(pack, { group: 'stretch' }).map((item) => item.id)).toEqual(STRETCH_IDS);
  expect(STRETCH_IDS).toHaveLength(12);
  expect(browseWorkouts(pack, { group: 'warmup' }).every((item) => item.type === 'warmup')).toBe(true);
});
it('resolves each category and collection without leaking unrelated workouts', () => {
  for (const [group, items] of [['category', pack.categories], ['collection', pack.collections]] as const) {
    for (const item of items) expect(new Set(browseWorkouts(pack, { group, id: item.id }).map((workout) => workout.id))).toEqual(new Set(item.workoutIds));
    expect(browseWorkouts(pack, { group, id: 'missing' })).toEqual([]);
  }
});
it('combines focus, goal and duration filters', () => {
  const result = browseWorkouts(pack, { focus: 'abs', goal: 'build_muscle', duration: 'medium' });
  expect(result.length).toBeGreaterThan(0);
  expect(result.every((item) => item.bodyFocus === 'abs' && item.goal === 'build_muscle' && item.estimatedMinutes >= 7 && item.estimatedMinutes <= 15)).toBe(true);
});
it('ranks matching level/goal first, removes the last three days, and lowers disliked moves', () => {
  const target = pack.workouts.find((item) => item.id === 'wo_abs_beginner')!;
  const workouts = [target, { ...target, id: 'harder', level: 3 as const, items: [] }, { ...target, id: 'off_goal', goal: 'burn_fat' as const, items: [] }];
  const context = { ...DEFAULT_BROWSE_CONTEXT, goal: target.goal };
  expect(rankWorkouts(workouts, context, now)[0]!.id).toBe(target.id);
  expect(rankWorkouts(workouts, { ...context, disliked: [target.items[0]!.exerciseId] }, now).at(-1)!.id).toBe(target.id);
  expect(rankWorkouts(workouts, { ...context, recent: [{ workoutId: target.id, endedAt: now - 3 * 86400000 }] }, now).some((item) => item.id === target.id)).toBe(false);
  expect(rankWorkouts(workouts, { ...context, recent: [{ workoutId: target.id, endedAt: now - 3 * 86400000 - 1 }] }, now)[0]!.id).toBe(target.id);
  expect(workouts.map((item) => item.id)).toEqual([target.id, 'harder', 'off_goal']);
});
it('starts with the beginner feature, rotates weekly and orders unique completed history', () => {
  expect(featuredWorkout(pack, DEFAULT_BROWSE_CONTEXT, now)?.id).toBe('wo_daily_move');
  const context = { ...DEFAULT_BROWSE_CONTEXT, recent: [{ workoutId: pack.workouts[0]!.id, endedAt: now }, { workoutId: pack.workouts[1]!.id, endedAt: now - 1 }, { workoutId: pack.workouts[0]!.id, endedAt: now - 2 }] };
  expect(recentWorkouts(pack, context).map((item) => item.id)).toEqual([pack.workouts[0]!.id, pack.workouts[1]!.id]);
  expect(featuredWorkout(pack, context, now)?.id).not.toBe(featuredWorkout(pack, context, now + 7 * 86400000)?.id);
});
it('keeps generated browse and challenge UI labels alongside catalog copy', () => {
  expect(en.browseUi).toEqual(BROWSE_STRINGS);
  expect(en.challengeUi.filter).toEqual(CHALLENGE_UI_STRINGS.filter);
  expect(en.challengeUi.startDay).toBe(CHALLENGE_UI_STRINGS.startDay);
  expect(en.challenge.full_body_challenge.desc.length).toBeGreaterThan(0);
});
