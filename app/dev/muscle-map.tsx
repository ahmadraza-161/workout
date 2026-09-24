import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { radius, spacing, useTheme } from '@/modules/core/theme';
import { Card, Text } from '@/modules/core/ui';

// Development-only comparison screen. Not reachable in a release build.
//
// It loads remote CC0 muscle diagrams by URL so the generated map can be
// judged against them side by side. This deliberately lives in app/dev and
// nowhere else: the app itself is fully offline and the release build has no
// INTERNET permission (ADR-003), so a remote image in a shipping screen would
// simply fail to load on a user's phone.
//
// Sources are openclipart.org, which is 100% public domain, so there is no
// licence to clear for anything that ends up being used. The images a search
// turns up elsewhere are commercial illustrations and cannot be used at all.
export default function MuscleMapCompare() {
  if (!__DEV__) return <Redirect href="/" />;
  return <Compare />;
}

/**
 * Verified on openclipart.org, which states "Openclipart is 100% Public
 * Domain". `paths` is the number of separate shapes in each file, which is
 * what decides whether individual muscles can be highlighted.
 */
const CANDIDATES = [
  { id: '347510', title: 'Human Muscle System — Colour Remix', author: 'j4p4n', paths: 11 },
  { id: '328754', title: 'Muscles of a Man (no border)', author: 'j4p4n', paths: 2 },
  { id: '326556', title: 'Human Muscle System', author: 'j4p4n', paths: 8 },
  { id: '316399', title: 'Muscles of a Man', author: 'j4p4n', paths: 1 },
];

const url = (id: string) => `https://openclipart.org/download/${id}`;

function Compare() {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg.page }}
      contentContainerStyle={styles.page}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.header}>
        <Text variant="h1">Muscle map candidates</Text>
        <Text variant="caption" tone="secondary">
          Public-domain diagrams from openclipart.org, loaded by URL. Development only — the release
          build has no network access.
        </Text>
      </View>

      <Card>
        <Text variant="bodyStrong">The thing to look for</Text>
        <Text variant="body" tone="secondary">
          The guide has to light up one muscle at a time: chest for a push-up, quads for a squat.
          That needs each muscle to be its own shape. These files draw the whole body as one to
          eleven shapes, so they can be shown but not highlighted.
        </Text>
      </Card>

      {CANDIDATES.map((candidate) => (
        <View key={candidate.id} style={styles.item}>
          <View style={styles.titleRow}>
            <Text variant="h3">{candidate.title}</Text>
            <Text variant="caption" tone={candidate.paths < 20 ? 'secondary' : 'brand'}>
              {candidate.paths} shape{candidate.paths === 1 ? '' : 's'}
            </Text>
          </View>
          <Text variant="caption" tone="secondary">
            openclipart.org/detail/{candidate.id} · {candidate.author} · public domain
          </Text>

          <View style={[styles.stage, { backgroundColor: colors.surface.default }]}>
            {width > 0 ? (
              <SvgUri uri={url(candidate.id)} width={width - spacing[4] * 4} height={360} />
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing[4], gap: spacing[5], paddingBottom: spacing[16] },
  header: { gap: spacing[2] },
  item: { gap: spacing[2] },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  stage: { borderRadius: radius.lg, alignItems: 'center', padding: spacing[3] },
});
