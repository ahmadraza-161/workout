// The 2D character rig (DESIGN §2.7, CONTENT_MAP §5, ADR-042).
//
// The figure is a bone hierarchy, not a set of drawings. A pose is a map of
// joint angles, so poses are data: cheap to author, cheap to tune, and they
// export to Lottie as rotation keyframes on parented layers rather than as
// morphing paths. That keeps each animation well under the 40 KB budget.
//
// Angle convention: degrees, 0 points DOWN (+Y), 90 points RIGHT (+X),
// 180 points UP. A bone's angle is its parent's world angle plus its own
// `restAngle` plus the pose's local angle, so every angle is 0 in the standing
// rest pose and a pose only names the joints it actually moves.
//
// The root is the pelvis floor. The hip bone runs UP from it to the waist, so
// legs hang from the root and the spine grows from the hip's far end.

/** Canvas is square so a pose can be dropped into any square slot. */
export const CANVAS = 600;

export type JointName =
  | 'hip'
  | 'torso'
  | 'neck'
  | 'head'
  | 'upperArmFar'
  | 'lowerArmFar'
  | 'handFar'
  | 'upperArmNear'
  | 'lowerArmNear'
  | 'handNear'
  | 'thighFar'
  | 'shinFar'
  | 'footFar'
  | 'thighNear'
  | 'shinNear'
  | 'footNear';

/**
 * Which flat tone a bone takes. Limbs on the far side of the body use the
 * shade tone, which is what gives a flat figure its depth (DESIGN §2.7).
 */
export type Depth = 'near' | 'far';

export interface Bone {
  name: JointName;
  parent: JointName | null;
  /** Distance from this bone's joint to its far end. */
  length: number;
  /** Rotation relative to the parent's direction. 180 reverses it. */
  restAngle: number;
  /** Width at the joint end and at the far end; limbs taper. */
  widthStart: number;
  widthEnd: number;
  depth: Depth;
  /** Rounded cap at the far end, for hands, feet and the head. */
  round?: boolean;
}

// Proportions: about 7.5 heads tall, 494 units from crown to sole, which
// leaves a comfortable margin inside the 600 canvas. The reference figure
// fills roughly 70% of its stage, and this matches that.
export const BONES: readonly Bone[] = [
  // Pelvis, running up from the root to the waist. This block is the shorts.
  { name: 'hip', parent: null, length: 44, restAngle: 180, widthStart: 74, widthEnd: 72, depth: 'near' },
  { name: 'torso', parent: 'hip', length: 140, restAngle: 0, widthStart: 72, widthEnd: 96, depth: 'near' },
  // The neck sits in the shadow under the jaw, so it always takes the shade tone.
  { name: 'neck', parent: 'torso', length: 16, restAngle: 0, widthStart: 34, widthEnd: 32, depth: 'far' },
  { name: 'head', parent: 'neck', length: 62, restAngle: 0, widthStart: 48, widthEnd: 48, depth: 'near', round: true },

  // Arms reverse the spine's direction so they hang down in the rest pose.
  { name: 'upperArmFar', parent: 'torso', length: 84, restAngle: 180, widthStart: 24, widthEnd: 21, depth: 'far' },
  { name: 'lowerArmFar', parent: 'upperArmFar', length: 76, restAngle: 0, widthStart: 21, widthEnd: 16, depth: 'far' },
  { name: 'handFar', parent: 'lowerArmFar', length: 30, restAngle: 0, widthStart: 18, widthEnd: 16, depth: 'far', round: true },

  { name: 'upperArmNear', parent: 'torso', length: 84, restAngle: 180, widthStart: 24, widthEnd: 21, depth: 'near' },
  { name: 'lowerArmNear', parent: 'upperArmNear', length: 76, restAngle: 0, widthStart: 21, widthEnd: 16, depth: 'near' },
  { name: 'handNear', parent: 'lowerArmNear', length: 30, restAngle: 0, widthStart: 18, widthEnd: 16, depth: 'near', round: true },

  // Legs likewise reverse the pelvis so they hang down.
  { name: 'thighFar', parent: 'hip', length: 112, restAngle: 180, widthStart: 42, widthEnd: 34, depth: 'far' },
  { name: 'shinFar', parent: 'thighFar', length: 108, restAngle: 0, widthStart: 34, widthEnd: 23, depth: 'far' },
  { name: 'footFar', parent: 'shinFar', length: 38, restAngle: 90, widthStart: 22, widthEnd: 20, depth: 'far', round: true },

  { name: 'thighNear', parent: 'hip', length: 112, restAngle: 180, widthStart: 42, widthEnd: 34, depth: 'near' },
  { name: 'shinNear', parent: 'thighNear', length: 108, restAngle: 0, widthStart: 34, widthEnd: 23, depth: 'near' },
  { name: 'footNear', parent: 'shinNear', length: 38, restAngle: 90, widthStart: 22, widthEnd: 20, depth: 'near', round: true },
];

export const BONE_BY_NAME: Record<JointName, Bone> = Object.fromEntries(
  BONES.map((bone) => [bone.name, bone]),
) as Record<JointName, Bone>;

/**
 * Where a bone attaches along its parent, as a fraction from the parent's
 * joint to its far end. Arms hang near the top of the torso; legs hang from
 * the pelvis floor, which is the hip bone's own joint.
 */
export const ATTACH: Partial<Record<JointName, number>> = {
  upperArmFar: 0.9,
  upperArmNear: 0.9,
  thighFar: 0,
  thighNear: 0,
};

/**
 * Sideways offset from the parent bone's centre line, so shoulders and hips
 * sit at the sides of the body rather than on its axis.
 */
export const OFFSET: Partial<Record<JointName, number>> = {
  // Wide enough that the arms clear the torso in a front view; the reference
  // shows them distinctly at the sides rather than tucked behind.
  upperArmFar: -56,
  upperArmNear: 56,
  thighFar: -19,
  thighNear: 19,
};

/** Draw order, back to front, so the far limbs sit behind the torso. */
export const DRAW_ORDER: readonly JointName[] = [
  'upperArmFar',
  'lowerArmFar',
  'handFar',
  'thighFar',
  'shinFar',
  'footFar',
  'hip',
  'thighNear',
  'shinNear',
  'footNear',
  'torso',
  'neck',
  'head',
  'upperArmNear',
  'lowerArmNear',
  'handNear',
];
