import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, StyleSheet, Text as NativeText, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../i18n';
import { darkColors, lightColors, motion, radius, sizes, spacing, textStyleFor } from '../theme';

// Deliberately independent of ThemeProvider: stored preferences require migrations first.
export function AppStartupScreen({ fontsReady, fontsLoaded = fontsReady, storageReady, onFinished, onLayout }: {
  fontsReady: boolean; fontsLoaded?: boolean; storageReady: boolean; onFinished: () => void; onLayout: () => void;
}) {
  const dark = useColorScheme() === 'dark';
  const colors = dark ? darkColors : lightColors;
  const [progress] = useState(() => new Animated.Value(0));
  const [laidOut, setLaidOut] = useState(false);
  const [minimumVisible, setMinimumVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const finishedOnce = useRef(false);
  const value = 0.12 + (fontsReady ? 0.38 : 0) + (storageReady ? 0.5 : 0);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (active) setReduceMotion(enabled); })
      .catch(() => { if (active) setReduceMotion(false); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);
  useEffect(() => {
    if (!laidOut) return;
    // Start the short presentation window only after native splash is handed off.
    // Slow fonts/storage still hold the page beyond this minimum.
    const timer = setTimeout(() => setMinimumVisible(true), motion.startupMinVisible);
    return () => clearTimeout(timer);
  }, [laidOut]);
  useEffect(() => {
    if (!laidOut || reduceMotion === null) return;
    if (reduceMotion) {
      progress.setValue(value);
      return;
    }
    const animation = Animated.timing(progress, { toValue: value, duration: motion.duration.base, useNativeDriver: false });
    animation.start(({ finished }) => { if (finished && fontsReady && storageReady) setCompleted(true); });
    return () => animation.stop();
  }, [progress, value, fontsReady, storageReady, laidOut, reduceMotion]);
  useEffect(() => {
    if (minimumVisible && (reduceMotion || completed) && fontsReady && storageReady && !finishedOnce.current) {
      finishedOnce.current = true;
      onFinished();
    }
  }, [minimumVisible, completed, reduceMotion, fontsReady, storageReady, onFinished]);
  const font = (variant: 'h1' | 'body') => ({ ...textStyleFor(variant), ...(!fontsLoaded ? { fontFamily: undefined } : {}) });
  return <SafeAreaView testID="app-startup" onLayout={() => { setLaidOut(true); onLayout(); }} style={[styles.page, { backgroundColor: colors.bg.plain }]}>
    <StatusBar style={dark ? 'light' : 'dark'} />
    <View style={styles.brand}>
      <Image source={require('../../../../assets/images/splash-icon.png')} accessible={false} style={styles.logo} />
      <NativeText style={[font('h1'), styles.center, { color: colors.text.primary }]}>{Constants.expoConfig?.name ?? t('startup.title')}</NativeText>
      <NativeText style={[font('body'), styles.center, { color: colors.text.secondary }]}>{t('startup.body')}</NativeText>
    </View>
    <View style={styles.loading}>
      <View accessible accessibilityRole="progressbar" accessibilityLabel={t('startup.preparing')}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }} style={[styles.track, { backgroundColor: colors.line.divider }]}>
        <Animated.View style={[styles.line, { backgroundColor: colors.primary,
          width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
      <NativeText style={[font('body'), styles.center, { color: colors.text.secondary }]}>{t('startup.preparing')}</NativeText>
    </View>
  </SafeAreaView>;
}
const styles = StyleSheet.create({ page: { flex: 1, justifyContent: 'center', padding: spacing[8], gap: spacing[16] },
  brand: { alignItems: 'center', gap: spacing[5] }, logo: { width: sizes.startupLogo, height: sizes.startupLogo },
  center: { textAlign: 'center' }, loading: { width: '100%', maxWidth: sizes.contentMax, alignSelf: 'center', gap: spacing[4] },
  track: { height: spacing[1], borderRadius: radius.pill, overflow: 'hidden' }, line: { height: '100%' } });
