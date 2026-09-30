import Fuse from 'fuse.js'
import { snipItems } from '../data/index.ts'
import type { SnipFilters, SnipItem, StackId } from '../types/snip.ts'

export const searchOptions = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'tags', weight: 0.25 },
    { name: 'summary', weight: 0.15 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true,
}

const indexes = new Map<StackId, Fuse<SnipItem>>()
for (const stack of ['react', 'typescript', 'javascript'] as const) {
  indexes.set(
    stack,
    new Fuse(
      snipItems.filter((item) => item.stack === stack),
      searchOptions,
    ),
  )
}

export function getVisibleItems(filters: SnipFilters): SnipItem[] {
  const query = filters.searchQuery.trim()
  const results = query
    ? indexes
        .get(filters.selectedStack)!
        .search(query)
        .map(({ item }) => item)
    : snipItems.filter((item) => item.stack === filters.selectedStack)

  return filters.selectedCategory
    ? results.filter((item) => item.category === filters.selectedCategory)
    : results
}
