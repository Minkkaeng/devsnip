import type { CodeTab, SnipItem } from '../types/snip.ts'

export function getSelectedItem(items: SnipItem[], selectedId: string | null): SnipItem | null {
  return items.find((item) => item.id === selectedId) ?? items[0] ?? null
}

export function getCodeTab(item: SnipItem | null, preferred: CodeTab): CodeTab {
  return preferred === 'js' && item?.code.js ? 'js' : 'ts'
}

export function getNextItemId(
  items: SnipItem[],
  selectedId: string | null,
  direction: -1 | 1,
): string | null {
  if (!items.length) return null
  const current = items.findIndex((item) => item.id === selectedId)
  const next = current < 0 ? 0 : Math.min(items.length - 1, Math.max(0, current + direction))
  return items[next].id
}
