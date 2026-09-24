// Reads the tables in DOC/CONTENT_MAP.md.
//
// The document is the content catalog (ADR-051 note in MEMORY §2), so the
// generators read it rather than keeping a second copy of 119 exercises that
// would quietly drift from the one humans edit.

import { readFileSync } from 'node:fs';

export type Row = Record<string, string>;

/** A `| a | b |` line split into trimmed cells. */
function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

const isTableLine = (line: string) => line.trim().startsWith('|');
const isSeparator = (line: string) => /^\|[\s:|-]+\|$/.test(line.trim());

/**
 * Every table under the given `## n.` or `### n.n` heading, as rows keyed by
 * the table's own column headers. Headings are matched by their number so a
 * reworded title does not silently return nothing.
 */
export function tablesUnder(markdown: string, headingNumber: string): Row[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^#{2,3} ${headingNumber.replace('.', '\\.')}[. ]`).test(line));
  if (start === -1) throw new Error(`No heading ${headingNumber} in the catalog`);

  // Stop at the next heading of the same or a higher level.
  const level = lines[start]!.match(/^#+/)![0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const match = lines[i]!.match(/^(#+) /);
    if (match && match[1]!.length <= level) {
      end = i;
      break;
    }
  }

  const rows: Row[] = [];
  let headers: string[] | null = null;

  for (const line of lines.slice(start, end)) {
    if (!isTableLine(line)) {
      // A blank line or prose ends the current table; the next one may have
      // different columns, as the per-category exercise tables do.
      headers = null;
      continue;
    }
    if (isSeparator(line)) continue;

    const parts = cells(line);
    if (headers === null) {
      headers = parts;
      continue;
    }
    if (parts.length !== headers.length) continue;

    const row: Row = {};
    headers.forEach((header, index) => {
      row[header] = parts[index]!;
    });
    rows.push(row);
  }

  return rows;
}

export function readCatalog(path: string): string {
  return readFileSync(path, 'utf8');
}

/** "✅" and "Yes" both mean true; "—", "❌" and empty mean false. */
export function flag(value: string | undefined): boolean {
  if (!value) return false;
  const text = value.trim();
  return text === '✅' || text.toLowerCase() === 'yes';
}

/** Turns a display name into a stable id: "Leg Swings (Front)" → "leg-swings-front". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Strips a trailing footnote dagger and any bracketed note. */
export function plain(value: string): string {
  return value.replace(/†/g, '').replace(/`/g, '').trim();
}
