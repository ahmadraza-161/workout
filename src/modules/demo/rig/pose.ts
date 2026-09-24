// A pose is data: joint angles plus where the root sits. Authoring an exercise
// means writing 2–4 of these, which the exporter interpolates into a loop.

import type { JointName } from './skeleton.ts';

/**
 * Which way the figure faces (ADR-042, CONTENT_MAP §5).
 *   side  – profile; floor work, squats, lunges, push-ups (79 exercises)
 *   front – facing the camera; lateral and rotational moves (33)
 *   top   – lying on the floor seen from above (7)
 */
export type View = 'side' | 'front' | 'top';

/** Head shape, which follows the crown rather than the body (CONTENT_MAP §5). */
export type HeadView = 'side' | 'front' | 'top';

export interface Pose {
  /** Local angles in degrees. Omitted joints stay at their rest angle. */
  angles: Partial<Record<JointName, number>>;
  /** Root position on the 600 canvas. Defaults to standing on the floor line. */
  root?: { x: number; y: number };
  /** Rotation of the whole figure, for planks and lying poses. */
  rootAngle?: number;
  /**
   * Overrides the head shape. A forward bend shows the crown even in a side
   * or front view, so the head is set separately from the body view.
   */
  head?: HeadView;
}

/** Ground line: the standing figure's soles rest here. */
export const FLOOR_Y = 540;
export const CENTRE_X = 300;

/**
 * Pelvis floor for a figure standing upright. Thigh 112 + shin 108 puts the
 * ankle 220 below the root, and the foot's own half-width puts the sole 11
 * below that.
 */
export const STANDING_HIP = { x: CENTRE_X, y: FLOOR_Y - 231 };

/**
 * Base pose library (CONTENT_MAP §5). Exercises start from one of these and
 * change only the joints they need, so a new exercise is a handful of numbers.
 *
 * `standing` and `plank` are finished: between them they cover 66 of the 119
 * exercises and both are used by the style proof. The remaining five are
 * ROUGH DRAFTS — the angles put the body in the right attitude but the hands
 * and feet do not yet meet the floor line. Finishing them is T2.10, in the
 * content and asset phase, once the rig's look has been signed off.
 */
export const BASE_POSES = {
  /** Upright, arms at the sides. Used by 50 exercises. */
  standing: {
    angles: {},
    root: STANDING_HIP,
  },

  /**
   * Straight-arm plank, head to the right. `rootAngle` tilts the spine 10
   * degrees above horizontal; the arms then need +80 to hang vertically from
   * the tilted shoulders, and the legs trail back at 38 degrees so the toes
   * reach the floor. Used by 16 exercises.
   *
   * Contacts: palms and toes both land on FLOOR_Y, which is what makes the
   * pose read as a plank rather than a figure floating at an angle.
   */
  plank: {
    angles: {
      upperArmNear: 80,
      upperArmFar: 80,
      thighNear: 28,
      thighFar: 28,
      footNear: 30,
      footFar: 30,
    },
    rootAngle: -80,
    root: { x: 240, y: 380 },
  },

  /** On the back, knees bent, the start of most core work. Used by 20. */
  lyingBack: {
    angles: {
      upperArmNear: 108,
      upperArmFar: 108,
      thighNear: -78,
      thighFar: -78,
      shinNear: 104,
      shinFar: 104,
      footNear: -18,
      footFar: -18,
    },
    rootAngle: -90,
    root: { x: CENTRE_X - 10, y: FLOOR_Y - 38 },
  },

  /** Face down, used by back extensions and supermans. Used by 9. */
  lyingFront: {
    angles: {
      upperArmNear: 96,
      upperArmFar: 96,
      lowerArmNear: -84,
      lowerArmFar: -84,
      footNear: -80,
      footFar: -80,
    },
    rootAngle: -88,
    root: { x: CENTRE_X - 70, y: FLOOR_Y - 34 },
  },

  /** Hands and knees. Used by 7. */
  allFours: {
    angles: {
      upperArmNear: 82,
      upperArmFar: 82,
      thighNear: -74,
      thighFar: -74,
      shinNear: 84,
      shinFar: 84,
      footNear: -20,
      footFar: -20,
    },
    rootAngle: -84,
    root: { x: CENTRE_X - 50, y: FLOOR_Y - 128 },
  },

  /** Sitting on the floor, legs forward. Used by 5. */
  seated: {
    angles: {
      torso: 8,
      upperArmNear: -16,
      upperArmFar: -16,
      thighNear: -86,
      thighFar: -86,
      footNear: -16,
      footFar: -16,
    },
    root: { x: CENTRE_X - 60, y: FLOOR_Y - 38 },
  },

  /** Upright on the knees. Used by 2. */
  kneeling: {
    angles: {
      shinNear: -92,
      shinFar: -92,
      footNear: -6,
      footFar: -6,
    },
    root: { x: CENTRE_X, y: FLOOR_Y - 116 },
  },
} as const satisfies Record<string, Pose>;

export type BasePoseName = keyof typeof BASE_POSES;

/**
 * Blends two poses. `t` runs 0 to 1. Joints missing from either pose are
 * treated as 0, their rest angle, so a pose only needs the joints it moves.
 *
 * Eased with a cosine so the loop slows at each key pose instead of snapping
 * through it, which is what reads as a rep rather than a jitter.
 */
export function lerpPose(from: Pose, to: Pose, t: number, ease = true): Pose {
  const k = ease ? (1 - Math.cos(Math.PI * t)) / 2 : t;
  const mix = (a: number, b: number) => a + (b - a) * k;

  const joints = new Set([...Object.keys(from.angles), ...Object.keys(to.angles)] as JointName[]);
  const angles: Partial<Record<JointName, number>> = {};
  for (const joint of joints) {
    angles[joint] = mix(from.angles[joint] ?? 0, to.angles[joint] ?? 0);
  }

  const fromRoot = from.root ?? STANDING_HIP;
  const toRoot = to.root ?? STANDING_HIP;

  return {
    angles,
    root: { x: mix(fromRoot.x, toRoot.x), y: mix(fromRoot.y, toRoot.y) },
    rootAngle: mix(from.rootAngle ?? 0, to.rootAngle ?? 0),
    // The head shape is a discrete choice, so it switches at the midpoint
    // rather than blending.
    head: k < 0.5 ? from.head : to.head,
  };
}

/**
 * Samples a loop of key poses at `t` in 0 to 1, returning to the first pose so
 * the animation is seamless.
 */
export function samplePoseLoop(poses: Pose[], t: number): Pose {
  const first = poses[0];
  if (first === undefined) throw new Error('A pose loop needs at least one pose');
  if (poses.length === 1) return first;

  const segments = poses.length;
  const scaled = ((((t % 1) + 1) % 1) * segments);
  const index = Math.min(segments - 1, Math.floor(scaled));
  const from = poses[index] ?? first;
  const to = poses[(index + 1) % segments] ?? first;
  return lerpPose(from, to, scaled - index);
}

/** Starts from a base pose and overrides only the joints an exercise moves. */
export function fromBase(base: BasePoseName, overrides: Pose = { angles: {} }): Pose {
  const source = BASE_POSES[base];
  return {
    angles: { ...source.angles, ...overrides.angles },
    root: overrides.root ?? ('root' in source ? source.root : undefined),
    rootAngle: overrides.rootAngle ?? ('rootAngle' in source ? source.rootAngle : undefined),
    head: overrides.head,
  };
}
