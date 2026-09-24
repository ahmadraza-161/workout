import { Tabs } from 'expo-router';
import { ChartColumn, Compass, Timer, UserRound } from 'lucide-react-native';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '@/modules/core/i18n';
import { sizes, textStyleFor, useTheme } from '@/modules/core/theme';

// Bottom tab bar (DESIGN §4.6): 64 dp + safe area, active tab in brand blue.
export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const icon = (Icon: typeof Timer) =>
    function TabIcon({ color }: { color: ColorValue }) {
      // Tab colours come from our tokens, so they are always plain strings.
      return <Icon color={typeof color === 'string' ? color : colors.text.secondary} size={sizes.iconXl - 2} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: textStyleFor('captionSm'),
        tabBarStyle: {
          backgroundColor: colors.surface.default,
          borderTopColor: colors.line.divider,
          height: sizes.tabBar + insets.bottom,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen name="training" options={{ title: t('tabs.training'), tabBarIcon: icon(Timer) }} />
      <Tabs.Screen name="discover" options={{ title: t('tabs.discover'), tabBarIcon: icon(Compass) }} />
      <Tabs.Screen name="report" options={{ title: t('tabs.report'), tabBarIcon: icon(ChartColumn) }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings'), tabBarIcon: icon(UserRound) }} />
    </Tabs>
  );
}
