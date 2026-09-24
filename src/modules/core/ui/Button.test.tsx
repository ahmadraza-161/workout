import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../theme';
import { Button } from './Button';

// Note: in React Native Testing Library v14, render() and fireEvent are async.
async function renderButton(props: Partial<Parameters<typeof Button>[0]> = {}) {
  const onPress = jest.fn();
  await render(
    <ThemeProvider>
      <Button label="Start" onPress={onPress} {...props} />
    </ThemeProvider>,
  );
  return onPress;
}

describe('Button', () => {
  it('calls onPress when tapped', async () => {
    const onPress = await renderButton();
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = await renderButton({ disabled: true });
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses the accessibility label when one is given', async () => {
    await renderButton({ accessibilityLabel: 'Start Abs Beginner' });
    expect(screen.getByRole('button', { name: 'Start Abs Beginner' })).toBeTruthy();
  });
});
