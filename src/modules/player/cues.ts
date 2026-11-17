import type { PlayerPhase } from './engine';

export interface CueFrame {
  phase: PlayerPhase;
  index: number;
  remaining: number | null;
  active: boolean;
}

/** Compare observed frames; never replay missed countdowns after a pause or background gap. */
export function getCue(previous: CueFrame | null, current: CueFrame): 'tick' | 'transition' | 'complete' | null {
  if (!current.active || !previous?.active) return null;
  if (current.phase !== previous.phase || current.index !== previous.index) {
    return current.phase === 'complete' ? 'complete' : 'transition';
  }
  if (current.phase !== 'complete' && current.remaining !== null &&
      current.remaining >= 1 && current.remaining <= 3 &&
      previous.remaining !== null && previous.remaining > current.remaining) return 'tick';
  return null;
}
