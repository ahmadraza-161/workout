import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '../theme';
import { MetaLine } from './MetaLine';
import { Text } from './Text';
import { Touchable } from './Touchable';

// The universal list row. The reference reuses the same shape in at least
// eight places — Body Focus, Just For You, generic lists, category lists, the
// workout exercise list, "You may like", Popular Goals and settings — varying
// only the leading slot, the title weight, the trailing slot and whether the
// row sits on a grey card or on a divider (DESIGN §4.3, ADR-051).
export interface RowProps {
  title: string;
  /** `list` is the reference's lighter 17/500; `card` is the denser 16/600. */
  titleVariant?: 'card' | 'list';
  /** Strings are joined with " · "; pass a node for level colours or bolts. */
  meta?: (string | null | undefined)[] | ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** `card` wraps the row in the grey rounded card used by generic lists. */
  container?: 'plain' | 'card';
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Row({
  title,
  titleVariant = 'card',
  meta,
  leading,
  trailing,
  container = 'plain',
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: RowProps) {
  const { colors } = useTheme();
  const isCardContainer = container === 'card';

  const body = (
    <View
      style={[
        styles.row,
        isCardContainer && { backgroundColor: colors.surface.row, borderRadius: radius.lg },
      ]}
    >
      {leading}
      <View style={styles.text}>
        <Text variant={titleVariant === 'list' ? 'listTitle' : 'title'} numberOfLines={2}>
          {title}
        </Text>
        {Array.isArray(meta) ? <MetaLine parts={meta} /> : meta}
      </View>
      {trailing}
    </View>
  );

  if (!onPress) return body;

  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {body}
    </Touchable>
  );
}

/** Left inset for a `Divider` that should start where the row's text starts. */
export function rowDividerInset(thumbSize: number) {
  return spacing[4] + thumbSize + spacing[3];
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
  },
  text: { flex: 1, gap: spacing[1] },
});
