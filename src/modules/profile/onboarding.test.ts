import { INITIAL_ONBOARDING_DRAFT, validateOnboarding } from './onboarding';

const ready = { ...INITIAL_ONBOARDING_DRAFT, adultConfirmed: true, safetyAnswers: Array.from({ length: 7 }, () => false) };

describe('onboarding profile validation', () => {
  it('accepts skipped optional body measurements', () => {
    expect(validateOnboarding(ready, 2026)).toMatchObject({
      error: null, value: { heightCm: null, weightKg: null, birthYear: null, daysPerWeekTarget: 4 },
    });
  });

  it('accepts the oldest permitted birth year and rejects a minor', () => {
    expect(validateOnboarding({ ...ready, birthYear: '2008' }, 2026).error).toBeNull();
    expect(validateOnboarding({ ...ready, birthYear: '2009' }, 2026).error).toBe('birthYear');
  });

  it('rejects invalid measurements and unanswered safety questions', () => {
    expect(validateOnboarding({ ...ready, heightCm: 'abc' }, 2026).error).toBe('height');
    expect(validateOnboarding({ ...ready, weightKg: '-1' }, 2026).error).toBe('weight');
    expect(validateOnboarding({ ...ready, safetyAnswers: INITIAL_ONBOARDING_DRAFT.safetyAnswers }, 2026).error).toBe('safety');
    expect(validateOnboarding({ ...ready, adultConfirmed: false }, 2026).error).toBe('adult');
  });

});
