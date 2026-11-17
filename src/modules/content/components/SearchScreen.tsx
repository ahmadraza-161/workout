import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { spacing } from '@/modules/core/theme';
import { EmptyState, Row, Screen, Section, StackHeader, TextField } from '@/modules/core/ui';

import { searchCatalog } from '../repository';
import { listRecentSearches, rememberSearch } from '../recentSearches';
import { ExerciseImage } from './ExerciseImage';
export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(listRecentSearches);
  const results = useMemo(() => searchCatalog(query, t), [query]);
  const hasResults = results.workouts.length + results.exercises.length + results.challenges.length > 0;

  return (
    <Screen background="plain" scroll>
      <StackHeader title={t('browse.search')} onBack={() => router.back()} />
      <View style={styles.content}>
        <TextField
          value={query}
          onChangeText={setQuery}
          label={t('browse.search')}
          placeholder={t('browse.searchPlaceholder')}
          onSubmitEditing={() => setRecent(rememberSearch(query))}
        />
        {!query.trim() && recent.length > 0 ? (
          <Section title={t('browse.recentSearches')} headerPadding={spacing[0]}>
            {recent.map((term) => <Row key={term} title={term} onPress={() => setQuery(term)} />)}
          </Section>
        ) : null}
        {query.trim() && !hasResults ? (
          <EmptyState title={t('browse.noResults')} body={t('browse.tryAnotherSearch')} />
        ) : null}
        {results.workouts.length > 0 ? (
          <Section title={t('browse.workouts')} headerPadding={spacing[0]}>
            {results.workouts.map((item) => (
              <Row
                key={item.id}
                title={t(item.titleKey)}
                meta={[t('browse.minutes', { count: item.estimatedMinutes })]}
                leading={item.items[0] ? <ExerciseImage id={item.items[0].exerciseId} variant="thumb" /> : undefined}
                onPress={() => router.push({ pathname: '/workout/[id]', params: { id: item.id } })}
              />
            ))}
          </Section>
        ) : null}
        {results.exercises.length > 0 ? (
          <Section title={t('browse.exercises')} headerPadding={spacing[0]}>
            {results.exercises.map((item) => (
              <Row
                key={item.id}
                title={t(item.nameKey)}
                leading={<ExerciseImage id={item.id} variant="thumb" />}
                onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.id } })}
              />
            ))}
          </Section>
        ) : null}
        {results.challenges.length > 0 ? (
          <Section title={t('browse.challenges')} headerPadding={spacing[0]}>
            {results.challenges.map((item) => <Row key={item.id} title={t(item.titleKey)} onPress={() => router.push({ pathname: '/challenge/[id]', params: { id: item.id } })} />)}
          </Section>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing[6] } });
