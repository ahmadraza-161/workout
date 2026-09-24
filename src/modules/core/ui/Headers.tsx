import type { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { sizes, spacing } from '../theme';
import { IconButton } from './IconButton';
import { Text } from './Text';

// Headers from DESIGN §4.6. All three are 56 dp with the title on the left;
// they differ only in the leading and trailing slots.

/** Tab screens: uppercase app-style title plus actions. */
export function TabHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <View style={styles.header}>
      <Text variant="tabHeader" style={styles.grow} numberOfLines={1}>
        {title}
      </Text>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

/** Stack screens: back arrow plus title. */
export function StackHeader({
  title,
  onBack,
  actions,
}: {
  title: string;
  onBack: () => void;
  actions?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel={t('a11y.back')} variant="stage" />
      <Text variant="h2" style={styles.grow} numberOfLines={1}>
        {title}
      </Text>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

/** Bottom sheets: title plus a close circle. */
export function SheetHeader({
  title,
  onClose,
  large = false,
}: {
  title: string;
  onClose: () => void;
  large?: boolean;
}) {
  return (
    <View style={styles.header}>
      <Text variant={large ? 'h1' : 'h2'} style={styles.grow} numberOfLines={1}>
        {title}
      </Text>
      <IconButton icon={X} onPress={onClose} accessibilityLabel={t('a11y.close')} variant="close" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: sizes.header,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  grow: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
});
