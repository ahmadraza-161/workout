import type { AnimationObject } from 'lottie-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { SegmentedControl } from '@/modules/core/ui';

import { EXERCISE_ANIMATIONS } from '../animations.generated';
import { EXERCISE_VIDEOS } from '../videos.generated';
import { ExerciseAnimationStage } from './ExerciseAnimationStage';
import { ExerciseImage } from './ExerciseImage';
import { ExerciseVideoStage } from './ExerciseVideoStage';

export interface ExerciseDemoProps {
  id: string;
  variant: 'guide' | 'player';
  playing?: boolean;
}

/** Use bundled movement demos where reviewed; all other exercises retain their pose. */
export function ExerciseDemo({ id, variant, playing = true }: ExerciseDemoProps) {
  const source = EXERCISE_ANIMATIONS[id];
  const video = EXERCISE_VIDEOS[id];
  return source || video !== undefined
    ? <SelectedExerciseDemo key={id} id={id} variant={variant} playing={playing} source={source} video={video} />
    : <ExerciseImage id={id} variant={variant} />;
}
function SelectedExerciseDemo({ id, variant, playing, source, video }: ExerciseDemoProps & {
  source?: AnimationObject; video?: number;
}) {
  const [preview, setPreview] = useState<'animation' | 'image'>('animation');
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <SegmentedControl options={[
          { value: 'animation', label: t('browseUi.animation') },
          { value: 'image', label: t('browseUi.image') },
        ]} value={preview} onChange={setPreview} appearance="primary" accessibilityLabel={t('browseUi.preview')} />
      </View>
      {preview === 'animation'
        ? video !== undefined
          ? <ExerciseVideoStage id={id} variant={variant} playing={playing} source={video} />
          : source ? <ExerciseAnimationStage id={id} variant={variant} playing={playing} source={source} />
            : <ExerciseImage id={id} variant={variant} />
        : <ExerciseImage id={id} variant={variant} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing[2] },
  controls: { paddingHorizontal: spacing[4] },
});
