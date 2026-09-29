import { ChevronRight, Code2, SearchX } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { techStacks } from '../data/index.ts'
import { useSnipStore } from '../store/useSnipStore.ts'
import type { SnipItem } from '../types/snip.ts'

export function ItemList({ items, selectedId }: { items: SnipItem[]; selectedId: string | null }) {
  const listRef = useRef<HTMLDivElement>(null)
  const stack = useSnipStore((state) => state.selectedStack)
  const category = useSnipStore((state) => state.selectedCategory)
  const query = useSnipStore((state) => state.searchQuery)
  const selectItem = useSnipStore((state) => state.selectItem)
  const resetFilters = useSnipStore((state) => state.resetFilters)
  const label = techStacks.find((tech) => tech.id === stack)!.label
  useEffect(() => {
    listRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])
  return (
    <section className="item-list-panel" aria-label="스니펫 목록">
      <div className="list-heading"><div><span className="section-label">EXPLORE SNIPPETS</span><h1>{query.trim() ? '검색 결과' : category ?? label}</h1></div><span className="result-count">{items.length}</span></div>
      <div className="list-subheading"><span>{query.trim() ? `“${query.trim()}” · ${label}` : '작은 코드, 빠른 해결.'}</span><Code2 size={14} aria-hidden="true" /></div>
      <div className="snippet-list" ref={listRef} data-shortcuts="list" role="group" aria-label="스니펫 선택" tabIndex={items.length ? -1 : 0}>
        {items.map((item, index) => <button key={item.id} className={`snippet-card ${selectedId === item.id ? 'is-selected' : ''}`} data-snip-item={item.id} aria-label={item.title} aria-current={selectedId === item.id ? 'true' : undefined} tabIndex={selectedId === item.id ? 0 : -1} onClick={() => selectItem(item.id, true)} onFocus={() => selectItem(item.id)}>{selectedId === item.id && <motion.span layoutId="selected-snippet" className="snippet-highlight" transition={{ type: 'spring', stiffness: 420, damping: 38 }} />}<span className="snippet-card-content"><span className="snippet-title-row"><span className="snippet-index">{String(index + 1).padStart(2, '0')}</span><span className="snippet-title">{item.title}</span><ChevronRight size={15} /></span><span className="snippet-summary">{item.summary}</span><span className="snippet-tags">{item.tags.slice(0, 2).map((tag) => <span key={tag}>#{tag}</span>)}</span></span></button>)}
        {!items.length && <div className="empty-state"><SearchX size={30} /><h2>일치하는 스니펫이 없어요</h2><p>검색어를 줄이거나 다른 카테고리를 찾아보세요.</p><button className="secondary-button" onClick={resetFilters}>필터 초기화</button></div>}
      </div>
      <div className="list-footer"><kbd>↑</kbd><kbd>↓</kbd><span>목록 탐색</span><span className="list-footer-right">{label}</span></div>
      <span className="sr-only" aria-live="polite" role="status">{label} 스니펫 {items.length}개</span>
    </section>
  )
}
