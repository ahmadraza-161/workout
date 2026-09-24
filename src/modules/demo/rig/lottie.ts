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

/** Cubic control-point ratio that approximates a quarter circle. */
const KAPPA = 0.5523;

/**
 * A bone drawn in its own space: joint at the origin, running along +Y, with a
 * semicircular cap at each end unless the bone squares that end off.
 *
 * The caps have to match the SVG renderer exactly. If one rounds its limbs and
 * the other does not, a thumbnail and its own animation would be drawn in two
 * different styles.
 */
function boneOutline(joint: JointName) {
  const bone = BONE_BY_NAME[joint];
  const s = bone.widthStart / 2;
  const e = bone.widthEnd / 2;
  const L = bone.length;

  const v: Vec[] = [];
  const i: Vec[] = [];
  const o: Vec[] = [];

  const push = (vertex: Vec, inTangent: Vec, outTangent: Vec) => {
    v.push(vertex);
    i.push(inTangent);
    o.push(outTangent);
  };

  // Right side, from the joint out to the far end.
  push([s, 0], bone.flatStart ? [0, 0] : [0, -s * KAPPA], [0, 0]);
  push([e, L], [0, 0], bone.flatEnd ? [0, 0] : [0, e * KAPPA]);

  // Far cap apex.
  if (!bone.flatEnd) push([0, L + e], [e * KAPPA, 0], [-e * KAPPA, 0]);

  // Left side, back towards the joint.
  push([-e, L], bone.flatEnd ? [0, 0] : [0, e * KAPPA], [0, 0]);
  push([-s, 0], [0, 0], bone.flatStart ? [0, 0] : [0, -s * KAPPA]);

  // Joint cap apex.
  if (!bone.flatStart) push([0, -s], [-s * KAPPA, 0], [s * KAPPA, 0]);

  return { i, o, v, c: true };
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

/** A filled group, the wrapper every Lottie shape needs. */
function group(name: string, shape: object, colour: string) {
  return {
    ty: 'gr',
    nm: name,
    it: [
      shape,
      { ty: 'fl', nm: `${name}-fill`, c: { a: 0, k: rgba(colour) }, o: { a: 0, k: 100 }, r: 1 },
      {
        ty: 'tr',
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
      },
    ],
  };
}

/**
 * The head is the one part that is not a capsule, so it mirrors the SVG
 * renderer's shapes rather than using `boneOutline`. In the head's own space
 * +Y points at the crown, which is where the hair sits; the top view is hair
 * only, with no face (CONTENT_MAP §5).
 */
function headGroups(view: View, palette: CharacterPalette) {
  const bone = BONE_BY_NAME.head;
  const rx = bone.widthStart / 2;
  const ry = bone.length / 2;
  const centre = ry;

  const el = (x: number, y: number, w: number, h: number) => ({
    ty: 'el',
    nm: 'shape',
    p: { a: 0, k: [x, y] },
    s: { a: 0, k: [w, h] },
  });

  if (view === 'top') {
    return [group('head', el(0, centre, rx * 2, rx * 2.16), palette.hair.base)];
  }

  const hairY = centre + ry * 0.3;
  const hairX = view === 'side' ? -rx * 0.28 : 0;

  return [
    group('head', el(0, centre, rx * 2, ry * 2), fillFor('head', 'near', palette)),
    group('hair', el(hairX, hairY, rx * 2.08, ry * 1.32), palette.hair.base),
  ];
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
      shapes:
        joint === 'head'
          ? headGroups(view, palette)
          : [group(joint, { ty: 'sh', ind: 0, nm: `${joint}-path`, ks: { a: 0, k: boneOutline(joint) } }, fillFor(joint, depth, palette))],
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
