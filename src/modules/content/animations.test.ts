import { EXERCISE_ANIMATIONS, EXERCISE_ANIMATION_PLAYBACK } from './animations.generated';
import { getExercise } from './repository';
import provenance from '../../../assets/lottie/imported/provenance.json';
import notices from '../../../assets/data/notices.generated.json';
import catalog from '../../../tools/animations/catalog.json';

it('bundles each licensed catalog mapping exactly once without external dependencies or canvas backgrounds', () => {
  expect(Object.keys(EXERCISE_ANIMATIONS).sort()).toEqual(catalog.map((item) => item.exerciseId).sort());
  expect(new Set(catalog.map((item) => item.exerciseId)).size).toBe(catalog.length);
  expect(new Set(catalog.map((item) => item.slug)).size).toBe(catalog.length);
  expect(provenance).toHaveLength(catalog.length);
  for (const [id, animation] of Object.entries(EXERCISE_ANIMATIONS)) {
    expect(getExercise(id)).toBeDefined();
    expect(['none', 'household']).toContain(getExercise(id)?.equipment);
    expect(animation.layers.length).toBeGreaterThan(0);
    expect(animation.fr).toBeGreaterThan(0);
    expect(animation.op).toBeGreaterThan(animation.ip);
    const json = JSON.stringify(animation);
    expect(json).not.toMatch(/https?:|"u":"[^\"]+"/);
    expect(animation.layers.some((layer: { ty: number }) => layer.ty === 1)).toBe(false);
    for (const asset of animation.assets) {
      expect(asset.layers?.some((layer: { ty: number }) => layer.ty === 1)).not.toBe(true);
      if (asset.p) {
        expect(asset.p).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/);
        expect(Buffer.from(asset.p.split(',')[1]!, 'base64').subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      }
    }
    const credit = provenance.find((item) => item.exerciseId === id)!;
    expect(['Dinh Bui Xuan', 'saagar shrestha', 'Brian Karungani', 'Dima Oris',
      'Unnamed LottieFiles contributor (a848f9e4)', 'Blinix Solutions', 'Bashir Ahmad', 'Indrum', 'Ajay Gupta']).toContain(credit.creator);
    expect(credit.originalSha256).toMatch(/^[a-f0-9]{64}$/);
    const notice = notices.notices.find((item) => item.name === `${credit.creator} — ${credit.title}`)!;
    expect(notice.source).toBe(credit.page);
    expect(notices.texts[notice.texts[0]!]).toContain('Lottie Simple License');
  }
});

it('removes only the reviewed decorative caption from the donkey-kick demo', () => {
  const demo = EXERCISE_ANIMATIONS.ex_donkey_kick!;
  expect(demo.layers.some((layer: { nm?: string }) => layer.nm === 'text')).toBe(false);
  expect(demo.layers.some((layer: { nm?: string }) => layer.nm === 'body')).toBe(true);
  expect(provenance.find((item) => item.exerciseId === 'ex_donkey_kick')?.removedLabels).toEqual(['text']);
});

it('keeps the russian-twist legs fixed while the original torso rotates', () => {
  const demo = EXERCISE_ANIMATIONS.ex_russian_twist!;
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_russian_twist).toBeUndefined();
  expect([demo.ip, demo.op, demo.fr]).toEqual([0, 195, 60]);
  for (const name of ['hips', 'thigh', 'thigh_1', 'calf', 'calf_1', 'foot', 'foot_1']) {
    const layer = demo.layers.find((entry: { nm?: string }) => entry.nm === name);
    expect(layer.ks.r.a).toBe(0);
    expect(layer.ks.p.a).toBe(0);
    expect(JSON.stringify(layer.shapes)).not.toContain('"a":1');
  }
  const torso = demo.layers.find((entry: { nm?: string }) => entry.nm === 'body_skin');
  expect(JSON.stringify(torso.shapes)).toContain('"a":1');
  const original = require('../../../tools/animations/source/russian-twists.json');
  expect(demo.layers).toEqual(original.layers);
});

it('maps the reviewed standing-squat asset by its actual movement rather than its misleading source title', () => {
  expect(catalog.find((item) => item.slug === 'sit-up')?.exerciseId).toBe('ex_bodyweight_squat');
  expect(EXERCISE_ANIMATIONS.ex_sit_up).toBeUndefined();
  expect(EXERCISE_ANIMATIONS.ex_reverse_crunch).toBeUndefined();
});

it('keeps cobra as a single rise into the held position rather than a bouncing loop', () => {
  const segment = EXERCISE_ANIMATION_PLAYBACK.ex_cobra_stretch!;
  const source = EXERCISE_ANIMATIONS.ex_cobra_stretch!;
  expect(getExercise('ex_cobra_stretch')?.type).toBe('hold');
  expect(segment).toEqual({ startFrame: 40, endFrame: 60, loop: false });
  expect(segment.startFrame).toBeGreaterThanOrEqual(source.ip);
  expect(segment.endFrame).toBeLessThan(source.op);
});

it('stops the standing forward fold before the original source starts walking the hands', () => {
  const demo = EXERCISE_ANIMATIONS.ex_standing_forward_fold!;
  expect(getExercise('ex_standing_forward_fold')?.type).toBe('hold');
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_standing_forward_fold).toEqual({ startFrame: 0, endFrame: 24, loop: false });
  expect(demo).toEqual(EXERCISE_ANIMATIONS.ex_inchworm_walkout);
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_inchworm_walkout).toBeUndefined();
  const credit = provenance.find((item) => item.exerciseId === 'ex_standing_forward_fold')!;
  expect(credit.originalSha256).toBe(provenance.find((item) => item.exerciseId === 'ex_inchworm_walkout')?.originalSha256);
});

it('holds the reviewed neck side tilt without substituting lateral tilts for neck rolls', () => {
  const demo = EXERCISE_ANIMATIONS.ex_neck_side_stretch!;
  expect(getExercise('ex_neck_side_stretch')?.type).toBe('hold');
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_neck_side_stretch).toEqual({ startFrame: 0, endFrame: 60, loop: false });
  const head = demo.layers.find((layer: { nm?: string }) => layer.nm === 'Path 121');
  expect(head.ks.r.k.find((key: { t: number }) => key.t === 60).s).toEqual([-19]);
  expect(EXERCISE_ANIMATIONS.ex_neck_rolls).toBeUndefined();
  const original = require('../../../tools/animations/source/neck-side-stretch-indrum.json');
  expect(demo.layers).toEqual(original.layers);
});

it('stops the rotating forearm-plank source at the reviewed side hold', () => {
  const demo = EXERCISE_ANIMATIONS.ex_side_plank_each_side!;
  expect(getExercise('ex_side_plank_each_side')?.type).toBe('hold');
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_side_plank_each_side).toEqual({ startFrame: 1, endFrame: 35, loop: false });
  expect([demo.w, demo.h]).toEqual([985, 700]);
  const original = require('../../../tools/animations/source/side-plank-hold-ajay.json');
  expect(demo.assets).toEqual(original.assets);
  for (const layer of demo.layers) {
    const source = original.layers.find((entry: { ind: number }) => entry.ind === layer.ind);
    expect(layer.shapes).toEqual(source.shapes);
    expect(layer.ks.r).toEqual(source.ks.r);
    expect(layer.ks.p.k).toEqual([source.ks.p.k[0], source.ks.p.k[1] - 100, source.ks.p.k[2]]);
  }
});

it('preserves alternating thigh lifts in the high-knees demo', () => {
  const demo = EXERCISE_ANIMATIONS.ex_high_knees!;
  const left = demo.layers.find((layer: { nm?: string }) => layer.nm === 'upper left leg Outlines');
  const right = demo.layers.find((layer: { nm?: string }) => layer.nm === 'upper right leg Outlines');
  expect(left.ks.r.a).toBe(1);
  expect(right.ks.r.a).toBe(1);
  expect(left.ks.r.k.find((key: { t: number }) => key.t === 15).s).toEqual([63]);
  expect(right.ks.r.k.find((key: { t: number }) => key.t === 0).s).toEqual([69]);
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_high_knees).toBeUndefined();
});

it('plays only a single shallow entry for push-up hold and shares walkout only for equivalent movement', () => {
  const demo = EXERCISE_ANIMATIONS.ex_push_up_hold!;
  const segment = EXERCISE_ANIMATION_PLAYBACK.ex_push_up_hold!;
  expect(getExercise('ex_push_up_hold')?.type).toBe('hold');
  expect(segment).toEqual({ startFrame: 2, endFrame: 10, loop: false });
  expect(segment.startFrame).toBeGreaterThanOrEqual(demo.ip);
  expect(segment.endFrame).toBeLessThan(demo.op);
  expect(demo).toEqual(EXERCISE_ANIMATIONS.ex_standard_push_up);
  expect(EXERCISE_ANIMATIONS.ex_plank_walkout).toEqual(EXERCISE_ANIMATIONS.ex_inchworm_walkout);
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_plank_walkout).toBeUndefined();
  expect(EXERCISE_ANIMATIONS.ex_shadow_boxing).toEqual(EXERCISE_ANIMATIONS.ex_punches);
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_shadow_boxing).toBeUndefined();
});

it('enters the forearm plank once and frames the original character without unused canvas', () => {
  const demo = EXERCISE_ANIMATIONS.ex_forearm_plank!;
  expect(getExercise('ex_forearm_plank')?.type).toBe('hold');
  expect(EXERCISE_ANIMATION_PLAYBACK.ex_forearm_plank).toEqual({ startFrame: 0, endFrame: 15, loop: false });
  expect([demo.w, demo.h]).toEqual([940, 340]);
  const original = require('../../../tools/animations/source/forearm-plank-blinix.json');
  for (const layer of demo.layers) {
    const source = original.layers.find((entry: { ind: number }) => entry.ind === layer.ind);
    expect(layer.shapes).toEqual(source.shapes);
    expect(layer.ks.r).toEqual(source.ks.r);
    const offset = layer.parent === undefined ? [90, 600] : [0, 0];
    expect(layer.ks.p.k.slice(0, 2)).toEqual(source.ks.p.k.slice(0, 2).map((n: number, i: number) => n - offset[i]!));
  }
});
