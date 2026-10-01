export type StackId = 'react' | 'typescript' | 'javascript' | 'css'
export type CodeTab = 'js' | 'ts' | 'css'

export interface TechStack {
  id: StackId
  label: string
  shortLabel: string
  description: string
}

export interface Gotcha {
  title: string
  description: string
}

export interface SnipItem {
  id: string
  stack: StackId
  category: string
  title: string
  summary: string
  tags: string[]
  code: { js?: string; ts?: string; css?: string }
  gotchas: Gotcha[]
  docsUrl: string
}

export interface SnipFilters {
  selectedStack: StackId
  selectedCategory: string | null
  searchQuery: string
}
