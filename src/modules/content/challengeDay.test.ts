import { getChallengeDayWorkout, getWorkout } from './repository';

describe('single-exercise challenge days', () => {
  it('builds the authored plank duration and three playable sets', () => {
    const workout = getChallengeDayWorkout('ch_plank_challenge', 1);
    expect(workout?.items).toHaveLength(3);
    expect(workout?.items[0]).toMatchObject({ exerciseId: 'ex_forearm_plank', seconds: 20 });
    expect(getWorkout(workout!.id)).toEqual(workout);
  });

  it('uses increasing authored reps and never builds a workout for a rest day', () => {
    const first = getChallengeDayWorkout('ch_push_up_challenge', 1);
    const second = getChallengeDayWorkout('ch_push_up_challenge', 2);
    expect((second?.items[0]?.reps ?? 0)).toBeGreaterThan(first?.items[0]?.reps ?? 0);
    expect(getChallengeDayWorkout('ch_push_up_challenge', 3)).toBeUndefined();
  });
});
