// Turns a pose into flat shapes. Used at runtime to draw thumbnails with
// react-native-svg (ADR-024) and at build time by the Lottie exporter, so
// there is one rig definition and two consumers.

import { fillFor, PROP_FILL, type CharacterPalette } from './palette.ts';
import { CENTRE_X, FLOOR_Y, STANDING_HIP, type HeadView, type Pose, type View } from './pose.ts';
import {
  ATTACH,
  BONE_BY_NAME,
  BONES,
  CANVAS,
  DRAW_ORDER,
  OFFSET,
  type Bone,
  type JointName,
} from './skeleton.ts';

export interface Point {
  x: number;
  y: number;
}

/** A solved bone: where it starts, where it ends, and which way it points. */
export interface SolvedBone {
  name: JointName;
  start: Point;
  end: Point;
  /** World angle in degrees, 0 pointing down. */
  angle: number;
}

export type Solved = Record<JointName, SolvedBone>;

const RAD = Math.PI / 180;

/** Steps `length` from `from` along `angle`, where 0 points down (+Y). */
function step(from: Point, angle: number, length: number): Point {
  const radians = angle * RAD;
  return {
    x: from.x + Math.sin(radians) * length,
    y: from.y + Math.cos(radians) * length,
  };
}

/**
 * Forward kinematics: walks the bone hierarchy, accumulating each bone's local
 * angle onto its parent's world angle.
 */
/**
 * Sideways joint offsets only read as depth when the body is seen from the
 * front or from above. In profile the two shoulders sit one behind the other,
 * so a full offset would stack them vertically instead.
 */
const OFFSET_SCALE: Record<View, number> = { front: 1, top: 1, side: 0.14 };

export function solve(pose: Pose, view: View = 'front'): Solved {
  const solved = {} as Solved;
  const root = pose.root ?? STANDING_HIP;
  const rootAngle = pose.rootAngle ?? 0;

  for (const bone of BONES) {
    const local = pose.angles[bone.name] ?? 0;

    if (bone.parent === null) {
      const angle = bone.restAngle + rootAngle + local;
      solved[bone.name] = { name: bone.name, start: root, end: step(root, angle, bone.length), angle };
      continue;
    }

    const parent = solved[bone.parent];
    const along = ATTACH[bone.name] ?? 1;
    const sideways = (OFFSET[bone.name] ?? 0) * OFFSET_SCALE[view];

    // Attach part-way along the parent, then step sideways perpendicular to it
    // so shoulders and hips sit at the body's sides rather than on its axis.
    const onParent: Point = {
      x: parent.start.x + (parent.end.x - parent.start.x) * along,
      y: parent.start.y + (parent.end.y - parent.start.y) * along,
    };
    const start = sideways === 0 ? onParent : step(onParent, parent.angle + 90, sideways);

    const angle = parent.angle + bone.restAngle + local;
    solved[bone.name] = { name: bone.name, start, end: step(start, angle, bone.length), angle };
  }

  return solved;
}

export interface Shape {
  /** SVG path data. */
  d: string;
  fill: string;
  /** Stable id so Lottie layers and SVG nodes keep the same names. */
  id: string;
  opacity?: number;
  /** Only the motion arc is stroked; every body part is a flat fill. */
  stroke?: string;
  strokeWidth?: number;
}

/**
 * A tapered limb with a semicircular cap at each end.
 *
 * Both caps matter. A bone with flat ends meets its parent at an angle and
 * leaves a wedge-shaped notch at every bent elbow and knee, which is what
 * makes a jointed figure read as planks bolted together rather than a body.
 * Rounding both ends means the parent's end cap and the child's start cap
 * overlap into a single smooth joint, whatever the angle.
 */
function capsule(bone: Bone, solvedBone: SolvedBone): string {
  const { start, end, angle } = solvedBone;
  const half = (angle + 90) * RAD;
  const nx = Math.sin(half);
  const ny = Math.cos(half);
  const s = bone.widthStart / 2;
  const e = bone.widthEnd / 2;

  const a = { x: start.x + nx * s, y: start.y + ny * s };
  const b = { x: end.x + nx * e, y: end.y + ny * e };
  const c = { x: end.x - nx * e, y: end.y - ny * e };
  const d = { x: start.x - nx * s, y: start.y - ny * s };

  const round = (n: number) => Math.round(n * 10) / 10;
  const arc = (r: number, to: { x: number; y: number }) =>
    `A ${round(r)} ${round(r)} 0 0 1 ${round(to.x)} ${round(to.y)}`;
  const line = (to: { x: number; y: number }) => `L ${round(to.x)} ${round(to.y)}`;

  return [
    `M ${round(a.x)} ${round(a.y)}`,
    line(b),
    bone.flatEnd ? line(c) : arc(e, c),
    line(d),
    bone.flatStart ? line(a) : arc(s, a),
    'Z',
  ].join(' ');
}

/**
 * An ellipse as a path, so every shape is the same kind of node.
 *
 * `angle` rotates the ellipse clockwise on screen. Unrotated, `rx` is the
 * horizontal semi-axis and `ry` the vertical one. The rig measures 0 as down
 * and 90 as right, so a caller aligning an ellipse with a bone passes the
 * negated bone angle.
 */
function ellipse(centre: Point, rx: number, ry: number, angle = 0): string {
  const round = (n: number) => Math.round(n * 10) / 10;
  const radians = angle * RAD;
  // Two arcs, from the left extreme to the right and back.
  const dx = Math.cos(radians) * rx;
  const dy = Math.sin(radians) * rx;
  const left = { x: centre.x - dx, y: centre.y - dy };
  const right = { x: centre.x + dx, y: centre.y + dy };
  const rotation = round(angle);
  return [
    `M ${round(left.x)} ${round(left.y)}`,
    `A ${round(rx)} ${round(ry)} ${rotation} 0 1 ${round(right.x)} ${round(right.y)}`,
    `A ${round(rx)} ${round(ry)} ${rotation} 0 1 ${round(left.x)} ${round(left.y)}`,
    'Z',
  ].join(' ');
}

/**
 * The head is the one part that is not a capsule: it is a skin oval plus hair,
 * and in the top view the crown faces the camera so no skin shows at all
 * (CONTENT_MAP §5).
 */
function headShapes(solved: Solved, headView: HeadView, palette: CharacterPalette): Shape[] {
  const bone = BONE_BY_NAME.head;
  const head = solved.head;
  const centre = {
    x: (head.start.x + head.end.x) / 2,
    y: (head.start.y + head.end.y) / 2,
  };
  const rx = bone.widthStart / 2;
  const ry = bone.length / 2;
  const tilt = head.angle;
  // The head bone runs from the jaw to the crown, so `tilt` already points at
  // the crown. Screen rotation is the negated rig angle.
  const rotation = -tilt;

  if (headView === 'top') {
    // Crown to camera: one flat oval in the hair tone, no face, no skin.
    return [{ id: 'head', d: ellipse(centre, rx, rx * 1.08, rotation), fill: palette.hair.base }];
  }

  const skin: Shape = {
    id: 'head',
    d: ellipse(centre, rx, ry, rotation),
    fill: fillFor('head', 'near', palette),
  };

  // Hair sits over the crown, which is the direction the head bone points.
  // In profile it also swings back over the skull, which is what makes the
  // facing direction readable without any facial features.
  let hairCentre = step(centre, tilt, ry * 0.3);
  if (headView === 'side') hairCentre = step(hairCentre, tilt - 90, rx * 0.28);

  const hair: Shape = {
    id: 'hair',
    d: ellipse(hairCentre, rx * 1.04, ry * 0.66, rotation),
    fill: palette.hair.base,
  };

  return [skin, hair];
}

export interface RenderOptions {
  palette: CharacterPalette;
  view: View;
  /** Pale ellipse under the feet; omitted for lying and plank poses. */
  floorShadow?: boolean;
}

/** Solves a pose and returns its shapes in back-to-front draw order. */
export function renderPose(pose: Pose, options: RenderOptions): Shape[] {
  const { palette, view } = options;
  const solved = solve(pose, view);
  const shapes: Shape[] = [];

  if (options.floorShadow !== false) {
    const near = solved.footNear.end;
    const far = solved.footFar.end;
    const lowest = Math.max(near.y, far.y);
    const middle = (near.x + far.x) / 2;
    shapes.push({
      id: 'floorShadow',
      d: ellipse({ x: middle, y: lowest + 4 }, 58, 11),
      fill: palette.floorShadow,
    });
  }

  const headView: HeadView = pose.head ?? (view === 'top' ? 'top' : view === 'front' ? 'front' : 'side');

  for (const name of DRAW_ORDER) {
    if (name === 'head') {
      shapes.push(...headShapes(solved, headView, palette));
      continue;
    }

    const bone = BONE_BY_NAME[name];

    // A front-on figure has no far side to shade: both limbs face the camera.
    const depth = view === 'front' && bone.depth === 'far' && name !== 'neck' ? 'near' : bone.depth;

    shapes.push({
      id: name,
      d: capsule(bone, solved[name]),
      fill: fillFor(name, depth, palette),
    });
  }

  return shapes;
}

/**
 * A curved arrow behind the figure showing the direction of travel
 * (DESIGN §2.7). Still frames cannot show direction on their own, and a
 * looping animation is ambiguous without it.
 */
export interface MotionArc {
  /** Joint the arc wraps. */
  around: JointName;
  /** Sweep in degrees; the sign sets the direction the arrowhead points. */
  sweep: number;
  radius: number;
  /** Start of the sweep in degrees, 0 pointing down. */
  from?: number;
}

export function renderMotionArc(
  pose: Pose,
  arc: MotionArc,
  palette: CharacterPalette,
  view: View = 'front',
): Shape[] {
  const solved = solve(pose, view);
  const bone = solved[arc.around];
  const centre = { x: (bone.start.x + bone.end.x) / 2, y: (bone.start.y + bone.end.y) / 2 };

  const from = arc.from ?? 0;
  const to = from + arc.sweep;
  const start = step(centre, from, arc.radius);
  const end = step(centre, to, arc.radius);
  const round = (n: number) => Math.round(n * 10) / 10;
  const large = Math.abs(arc.sweep) > 180 ? 1 : 0;
  const sweepFlag = arc.sweep > 0 ? 0 : 1;

  const body: Shape = {
    id: 'motionArcBody',
    d: [
      `M ${round(start.x)} ${round(start.y)}`,
      `A ${round(arc.radius)} ${round(arc.radius * 0.42)} 0 ${large} ${sweepFlag} ${round(end.x)} ${round(end.y)}`,
    ].join(' '),
    fill: 'none',
    stroke: palette.motionArc,
    strokeWidth: 10,
    opacity: 0.55,
  };

  // Solid triangle at the leading end, tangent to the sweep.
  const tangent = to + (arc.sweep > 0 ? 90 : -90);
  const tip = step(end, tangent, 26);
  const left = step(end, tangent + 115, 14);
  const right = step(end, tangent - 115, 14);
  const head: Shape = {
    id: 'motionArcHead',
    d: `M ${round(tip.x)} ${round(tip.y)} L ${round(left.x)} ${round(left.y)} L ${round(right.x)} ${round(right.y)} Z`,
    fill: palette.motionArc,
    opacity: 0.55,
  };

  return [body, head];
}

export interface PropShape extends Shape {
  kind: 'prop';
}

/** Flat grey props drawn behind the character (CONTENT_MAP §5, ADR-042). */
export function renderProp(kind: 'wall' | 'chair' | 'doorway' | 'bottles' | 'floorLine'): PropShape[] {
  const prop = (id: string, d: string): PropShape => ({ kind: 'prop', id, d, fill: PROP_FILL });
  const rect = (x: number, y: number, w: number, h: number) =>
    `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;

  switch (kind) {
    case 'wall':
      return [prop('wall', rect(40, 40, 26, FLOOR_Y - 40))];
    case 'doorway':
      return [
        prop('doorwayLeft', rect(60, 60, 20, FLOOR_Y - 60)),
        prop('doorwayRight', rect(CANVAS - 80, 60, 20, FLOOR_Y - 60)),
        prop('doorwayTop', rect(60, 60, CANVAS - 140, 20)),
      ];
    case 'chair':
      return [
        prop('chairSeat', rect(CENTRE_X - 30, FLOOR_Y - 190, 180, 22)),
        prop('chairBack', rect(CENTRE_X + 128, FLOOR_Y - 330, 22, 140)),
        prop('chairLegFront', rect(CENTRE_X - 22, FLOOR_Y - 168, 16, 168)),
        prop('chairLegBack', rect(CENTRE_X + 128, FLOOR_Y - 168, 16, 168)),
      ];
    case 'bottles':
      return [
        prop('bottleNear', rect(CENTRE_X - 116, FLOOR_Y - 74, 26, 74)),
        prop('bottleFar', rect(CENTRE_X + 90, FLOOR_Y - 74, 26, 74)),
      ];
    case 'floorLine':
      return [prop('floorLine', rect(0, FLOOR_Y, CANVAS, 4))];
  }
}
