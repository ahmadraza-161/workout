import { Image, StyleSheet, View } from 'react-native';
import { BicepsFlexed, ShieldCheck, WifiOff } from 'lucide-react-native';

import { t } from '@/modules/core/i18n';
import { radius, sizes, spacing, useTheme } from '@/modules/core/theme';
import { Text } from '@/modules/core/ui';

export function OnboardingWelcome() {
  const { colors } = useTheme();
  return <View style={styles.content}>
    <View style={[styles.hero, { backgroundColor: colors.primaryTint }]}>
      <Image source={require('../../../../assets/images/branding/workoutstride-characters.png')}
        resizeMode="contain" accessible={false} style={styles.characters} />
    </View>
    <Text variant="h1">{t('onboarding.welcome')}</Text>
    <Text variant="title" tone="brand">{t('onboarding.headline')}</Text>
    <Text tone="secondary">{t('onboarding.welcomeBody')}</Text>
    <View style={styles.benefits}>
      {([['equipment', BicepsFlexed], ['offline', WifiOff], ['private', ShieldCheck]] as const).map(([key, Icon]) =>
        <View key={key} style={styles.benefit}>
          <Icon size={sizes.iconMd} color={colors.primary} />
          <Text variant="caption">{t(`onboarding.benefits.${key}`)}</Text>
        </View>)}
    </View>
    <Text variant="caption" tone="secondary">{t('onboarding.privacy')}</Text>
  </View>;
}

const styles = StyleSheet.create({
  content: { gap: spacing[4] },
  hero: { height: sizes.onboardingArt, borderRadius: radius.xxl, overflow: 'hidden', paddingTop: spacing[4] },
  characters: { width: '100%', height: '100%' },
  benefits: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
});
