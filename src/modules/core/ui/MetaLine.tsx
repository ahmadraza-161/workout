import { Text } from './Text';

// "16 mins · 16 Exercises" — the meta line under a title. It appears on every
// row and card in the reference, so the dot separator lives in one place.
export interface MetaLineProps {
  /** Parts are joined with " · ". Empty and null parts are dropped. */
  parts: (string | null | undefined)[];
  numberOfLines?: number;
}

export function MetaLine({ parts, numberOfLines = 1 }: MetaLineProps) {
  const text = parts.filter((part): part is string => Boolean(part)).join(' · ');
  if (!text) return null;
  return (
    <Text variant="caption" tone="secondary" numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
}
