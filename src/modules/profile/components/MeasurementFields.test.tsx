import { render, screen, fireEvent } from '@testing-library/react-native';
import { HeightField, WeightField } from './MeasurementFields';

jest.mock('@/modules/core/i18n', () => ({ t: (key: string) => key }));
jest.mock('@/modules/core/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { TextInput } = jest.requireActual<typeof import('react-native')>('react-native');
  return { TextField: ({ label, ...props }: { label: string }) => React.createElement(TextInput, { ...props, accessibilityLabel: label }) };
});

it('keeps untouched canonical height, edits imperial fields and clears optional height', async () => {
  const onChange = jest.fn();
  await render(<HeightField unit="imperial" value="177.8" onChange={onChange} />);
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByLabelText('settings.heightFeet').props.value).toBe('5');
  await fireEvent.changeText(screen.getByLabelText('settings.heightInches'), '9.5');
  expect(onChange).toHaveBeenLastCalledWith('176.53');
  await fireEvent.changeText(screen.getByLabelText('settings.heightInches'), '12');
  expect(onChange).toHaveBeenLastCalledWith('NaN');
  await fireEvent.changeText(screen.getByLabelText('settings.heightFeet'), '');
  await fireEvent.changeText(screen.getByLabelText('settings.heightInches'), '');
  expect(onChange).toHaveBeenLastCalledWith('');
});

it('converts pound edits to kilograms and retains partial decimal text', async () => {
  const onChange = jest.fn();
  await render(<WeightField unit="imperial" value="70" onChange={onChange} />);
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent.changeText(screen.getByLabelText('settings.weightLbs'), '154.');
  expect(screen.getByLabelText('settings.weightLbs').props.value).toBe('154.');
  expect(Number(onChange.mock.calls.at(-1)?.[0])).toBeCloseTo(69.853, 3);
  await fireEvent.changeText(screen.getByLabelText('settings.weightLbs'), '');
  expect(onChange).toHaveBeenLastCalledWith('');
});
