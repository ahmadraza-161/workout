// The body outline the muscle map is drawn on (T2.13).
//
// One connected path, not a pile of ovals. A silhouette assembled from
// separate blobs does not read as a person however carefully the blobs are
// placed, because the eye follows the outline and a broken outline has none.
//
// Canvas is 240 x 560, head at the top, feet on the bottom edge.

export const WIDTH = 240;
export const HEIGHT = 560;
const MID = WIDTH / 2;

/** Mirrors a half-body outline about the centre line and closes it. */
function mirrored(half: [number, number][]): string {
  const right = half.map(([x, y]) => [MID + x, y] as [number, number]);
  const left = [...half].reverse().map(([x, y]) => [MID - x, y] as [number, number]);
  const all = [...right, ...left];

  const round = (value: number) => Math.round(value * 10) / 10;
  const points = all.map(([x, y]) => `${round(x)} ${round(y)}`);
  return `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;
}

/**
 * Half the body, from the top of the head down the right side to the right
 * foot, then back in to the centre line. Traced at roughly seven and a half
 * heads, the same proportions the exercise rig uses.
 */
const HALF: [number, number][] = [
  [0, 14], // crown
  [15, 20],
  [20, 40],
  [17, 60],
  [10, 72], // jaw
  [11, 82], // neck
  [26, 92], // trapezius slope
  [46, 104], // shoulder
  [56, 118], // deltoid
  [60, 150], // upper arm
  [58, 196], // elbow
  [56, 240], // forearm
  [52, 276], // wrist
  [44, 286], // hand
  [38, 276],
  [40, 238],
  [42, 196],
  [44, 150],
  [42, 120], // armpit, back up the inner arm
  [38, 128], // outer chest
  [42, 170], // ribs
  [36, 210], // waist
  [46, 248], // hip
  [50, 282], // outer thigh
  [46, 338],
  [40, 384], // knee
  [38, 420],
  [34, 462], // calf
  [24, 508], // ankle
  [30, 548], // foot
  [9, 552],
  [8, 512], // inner ankle, back up the inside of the leg
  [13, 462],
  [15, 420],
  [13, 384],
  [11, 338],
  [6, 292], // inner thigh, meeting the centre line at the crotch
];

export const SILHOUETTE = mirrored(HALF);

/**
 * Where each region of the body sits, so muscle shapes can be placed against
 * the outline instead of guessed at. All values are on the 240 x 560 canvas.
 */
export const LANDMARKS = {
  headCentre: { x: MID, y: 44 },
  neck: { y: 86 },
  shoulder: { y: 110, halfWidth: 48 },
  chest: { y: 140, halfWidth: 36 },
  waist: { y: 200, halfWidth: 32 },
  hip: { y: 246, halfWidth: 42 },
  knee: { y: 360 },
  ankle: { y: 496 },
  armOuter: 56,
  armInner: 40,
} as const;
