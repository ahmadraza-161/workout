import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../theme';
import { Stepper } from './Forms';

// Note: in React Native Testing Library v14, render() and fireEvent are async.
async function renderStepper(props: Partial<Parameters<typeof Stepper>[0]> = {}) {
  const onChange = jest.fn();
  await render(
    <ThemeProvider>
      <Stepper value={15} onChange={onChange} label="Reps" {...props} />
    </ThemeProvider>,
  );
  return onChange;
}

describe('Stepper', () => {
  it('increases the value', async () => {
    const onChange = await renderStepper();
    await fireEvent.press(screen.getByLabelText('Increase'));
    expect(onChange).toHaveBeenCalledWith(16);
  });

  it('decreases the value', async () => {
    const onChange = await renderStepper();
    await fireEvent.press(screen.getByLabelText('Decrease'));
    expect(onChange).toHaveBeenCalledWith(14);
  });

  it('does not go below the minimum', async () => {
    const onChange = await renderStepper({ value: 1, min: 1 });
    await fireEvent.press(screen.getByLabelText('Decrease'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not go above the maximum', async () => {
    const onChange = await renderStepper({ value: 99, max: 99 });
    await fireEvent.press(screen.getByLabelText('Increase'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('announces the label and the current value together', async () => {
    await renderStepper();
    expect(screen.getByLabelText('Reps: 15')).toBeTruthy();
  });
});
