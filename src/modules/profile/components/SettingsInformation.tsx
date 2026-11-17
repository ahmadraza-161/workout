import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import Constants from 'expo-constants';
import { useState, type Ref } from 'react';
import { StyleSheet, View } from 'react-native';

import notices from '../../../../assets/data/notices.generated.json';
import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Button, Row, Sheet, SheetHeader, Text, TextField } from '@/modules/core/ui';

export type InformationKind = 'credits' | 'privacy' | 'disclaimer' | 'about';
const PAGE_SIZE = 30;

function Credits() {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<(typeof notices.notices)[number] | null>(null);
  if (selected) return <View style={styles.content}>
    <Button variant="plainLink" label={t('common.back')} onPress={() => setSelected(null)} />
    <Text variant="h3">{selected.name}</Text>
    <Text>{[selected.version, selected.licence].filter(Boolean).join(' · ')}</Text>
    {selected.source ? <Text selectable tone="secondary">{selected.source}</Text> : null}
    {selected.texts.map((index) => <Text key={index} selectable>{notices.texts[index]}</Text>)}
  </View>;
  const filtered = notices.notices.filter((notice) => `${notice.name} ${notice.licence}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <View style={styles.content}>
    <Text>{t('settings.info.credits.body')}</Text>
    <Text>{t('settings.info.credits.images')}</Text>
    <Text tone="secondary">{t('settings.info.credits.map')}</Text>
    <TextField label={t('settings.info.credits.search')} value={query} onChangeText={(value) => { setQuery(value); setLimit(PAGE_SIZE); }} />
    {filtered.slice(0, limit).map((notice) => <Row key={`${notice.name}@${notice.version}`}
      title={notice.name} meta={[notice.version, notice.licence]} onPress={() => setSelected(notice)} />)}
    {!filtered.length ? <Text>{t('settings.info.credits.empty')}</Text> : null}
    {filtered.length > limit ? <Button variant="secondary" label={t('settings.info.credits.more')}
      onPress={() => setLimit((value) => value + PAGE_SIZE)} /> : null}
  </View>;
}

export function SettingsInformation({ kind, sheetRef, onClose }: {
  kind: InformationKind; sheetRef: Ref<BottomSheetModal>; onClose: () => void;
}) {
  const config = Constants.expoConfig;
  return <Sheet ref={sheetRef} scroll>
    <View style={styles.content}>
      <SheetHeader title={t(`settings.info.${kind}.title`)} onClose={onClose} />
      {kind === 'credits' ? <Credits /> : <>
        {kind === 'about' ? <>
          <Text variant="h3">{config?.name ?? t('app.name')}</Text>
          <Text>{t('settings.info.about.version', { version: config?.version ?? t('settings.info.about.unknownVersion') })}</Text>
        </> : null}
        <Text>{t(`settings.info.${kind}.body`)}</Text>
        {kind === 'privacy' ? <>
          <Text variant="h3">{t('settings.info.privacy.backupTitle')}</Text>
          <Text>{t('settings.info.privacy.backupBody')}</Text>
          <Text variant="h3">{t('settings.info.privacy.reminderTitle')}</Text>
          <Text>{t('settings.info.privacy.reminderBody')}</Text>
          <Text variant="h3">{t('settings.info.privacy.deleteTitle')}</Text>
          <Text>{t('settings.info.privacy.deleteBody')}</Text>
        </> : null}
        {kind === 'disclaimer' ? <Text>{t('onboarding.disclaimer')}</Text> : null}
      </>}
    </View>
  </Sheet>;
}

const styles = StyleSheet.create({ content: { gap: spacing[4] } });
