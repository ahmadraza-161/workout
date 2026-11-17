import type { ComponentType, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, spacing, useTheme } from '../theme';
import { Card } from './Card';
import { Divider } from './Divider';
import { MetaCell } from './MetaCell';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Grouped cards from DESIGN §4.3: the Report summary card and the settings
// groups. Both are a white card holding a repeated child.

export interface StatCardProps {
  stats: { icon: ComponentType<{ size?: number; color?: string }>; value: string; label: string }[];
}

/** Report summary: three icon-value-label columns in one card. */
export function StatCard({ stats }: StatCardProps) {
  return (
    <Card>
      <View style={styles.statRow}>
        {stats.map((stat) => (
          <MetaCell key={stat.label} {...stat} layout="stat" />
        ))}
      </View>
    </Card>
  );
}

export interface SettingsRow {
  key: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value?: string;
  onPress: () => void;
}

/** Settings group: white card, icon tile, label, optional value, chevron. */
export function SettingsGroup({ rows }: { rows: SettingsRow[] }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.group, { backgroundColor: colors.surface.default }]}>
      {rows.map((row, index) => (
        <View key={row.key}>
          {index > 0 ? <Divider inset={spacing[4] + 36 + spacing[3]} /> : null}
          <Touchable onPress={row.onPress} accessibilityLabel={row.label}>
            <View style={styles.settingsRow}>
              <View style={[styles.iconTile, { backgroundColor: colors.primarySoft }]}>
                <row.icon size={20} color={colors.primary} />
              </View>
              <Text variant="title" style={styles.grow} numberOfLines={1}>
                {row.label}
              </Text>
              {row.value ? (
                <Text variant="caption" tone="secondary">
                  {row.value}
                </Text>
              ) : null}
              <ChevronRight size={20} color={colors.text.secondary} />
            </View>
          </Touchable>
        </View>
      ))}
    </View>
  );
}

/** Achievement badge: 72 dp circle, greyed out until unlocked. */
export function AchievementBadge({
  name,
  icon: Icon,
  unlocked,
  gradientChild,
  statusLabel,
}: {
  name: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  unlocked: boolean;
  gradientChild?: ReactNode;
  statusLabel?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={styles.badge}
      accessible
      accessibilityLabel={statusLabel ? `${name}, ${statusLabel}` : name}
    >
      <View
        style={[
          styles.badgeCircle,
          { backgroundColor: unlocked ? colors.primaryFill : colors.surface.muted },
        ]}
      >
        {unlocked ? gradientChild : null}
        <Icon size={32} color={unlocked ? colors.onPrimary : colors.text.tertiary} />
      </View>
      <Text variant="captionSm" numberOfLines={2} style={styles.badgeName}>
        {name}
      </Text>
    </View>
  );
}

/** Discover category hero: dark band with the title and description. */
export function CategoryHero({
  title,
  description,
  back,
  artwork,
}: {
  title: string;
  description: string;
  back?: ReactNode;
  artwork?: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.hero, { backgroundColor: colors.surface.categoryHero }]}>
      {artwork ? <View style={styles.heroArt} pointerEvents="none">{artwork}</View> : null}
      {back}
      <Text variant="cardTitle" style={styles.onHero}>
        {title}
      </Text>
      <Text variant="body" style={styles.onHero}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row' },
  group: { borderRadius: radius.lg, overflow: 'hidden' },
  settingsRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  iconTile: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1 },
  badge: { width: 88, alignItems: 'center', gap: spacing[2] },
  badgeCircle: { width: 72, height: 72, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  badgeName: { textAlign: 'center' },
  hero: { minHeight: sizes.categoryHero, padding: spacing[5], gap: spacing[2], overflow: 'hidden' },
  heroArt: { position: 'absolute', top: 0, bottom: 0, right: 0, width: '44%' },
  // The hero band is dark in both themes.
  onHero: { color: '#FFFFFF', width: '58%' },
});
