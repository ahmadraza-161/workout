// Four exercises chosen to prove the rig before all 119 are posed (T2.9 gate).
// Between them they exercise every risky part: a standing front-view move with
// a motion arc, floor work in profile, a deep leg bend, and a pose that leans
// on a prop.
//
// Each exercise is 2–3 key poses; the exporter interpolates them into a
// seamless loop, so these numbers are the entire authoring cost per exercise.
// That is what makes 119 exercises tractable.

import { FLOOR_Y, fromBase, type Pose, type View } from './pose.ts';
import type { MotionArc } from './render.ts';
import type { PropKind } from '../components/RigFigure.tsx';

export interface ProofExercise {
  slug: string;
  name: string;
  view: View;
  /** Key poses in order; the loop returns to the first. */
  poses: Pose[];
  /** Seconds for one full loop. */
  duration: number;
  props?: PropKind[];
  motionArc?: MotionArc;
  floorShadow?: boolean;
  /** Why this one is in the proof set. */
  proves: string;
}

/**
 * Elbows down and in, forearms crossing up to the chest. The forearm angle is
 * relative to the upper arm, so it has to overshoot to swing back inward.
 */
const HANDS_AT_CHEST = {
  upperArmNear: 16,
  lowerArmNear: 104,
  upperArmFar: -16,
  lowerArmFar: -104,
};

export const PROOF_EXERCISES: ProofExercise[] = [
  {
    slug: 'torso-twist',
    name: 'Torso Twist',
    view: 'front',
    proves: 'Front view, rotation, and the motion arc. Directly comparable with the reference.',
    duration: 2.6,
    motionArc: { around: 'hip', sweep: 330, radius: 112, from: -165 },
    poses: [
      // A twist is rotation in depth, which a front view cannot show directly.
      // Tilting the torso far would read as a side bend, so the body barely
      // moves and the motion arc carries the meaning — exactly as in the
      // reference, where this exercise is almost static.
      fromBase('standing', { angles: { ...HANDS_AT_CHEST, torso: -5 } }),
      fromBase('standing', { angles: { ...HANDS_AT_CHEST, torso: 0 } }),
      fromBase('standing', { angles: { ...HANDS_AT_CHEST, torso: 5 } }),
    ],
  },

  {
    slug: 'push-up',
    name: 'Push-Up',
    view: 'side',
    proves: 'Floor work in profile — the case the design doc flags as likeliest to look basic.',
    duration: 3,
    floorShadow: false,
    poses: [
      // Top: the plank base, arms straight.
      fromBase('plank'),
      // Bottom: the shoulder drops while the palm stays planted, so the upper
      // arm swings back and the forearm swings forward to compensate.
      fromBase('plank', {
        angles: {
          upperArmNear: 128,
          upperArmFar: 128,
          lowerArmNear: -84,
          lowerArmFar: -84,
          thighNear: 24,
          thighFar: 24,
          footNear: 34,
          footFar: 34,
        },
        root: { x: 246, y: 416 },
        rootAngle: -84,
      }),
    ],
  },

  {
    slug: 'squat',
    name: 'Squat',
    view: 'side',
    proves: 'Deep knee and hip bend, where limb overlap and taper show up worst.',
    duration: 3,
    poses: [
      fromBase('standing', { angles: { upperArmNear: 8, upperArmFar: 8 } }),
      // Hips back and down, shins near vertical, arms counterbalancing forward.
      fromBase('standing', {
        angles: {
          torso: -22,
          thighNear: 46,
          thighFar: 46,
          shinNear: -54,
          shinFar: -54,
          footNear: 8,
          footFar: 8,
          upperArmNear: 88,
          upperArmFar: 88,
          lowerArmNear: 14,
          lowerArmFar: 14,
        },
        root: { x: 268, y: FLOOR_Y - 185 },
      }),
    ],
  },

  {
    slug: 'wall-sit',
    name: 'Wall Sit',
    view: 'side',
    proves: 'A prop the pose has to line up against, and a near-static hold.',
    duration: 2.4,
    props: ['wall'],
    poses: [
      // Thighs horizontal, shins vertical, back flat on the wall.
      fromBase('standing', {
        angles: {
          thighNear: 90,
          thighFar: 90,
          shinNear: -90,
          shinFar: -90,
          footNear: 0,
          footFar: 0,
          upperArmNear: 86,
          upperArmFar: 86,
          lowerArmNear: 4,
          lowerArmFar: 4,
        },
        root: { x: 118, y: 421 },
      }),
      // A hold still needs a second pose so the loop breathes rather than
      // freezing, which reads as a broken animation.
      fromBase('standing', {
        angles: {
          thighNear: 90,
          thighFar: 90,
          shinNear: -90,
          shinFar: -90,
          footNear: 0,
          footFar: 0,
          upperArmNear: 84,
          upperArmFar: 84,
          lowerArmNear: 6,
          lowerArmFar: 6,
          torso: 1.5,
        },
        root: { x: 118, y: 425 },
      }),
    ],
  },
];
