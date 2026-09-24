// Renders the proof poses to a standalone HTML page so the rig can be looked
// at without a phone or a dev server. Development aid only; nothing here ships.
//
// Run: node tools/rig/preview-html.mts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { PALETTES } from '../../src/modules/demo/rig/palette.ts';
import { BASE_POSES, samplePoseLoop } from '../../src/modules/demo/rig/pose.ts';
import { PROOF_EXERCISES } from '../../src/modules/demo/rig/proof.ts';
import { renderMotionArc, renderPose, renderProp, type Shape } from '../../src/modules/demo/rig/render.ts';
import { CANVAS } from '../../src/modules/demo/rig/skeleton.ts';

const OUT = join(import.meta.dirname, '..', '..', '.expo', 'rig-preview.html');
const FRAMES = 4;

function svg(shapes: Shape[], size: number): string {
  const paths = shapes
    .map(
      (shape) =>
        `<path d="${shape.d}" fill="${shape.fill}"` +
        (shape.stroke ? ` stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" stroke-linecap="round"` : '') +
        (shape.opacity !== undefined ? ` opacity="${shape.opacity}"` : '') +
        ' />',
    )
    .join('\n      ');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${CANVAS} ${CANVAS}">\n      ${paths}\n    </svg>`;
}

const sections = PROOF_EXERCISES.map((exercise) => {
  const palette = PALETTES.a;

  const frames = Array.from({ length: FRAMES }, (_, index) => {
    const pose = samplePoseLoop(exercise.poses, index / FRAMES);
    const shapes: Shape[] = [
      ...(exercise.props ?? []).flatMap((kind) => renderProp(kind)),
      ...(exercise.motionArc ? renderMotionArc(pose, exercise.motionArc, palette) : []),
      ...renderPose(pose, { palette, view: exercise.view, floorShadow: exercise.floorShadow }),
    ];
    return `<figure><figcaption>${index}</figcaption>${svg(shapes, 150)}</figure>`;
  }).join('\n    ');

  const variantB = svg(
    renderPose(exercise.poses[0]!, {
      palette: PALETTES.b,
      view: exercise.view,
      floorShadow: exercise.floorShadow,
    }),
    150,
  );

  return `<section>
    <h2>${exercise.name} <small>${exercise.view} · ${exercise.poses.length} key poses</small></h2>
    <p>${exercise.proves}</p>
    <div class="row">
    ${frames}
    <figure class="variant"><figcaption>Variant B</figcaption>${variantB}</figure>
    </div>
  </section>`;
}).join('\n  ');

// The base-pose library is checked first: every exercise starts from one of
// these, so a wrong base pose would be wrong 119 times.
const basePoses = Object.entries(BASE_POSES)
  .map(([name, pose]) => {
    const view = name === 'standing' ? 'front' : 'side';
    const shapes = renderPose(pose, {
      palette: PALETTES.a,
      view,
      floorShadow: name === 'standing',
    });
    return `<figure><figcaption>${name}</figcaption>${svg([...renderProp('floorLine'), ...shapes], 150)}</figure>`;
  })
  .join('\n    ');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Rig style proof</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 24px; background: #F8F8F8; color: #1D2025; }
  h1 { font-size: 26px; }
  h2 { font-size: 19px; margin-bottom: 4px; }
  small { font-weight: 400; color: #6B6B6B; }
  p { color: #6B6B6B; margin-top: 0; }
  .row { display: flex; flex-wrap: wrap; gap: 8px; }
  figure { margin: 0; background: #FAFAFA; border-radius: 12px; padding: 4px; }
  figure.variant { background: #EFF0F2; }
  figcaption { font-size: 11px; color: #949494; text-align: center; }
  section { margin-bottom: 32px; }
</style>
</head>
<body>
  <h1>Rig style proof</h1>
  <section>
    <h2>Base poses <small>every exercise starts from one of these</small></h2>
    <div class="row">
    ${basePoses}
    </div>
  </section>
  <p>Four evenly spaced frames of each loop, plus the same first pose in variant B.</p>
  ${sections}
</body>
</html>`;

writeFileSync(OUT, html, 'utf8');
console.log(`Wrote ${OUT}`);
