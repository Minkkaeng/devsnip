import { Code2, Menu, Search, X } from 'lucide-react'
import type { RefObject } from 'react'
import { techStacks } from '../data/index.ts'
import { useSnipStore } from '../store/useSnipStore.ts'

export function Header({
  searchRef,
  onOpenMenu,
}: {
  searchRef: RefObject<HTMLInputElement | null>
  onOpenMenu: () => void
}) {
  const stack = useSnipStore((state) => state.selectedStack)
  const query = useSnipStore((state) => state.searchQuery)
  const setQuery = useSnipStore((state) => state.setSearchQuery)
  const setMobileView = useSnipStore((state) => state.setMobileView)
  const stackLabel = techStacks.find((tech) => tech.id === stack)!.label
  const modifier = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'
  return (
    <header className="app-header">
      <div className="brand-block">
        <button
          className="icon-button mobile-menu"
          onClick={onOpenMenu}
          aria-label="스택과 카테고리 메뉴 열기"
        >
          <Menu size={20} />
        </button>
        <a className="brand" href="#main-content" aria-label="DevSnip 메인 콘텐츠">
          <span className="brand-icon">
            <Code2 size={24} strokeWidth={2.5} />
          </span>
          <span>
            Dev<span className="brand-accent">Snip</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <span className="version-badge">BETA</span>
      </div>
      <div className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          ref={searchRef}
          type="search"
          aria-label={`${stackLabel} 스니펫 검색`}
          aria-describedby="shortcut-help"
          placeholder={`${stackLabel} 스니펫 검색…`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setMobileView('list')}
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            className="icon-button clear-search"
            aria-label="검색어 지우기"
            onClick={() => {
              setQuery('')
              searchRef.current?.focus()
            }}
          >
            <X size={15} />
          </button>
        ) : (
          <kbd>{modifier} K</kbd>
        )}
      </div>
      <div className="header-tagline">
        <span className="status-dot" /> Less searching. More building.
      </div>
    </header>
  )
}
