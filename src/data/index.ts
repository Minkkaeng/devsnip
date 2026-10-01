import reactItems from './react.json' with { type: 'json' }
import typescriptItems from './typescript.json' with { type: 'json' }
import javascriptItems from './javascript.json' with { type: 'json' }
import cssItems from './css.json' with { type: 'json' }
import type { SnipItem, StackId, TechStack } from '../types/snip.ts'

// JSON string literals widen to string; the data contract is also checked in tests.
export const snipItems = [
  ...reactItems,
  ...typescriptItems,
  ...javascriptItems,
  ...cssItems,
] as SnipItem[]

export const techStacks: TechStack[] = [
  { id: 'react', label: 'React', shortLabel: 'R', description: 'Hooks & patterns' },
  { id: 'typescript', label: 'TypeScript', shortLabel: 'TS', description: 'Types & utilities' },
  { id: 'javascript', label: 'JavaScript', shortLabel: 'JS', description: 'Everyday essentials' },
  { id: 'css', label: 'CSS', shortLabel: 'CSS', description: 'Layout & styling' },
]

export function getCategories(stack: StackId): string[] {
  return [...new Set(snipItems.filter((item) => item.stack === stack).map((item) => item.category))]
}
