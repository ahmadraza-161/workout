import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { getActivePlan, selectPlan } from '@/modules/challenges';
import { ChallengeCard, getChallenge, getContentPack, HeroArtwork, challengeHeroKey, type Goal, type Level } from '@/modules/content';
import { t } from '@/modules/core/i18n';
import { challengeGradients, radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Button, Chip, GradientBackground, LevelText, Screen, StackHeader, Stepper, Tag, Text, Touchable } from '@/modules/core/ui';
import { getProfile, updateProfile } from '@/modules/profile';

import { recommendPlanId, toLevel } from '../plan';
import { homeStyles } from './HomeSections';
import { LEVEL_KEYS, openPlan } from './WelcomeHome';

const GOALS: Goal[] = ['keep_fit', 'build_muscle', 'burn_fat', 'flexibility'];
const LEVELS: Level[] = [1, 2, 3];

/** Customize: goal and level pick the plan; any plan can still be opened from the list. */
export function PlanScreen() {
  const { colors } = useTheme();
  const [loaded] = useState(() => { try { return { profile: getProfile(), active: getActivePlan() }; } catch { return null; } });
  const profile = loaded?.profile;
  const active = loaded?.active ?? null;
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'keep_fit');
  const [level, setLevel] = useState<Level>(toLevel(profile?.level));
  const [days, setDays] = useState(profile?.daysPerWeekTarget ?? 4);
  const [failed, setFailed] = useState(loaded === null);
  const recommended = getChallenge(recommendPlanId(goal, level))!;
  const current = active?.challengeId === recommended.id;

  function apply(): void {
    try {
      if (profile) updateProfile({ gender: profile.gender ?? 'unspecified', goal, level, heightCm: profile.heightCm, weightKg: profile.weightKg,
        birthYear: profile.birthYear, daysPerWeekTarget: days });
      if (!selectPlan(recommended.id)) throw new Error('Unknown plan');
      router.back();
    } catch { setFailed(true); }
  }
  function choose(): void {
    if (!active || current) { apply(); return; }
    Alert.alert(t('home.switchTitle'), t('home.switchBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('home.switch'), onPress: apply },
    ]);
  }

  return <Screen background="plain" scroll><View style={homeStyles.content}>
    <StackHeader title={t('home.planScreenTitle')} onBack={() => router.back()} />
    <Text tone="secondary">{t('home.planScreenBody')}</Text>
    <View style={homeStyles.stack}>
      <Text variant="h3">{t('home.goal')}</Text>
      <View style={styles.chips}>{GOALS.map((option) => <Chip key={option} label={t(`onboarding.goal.${option}`)}
        selected={goal === option} onPress={() => setGoal(option)} />)}</View>
    </View>
    <View style={homeStyles.stack}>
      <Text variant="h3">{t('home.level')}</Text>
      <View style={styles.chips}>{LEVELS.map((option) => <Chip key={option} label={t(`level.${LEVEL_KEYS[option]}`)}
        selected={level === option} onPress={() => setLevel(option)} />)}</View>
    </View>
    <Stepper label={t('home.weeklyGoal')} value={days} onChange={setDays} min={1} max={7} />
    <View style={homeStyles.stack}>
      <Text variant="h3">{t('home.recommended')}</Text>
      <ChallengeCard challenge={recommended} featured footer={<Button variant="cardCta"
        label={t(current ? 'home.continuePlan' : 'home.usePlan')} onPress={choose} />} />
      {failed ? <Text accessibilityRole="alert" style={{ color: colors.semantic.errorText }}>{t('errors.generic.title')}</Text> : null}
    </View>
    <View style={homeStyles.stack}>
      <Text variant="h3">{t('home.allPlans')}</Text>
      {getContentPack().challenges.map((plan) => <Touchable key={plan.id} onPress={() => openPlan(plan.id)}
        accessibilityRole="button" accessibilityLabel={t(plan.titleKey)}
        style={[styles.row, { backgroundColor: colors.surface.row }]}>
        <View style={styles.art}>
          <GradientBackground stops={challengeGradients[plan.gradient]} angle={135} />
          <HeroArtwork id={challengeHeroKey(plan.id)} />
        </View>
        <View style={styles.grow}>
          <Text variant="title" numberOfLines={2}>{t(plan.titleKey)}</Text>
          <Text variant="caption" tone="secondary">{t('home.planRowMeta', { days: plan.days, minutes: plan.dailyMinutes })}</Text>
          <LevelText level={plan.level} />
          {active?.challengeId === plan.id ? <Tag label={t('home.currentPlan')} cardRadius={radius.md} /> : null}
        </View>
        <ChevronRight size={sizes.iconMd} color={colors.text.tertiary} />
      </Touchable>)}
    </View>
  </View></Screen>;
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[3], borderRadius: radius.lg },
  art: { width: sizes.thumbSm + spacing[4], height: sizes.thumbSm + spacing[4], borderRadius: radius.md, overflow: 'hidden' },
  grow: { flex: 1, gap: spacing[1] },
});
