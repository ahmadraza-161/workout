import { DEFAULT_BROWSE_CONTEXT, rankWorkouts } from '../browse';
import { loadBrowseContext } from '../browseRepository';
import { getContentPack } from '../repository';
import { WorkoutCarousel } from './BrowseCards';
import { useBrowseNow } from './useBrowseNow';

/** A short goal-ranked set for people who already train; the full catalog lives in Discover. */
export function SuggestedWorkouts({ count = 6 }: { count?: number }) {
  const now = useBrowseNow();
  const context = (() => { try { return loadBrowseContext(); } catch { return DEFAULT_BROWSE_CONTEXT; } })();
  return <WorkoutCarousel workouts={rankWorkouts(getContentPack().workouts, context, now).slice(0, count)} />;
}
