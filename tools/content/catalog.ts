// Turns DOC/CONTENT_MAP.md into typed data the generators can use.
//
// Everything here is read from the catalog. Anything the catalog does not
// record — muscles, MET values, default durations, copy — is authored
// separately and joined on the exercise number.

import { flag, plain, rowsBySubheading, slugify, tablesUnder } from './markdown.ts';

export type ExerciseType = 'time' | 'reps' | 'hold';
export type RigView = 'side' | 'front' | 'top';
export type Prop = 'wall' | 'chair' | 'doorway' | 'bottles';
export type Equipment = 'none' | 'household' | 'optional_weight';

export interface CatalogExercise {
  /** Catalog row number, 1 to 119. The stable key everything joins on. */
  number: number;
  name: string;
  slug: string;
  type: ExerciseType;
  level: 1 | 2 | 3;
  quietSafe: boolean;
  /** The §2 table the row came from, e.g. "Core & Abs". Decides the pool. */
  category: string;
  basePose: string;
  view: RigView;
  props: Prop[];
  oneSided: boolean;
  /** Raw catalog text; resolved into ids in a later pass. */
  variations: string;
  quietSwap: string;
  equipment: Equipment;
}

export interface CatalogWorkout {
  number: number;
  name: string;
  slug: string;
  group: string;
  minutes: number;
  level: 1 | 2 | 3;
  bodyFocus: string;
  goal: string;
  type: string;
  quiet: string;
  tiles: string[];
  placements: string;
}

export interface CatalogChallenge {
  number: number;
  name: string;
  slug: string;
  days: number;
  focus: string;
  dailyTime: string;
  gradient: string;
  kind: string;
  goal: string;
  filterChips: string[];
}

export interface CatalogAchievement {
  number: number;
  id: string;
  badge: string;
  group: string;
  condition: string;
}

export interface Catalog {
  exercises: CatalogExercise[];
  workouts: CatalogWorkout[];
  challenges: CatalogChallenge[];
  achievements: CatalogAchievement[];
}

function parseType(value: string): ExerciseType {
  const text = plain(value).toLowerCase();
  if (text === 'time' || text === 'reps' || text === 'hold') return text;
  throw new Error(`Unknown exercise type "${value}"`);
}

function parseLevel(value: string): 1 | 2 | 3 {
  const level = Number(plain(value));
  if (level === 1 || level === 2 || level === 3) return level;
  throw new Error(`Unknown level "${value}"`);
}

function parseView(value: string): RigView {
  const text = plain(value).toLowerCase();
  if (text === 'side' || text === 'front' || text === 'top') return text;
  throw new Error(`Unknown view "${value}"`);
}

/** "Wall (balance, optional)" and "Chair · Wall" both resolve to prop ids. */
function parseProps(value: string): Prop[] {
  const text = plain(value).toLowerCase();
  if (!text || text === '—' || text === '-') return [];

  const props: Prop[] = [];
  if (text.includes('wall')) props.push('wall');
  if (text.includes('chair')) props.push('chair');
  if (text.includes('doorway')) props.push('doorway');
  if (text.includes('bottle')) props.push('bottles');
  if (props.length === 0) throw new Error(`Unrecognised prop "${value}"`);
  return props;
}

function dash(value: string): string {
  const text = plain(value);
  return text === '—' || text === '-' ? '' : text;
}

/** §7 lists equipment by exercise number rather than per row. */
function equipmentByNumber(markdown: string): Map<number, Equipment> {
  const map = new Map<number, Equipment>();
  for (const row of tablesUnder(markdown, '7')) {
    const value = plain(row.Value ?? '') as Equipment;
    if (value !== 'household' && value !== 'optional_weight') continue;
    for (const match of (row.Exercises ?? '').matchAll(/#(\d+)/g)) {
      map.set(Number(match[1]), value);
    }
  }
  return map;
}

function exerciseRows(markdown: string) {
  // The exercises are split across nine per-category tables under §2, and the
  // subheading is the category the generator pools exercises by.
  return rowsBySubheading(markdown, '2').filter((entry) => /^\d+$/.test(entry.row['#'] ?? ''));
}

export function loadCatalog(markdown: string): Catalog {
  const equipment = equipmentByNumber(markdown);

  const exercises: CatalogExercise[] = exerciseRows(markdown).map(({ heading, row }) => {
    const number = Number(row['#']);
    const name = plain(row.Exercise ?? '');
    return {
      number,
      name,
      slug: slugify(name),
      type: parseType(row.Type ?? ''),
      level: parseLevel(row.Lvl ?? ''),
      quietSafe: flag(row.Quiet),
      category: heading,
      basePose: plain(row['Base pose'] ?? ''),
      view: parseView(row.View ?? ''),
      props: parseProps(row.Props ?? ''),
      oneSided: flag(row['One-sided']),
      variations: dash(row.Variations ?? ''),
      quietSwap: dash(row['Quiet swap'] ?? ''),
      equipment: equipment.get(number) ?? 'none',
    };
  });

  const workouts: CatalogWorkout[] = tablesUnder(markdown, '8')
    .filter((row) => /^\d+$/.test(row['#'] ?? ''))
    .map((row) => {
      const name = plain(row.Workout ?? '');
      return {
        number: Number(row['#']),
        name,
        slug: slugify(name),
        group: plain(row.Group ?? ''),
        minutes: Number(plain(row.Min ?? '')),
        level: parseLevel(row.Lvl ?? ''),
        bodyFocus: plain(row['Body focus'] ?? ''),
        goal: plain(row.Goal ?? ''),
        type: plain(row.Type ?? ''),
        quiet: plain(row.Quiet ?? ''),
        tiles: dash(row['Discover tile(s)'] ?? '')
          .split('·')
          .map((tile) => tile.trim())
          .filter(Boolean),
        placements: plain(row['Fixed placements'] ?? ''),
      };
    });

  const challenges: CatalogChallenge[] = tablesUnder(markdown, '10')
    .filter((row) => /^\d+$/.test(row['#'] ?? ''))
    .map((row) => {
      const name = plain(row.Challenge ?? '');
      return {
        number: Number(row['#']),
        name,
        slug: slugify(name),
        days: Number(plain(row.Days ?? '')),
        focus: plain(row.Focus ?? ''),
        dailyTime: plain(row['Daily time'] ?? ''),
        gradient: plain(row.Gradient ?? ''),
        kind: plain(row.Kind ?? ''),
        goal: plain(row.Goal ?? ''),
        filterChips: plain(row['List filter chips'] ?? '')
          .split('·')
          .map((chip) => chip.trim())
          .filter(Boolean),
      };
    });

  const achievements: CatalogAchievement[] = tablesUnder(markdown, '11')
    .filter((row) => /^\d+$/.test(row['#'] ?? ''))
    .map((row) => ({
      number: Number(row['#']),
      id: plain(row.ID ?? ''),
      badge: plain(row.Badge ?? ''),
      group: plain(row['Group (gradient)'] ?? ''),
      condition: plain(row['Unlock condition'] ?? ''),
    }));

  return { exercises, workouts, challenges, achievements };
}
