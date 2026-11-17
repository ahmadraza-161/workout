import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import catalog from '../../../tools/animations/video-candidates.json';
import coverage from '../../../tools/animations/coverage.generated.json';
import { EXERCISE_ANIMATIONS } from './animations.generated';
import { EXERCISE_VIDEOS } from './videos.generated';
import { getExercise } from './repository';

it('bundles local MP4s with source integrity and counts both media formats without duplicates', () => {
  for (const item of catalog as { exerciseId: string; slug: string; originalSha256: string }[]) {
    expect(getExercise(item.exerciseId)).toBeDefined();
    expect(EXERCISE_VIDEOS[item.exerciseId]).toBeDefined();
    expect(EXERCISE_ANIMATIONS[item.exerciseId]).toBeUndefined();
    const media = readFileSync(join(__dirname, '../../../assets/videos/exercises', `${item.slug}.mp4`));
    expect(media.toString('ascii', 4, 8)).toBe('ftyp');
    expect(createHash('sha256').update(media).digest('hex')).toBe(item.originalSha256);
  }
  const active = [...Object.keys(EXERCISE_ANIMATIONS), ...Object.keys(EXERCISE_VIDEOS)];
  expect(new Set(active).size).toBe(active.length);
  expect(coverage.animatedExerciseIds.slice().sort()).toEqual(active.sort());
  expect(coverage.animatedExerciseIds.length + coverage.remainingExerciseIds.length).toBe(coverage.totalExercises);
});
