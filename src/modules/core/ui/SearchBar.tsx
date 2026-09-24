import { Search } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, spacing, useTheme } from '../theme';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Search pill (DESIGN §4.2). On the tab screens it is read-only and opens the
// search screen; the search screen itself passes `editable` with a real input.
export interface SearchBarProps {
  placeholder: string;
  onPress: () => void;
}

export function SearchBar({ placeholder, onPress }: SearchBarProps) {
  const { colors } = useTheme();
  return (
    <Touchable onPress={onPress} accessibilityRole="button" accessibilityLabel={placeholder}>
      <View style={[styles.bar, { backgroundColor: colors.surface.muted }]}>
        <Search size={20} color={colors.text.secondary} />
        <Text variant="body" tone="secondary">
          {placeholder}
        </Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: sizes.searchBar,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
  },
});
