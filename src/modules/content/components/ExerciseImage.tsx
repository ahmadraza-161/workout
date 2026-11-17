import { Dumbbell } from 'lucide-react-native';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { artworkLayout, radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, Text, Thumb, type ThumbSize } from '@/modules/core/ui';

import { getExerciseImage } from '../media';
import { getExercise } from '../repository';

export function ExerciseImage({ id, variant = 'stage', thumbSize = 'md' }: {
  id: string;
  variant?: 'stage' | 'guide' | 'player' | 'thumb' | 'art' | 'card';
  thumbSize?: ThumbSize;
}) {
  const { colors } = useTheme();
  const [failedId, setFailedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const source = getExerciseImage(id);
  const failed = source === null || failedId === id;
  const label = t(getExercise(id)?.nameKey ?? 'browse.imagePending');
  const content = failed ? (
    <View style={styles.fallback}>
      <Dumbbell size={variant === 'thumb' ? sizes.iconLg : sizes.iconXl} color={colors.text.tertiary} />
      {variant === 'stage' || variant === 'guide' || variant === 'player' ? <>
        <Text tone="secondary">{t('browse.imagePending')}</Text>
        {source !== null ? <Button label={t('errors.generic.retry')} variant="secondary" onPress={() => {
          setFailedId(null);
          setAttempt((value) => value + 1);
        }} /> : null}
      </> : null}
    </View>
  ) : (
    <View style={[styles.frame, variant === 'thumb' ? styles.thumbFrame : variant === 'card' ? styles.cardFrame
      : variant === 'player' || variant === 'stage' ? styles.stageFrame : variant === 'guide' ? styles.guideFrame : styles.poseFrame]}>
    <Image key={`${id}-${attempt}`} source={source} style={styles.image} resizeMode="contain" fadeDuration={0}
      resizeMethod="resize" accessible={variant === 'stage'} accessibilityLabel={label}
      onError={() => setFailedId(id)} />
    </View>
  );

  if (variant === 'thumb') return <Thumb size={thumbSize} stage>{content}</Thumb>;
  if (variant === 'art' || variant === 'card') return <View style={styles.art}>{content}</View>;
  return (
    <View style={[variant === 'player' ? styles.playerStage : variant === 'guide' ? styles.guideStage : styles.stage,
      { backgroundColor: colors.surface.stage }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  art: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden', borderRadius: radius.md },
  stage: { width: '100%', aspectRatio: 3 / 4, borderRadius: radius.lg, overflow: 'hidden' },
  guideStage: { width: '100%', aspectRatio: 3 / 2, borderRadius: radius.lg, overflow: 'hidden' },
  playerStage: { width: '100%', aspectRatio: 5 / 4, borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  frame: { width: '100%', height: '100%' },
  thumbFrame: { padding: artworkLayout.pose.thumbInset },
  poseFrame: { padding: artworkLayout.pose.artInset },
  stageFrame: { padding: artworkLayout.pose.stageInset },
  guideFrame: { padding: artworkLayout.pose.guideInset },
  cardFrame: { padding: artworkLayout.pose.artInset, paddingBottom: artworkLayout.card.bottomInset },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[2] },
});
