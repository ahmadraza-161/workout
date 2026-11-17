import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { getActivePlan, selectPlan } from '@/modules/challenges';
import { getChallenge } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';
import { getProfile, updateProfile } from '@/modules/profile';

import { PlanScreen } from './PlanScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn() } }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('@/modules/content', () => ({
  ...jest.requireActual('../../content/repository'),
  ChallengeCard: jest.requireActual('../../content/components/ChallengeCard').ChallengeCard,
  HeroArtwork: () => null, challengeHeroKey: (id: string) => id,
}));
jest.mock('@/modules/challenges', () => ({ getActivePlan: jest.fn(), selectPlan: jest.fn() }));
jest.mock('@/modules/profile', () => ({ getProfile: jest.fn(), updateProfile: jest.fn() }));

const profile = { gender: 'male', goal: 'keep_fit', level: 1, heightCm: null, weightKg: null, birthYear: null, daysPerWeekTarget: 3 };
const progress = { currentDay: 1, completedDays: new Set<number>(), status: 'active' as const };
const title = (id: string) => t(getChallenge(id)!.titleKey);

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getProfile).mockReturnValue(profile as unknown as ReturnType<typeof getProfile>);
  jest.mocked(getActivePlan).mockReturnValue(null);
  jest.mocked(selectPlan).mockReturnValue(progress);
});

it('recommends a plan from goal and level, then saves the choices and selects it', async () => {
  await render(<ThemeProvider><PlanScreen /></ThemeProvider>);
  expect(screen.getAllByText(title('ch_beginner_start_challenge')).length).toBeGreaterThan(0);
  await fireEvent.press(screen.getByLabelText(t('onboarding.goal.burn_fat')));
  await fireEvent.press(screen.getByLabelText(t('level.intermediate')));
  await fireEvent.press(screen.getByLabelText(t('home.usePlan')));
  expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ goal: 'burn_fat', level: 2, daysPerWeekTarget: 3 }));
  expect(selectPlan).toHaveBeenCalledWith('ch_lose_weight_challenge');
  expect(router.back).toHaveBeenCalled();
});

it('confirms before switching away from a different active plan', async () => {
  jest.mocked(getActivePlan).mockReturnValue({ challengeId: 'ch_plank_challenge', progress });
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  await render(<ThemeProvider><PlanScreen /></ThemeProvider>);
  await fireEvent.press(screen.getByLabelText(t('home.usePlan')));
  expect(selectPlan).not.toHaveBeenCalled();
  const buttons = alert.mock.calls[0]![2]!;
  buttons.find((button) => button.text === t('home.switch'))!.onPress!();
  expect(selectPlan).toHaveBeenCalledWith('ch_beginner_start_challenge');
  expect(screen.getByText(t('home.currentPlan'))).toBeTruthy();
});

it('keeps the current plan without a prompt and opens any plan from the list', async () => {
  jest.mocked(getActivePlan).mockReturnValue({ challengeId: 'ch_beginner_start_challenge', progress });
  await render(<ThemeProvider><PlanScreen /></ThemeProvider>);
  await fireEvent.press(screen.getByLabelText(t('home.continuePlan')));
  expect(selectPlan).toHaveBeenCalledWith('ch_beginner_start_challenge');
  await fireEvent.press(screen.getByLabelText(title('ch_squat_challenge')));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/challenge/[id]', params: { id: 'ch_squat_challenge' } });
});
