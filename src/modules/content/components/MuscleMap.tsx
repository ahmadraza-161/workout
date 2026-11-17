import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import paths from '../../../../assets/data/muscle-map-paths.json';
import { t } from '@/modules/core/i18n';
import { spacing, useTheme } from '@/modules/core/theme';
import { Text } from '@/modules/core/ui';

import type { MuscleGroup } from '../types';

export function MuscleMap({ primary, secondary }: {
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
}) {
  const { colors } = useTheme();
  const primarySet = new Set<string>(primary);
  const secondarySet = new Set<string>(secondary);

  return (
    <View style={styles.row}>
      {(['front', 'back'] as const).map((view) => (
        <View key={view} style={styles.figure}>
          <View style={styles.diagram}>
            <Svg viewBox={paths[view].viewBox} width="100%" height="100%" accessible={false}>
              {paths[view].body.map((d, index) => <Path key={`body-${index}`} d={d} fill={colors.muscle.base} />)}
              {paths[view].muscles.map(({ muscle, d }, index) => (
                <Path key={`${muscle}-${index}`} d={d} fill={primarySet.has(muscle)
                  ? colors.muscle.primary
                  : secondarySet.has(muscle) ? colors.muscle.secondary : colors.muscle.base} />
              ))}
            </Svg>
          </View>
          <Text variant="caption" tone="secondary">{t(`guide.${view}`)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', gap: spacing[4] },
  figure: { flex: 1, aspectRatio: 0.53, alignItems: 'center', gap: spacing[2] },
  diagram: { flex: 1, width: '100%' },
});
