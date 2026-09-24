import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';

import { ThemeProvider } from '../theme';
import { Row } from './Row';

// Note: in React Native Testing Library v14, render() and fireEvent are async.
async function renderRow(props: Partial<Parameters<typeof Row>[0]> = {}) {
  const onPress = jest.fn();
  await render(
    <ThemeProvider>
      <Row title="Abs Beginner" onPress={onPress} {...props} />
    </ThemeProvider>,
  );
  return onPress;
}

describe('Row', () => {
  it('joins string meta parts with a dot separator', async () => {
    await renderRow({ meta: ['16 mins', '16 Exercises'] });
    expect(screen.getByText('16 mins · 16 Exercises')).toBeTruthy();
  });

  it('drops empty meta parts so rows without a level do not show a stray dot', async () => {
    await renderRow({ meta: ['16 mins', undefined, null, ''] });
    expect(screen.getByText('16 mins')).toBeTruthy();
  });

  it('renders a node when meta needs its own colours, such as a level', async () => {
    await renderRow({ meta: <RNText>Intermediate</RNText> });
    expect(screen.getByText('Intermediate')).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = await renderRow();
    await fireEvent.press(screen.getByRole('button', { name: 'Abs Beginner' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is not a button when it has no onPress', async () => {
    await render(
      <ThemeProvider>
        <Row title="Torso Twist" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Torso Twist')).toBeTruthy();
  });
});
