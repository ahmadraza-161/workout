// Public API of the demo module: how an exercise is shown.
// The rig model is shared with the build-time Lottie exporter in tools/rig.

export { RigFigure, type RigFigureProps, type PropKind } from './components/RigFigure';
export { StaticImagePreview } from './components/StaticImagePreview';
export { PALETTES, fillFor, PROP_FILL, type CharacterPalette, type PaletteName } from './rig/palette';
export {
  BASE_POSES,
  fromBase,
  lerpPose,
  samplePoseLoop,
  CENTRE_X,
  FLOOR_Y,
  STANDING_HIP,
  type BasePoseName,
  type HeadView,
  type Pose,
  type View,
} from './rig/pose';
export {
  solve,
  renderPose,
  renderMotionArc,
  renderProp,
  type MotionArc,
  type Point,
  type Shape,
  type Solved,
  type SolvedBone,
} from './rig/render';
export { BONES, BONE_BY_NAME, CANVAS, DRAW_ORDER, type Bone, type JointName } from './rig/skeleton';
export { PROOF_EXERCISES, type ProofExercise } from './rig/proof';
export { exportLottie, LAYER_NAMES, type ExportOptions } from './rig/lottie';
