import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import rawPack from '../../../assets/data/content-pack.json';
import type { ContentPack } from '@/modules/content';

import { BuilderScreen } from './BuilderScreen';
import { saveCustomWorkout } from './repository';

const mockExercises = (rawPack as ContentPack).exercises.slice(0, 2).map((exercise, index) => ({
  ...exercise, nameKey: `exercise.${index}`, type: 'time' as const, defaultSeconds: 30,
}));
let mockBack: () => boolean;
jest.mock('expo-router', () => ({ router: { back: jest.fn(), replace: jest.fn() } }));
jest.mock('@/modules/core/navigation', () => ({ useAndroidBack: (handler: () => boolean) => { mockBack = handler; } }));
jest.mock('@/modules/content', () => ({
  listExercises: () => mockExercises,
  getExercise: (id: string) => mockExercises.find((exercise) => exercise.id === id),
  getWorkout: () => undefined, ExerciseImage: () => null,
}));
jest.mock('@/modules/achievements', () => ({ refreshAchievements: jest.fn() }));
jest.mock('@/modules/core/i18n', () => ({ t: (key: string) => key }));
jest.mock('@/modules/core/theme', () => ({ spacing: { 2: 8, 3: 12, 4: 16 } }));
jest.mock('./repository', () => ({ getCustomWorkout: jest.fn(), saveCustomWorkout: jest.fn() }));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const Native = jest.requireActual<typeof import('react-native')>('react-native');
  const labelButton = (label: string, onPress?: () => void, disabled?: boolean) =>
    React.createElement(Native.Pressable, { onPress, disabled, accessibilityLabel: label }, React.createElement(Native.Text, null, label));
  return {
    Screen: Native.View, Card: Native.View, Text: Native.Text, StackHeader: () => null,
    EmptyState: ({ title }: { title: string }) => React.createElement(Native.Text, null, title),
    ErrorState: () => null,
    TextField: ({ label, ...props }: { label: string }) => React.createElement(Native.TextInput, { ...props, accessibilityLabel: label }),
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => labelButton(label, onPress),
    Chip: ({ label, onPress }: { label: string; onPress: () => void }) => labelButton(label, onPress),
    Row: ({ title, onPress }: { title: string; onPress?: () => void }) => labelButton(title, onPress),
    IconButton: ({ accessibilityLabel, onPress, disabled }: { accessibilityLabel: string; onPress: () => void; disabled: boolean }) => labelButton(accessibilityLabel, onPress, disabled),
    Stepper: ({ label, value, onChange }: { label: string; value: number; onChange: (next: number) => void }) => labelButton(`${label} increase`, () => onChange(value + 1)),
  };
});

it('validates each step, adds and reorders exercises, and saves the edited targets once', async () => {
  await render(<BuilderScreen />);
  await fireEvent.press(screen.getByText('builder.next'));
  expect(screen.getByText('builder.nameError')).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText('builder.name'), 'My plan');
  await fireEvent.press(screen.getByText('builder.next'));
  await fireEvent.press(screen.getByText('builder.next'));
  expect(screen.getByText('builder.itemsError')).toBeTruthy();
  await fireEvent.press(screen.getByText('exercise.0'));
  await fireEvent.press(screen.getByText('exercise.1'));
  await fireEvent.press(screen.getByText('builder.next'));
  await fireEvent.press(screen.getAllByLabelText('builder.moveDown')[0]!);
  await fireEvent.press(screen.getAllByLabelText('builder.seconds increase')[0]!);
  await fireEvent.press(screen.getByText('builder.save'));
  await fireEvent.press(screen.getByText('builder.save'));
  expect(saveCustomWorkout).toHaveBeenCalledTimes(1);
  expect(saveCustomWorkout).toHaveBeenCalledWith(expect.objectContaining({ title: 'My plan',
    plan: expect.objectContaining({ items: [
      { exerciseId: mockExercises[1]!.id, seconds: 31, rest: 20 },
      { exerciseId: mockExercises[0]!.id, seconds: 30, rest: 20 },
    ] }),
  }), expect.any(Function), undefined);
}, 15000);

it('Android Back moves to the previous step and confirms before discarding a changed draft', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await render(<BuilderScreen />);
  await fireEvent.changeText(screen.getByLabelText('builder.name'), 'Unsaved plan');
  await fireEvent.press(screen.getByText('builder.next'));
  await act(() => { mockBack!(); });
  expect(screen.getByLabelText('builder.name').props.value).toBe('Unsaved plan');
  await act(() => { mockBack!(); mockBack!(); });
  expect(alert).toHaveBeenCalledTimes(1);
  const buttons = alert.mock.calls[0]![2]!;
  expect(router.back).not.toHaveBeenCalled();
  await act(() => { buttons[0]!.onPress?.(); mockBack!(); });
  expect(alert).toHaveBeenCalledTimes(2);
  await act(() => { alert.mock.calls[1]![2]![1]!.onPress?.(); });
  expect(router.back).toHaveBeenCalledTimes(1);
  alert.mockRestore();
}, 15000);
