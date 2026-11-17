import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';
import { getContentPack, getRelatedWorkouts } from '../repository';
import { setFavoriteWorkout } from '../favorites';
import { WorkoutDetailScreen } from './WorkoutDetailScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn() } }));
jest.mock('../favorites', () => ({ isFavoriteWorkout: () => false, setFavoriteWorkout: jest.fn() }));
jest.mock('./ExerciseImage', () => ({ ExerciseImage: () => null }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));

it('keeps start, customize, favorite, exercise and hero-back actions working', async () => {
  const workout = getContentPack().workouts[0]!;
  await render(<ThemeProvider><WorkoutDetailScreen id={workout.id} /></ThemeProvider>);
  await fireEvent.press(screen.getByText(t('player.start')));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/player/[id]', params: { id: workout.id, mode: 'new' } });
  await fireEvent.press(screen.getByText(t('builder.customize')));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/builder', params: { sourceId: workout.id } });
  await fireEvent.press(screen.getByLabelText(t('favorites.add')));
  expect(setFavoriteWorkout).toHaveBeenCalledWith(workout.id, true);
  expect(screen.getByLabelText(t('favorites.remove'))).toBeTruthy();
  const exercise = getContentPack().exercises.find((item) => item.id === workout.items[0]!.exerciseId)!;
  await fireEvent.press(screen.getAllByText(t(exercise.nameKey))[0]!);
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/exercise/[id]', params: { id: exercise.id } });
  await fireEvent.press(screen.getByLabelText(t('a11y.back')));
  expect(router.back).toHaveBeenCalledTimes(1);
  const related = getRelatedWorkouts(workout.id, 3)[0]!;
  await fireEvent.press(screen.getByLabelText(t(related.titleKey)));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/workout/[id]', params: { id: related.id } });
});
