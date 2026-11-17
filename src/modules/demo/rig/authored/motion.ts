import type { CharacterPalette } from '../palette.ts';
import { arm, head, leg, shadow, shape, shoe, vest } from './character.ts';
import { kneeBetween, type Artwork, type Transform, type Vec } from './geometry.ts';

export type StyleExercise = 'torso-twist' | 'squat';
export const STYLE_EXERCISES: readonly StyleExercise[] = ['torso-twist', 'squat'];
export const STYLE_DURATION: Record<StyleExercise, number> = { 'torso-twist': 5.6, squat: 4.8 };
const TAU = 2 * Math.PI;

/** Grounded squat contacts, solved at every frame instead of sliding the root. */
export function squatContacts(t: number): { hip: Vec; knee: Vec; ankle: Vec; depth: number } {
  const depth = (1 - Math.cos(t * TAU)) / 2;
  const hip: Vec = [332 - 85 * depth, 288 + 112 * depth];
  const ankle: Vec = [332, 508];
  return { hip, knee: kneeBetween(hip, ankle), ankle, depth };
}

function squat(t: number, p: CharacterPalette): Artwork[] {
  const { hip, knee, ankle, depth } = squatContacts(t);
  const lean = depth * 0.54;
  const trunk: Transform = ([x, y]) => [
    hip[0] + x * 0.66 - y * Math.sin(lean),
    hip[1] + y * Math.cos(lean),
  ];
  const farOffset = ([x, y]: Vec): Vec => [x - 16, y - 3];
  const shoulder = trunk([16, -125]);
  const elbow: Vec = [shoulder[0] + 24 + 35 * depth, shoulder[1] + 66 - 48 * depth];
  const wrist: Vec = [elbow[0] + 14 + 44 * depth, elbow[1] + 58 - 62 * depth];
  const neck = trunk([5, -155]);
  // Counter-rotate the head so the gaze stays forward during the hip hinge.
  const headTransform: Transform = ([x, y]) => [neck[0] + x * 0.87, neck[1] + y];
  return [
    shadow(p, true),
    ...leg('far', farOffset(hip), farOffset(knee), farOffset(ankle), p, true),
    ...shoe('far', farOffset(ankle), p, true),
    ...arm('farArm', farOffset(shoulder), farOffset(elbow), farOffset(wrist), p, true),
    shape(
      'pelvis',
      [
        [-29, -21],
        [25, -21],
        [31, 5],
        [16, 24],
        [-26, 19],
        [-35, 3],
      ],
      p.shorts.base,
      trunk,
    ),
    ...leg('near', hip, knee, ankle, p),
    ...shoe('near', ankle, p, true),
    ...head(p, headTransform, 1),
    ...vest(p, trunk),
    ...arm('nearArm', shoulder, elbow, wrist, p),
  ];
}

function twist(t: number, p: CharacterPalette): Artwork[] {
  const yaw = Math.sin(t * TAU) * 1.03;
  // A ribcage has depth: its silhouette must not collapse to a paper-thin
  // line as the shoulders turn away from the camera.
  const c = 0.45 + 0.55 * Math.cos(yaw);
  const s = Math.sin(yaw);
  // Project the chest and hands at different depths: this is a turn in depth,
  // never a side bend. The pelvis, knees and soles remain fixed.
  const upper = (x: number, y: number, z = 0): Vec => [300 + x * c + z * s, y];
  const trunk: Transform = ([x, y]) => upper(x, y + 302, 8);
  const face: Transform = ([x, y]) => [300 + x * (0.84 + 0.16 * Math.cos(yaw)) + 12 * s, y + 148];
  const leftHip: Vec = [278, 307];
  const rightHip: Vec = [322, 307];
  return [
    shadow(p, false),
    ...leg('left', leftHip, [270, 410], [262, 508], p),
    ...leg('right', rightHip, [330, 410], [338, 508], p),
    ...shoe('left', [262, 508], p, false, -1),
    ...shoe('right', [338, 508], p, false),
    shape(
      'pelvis',
      [
        [266, 286],
        [334, 286],
        [337, 315],
        [317, 329],
        [300, 322],
        [280, 329],
        [263, 314],
      ],
      p.shorts.base,
    ),
    ...head(p, face, s),
    ...vest(p, trunk),
    ...arm('leftArm', upper(-43, 177), upper(-66, 239, 10), upper(-21, 227, 47), p),
    ...arm('rightArm', upper(43, 177), upper(66, 239, 10), upper(21, 227, 47), p),
  ];
}

/** Original vector artwork at a normalized loop time; shared by both renderers. */
export function drawStyleFrame(
  exercise: StyleExercise,
  t: number,
  palette: CharacterPalette,
): Artwork[] {
  return exercise === 'squat' ? squat(t, palette) : twist(t, palette);
}
