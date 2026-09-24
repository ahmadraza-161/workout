import { StyleSheet, View } from 'react-native';

import { useTheme } from '../theme';

// Hairline between rows (DESIGN §4.3). `inset` pulls the line in to the text
// start so it lines up under the title rather than under the thumbnail.
export function Divider({ inset = 0 }: { inset?: number }) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.line, { backgroundColor: colors.line.divider, marginLeft: inset }]}
    />
  );
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth },
});
