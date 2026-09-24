import { t } from '../i18n';
import { useTheme } from '../theme';
import { Text } from './Text';
import type { Level } from './Bolts';

const KEYS = { 1: 'level.beginner', 2: 'level.intermediate', 3: 'level.advanced' } as const;
const TOKENS = { 1: 'beginner', 2: 'intermediate', 3: 'advanced' } as const;

// "Beginner" / "Intermediate" / "Advanced" in the matching level colour
// (DESIGN §2.4, §4.5). Used on workout rows and "You may like".
export function LevelText({ level }: { level: Level }) {
  const { colors } = useTheme();
  return (
    <Text variant="caption" style={{ color: colors.level[TOKENS[level]] }}>
      {t(KEYS[level])}
    </Text>
  );
}
