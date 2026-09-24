import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useDatabaseMigrations } from '@/modules/core/db';
import { t } from '@/modules/core/i18n';
import { fontFiles, spacing, ThemeProvider, useTheme } from '@/modules/core/theme';
import { ErrorBoundary, Text } from '@/modules/core/ui';

// Keep the splash screen up until fonts and the database are ready (ARCHITECTURE §7.1).
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  const migration = useDatabaseMigrations();
  // A font failure is not fatal: the app falls back to the system font.
  const ready = (fontsLoaded || fontError !== null) && (migration.success || migration.error !== undefined);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <ErrorBoundary>{migration.error ? <DatabaseError /> : <RootStack />}</ErrorBoundary>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.page } }} />
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
