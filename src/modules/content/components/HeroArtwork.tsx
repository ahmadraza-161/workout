import { Image, StyleSheet } from 'react-native';
import { spacing } from '@/modules/core/theme';
import { HERO_IMAGES } from '../heroImages.generated';

const CHALLENGE_KEYS: Record<string, string> = {
  ch_full_body_challenge: 'full-body', ch_lose_weight_challenge: 'lose-weight',
  ch_lower_body_challenge: 'lower-body', ch_core_six_pack_challenge: 'core',
  ch_calisthenics_plan: 'calisthenics', ch_upper_body_challenge: 'upper-body',
  ch_beginner_start_challenge: 'beginner', ch_plank_challenge: 'plank',
  ch_push_up_challenge: 'push-up', ch_squat_challenge: 'squat',
  ch_flexibility_mobility_challenge: 'flexibility', ch_posture_stand_tall_challenge: 'posture',
};
export function challengeHeroKey(id: string) { return `challenge-${CHALLENGE_KEYS[id] ?? id}`; }
export function HeroArtwork({ id, portrait = false }: { id: string; portrait?: boolean }) {
  const source = HERO_IMAGES[id as keyof typeof HERO_IMAGES];
  return source ? <Image source={source} resizeMode="contain" style={[styles.image, portrait && styles.portrait]}
    accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" /> : null;
}
const styles = StyleSheet.create({ image: { position: 'absolute', top: spacing[0], bottom: spacing[0],
  left: spacing[0], right: spacing[0], width: undefined, height: undefined },
  portrait: { bottom: undefined, width: '100%', height: '170%' } });
