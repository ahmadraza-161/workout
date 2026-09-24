import { Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { useTheme } from '../theme';

export type Level = 1 | 2 | 3;

// Difficulty bolts (DESIGN §4.5): 3 zap icons, filled ones in brand blue.
// The icons are decorative, so the group carries a single spoken label.
export function Bolts({ level, size = 14 }: { level: Level; size?: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={t('a11y.difficulty', { level })}
    >
      {[1, 2, 3].map((index) => (
        <Zap
          key={index}
          size={size}
          color={index <= level ? colors.primary : colors.boltOff}
          fill={index <= level ? colors.primary : colors.boltOff}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
});
