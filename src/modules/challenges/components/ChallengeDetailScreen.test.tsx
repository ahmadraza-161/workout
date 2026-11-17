import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { getContentPack } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';

import { getChallengeProgress, restartChallenge, selectPlan } from '../repository';
import { ChallengeDetailScreen } from './ChallengeDetailScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn() }, useIsFocused: () => true }));
jest.mock('@/modules/content', () => ({
  ...jest.requireActual('../../content/repository'),
  ChallengeCard: jest.requireActual('../../content/components/ChallengeCard').ChallengeCard,
}));
jest.mock('../repository', () => ({ getChallengeProgress: jest.fn(), selectPlan: jest.fn(), restartChallenge: jest.fn(), abandonChallenge: jest.fn() }));
jest.mock('@/modules/content/components/ExerciseImage', () => ({ ExerciseImage: () => null }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
const challenge = getContentPack().challenges[0]!;
beforeEach(() => { jest.clearAllMocks(); jest.mocked(getChallengeProgress).mockReturnValue(null); });

it('starts the reconciled day and leaves later days locked', async () => {
  jest.mocked(selectPlan).mockReturnValue({ currentDay: 2, completedDays: new Set([1]), status: 'active' });
  await render(<ThemeProvider><ChallengeDetailScreen id={challenge.id} /></ThemeProvider>);
  const locked = screen.getByLabelText(`${t('challengeUi.day', { count: 2 })}, ${t('challengeUi.locked')}`);
  await fireEvent.press(locked);
  expect(router.push).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByLabelText(t('challengeUi.startDay', { count: 1 })));
  expect(router.push).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/player/[id]', params: expect.objectContaining({ challengeId: challenge.id, day: '2' }) }));
});
it('offers restart after completion and reports write failures', async () => {
  jest.mocked(getChallengeProgress).mockReturnValue({ currentDay: challenge.days + 1, completedDays: new Set([1]), status: 'completed' });
  jest.mocked(restartChallenge).mockImplementation(() => { throw new Error('disk'); });
  await render(<ThemeProvider><ChallengeDetailScreen id={challenge.id} /></ThemeProvider>);
  expect(screen.getByText(t('challengeUi.complete'))).toBeTruthy();
  expect(screen.queryByLabelText(t('challengeUi.startDay', { count: 1 }))).toBeNull();
  await fireEvent.press(screen.getByLabelText(t('challengeUi.restart')));
  expect(screen.getByText(t('errors.generic.title'))).toBeTruthy();
});
