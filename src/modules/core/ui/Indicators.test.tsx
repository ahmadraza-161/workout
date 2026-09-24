import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../theme';
import { Bolts } from './Bolts';
import { ProgressBar } from './Indicators';
import { WeekStrip } from './WeekStrip';

// Note: in React Native Testing Library v14, render() is async.
function wrap(node: React.ReactElement) {
  return render(<ThemeProvider>{node}</ThemeProvider>);
}

describe('Bolts', () => {
  it('speaks the difficulty instead of reading three icons', async () => {
    await wrap(<Bolts level={2} />);
    expect(screen.getByLabelText('Difficulty 2 of 3')).toBeTruthy();
  });
});

describe('ProgressBar', () => {
  it('reports progress as a percentage', async () => {
    await wrap(<ProgressBar progress={0.35} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 35,
    });
  });

  it('clamps out-of-range progress so a long overrun cannot overflow the bar', async () => {
    await wrap(<ProgressBar progress={1.8} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(100);
  });

  it('clamps negative progress to zero', async () => {
    await wrap(<ProgressBar progress={-1} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(0);
  });
});

describe('WeekStrip', () => {
  const days = [
    { date: 20, letter: 'S', state: 'past' as const },
    { date: 21, letter: 'M', state: 'done' as const },
    { date: 22, letter: 'T', state: 'today' as const },
  ];

  it('shows a check instead of the date on completed days', async () => {
    await wrap(<WeekStrip days={days} accessibilityLabel="This week" />);
    expect(screen.queryByText('21')).toBeNull();
    expect(screen.getByText('20')).toBeTruthy();
    expect(screen.getByText('22')).toBeTruthy();
  });

  it('carries one label for the whole strip rather than seven separate cells', async () => {
    await wrap(<WeekStrip days={days} accessibilityLabel="This week" />);
    expect(screen.getByLabelText('This week')).toBeTruthy();
  });
});
