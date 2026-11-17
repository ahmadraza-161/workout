import { fireEvent, render, screen } from '@testing-library/react-native';

import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';

import { getExerciseImage } from '../media';
import { ExerciseImage } from './ExerciseImage';

jest.mock('../media', () => ({ getExerciseImage: jest.fn() }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));

it('contains the complete pose and falls back when decoding fails', async () => {
  jest.mocked(getExerciseImage).mockReturnValue(1);
  await render(<ThemeProvider><ExerciseImage id="ex_bodyweight_squat" /></ThemeProvider>);
  const image = screen.getByLabelText(t('exercise.bodyweight_squat.name'));
  expect(image.props.resizeMode).toBe('contain');
  await fireEvent(image, 'error', { nativeEvent: { error: 'decode failed' } });
  expect(screen.getByText(t('browse.imagePending'))).toBeTruthy();
  expect(screen.queryByLabelText(t('exercise.bodyweight_squat.name'))).toBeNull();
});

it('does not keep a failed-image fallback after changing exercise', async () => {
  jest.mocked(getExerciseImage).mockReturnValue(1);
  await render(<ThemeProvider><ExerciseImage id="ex_bodyweight_squat" /></ThemeProvider>);
  await fireEvent(screen.getByLabelText(t('exercise.bodyweight_squat.name')), 'error', {});
  await screen.rerender(<ThemeProvider><ExerciseImage id="ex_standard_push_up" /></ThemeProvider>);
  expect(screen.getByLabelText(t('exercise.standard_push_up.name')).props.resizeMode).toBe('contain');
});

it('retries an existing local image inside the guide after a decoder error', async () => {
  jest.mocked(getExerciseImage).mockReturnValue(1);
  await render(<ThemeProvider><ExerciseImage id="ex_bodyweight_squat" variant="guide" /></ThemeProvider>);
  await fireEvent(screen.getByLabelText(t('exercise.bodyweight_squat.name')), 'error', {});
  await fireEvent.press(screen.getByRole('button', { name: t('errors.generic.retry') }));
  expect(screen.getByLabelText(t('exercise.bodyweight_squat.name')).props.source).toBe(1);
  expect(screen.queryByText(t('browse.imagePending'))).toBeNull();
});
