import { StyleSheet, View } from 'react-native';

import { radius, useTheme } from '../theme';
import { Text } from './Text';

// "CUSTOMIZED FOR YOU" tag (DESIGN §4.5). It sits in a card corner, so the
// top-left corner follows the card radius and the bottom-right is 12.
export function Tag({ label, cardRadius = radius.xl }: { label: string; cardRadius?: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.tag,
        { backgroundColor: colors.tagBg, borderTopLeftRadius: cardRadius },
      ]}
    >
      <Text variant="micro" style={{ color: colors.tagText }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    height: 24,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderBottomRightRadius: radius.md,
  },
});
