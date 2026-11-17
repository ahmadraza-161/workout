import { format } from 'date-fns';
import { router, useIsFocused } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { DatePicker, EmptyState, ErrorState, Row, Screen, Section, StackHeader } from '@/modules/core/ui';

import { localDateOf } from '../aggregates';
import { recordedDays } from '../records';
import { listReportSessions, listSessionsOnDate } from '../repository';
import { sessionWorkoutTitle } from '../workoutTitle';

export function HistoryScreen() {
  const focused = useIsFocused();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [, setRevision] = useState(0);
  const data = (() => {
    if (!focused) return null;
    try {
      return {
        dates: recordedDays(listReportSessions()),
        sessions: listSessionsOnDate(localDateOf(selectedDate)),
      };
    } catch {
      return 'error' as const;
    }
  })();

  return (
    <Screen scroll>
      <View style={styles.content}>
        <StackHeader title={t('report.history.title')} onBack={() => router.back()} />
        {data === 'error' ? <ErrorState onRetry={() => setRevision((value) => value + 1)} /> : data ? (
          <>
            <DatePicker value={selectedDate} onChange={setSelectedDate} markedDates={data.dates} />
            <Section title={format(selectedDate, 'MMMM d, yyyy')} headerPadding={spacing[0]}>
              {data.sessions.length === 0 ? (
                <EmptyState title={t('report.history.emptyDay')} body={t('report.history.emptyDayBody')} />
              ) : data.sessions.map((session) => (
                <Row key={session.id}
                  title={sessionWorkoutTitle(session.workoutId)}
                  meta={[
                    format(new Date(session.startedAt), 'h:mm a'),
                    t('browse.minutes', { count: Math.round(session.durationSec / 60) }),
                    t('report.completion', { percent: session.completionPct }),
                  ]}
                  container="card"
                  onPress={() => router.push({ pathname: '/session/[id]', params: { id: session.id } })} />
              ))}
            </Section>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing[6], paddingBottom: spacing[8] } });
