// Reads the catalog, validates it, and writes the intermediate data the other
// generators build on (T2.1, T2.8).
//
// Run: npm run assets

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP_NAME } from '../../app.config.ts';
import { ONBOARDING_STRINGS } from './onboardingStrings.ts';

import { loadCatalog } from './catalog.ts';
import { readCatalog } from './markdown.ts';
import { METRICS, MUSCLE_GROUPS } from './metrics.ts';
import { resolveReferences } from './resolve.ts';
import { generateChallenges } from './challenges.ts';
import { buildPack, buildStrings } from './pack.ts';
import { achievementRules, categoriesFrom, collectionsFrom } from './placements.ts';
import { generateWorkouts } from './workouts.ts';
import { BROWSE_STRINGS, CHALLENGE_UI_STRINGS } from './browseStrings.ts';
import { HOME_STRINGS } from './homeStrings.ts';
import { PLAYER_FINISH_STRINGS } from './playerStrings.ts';
import { assertValid, EXPECTED } from './validate.ts';

const ROOT = join(import.meta.dirname, '..', '..');
const CATALOG_PATH = join(ROOT, 'DOC', 'CONTENT_MAP.md');
const OUT_DIR = join(ROOT, 'assets', 'data');

const markdown = readCatalog(CATALOG_PATH);
const catalog = loadCatalog(markdown);
const resolved = resolveReferences(catalog.exercises, markdown);

assertValid(catalog, resolved);

// Reference maps are written as plain objects so the file stays diffable.
const fromMap = (map: Map<number, number>) => Object.fromEntries([...map].map(([k, v]) => [String(k), v]));

const workouts = generateWorkouts(catalog.workouts, catalog.exercises);
const challenges = generateChallenges(catalog.challenges, catalog.workouts, catalog.exercises);
const categories = categoriesFrom(catalog.workouts);
const { collections, unmatched } = collectionsFrom(markdown, catalog.workouts);
const badges = achievementRules(catalog.achievements);

if (unmatched.length > 0) {
  console.error(`Collections name workouts that do not exist: ${unmatched.join(", ")}`);
  process.exit(1);
}
if (badges.missing.length > 0 || badges.extra.length > 0) {
  console.error(`Achievement rules out of step with the catalog: missing ${badges.missing.join(", ") || "none"}, extra ${badges.extra.join(", ") || "none"}`);
  process.exit(1);
}

const data = {
  generatedFrom: 'DOC/CONTENT_MAP.md',
  // Catalog rows joined with the hand-authored metrics (T2.2).
  exercises: catalog.exercises.map((exercise) => ({ ...exercise, ...METRICS[exercise.number]! })),
  workouts: catalog.workouts.map((workout) => ({
    ...workout,
    ...workouts.find((generated) => generated.number === workout.number)!,
  })),
  challenges: catalog.challenges.map((challenge) => ({
    ...challenge,
    ...challenges.find((generated) => generated.number === challenge.number)!,
  })),
  achievements: catalog.achievements.map((achievement) => ({
    ...achievement,
    ...badges.rules.find((rule) => rule.id === achievement.id)!,
  })),
  categories,
  collections,
  references: {
    easier: fromMap(resolved.easier),
    harder: fromMap(resolved.harder),
    quietSwap: fromMap(resolved.quietSwap),
  },
};

mkdirSync(OUT_DIR, { recursive: true });
const path = join(OUT_DIR, 'catalog.generated.json');
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const counts = Object.entries(EXPECTED)
  .map(([key, expected]) => `${key} ${catalog[key as keyof typeof EXPECTED].length}/${expected}`)
  .join(' · ');

console.log(`Catalog valid: ${counts}`);
console.log(
  `References: ${resolved.easier.size} easier, ${resolved.harder.size} harder, ` +
    `${resolved.quietSwap.size} quiet swaps`,
);

// The muscle map needs a named group for every muscle the content mentions,
// so the generator reports which ones the catalog actually loads (T2.13).
const asPrimary = new Set<string>();
const atAll = new Set<string>();
for (const metrics of Object.values(METRICS)) {
  for (const muscle of metrics.primary) {
    asPrimary.add(muscle);
    atAll.add(muscle);
  }
  for (const muscle of metrics.secondary) atAll.add(muscle);
}
const neverPrimary = MUSCLE_GROUPS.filter((muscle) => !asPrimary.has(muscle));
console.log(`Muscles: ${atAll.size}/${MUSCLE_GROUPS.length} used, never primary: ${neverPrimary.join(', ') || 'none'}`);
const flexed = workouts.filter((workout) => workout.blockSizeFlexed).length;
const worstGap = Math.max(
  ...workouts.map((generated) => {
    const target = catalog.workouts.find((workout) => workout.number === generated.number)!.minutes * 60;
    return Math.abs(generated.totalSeconds - target);
  }),
);
console.log(
  `Workouts: ${workouts.length} built, worst duration gap ${worstGap}s, ` +
    `${flexed} needed a block size outside PRD 8.2`,
);
const trainingDays = challenges.reduce((sum, challenge) => sum + challenge.trainingDays, 0);
console.log(`Challenges: ${challenges.length} scheduled, ${trainingDays} training days total`);
console.log(`Placements: ${categories.length} tiles, ${collections.length} collections, ${badges.rules.length} badge rules`);
// The content pack and its strings: what the app actually loads (T2.20).
const inputs = {
  catalog,
  resolved,
  workouts,
  challenges,
  categories,
  collections,
  badgeRules: badges.rules,
  contentVersion: 1,
};

const pack = buildPack(inputs);
const packPath = join(OUT_DIR, 'content-pack.json');
writeFileSync(packPath, `${JSON.stringify(pack)}
`, 'utf8');

const strings = { ...buildStrings(inputs), reportUi: REPORT_UI_STRINGS, restTimerUi: REST_TIMER_UI_STRINGS };
const i18nPath = join(ROOT, 'assets', 'i18n', 'en.json');
const existing = JSON.parse(readFileSync(i18nPath, 'utf8'));
writeFileSync(i18nPath, `${JSON.stringify({ ...existing, ...strings,
  app: { ...existing.app, name: APP_NAME },
  onboarding: { ...existing.onboarding, ...ONBOARDING_STRINGS, welcome: `Welcome to ${APP_NAME}` },
  player: { ...existing.player, finish: { ...existing.player.finish, ...PLAYER_FINISH_STRINGS } },
  browseUi: BROWSE_STRINGS, challengeUi: CHALLENGE_UI_STRINGS, home: HOME_STRINGS, startup: STARTUP_STRINGS }, null, 2)}
`, 'utf8');

const packBytes = Buffer.byteLength(JSON.stringify(pack));
console.log(
  `Content pack: ${pack.exercises.length} exercises, ${pack.workouts.length} workouts, ` +
    `${pack.challenges.length} challenges, ${(packBytes / 1024).toFixed(0)} KB`,
);
console.log(`Wrote ${path}`);
console.log(`Wrote ${packPath}`);
console.log(`Wrote ${i18nPath}`);

// The catalog names 19 easier/harder variations that do not exist, and adding
// exercises is not allowed, so every link resolves to "none" (ADR-013,
// ADR-040). The guide's Easier/Harder buttons therefore never appear in v1.
if (resolved.easier.size === 0 && resolved.harder.size === 0) {
  console.log(
    '\nNote: no variation links resolve, so the exercise guide will show no ' +
      'Easier/Harder buttons in v1 (ADR-040). T4.8 should build the feature to ' +
      'stay hidden rather than assume data.',
  );
}
import { STARTUP_STRINGS } from './startupStrings.ts';
import { REPORT_UI_STRINGS } from './reportUiStrings.ts';
import { REST_TIMER_UI_STRINGS } from './restTimerStrings.ts';
