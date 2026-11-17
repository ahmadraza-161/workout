import type { ExerciseDemoProps } from './ExerciseDemo';
import { ExerciseImage } from './ExerciseImage';

// Web retains the original offline pose, matching the existing Lottie fallback.
export function ExerciseVideoStage({ id, variant }: ExerciseDemoProps & { source: number }) {
  return <ExerciseImage id={id} variant={variant} />;
}
