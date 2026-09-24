// Resolves the catalog's cross-references into ids.
//
// §3 settles the variation links: the catalog names 19 exercises that do not
// exist, and adding exercises is not allowed (ADR-013, ADR-040), so those
// links resolve to "none". §4 completes the quiet swaps for all nine jumping
// exercises, only four of which the catalog defined (ADR-041).

import { tablesUnder, plain } from './markdown.ts';
import type { CatalogExercise } from './catalog.ts';

export interface Resolved {
  /** Exercise number to the number of its easier variation, when one exists. */
  easier: Map<number, number>;
  harder: Map<number, number>;
  /** Jumping exercise number to its quiet replacement's number. */
  quietSwap: Map<number, number>;
}

const number = (value: string): number | null => {
  const match = value.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
};

export function resolveReferences(
  exercises: CatalogExercise[],
  markdown: string,
): Resolved {
  const easier = new Map<number, number>();
  const harder = new Map<number, number>();
  const quietSwap = new Map<number, number>();

  const byName = new Map(exercises.map((exercise) => [exercise.name.toLowerCase(), exercise.number]));

  for (const row of tablesUnder(markdown, '3')) {
    const from = Number(plain(row['#'] ?? ''));
    if (!Number.isFinite(from)) continue;

    const target = plain(row['Resolved to'] ?? '').toLowerCase();
    // "none" is the common case: the named exercise is not in the catalog.
    if (!target || target === 'none') continue;

    const to = number(target) ?? byName.get(target) ?? null;
    if (to === null) continue;
    (plain(row.Side ?? '').toLowerCase() === 'easier' ? easier : harder).set(from, to);
  }

  for (const row of tablesUnder(markdown, '4')) {
    const from = number(row['Jumping exercise'] ?? '');
    const to = number(row['Quiet swap'] ?? '');
    if (from !== null && to !== null) quietSwap.set(from, to);
  }

  return { easier, harder, quietSwap };
}
