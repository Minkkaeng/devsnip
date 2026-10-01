import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { Code2, Keyboard } from 'lucide-react'
import { DetailView } from './components/DetailView.tsx'
import { Header } from './components/Header.tsx'
import { ItemList } from './components/ItemList.tsx'
import { StackSidebar } from './components/StackSidebar.tsx'
import { Toast } from './components/Toast.tsx'
import { useCopyCode } from './hooks/useCopyCode.ts'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut.ts'
import { getVisibleItems } from './lib/fuse.ts'
import { getAvailableCodeTabs, getCodeTab, getSelectedItem } from './lib/selection.ts'
import { useSnipStore } from './store/useSnipStore.ts'
import './App.css'

function App() {
  const state = useSnipStore()
  const { setMobileView, searchQuery, setSearchQuery, moveSelection } = state
  const items = getVisibleItems(state)
  const item = getSelectedItem(items, state.selectedItemId)
  const tab = getCodeTab(item, state.activeCodeTab)
  const searchRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousMobileView = useRef(state.mobileView)
  const [menuOpen, setMenuOpen] = useState(false)
  const { copy, toast, copiedCode } = useCopyCode()

  const copySelected = useCallback(() => {
    if (item) void copy(item.code[tab]!, item.title + ' · ' + tab.toUpperCase())
  }, [item, tab, copy])
  const focusSearch = useCallback(() => setMobileView('list'), [setMobileView])
  const escapeSearch = useCallback(() => {
    if (searchQuery) setSearchQuery('')
    else searchRef.current?.blur()
  }, [searchQuery, setSearchQuery])
  const navigate = useCallback(
    (direction: -1 | 1, fromList: boolean) => {
      moveSelection(direction)
      if (fromList) {
        const id = useSnipStore.getState().selectedItemId
        document
          .querySelector<HTMLButtonElement>('[data-snip-item="' + id + '"]')
          ?.focus({ preventScroll: true })
      }
    },
    [moveSelection],
  )

  useKeyboardShortcut({
    searchRef,
    hasSelection: !!item,
    canToggle: !!item && getAvailableCodeTabs(item).length > 1,
    onFocusSearch: focusSearch,
    onNavigate: navigate,
    onToggleTab: state.toggleCodeTab,
    onCopy: copySelected,
    onEscapeSearch: escapeSearch,
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (menuOpen && !dialog.open) dialog.showModal()
    if (!menuOpen && dialog.open) dialog.close()
  }, [menuOpen])
  useEffect(() => {
    document.getElementById('detail-scroll')?.scrollTo({ top: 0 })
  }, [item?.id])
  useEffect(() => {
    if (previousMobileView.current === state.mobileView) return
    previousMobileView.current = state.mobileView
    if (
      !window.matchMedia('(max-width: 900px)').matches ||
      document.activeElement === searchRef.current
    )
      return
    const target =
      state.mobileView === 'detail' ? '.back-button' : '[data-snip-item][aria-current="true"]'
    document.querySelector<HTMLButtonElement>(target)?.focus({ preventScroll: true })
  }, [state.mobileView])

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          메인 콘텐츠로 이동
        </a>
        <Header searchRef={searchRef} onOpenMenu={() => setMenuOpen(true)} />
        <main
          className="workspace"
          id="main-content"
          tabIndex={-1}
          data-mobile-view={state.mobileView}
        >
          <aside className="desktop-sidebar">
            <StackSidebar />
          </aside>
          <ItemList items={items} selectedId={item?.id ?? null} />
          <DetailView item={item} copiedCode={copiedCode} onCopy={copySelected} />
        </main>
        <footer className="app-footer">
          <div>
            <Code2 size={14} />
            <span>Your everyday developer cheat sheet.</span>
          </div>
          <div id="shortcut-help">
            <Keyboard size={14} />
            <span>
              검색·목록·코드: <kbd>Tab</kbd> 언어 전환 · 다시 <kbd>Tab</kbd> 포커스 이동 ·{' '}
              <kbd>Enter</kbd> 복사
            </span>
          </div>
          <span className="footer-version">DEVSNIP / V0.1</span>
        </footer>
        <dialog
          className="menu-dialog"
          ref={dialogRef}
          aria-label="스택과 카테고리 선택"
          onCancel={() => setMenuOpen(false)}
          onClose={() => setMenuOpen(false)}
        >
          <StackSidebar variant="drawer" onClose={() => setMenuOpen(false)} />
        </dialog>
        <Toast toast={toast} />
      </div>
    </MotionConfig>
  )
}

export default App
