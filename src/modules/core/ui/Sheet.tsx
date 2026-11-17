import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState, type ReactNode, type Ref } from 'react';
import { StyleSheet } from 'react-native';

import { radius, spacing, useTheme } from '../theme';
import { useAndroidBack } from '../navigation';

// All secondary actions open in a bottom sheet (DESIGN §4.4): 24 dp top radius,
// no drag handle, scrim behind. Open with ref.current?.present().
export interface SheetProps {
  children: ReactNode;
  ref?: Ref<BottomSheetModal>;
  /** Muted background, as used by the Workout Settings sheet. */
  muted?: boolean;
  scroll?: boolean;
}

export function Sheet({ children, ref, muted = false, scroll = false }: SheetProps) {
  const { colors, isDark } = useTheme();
  const modal = useRef<BottomSheetModal>(null);
  const [open, setOpen] = useState(false);
  const assignRef = useCallback((instance: BottomSheetModal | null) => {
    modal.current = instance;
    if (typeof ref === 'function') ref(instance);
    else if (ref) ref.current = instance;
  }, [ref]);
  useAndroidBack(() => { modal.current?.dismiss(); return true; }, open);
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
      ref={assignRef}
      onChange={(index) => setOpen(index >= 0)}
      onDismiss={() => setOpen(false)}
      enableDynamicSizing
      handleComponent={null}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.background,
        { backgroundColor: muted ? colors.surface.row : colors.surface.default },
      ]}
    >
      {scroll ? <BottomSheetScrollView contentContainerStyle={styles.content}>{children}</BottomSheetScrollView>
        : <BottomSheetView style={styles.content}>{children}</BottomSheetView>}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: { borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl },
  content: { padding: spacing[4], paddingBottom: spacing[8] },
});
