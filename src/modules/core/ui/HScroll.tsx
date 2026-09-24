import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { spacing } from '../theme';

// Horizontal carousel (DESIGN §4.6): 12 dp gap, 16 dp start padding, and the
// next item peeking. Pass `snapWidth` (item width + gap) to snap card by card.
export interface HScrollProps {
  children: ReactNode;
  snapWidth?: number;
  gap?: number;
  padding?: number;
}

export function HScroll({ children, snapWidth, gap = spacing[3], padding = spacing[4] }: HScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate={snapWidth ? 'fast' : 'normal'}
      snapToInterval={snapWidth}
      snapToAlignment="start"
      contentContainerStyle={[styles.content, { gap, paddingHorizontal: padding }]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexDirection: 'row' },
});
