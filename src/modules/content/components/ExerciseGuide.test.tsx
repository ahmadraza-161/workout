import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '@/modules/core/theme';

import { getExercise } from '../repository';
import { ExerciseGuide } from './ExerciseGuide';

// The newly animated plank uses the native stage's navigation-focus hook.
// This isolated guide test represents an already focused route.
jest.mock('expo-router', () => ({ useIsFocused: () => true }));
// This guide case uses the Lottie plank. MP4's native module is covered in its
// dedicated stage tests and is unavailable in Jest's native runtime.
jest.mock('./ExerciseVideoStage', () => ({ ExerciseVideoStage: () => null }));

// The shared UI barrel also exports Sheet; this guide does not mount it.
jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetBackdrop: () => null,
  BottomSheetModal: () => null,
  BottomSheetView: () => null,
}));

describe('ExerciseGuide', () => {
  it('shows the bundled guide sections and keeps Close available across tabs', async () => {
    const exercise = getExercise('ex_forearm_plank');
    expect(exercise).toBeDefined();
    const onClose = jest.fn();
    await render(
      <ThemeProvider>
        <ExerciseGuide exercise={exercise!} onClose={onClose} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Instructions')).toBeTruthy();
    expect(screen.getByText('Focus area')).toBeTruthy();
    expect(screen.getByText('Common mistakes')).toBeTruthy();
    expect(screen.getByText('Breathing tips')).toBeTruthy();

    await fireEvent.press(screen.getByRole('tab', { name: 'Muscle' }));
    expect(screen.getAllByText('Front')).toHaveLength(2);
    await fireEvent.press(screen.getByRole('tab', { name: 'How to do' }));
    expect(screen.getAllByText(/Place forearms on the floor/)).toHaveLength(2);

    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
