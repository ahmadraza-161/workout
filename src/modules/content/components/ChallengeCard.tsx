import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { Clock, Dumbbell, House, Target } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, GradientCard, MetaCell, Text } from '@/modules/core/ui';

import type { Challenge } from '../types';
import { HeroArtwork, challengeHeroKey } from './HeroArtwork';

export function ChallengeCard({ challenge, featured = false, width, footer, compact = false }: {
  challenge: Challenge; featured?: boolean; width?: number; footer?: ReactNode; compact?: boolean;
}) {
  const { colors } = useTheme();
  return <GradientCard title={t(challenge.titleKey)} gradient={challenge.gradient} width={width}
    compact={compact} height={compact ? sizes.trainingChallengeCard : undefined}
    tag={featured ? t('browseUi.forYourGoal') : undefined} eyebrow={featured && compact ? undefined : t('browse.days', { count: challenge.days })}
    artwork={<HeroArtwork id={challengeHeroKey(challenge.id)} />}
    footer={footer ?? <Button variant="cardCta" label={t('browseUi.viewPlan')} onPress={() => router.push({ pathname: '/challenge/[id]', params: { id: challenge.id } })} />}>
    {featured ? <View style={styles.grid}>
      <View style={styles.row}><MetaCell compact={compact} icon={Clock} value={challenge.dailyMinutes} label={t('browseUi.dailyMinutes')} />
        <MetaCell compact={compact} icon={Dumbbell} value={t(`level.${challenge.level === 1 ? 'beginner' : challenge.level === 2 ? 'intermediate' : 'advanced'}`)} label={t('browseUi.level')} /></View>
      <View style={styles.row}><MetaCell compact={compact} icon={Target} value={t(`training.focus.${challenge.bodyFocus}`)} label={t('browseUi.focus')} />
        <MetaCell compact={compact} icon={House} value={t('browseUi.homeWorkout')} label={t('browseUi.location')} /></View>
    </View> : <Text variant="caption" style={{ color: colors.onPrimary }}>{t(challenge.descKey)}</Text>}
  </GradientCard>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing[3] }, grid: { gap: spacing[3], marginTop: spacing[2], minHeight: sizes.thumbLg } });
