// Generates the front and back muscle maps (T2.13, ADR-043, ADR-055).
//
// The shapes come from react-native-body-highlighter's path data, vendored
// under MIT into ./vendor. Only the data is used, not the component: the app
// needs per-muscle paths it can recolour, and an earlier attempt to draw them
// from scratch produced a figure that did not read as a body.
//
// One named group per muscle, so the exercise guide can light up the ones an
// exercise works: strong for primary, faint for secondary, grey otherwise
// (DESIGN §4.4). Colours stay as CSS custom properties, so the map recolours
// for dark mode and per exercise without regenerating anything.

import { MUSCLE_GROUPS, type MuscleGroup } from '../content/metrics.ts';
import { BODYBACK } from './vendor/body-back.ts';
import { BODYFRONT } from './vendor/body-front.ts';

export type MapView = 'front' | 'back';

/**
 * Both views share one coordinate space in the source data, so each view is
 * framed by its own viewBox rather than by moving any path.
 */
export const VIEW_BOX: Record<MapView, string> = {
  front: '30 150 640 1210',
  back: '765 150 640 1210',
};

export interface MusclePath {
  muscle: MuscleGroup;
  d: string;
}

interface VendorPart {
  slug: string;
  path?: { left?: string[]; right?: string[] };
}

/**
 * Our 19 groups against the source's slugs (ADR-043).
 *
 * Two are approximations, because the source does not separate them:
 *   lats          -> the back's upper-back shape, which covers the same area
 *   hip_flexors   -> the front's adductors, the nearest thing it draws
 * Both are noted in DOC/LICENSES.md so the guide is not read as more precise
 * than it is.
 */
const SLUGS: Record<MuscleGroup, { front?: string; back?: string }> = {
  neck: { front: 'neck', back: 'neck' },
  traps: { front: 'trapezius', back: 'trapezius' },
  deltoids: { front: 'deltoids' },
  rear_deltoids: { back: 'deltoids' },
  chest: { front: 'chest' },
  biceps: { front: 'biceps' },
  triceps: { front: 'triceps', back: 'triceps' },
  forearms: { front: 'forearm', back: 'forearm' },
  upper_back: { back: 'upper-back' },
  lats: { back: 'upper-back' },
  erector_spinae: { back: 'lower-back' },
  abs: { front: 'abs' },
  obliques: { front: 'obliques' },
  hip_flexors: { front: 'adductors' },
  glutes: { back: 'gluteal' },
  adductors: { front: 'adductors', back: 'adductors' },
  quads: { front: 'quadriceps' },
  hamstrings: { back: 'hamstring' },
  calves: { front: 'calves', back: 'calves' },
};

/** Muscles the source does not draw separately, so the map approximates them. */
export const APPROXIMATED: MuscleGroup[] = ['lats', 'hip_flexors'];

const SOURCE: Record<MapView, VendorPart[]> = {
  front: BODYFRONT as VendorPart[],
  back: BODYBACK as VendorPart[],
};

/** Both sides of a muscle joined into one path, since they highlight together. */
function pathFor(view: MapView, slug: string): string | undefined {
  const part = SOURCE[view].find((entry) => entry.slug === slug);
  if (!part?.path) return undefined;
  const shapes = [...(part.path.left ?? []), ...(part.path.right ?? [])];
  return shapes.length > 0 ? shapes.join(' ') : undefined;
}

export function musclePaths(view: MapView): MusclePath[] {
  return MUSCLE_GROUPS.map((muscle) => {
    const slug = SLUGS[muscle][view];
    const d = slug === undefined ? undefined : pathFor(view, slug);
    return d === undefined ? undefined : { muscle, d };
  }).filter((path): path is MusclePath => path !== undefined);
}

/** The body outline the muscles sit on: everything the source is not colouring. */
const BODY_SLUGS = ['head', 'hair', 'hands', 'feet', 'ankles', 'knees', 'tibialis'];

export function bodyPaths(view: MapView): string[] {
  return BODY_SLUGS.map((slug) => pathFor(view, slug)).filter((d): d is string => d !== undefined);
}

/** Every muscle has to appear on at least one view, or the guide cannot show it. */
export function coverage(): { muscle: MuscleGroup; views: MapView[] }[] {
  return MUSCLE_GROUPS.map((muscle) => ({
    muscle,
    views: (['front', 'back'] as MapView[]).filter((view) =>
      musclePaths(view).some((path) => path.muscle === muscle),
    ),
  }));
}

export function toSvg(view: MapView): string {
  const body = bodyPaths(view)
    .map((d) => `  <path d="${d}" fill="var(--muscle-body, #E4E4E8)" />`)
    .join('\n');

  const muscles = musclePaths(view)
    .map((path) => `  <path id="${path.muscle}" d="${path.d}" fill="var(--muscle-${path.muscle}, #C7C7CC)" />`)
    .join('\n');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX[view]}">`,
    body,
    muscles,
    '</svg>',
  ].join('\n');
}
