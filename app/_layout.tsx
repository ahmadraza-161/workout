import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useDatabaseMigrations } from '@/modules/core/db';
import { t } from '@/modules/core/i18n';
import { fontFiles, spacing, ThemeProvider, useTheme } from '@/modules/core/theme';
import { AppStartupScreen, ErrorBoundary, Text } from '@/modules/core/ui';
import { ReminderLifecycle } from '@/modules/reminders';

// Keep native splash until the first branded startup frame is laid out.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  const migration = useDatabaseMigrations();
  const [bootComplete, setBootComplete] = useState(false);
  const splashHidden = useRef(false);
  const finishBoot = useCallback(() => setBootComplete(true), []);
  const showStartup = useCallback(() => {
    if (splashHidden.current) return;
    splashHidden.current = true;
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);
  // A font failure is not fatal: the app falls back to the system font.
  const ready = (fontsLoaded || fontError !== null) && (migration.success || migration.error !== undefined);

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        {!ready || !bootComplete ? <AppStartupScreen fontsReady={fontsLoaded || fontError !== null} fontsLoaded={fontsLoaded}
          storageReady={migration.success || migration.error !== undefined} onFinished={finishBoot} onLayout={showStartup} /> :
        <ThemeProvider>
          <BottomSheetModalProvider>
            <ErrorBoundary>{migration.error ? <DatabaseError /> : <RootStack />}</ErrorBoundary>
          </BottomSheetModalProvider>
        </ThemeProvider>}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ReminderLifecycle />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.page } }}>
        <Stack.Screen name="exercise/[id]" options={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }} />
      </Stack>
    </>
  );
}

// Data is never deleted silently when migrations fail (ARCHITECTURE §12).
function DatabaseError() {
  const { colors } = useTheme();
  return (
    <View style={[styles.error, { backgroundColor: colors.bg.plain }]}>
      <Text variant="h2">{t('errors.database.title')}</Text>
      <Text tone="secondary">{t('errors.database.body')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  error: { flex: 1, justifyContent: 'center', padding: spacing[6], gap: spacing[3] },
});
