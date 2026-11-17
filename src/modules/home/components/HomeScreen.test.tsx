import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { AccessibilityInfo } from 'react-native';

import { getActivePlan, selectPlan } from '@/modules/challenges';
import { getChallenge } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';
import { getProfile } from '@/modules/profile';
import { listReportSessions } from '@/modules/report';

import { HomeScreen } from './HomeScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn() }, useIsFocused: () => true, useFocusEffect: () => undefined }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('@/modules/content', () => ({
  ...jest.requireActual('../../content/repository'),
  ChallengeCard: jest.requireActual('../../content/components/ChallengeCard').ChallengeCard,
  CharacterArtwork: () => null, HeroArtwork: () => null, challengeHeroKey: (id: string) => id,
  ExerciseImage: () => null, SuggestedWorkouts: () => null, openBrowse: jest.fn(),
}));
jest.mock('@/modules/challenges', () => ({ getActivePlan: jest.fn(), selectPlan: jest.fn() }));
jest.mock('@/modules/profile', () => ({ getProfile: jest.fn() }));
jest.mock('@/modules/report', () => ({ listReportSessions: jest.fn(), localDateOf: () => '2026-10-27',
  buildReportSummary: () => ({ streak: { current: 3 } }) }));

const PLAN = 'ch_beginner_start_challenge';
const profile = { gender: 'female', goal: 'burn_fat', level: 1, daysPerWeekTarget: 4 } as unknown as ReturnType<typeof getProfile>;
const home = () => render(<ThemeProvider><HomeScreen /></ThemeProvider>);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  jest.mocked(getProfile).mockReturnValue(profile);
  jest.mocked(getActivePlan).mockReturnValue(null);
  jest.mocked(listReportSessions).mockReturnValue([]);
});

it('welcomes a new user with the recommended plan and starts its first day', async () => {
  jest.mocked(selectPlan).mockReturnValue({ currentDay: 1, completedDays: new Set(), status: 'active' });
  await home();
  expect(screen.getByText(t('home.welcomeTitle'))).toBeTruthy();
  expect(screen.getByText(t(getChallenge(PLAN)!.titleKey))).toBeTruthy();
  expect(screen.getByText(t('home.howTitle'))).toBeTruthy();
  expect(screen.getByLabelText(t('home.pathDay', { day: 3, state: t('home.pathRest') }))).toBeTruthy();
  await fireEvent.press(screen.getByLabelText(t('home.customize')));
  expect(router.push).toHaveBeenLastCalledWith('/plan');
  await fireEvent.press(screen.getByLabelText(t('home.startDayOne')));
  expect(selectPlan).toHaveBeenCalledWith(PLAN);
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/player/[id]',
    params: expect.objectContaining({ challengeId: PLAN, day: '1' }) });
});

it('shows a returning user today’s plan day, the week path and today’s completion', async () => {
  jest.mocked(getActivePlan).mockReturnValue({ challengeId: PLAN, progress: { currentDay: 4, completedDays: new Set([1, 2]), status: 'active' } });
  jest.mocked(listReportSessions).mockReturnValue([{ id: 's1', localDate: '2026-10-27', completionPct: 100, durationSec: 600, kcal: 40 }]);
  await home();
  const plan = getChallenge(PLAN)!;
  expect(screen.getByText(t('home.todayEyebrow', { plan: t(plan.titleKey), day: 4, total: plan.days }))).toBeTruthy();
  expect(screen.getByText(t('home.doneToday', { day: 4 }))).toBeTruthy();
  expect(screen.getByLabelText(t('home.pathDay', { day: 2, state: t('home.pathDone') }))).toBeTruthy();
  expect(screen.getByLabelText(t('home.pathDay', { day: 4, state: t('home.pathToday') }))).toBeTruthy();
  expect(screen.getByText(t('home.planProgress', { done: 2, total: plan.schedule.filter((day) => !day.rest).length }))).toBeTruthy();
  expect(screen.queryByText(t('home.welcomeTitle'))).toBeNull();
  await fireEvent.press(screen.getByLabelText(t('home.startDay', { day: 4 })));
  expect(selectPlan).not.toHaveBeenCalled();
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/player/[id]', params: expect.objectContaining({ challengeId: PLAN, day: '4' }) });
});

it('asks a returning user without a plan to pick one', async () => {
  jest.mocked(listReportSessions).mockReturnValue([{ id: 's1', localDate: '2026-10-20', completionPct: 100, durationSec: 600, kcal: 40 }]);
  await home();
  expect(screen.getByText(t('home.noPlanTitle'))).toBeTruthy();
  await fireEvent.press(screen.getByLabelText(t('home.choosePlan')));
  expect(router.push).toHaveBeenLastCalledWith('/plan');
});

it('offers a retry when local data cannot be read', async () => {
  jest.mocked(getProfile).mockImplementation(() => { throw new Error('disk'); });
  await home();
  expect(screen.getByText(t('errors.generic.title'))).toBeTruthy();
});
