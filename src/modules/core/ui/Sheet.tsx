import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, type ReactNode, type Ref } from 'react';
import { StyleSheet } from 'react-native';

import { radius, spacing, useTheme } from '../theme';

// All secondary actions open in a bottom sheet (DESIGN §4.4): 24 dp top radius,
// no drag handle, scrim behind. Open with ref.current?.present().
export interface SheetProps {
  children: ReactNode;
  ref?: Ref<BottomSheetModal>;
  /** Muted background, as used by the Workout Settings sheet. */
  muted?: boolean;
}

export function Sheet({ children, ref, muted = false }: SheetProps) {
  const { colors, isDark } = useTheme();
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={isDark ? 0.7 : 0.6}
      />
    ),
    [isDark],
  );
  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      handleComponent={null}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.background,
        { backgroundColor: muted ? colors.surface.row : colors.surface.default },
      ]}
    >
      <BottomSheetView style={styles.content}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: { borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl },
  content: { padding: spacing[4], paddingBottom: spacing[8] },
});
