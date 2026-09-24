import { exportLottie } from './lottie';
import { PALETTES } from './palette';
import { BASE_POSES, type Pose } from './pose';
import { PROOF_EXERCISES } from './proof';
import { solve } from './render';
import { BONE_BY_NAME, CANVAS, type JointName } from './skeleton';

// The exporter writes a rig as parented layers with only rotation keyframed,
// so nothing in the JSON looks like the shapes the SVG renderer produces.
// These tests walk the exported transform hierarchy and check it lands the
// joints in the same places the rig solver does. Without that, a broken
// export would only show up as a wrong-looking animation on a phone.

const RAD = Math.PI / 180;

interface Layer {
  ind: number;
  nm: string;
  parent?: number;
  ks: {
    r: { a: number; k: unknown };
    p: { a: number; k: unknown };
  };
}

/** Reads a track's value at frame 0, whether it is static or keyframed. */
function valueAtStart(track: { a: number; k: unknown }): number[] {
  if (track.a === 0) {
    const value = track.k as number | number[];
    return Array.isArray(value) ? value : [value];
  }
  const keys = track.k as { s: number[] }[];
  return keys[0]!.s;
}

/**
 * Applies a Lottie layer chain the way a player would: each layer rotates and
 * translates within its parent's frame.
 */
function jointPosition(layers: Layer[], name: string): { x: number; y: number } {
  const byIndex = new Map(layers.map((layer) => [layer.ind, layer]));
  const chain: Layer[] = [];
  let current = layers.find((layer) => layer.nm === name);
  while (current) {
    chain.unshift(current);
    current = current.parent === undefined ? undefined : byIndex.get(current.parent);
  }

  let x = 0;
  let y = 0;
  let rotation = 0;

  for (const layer of chain) {
    const position = valueAtStart(layer.ks.p);
    const px = position[0]!;
    const py = position[1]!;
    // Lottie rotates clockwise on a y-down screen, which is the standard
    // matrix [cos -sin; sin cos]. Rotate the child's offset into the parent's
    // accumulated frame before adding this layer's own rotation.
    const radians = rotation * RAD;
    x += px * Math.cos(radians) - py * Math.sin(radians);
    y += px * Math.sin(radians) + py * Math.cos(radians);
    rotation += valueAtStart(layer.ks.r)[0]!;
  }

  return { x, y };
}

function exportOf(pose: Pose, view: 'front' | 'side' = 'front') {
  return exportLottie({
    name: 'test',
    poses: [pose],
    durationSeconds: 1,
    palette: PALETTES.a,
    view,
  });
}

describe('exportLottie', () => {
  it('produces one layer per bone', () => {
    const animation = exportOf(BASE_POSES.standing);
    expect(animation.layers).toHaveLength(16);
  });

  it('draws the far limbs first so they sit behind the torso', () => {
    const animation = exportOf(BASE_POSES.standing);
    const names = animation.layers.map((layer) => layer.nm);
    // Lottie paints the first layer on top, so the near arm must come before
    // the torso and the far arm after it.
    expect(names.indexOf('handNear')).toBeLessThan(names.indexOf('torso'));
    expect(names.indexOf('torso')).toBeLessThan(names.indexOf('upperArmFar'));
  });

  it('uses the canvas the rig is authored on', () => {
    const animation = exportOf(BASE_POSES.standing);
    expect(animation.w).toBe(CANVAS);
    expect(animation.h).toBe(CANVAS);
  });

  it.each<JointName>(['torso', 'head', 'upperArmNear', 'thighNear', 'footNear'])(
    'places %s where the rig solver does',
    (joint) => {
      const pose = BASE_POSES.standing;
      const animation = exportOf(pose);
      const fromLottie = jointPosition(animation.layers as unknown as Layer[], joint);
      const fromRig = solve(pose, 'front')[joint].start;

      expect(fromLottie.x).toBeCloseTo(fromRig.x, 1);
      expect(fromLottie.y).toBeCloseTo(fromRig.y, 1);
    },
  );

  it('places joints correctly for a rotated root, which plank poses rely on', () => {
    const pose = BASE_POSES.plank;
    const animation = exportOf(pose, 'side');
    const fromLottie = jointPosition(animation.layers as unknown as Layer[], 'handNear');
    const fromRig = solve(pose, 'side').handNear.start;

    expect(fromLottie.x).toBeCloseTo(fromRig.x, 1);
    expect(fromLottie.y).toBeCloseTo(fromRig.y, 1);
  });

  it('closes the loop so the animation does not jump at the end', () => {
    const exercise = PROOF_EXERCISES.find((item) => item.slug === 'squat')!;
    const animation = exportLottie({
      name: exercise.slug,
      poses: exercise.poses,
      durationSeconds: exercise.duration,
      palette: PALETTES.a,
      view: exercise.view,
    });

    const moving = animation.layers.find((layer) => layer.nm === 'thighNear')!;
    const keys = moving.ks.r.k as { t: number; s: number[] }[];
    expect(keys.length).toBeGreaterThan(2);
    expect(keys[0]!.s[0]).toBeCloseTo(keys[keys.length - 1]!.s[0]!, 5);
    expect(keys[keys.length - 1]!.t).toBe(animation.op);
  });

  it('keeps a still bone as a static value rather than a keyframe track', () => {
    const exercise = PROOF_EXERCISES.find((item) => item.slug === 'torso-twist')!;
    const animation = exportLottie({
      name: exercise.slug,
      poses: exercise.poses,
      durationSeconds: exercise.duration,
      palette: PALETTES.a,
      view: exercise.view,
    });

    // The legs never move in a torso twist, which is most of the size saving.
    const still = animation.layers.find((layer) => layer.nm === 'shinNear')!;
    expect(still.ks.r.a).toBe(0);
  });

  it('stays well inside the 40 KB budget for every proof exercise', () => {
    for (const exercise of PROOF_EXERCISES) {
      const json = JSON.stringify(
        exportLottie({
          name: exercise.slug,
          poses: exercise.poses,
          durationSeconds: exercise.duration,
          palette: PALETTES.a,
          view: exercise.view,
        }),
      );
      expect(json.length).toBeLessThan(40 * 1024);
    }
  });

  it('names every layer after its bone, which is the contract for replacing the art later', () => {
    const animation = exportOf(BASE_POSES.standing);
    for (const layer of animation.layers) {
      expect(BONE_BY_NAME[layer.nm as JointName]).toBeDefined();
    }
  });
});
