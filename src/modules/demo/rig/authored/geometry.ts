// Shared cubic paths: SVG previews and Lottie exports consume the same artwork.
export type Vec = [number, number];
export interface Outline {
  v: Vec[];
  i: Vec[];
  o: Vec[];
  c: boolean;
}
export interface Artwork {
  id: string;
  path: Outline;
  fill: string;
  opacity?: number;
}
export type Transform = (point: Vec) => Vec;

export const round = (n: number): number => Math.round(n * 10) / 10;
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
export const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];

/** Smooth closed silhouette through authored anatomical landmarks. */
export function contour(points: Vec[], tension = 0.16): Outline {
  const tangents = points.map((_, index): Vec => {
    const before = points[(index + points.length - 1) % points.length]!;
    const after = points[(index + 1) % points.length]!;
    return [(after[0] - before[0]) * tension, (after[1] - before[1]) * tension];
  });
  return {
    v: points,
    o: tangents,
    i: tangents.map(([x, y]) => [-x, -y]),
    c: true,
  };
}

/** Transforms handles as vectors, so translation never distorts the curves. */
export function transformPath(path: Outline, transform: Transform): Outline {
  const vertices = path.v.map(transform);
  const handles = (values: Vec[]): Vec[] =>
    values.map((handle, index) => {
      const end = transform(add(path.v[index]!, handle));
      const start = vertices[index]!;
      return [round(end[0] - start[0]), round(end[1] - start[1])];
    });
  return {
    v: vertices.map(([x, y]) => [round(x), round(y)]),
    i: handles(path.i),
    o: handles(path.o),
    c: path.c,
  };
}

/** Converts the exact exported cubic outline to an SVG path. */
export function svgPath(path: Outline): string {
  const point = (v: Vec): string => `${round(v[0])} ${round(v[1])}`;
  let d = `M ${point(path.v[0]!)}`;
  for (let index = 0; index < path.v.length; index++) {
    const next = (index + 1) % path.v.length;
    d += ` C ${point(add(path.v[index]!, path.o[index]!))} ${point(add(path.v[next]!, path.i[next]!))} ${point(path.v[next]!)}`;
  }
  return `${d} Z`;
}

/** Two-bone IK keeps the squat's ankle planted throughout the repetition. */
export function kneeBetween(hip: Vec, ankle: Vec, thigh = 112, shin = 108): Vec {
  const dx = ankle[0] - hip[0];
  const dy = ankle[1] - hip[1];
  const distance = Math.hypot(dx, dy);
  if (distance > thigh + shin || distance < Math.abs(thigh - shin)) {
    throw new Error('Unreachable squat contact');
  }
  const along = (thigh * thigh - shin * shin + distance * distance) / (2 * distance);
  const bend = Math.sqrt(Math.max(0, thigh * thigh - along * along));
  return [
    hip[0] + (dx * along + dy * bend) / distance,
    hip[1] + (dy * along - dx * bend) / distance,
  ];
}

/** A sculpted limb, with a fuller muscle belly and a narrower wrist/ankle. */
export function limb(start: Vec, end: Vec, upper: number, lower: number): Outline {
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
  const dx = (end[0] - start[0]) / length;
  const dy = (end[1] - start[1]) / length;
  const local = contour(
    [
      [0, -upper * 0.65],
      [-upper * 0.8, -upper * 0.3],
      [-upper, length * 0.18],
      [-upper * 0.85, length * 0.44],
      [-lower, length * 0.88],
      [-lower * 0.8, length],
      [0, length + lower * 0.65],
      [lower * 0.8, length],
      [lower, length * 0.82],
      [upper * 0.85, length * 0.35],
      [upper * 0.8, length * 0.04],
    ],
    0.13,
  );
  return transformPath(local, ([x, y]) => [start[0] - dy * x + dx * y, start[1] + dx * x + dy * y]);
}
