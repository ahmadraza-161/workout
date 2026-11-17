import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/modules/core/theme';
import { ExerciseDemo } from './ExerciseDemo';

jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('./ExerciseAnimationStage', () => ({ ExerciseAnimationStage: () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return <Text testID="movement">movement</Text>;
} }));
jest.mock('./ExerciseImage', () => ({ ExerciseImage: () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return <Text testID="original-image">original-image</Text>;
} }));
jest.mock('../videos.generated', () => ({ EXERCISE_VIDEOS: { ex_pike_push_up: 1 } }));
jest.mock('./ExerciseVideoStage', () => ({ ExerciseVideoStage: () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return <Text testID="video-movement">video</Text>;
} }));

it('opens animation first and retains the original image as the second preview', async () => {
  await render(<ThemeProvider><ExerciseDemo id="ex_standard_push_up" variant="player" /></ThemeProvider>);
  expect(screen.getByTestId('movement')).toBeTruthy();
  await fireEvent.press(screen.getByRole('tab', { name: 'Image' }));
  expect(screen.getByTestId('original-image')).toBeTruthy();
  expect(screen.queryByTestId('movement')).toBeNull();
  await fireEvent.press(screen.getByRole('tab', { name: 'Animation' }));
  expect(screen.getByTestId('movement')).toBeTruthy();
});

it('retains the static fallback when an exercise ID has no bundled demo', async () => {
  await render(<ThemeProvider><ExerciseDemo id="ex_not_bundled" variant="guide" /></ThemeProvider>);
  expect(screen.getByTestId('original-image')).toBeTruthy();
  expect(screen.queryByRole('tab', { name: 'Animation' })).toBeNull();
});

it('opens the MP4 animation first and retains the original Pike Push-Up image', async () => {
  await render(<ThemeProvider><ExerciseDemo id="ex_pike_push_up" variant="player" /></ThemeProvider>);
  expect(screen.getByTestId('video-movement')).toBeTruthy();
  await fireEvent.press(screen.getByRole('tab', { name: 'Image' }));
  expect(screen.getByTestId('original-image')).toBeTruthy();
  expect(screen.queryByTestId('video-movement')).toBeNull();
});
