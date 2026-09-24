// Exports a pose loop to Lottie.
//
// Each bone becomes one shape layer whose geometry is drawn ONCE in local
// space, parented to its parent bone, with only its rotation keyframed. That
// is how a real rig works, and it is why the files are small: the alternative,
// keyframing path data per frame, would repeat every outline at every key and
// would also shrink limbs toward the chord as they swing through an arc.
//
// Lottie rotates clockwise for positive values, while the rig measures 0 as
// down and 90 as right, so layer rotation is the negated rig angle.

import {
  ATTACH,
  BONES,
  BONE_BY_NAME,
  CANVAS,
  DRAW_ORDER,
  OFFSET,
  type JointName,
} from './skeleton.ts';
import { fillFor, type CharacterPalette } from './palette.ts';
import type { Pose, View } from './pose.ts';
import { STANDING_HIP } from './pose.ts';

const FPS = 30;
/** Matches the side view's flattened joint offsets in the SVG renderer. */
const OFFSET_SCALE: Record<View, number> = { front: 1, top: 1, side: 0.14 };

type Vec = [number, number];

function rgba(hex: string): [number, number, number, number] {
  const value = hex.replace('#', '');
  const channel = (at: number) => parseInt(value.slice(at, at + 2), 16) / 255;
  return [channel(0), channel(2), channel(4), 1];
}

/** Straight-sided polygon; Lottie wants zero tangents for straight edges. */
function polygon(points: Vec[]) {
  return {
    i: points.map(() => [0, 0]),
    o: points.map(() => [0, 0]),
    v: points,
    c: true,
  };
}

/** A bone drawn in its own space: joint at the origin, running along +Y. */
function boneOutline(joint: JointName): Vec[] {
  const bone = BONE_BY_NAME[joint];
  const s = bone.widthStart / 2;
  const e = bone.widthEnd / 2;
  return [
    [s, 0],
    [e, bone.length],
    [-e, bone.length],
    [-s, 0],
  ];
}

interface Keyframe {
  t: number;
  s: [number];
  i?: { x: number[]; y: number[] };
  o?: { x: number[]; y: number[] };
}

/**
 * Rotation track for one bone across the loop, returning to the first value so
 * the animation is seamless. The bezier easing mirrors the cosine easing the
 * runtime preview uses, so a Lottie and the SVG preview move identically.
 */
function rotationTrack(joint: JointName, poses: Pose[], frames: number) {
  const bone = BONE_BY_NAME[joint];
  const isRoot = bone.parent === null;
  const valueAt = (pose: Pose) =>
    isRoot
      ? -(bone.restAngle + (pose.rootAngle ?? 0) + (pose.angles[joint] ?? 0))
      : -(bone.restAngle + (pose.angles[joint] ?? 0));

  const values = poses.map(valueAt);
  const looped = [...values, values[0]!];
  const perSegment = frames / poses.length;

  const ease = { i: { x: [0.42], y: [0] }, o: { x: [0.58], y: [1] } };
  const keys: Keyframe[] = looped.map((value, index) => ({
    t: Math.round(index * perSegment),
    s: [value],
    ...ease,
  }));

  // A bone that never moves costs one static value instead of a track.
  const moves = values.some((value) => Math.abs(value - values[0]!) > 0.01);
  return moves ? { a: 1, k: keys } : { a: 0, k: values[0]! };
}

/** Position track for the root, which also translates rather than only turning. */
function rootPositionTrack(poses: Pose[], frames: number) {
  const points = poses.map((pose) => {
    const root = pose.root ?? STANDING_HIP;
    return [root.x, root.y, 0];
  });
  const looped = [...points, points[0]!];
  const perSegment = frames / poses.length;

  const moves = points.some(
    (point) => Math.abs(point[0]! - points[0]![0]!) > 0.01 || Math.abs(point[1]! - points[0]![1]!) > 0.01,
  );
  if (!moves) return { a: 0, k: points[0]! };

  return {
    a: 1,
    k: looped.map((point, index) => ({
      t: Math.round(index * perSegment),
      s: point,
      i: { x: [0.42], y: [0] },
      o: { x: [0.58], y: [1] },
    })),
  };
}

export interface ExportOptions {
  name: string;
  poses: Pose[];
  durationSeconds: number;
  palette: CharacterPalette;
  view: View;
}

export function exportLottie({ name, poses, durationSeconds, palette, view }: ExportOptions) {
  const frames = Math.round(durationSeconds * FPS);
  const scale = OFFSET_SCALE[view];

  // Lottie draws the first layer on top, so the rig's back-to-front order is
  // reversed here. Layer indices are 1-based and referenced by `parent`.
  const order = [...DRAW_ORDER].reverse();
  const indexOf = new Map<JointName, number>(order.map((joint, index) => [joint, index + 1]));

  const layers = order.map((joint, index) => {
    const bone = BONE_BY_NAME[joint];
    const parent = bone.parent;

    const position = parent
      ? [(OFFSET[joint] ?? 0) * scale, (ATTACH[joint] ?? 1) * BONE_BY_NAME[parent].length, 0]
      : undefined;

    // A front-on figure has no far side to shade.
    const depth = view === 'front' && bone.depth === 'far' && joint !== 'neck' ? 'near' : bone.depth;

    return {
      ddd: 0,
      ind: index + 1,
      ty: 4,
      nm: joint,
      sr: 1,
      ...(parent ? { parent: indexOf.get(parent) } : {}),
      ks: {
        o: { a: 0, k: 100 },
        r: rotationTrack(joint, poses, frames),
        p: parent ? { a: 0, k: position } : rootPositionTrack(poses, frames),
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          nm: joint,
          it: [
            { ty: 'sh', ind: 0, nm: `${joint}-path`, ks: { a: 0, k: polygon(boneOutline(joint)) } },
            {
              ty: 'fl',
              nm: `${joint}-fill`,
              c: { a: 0, k: rgba(fillFor(joint, depth, palette)) },
              o: { a: 0, k: 100 },
              r: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: frames,
      st: 0,
      bm: 0,
    };
  });

  return {
    v: '5.7.0',
    fr: FPS,
    ip: 0,
    op: frames,
    w: CANVAS,
    h: CANVAS,
    nm: name,
    ddd: 0,
    assets: [],
    layers,
  };
}

/** Layer names are the contract for swapping in professional art later. */
export const LAYER_NAMES = BONES.map((bone) => bone.name);
