import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../theme';
import { DatePicker } from './DatePicker';

describe('history calendar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 29, 12));
  });

  afterEach(() => jest.useRealTimers());

  it('marks a saved workout day and selects it', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><DatePicker value={new Date(2026, 8, 29)} onChange={onChange}
      markedDates={new Set(['2026-09-28'])} /></ThemeProvider>);
    const day = screen.getByLabelText('28 September 2026, workout recorded');
    await fireEvent.press(day);
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(onChange.mock.calls[0]?.[0].getDate()).toBe(28);
  });

  it('disables future days and the next month', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><DatePicker value={new Date(2026, 8, 29)} onChange={onChange} /></ThemeProvider>);
    expect(screen.getByLabelText('30 September 2026').props.accessibilityState.disabled).toBe(true);
    expect(screen.getByLabelText('October 2026').props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(screen.getByLabelText('30 September 2026'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('opens an earlier month to reach older workout records', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><DatePicker value={new Date(2026, 8, 29)} onChange={onChange}
      markedDates={new Set(['2026-08-05'])} /></ThemeProvider>);
    await fireEvent.press(screen.getByLabelText('August 2026'));
    await fireEvent.press(screen.getByLabelText('5 August 2026, workout recorded'));
    expect(onChange.mock.calls[0]?.[0].getMonth()).toBe(7);
  });
});
