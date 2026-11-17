import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { Button, Sheet, SheetHeader, Text, TextField } from '@/modules/core/ui';

import { readFeedbackNote, saveFeedbackNote } from '../browseRepository';

export function FeedbackSection() {
  const sheet = useRef<BottomSheetModal>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>();
  function open(): void {
    try { setNote(readFeedbackNote()); setError(undefined); } catch { setError(t('errors.generic.title')); }
    sheet.current?.present();
  }
  function save(): void {
    try { saveFeedbackNote(note); setError(undefined); sheet.current?.dismiss(); }
    catch { setError(t('errors.generic.title')); }
  }
  return <>
    <Button variant="secondary" label={t('browseUi.feedback')} onPress={open} />
    <Sheet ref={sheet} scroll><View style={styles.content}>
      <SheetHeader title={t('browseUi.feedback')} onClose={() => sheet.current?.dismiss()} />
      <Text tone="secondary">{t('browseUi.feedbackHint')}</Text>
      <TextField value={note} onChangeText={setNote} label={t('browseUi.note')} maxLength={10000} error={error} />
      <Button label={t('common.save')} onPress={save} />
    </View></Sheet>
  </>;
}
const styles = StyleSheet.create({ content: { gap: spacing[3] } });
