import { Image, StyleSheet, View } from 'react-native';

import { artworkLayout, spacing } from '@/modules/core/theme';
import { Thumb, type ThumbSize } from '@/modules/core/ui';

const SOURCES = {
  trainer: require('../../../../assets/images/characters/optimized/male-trainer.png'),
  plank: require('../../../../assets/images/characters/optimized/male-plank.png'),
  squat: require('../../../../assets/images/characters/optimized/male-squat.png'),
  mixed: require('../../../../assets/images/characters/optimized/trainers-mixed.png'),
  female: require('../../../../assets/images/characters/optimized/female-trainer.png'),
};

/** Decorative browse artwork. Exercise instructions retain their actual pose. */
export function CharacterArtwork({ pose = 'trainer', variant = 'hero', thumbSize = 'lg' }: {
  pose?: keyof typeof SOURCES; variant?: 'hero' | 'banner' | 'card' | 'thumb';
  thumbSize?: ThumbSize;
}) {
  const art = <View style={[styles.frame, variant === 'card' ? styles.card : undefined,
    variant === 'thumb' ? styles.thumb : undefined]} pointerEvents="none">
    <Image source={SOURCES[pose]} resizeMode="contain" fadeDuration={0}
      accessible={false} style={styles.image} />
  </View>;
  return variant === 'thumb' ? <Thumb size={thumbSize}>{art}</Thumb> : art;
}

const styles = StyleSheet.create({
  frame: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, padding: spacing[1] },
  image: { width: '100%', height: '100%' },
  thumb: { padding: artworkLayout.pose.thumbInset },
  card: { paddingBottom: artworkLayout.card.bottomInset },
});
