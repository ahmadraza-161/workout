import { Modal, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, Text } from '@/modules/core/ui';

import type { AchievementStatus } from '../repository';
import { BadgeGrid } from './BadgeGrid';

export function AchievementCelebration({ badges, onClose }: { badges: AchievementStatus[]; onClose: () => void }) {
  const { colors } = useTheme();
  return (
    <Modal visible={badges.length > 0} transparent animationType="none" onRequestClose={onClose}>
      <View style={[styles.scrim, { backgroundColor: colors.scrim }]}>
        <Card style={styles.card}>
          <Text variant="h1" style={styles.title}>{t('achievements.earned')}</Text>
          <BadgeGrid badges={badges} />
          <Button label={t('achievements.nice')} onPress={onClose} />
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'center', padding: spacing[6] },
  card: { gap: spacing[6] },
  title: { textAlign: 'center' },
});
