import type { AnimationObject } from 'lottie-react-native';
import type { ExerciseDemoProps } from './ExerciseDemo';
import { ExerciseImage } from './ExerciseImage';

// Android uses the .native component. Web keeps the offline pose without a web
// player/WASM dependency or a remote runtime download.
export function ExerciseAnimationStage({ id, variant }: ExerciseDemoProps & { source: AnimationObject }) {
  return <ExerciseImage id={id} variant={variant} />;
}
