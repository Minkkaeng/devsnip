import { Atom, Braces, ChevronRight, Layers, Library, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCategories, snipItems, techStacks } from '../data/index.ts'
import { useSnipStore } from '../store/useSnipStore.ts'

export function StackSidebar({ variant = 'desktop', onClose }: { variant?: 'desktop' | 'drawer'; onClose?: () => void }) {
  const stack = useSnipStore((state) => state.selectedStack)
  const category = useSnipStore((state) => state.selectedCategory)
  const setStack = useSnipStore((state) => state.setStack)
  const setCategory = useSnipStore((state) => state.setCategory)
  const stackItems = snipItems.filter((item) => item.stack === stack)
  return (
    <div className="sidebar-content">
      <div className="section-label sidebar-heading"><span>YOUR TOOLBOX</span>{onClose && <button className="icon-button" onClick={onClose} aria-label="메뉴 닫기"><X size={20} /></button>}</div>
      <nav aria-label="기술 스택" className="stack-nav">
        {techStacks.map((tech) => <button key={tech.id} className={`stack-button ${tech.id === stack ? 'is-active' : ''}`} aria-pressed={tech.id === stack} onClick={() => setStack(tech.id)}><span className={`stack-symbol ${tech.id}`}>{tech.id === 'react' ? <Atom size={22} /> : tech.shortLabel}</span><span className="stack-text"><span>{tech.label}</span><small>{tech.description}</small></span>{tech.id === stack && <ChevronRight size={14} className="stack-chevron" />}</button>)}
      </nav>
      <div className="sidebar-divider" />
      <div className="section-label category-heading"><span>CATEGORIES</span><Layers size={13} aria-hidden="true" /></div>
      <nav aria-label="스니펫 카테고리" className="category-nav">
        {[null, ...getCategories(stack)].map((name) => <button key={name ?? 'all'} className={`category-button ${category === name ? 'is-active' : ''}`} aria-pressed={category === name} onClick={() => { setCategory(name); onClose?.() }}>{category === name && <motion.span layoutId={`${variant}-category-indicator`} className="category-indicator" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}<span className="category-name">{name === null ? <Library size={15} /> : <Braces size={14} />}{name ?? 'All snippets'}</span><span className="category-count">{name === null ? stackItems.length : stackItems.filter((item) => item.category === name).length}</span></button>)}
      </nav>
      <div className="sidebar-note"><span className="note-kicker">BUILT FOR YOUR FLOW</span><p>필요한 코드만,<br />바로 꺼내 쓰세요.</p><span>{snipItems.length} curated snippets</span></div>
    </div>
  )
}
