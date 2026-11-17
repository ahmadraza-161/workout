import { getKv, setKv } from '@/modules/core/kv';

const MAX_RECENT_SEARCHES = 10;

export function listRecentSearches(): string[] {
  const value = getKv('search.recent');
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, MAX_RECENT_SEARCHES) : [];
}

export function rememberSearch(query: string): string[] {
  const term = query.trim();
  if (!term) return listRecentSearches();
  const previous = listRecentSearches().filter((item) => item.toLocaleLowerCase() !== term.toLocaleLowerCase());
  const next = [term, ...previous].slice(0, MAX_RECENT_SEARCHES);
  setKv('search.recent', next);
  return next;
}
