import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../theme';
import { Chip } from './Chip';

// Note: in React Native Testing Library v14, render() and fireEvent are async.
async function renderChip(props: Partial<Parameters<typeof Chip>[0]> = {}) {
  const onPress = jest.fn();
  await render(
    <ThemeProvider>
      <Chip label="Abs" onPress={onPress} {...props} />
    </ThemeProvider>,
  );
  return onPress;
}

describe('Chip', () => {
  it('reports its selected state to screen readers', async () => {
    await renderChip({ selected: true });
    expect(screen.getByRole('tab', { name: 'Abs', selected: true })).toBeTruthy();
  });

  it('reports an unselected chip as not selected', async () => {
    await renderChip({ selected: false });
    expect(screen.getByRole('tab', { name: 'Abs', selected: false })).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = await renderChip();
    await fireEvent.press(screen.getByRole('tab', { name: 'Abs' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders focus chips as plain labels, since they are not tappable', async () => {
    await render(
      <ThemeProvider>
        <Chip label="Lower back" variant="focus" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('tab')).toBeNull();
    expect(screen.getByText('Lower back')).toBeTruthy();
  });
});
