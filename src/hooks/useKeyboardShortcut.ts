import { useEffect } from 'react'
import type { RefObject } from 'react'

interface ShortcutOptions {
  searchRef: RefObject<HTMLInputElement | null>
  hasSelection: boolean
  canToggle: boolean
  onFocusSearch: () => void
  onNavigate: (direction: -1 | 1, fromList: boolean) => void
  onToggleTab: () => void
  onCopy: () => void
  onEscapeSearch: () => void
}

export function useKeyboardShortcut({ searchRef, hasSelection, canToggle, onFocusSearch, onNavigate, onToggleTab, onCopy, onEscapeSearch }: ShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.isComposing || event.defaultPrevented || document.querySelector('dialog[open]')) return
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onFocusSearch()
        searchRef.current?.focus()
        searchRef.current?.select()
        return
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target instanceof Element ? event.target : null
      const scope = target?.closest('[data-shortcuts]')?.getAttribute('data-shortcuts')
      const isSearch = target === searchRef.current
      const isList = scope === 'list'
      const isCode = scope === 'code'
      if (!isSearch && !isList && !isCode) return
      if (event.key === 'Escape' && isSearch) {
        event.preventDefault()
        onEscapeSearch()
      } else if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && hasSelection && !event.shiftKey && !isCode) {
        event.preventDefault()
        onNavigate(event.key === 'ArrowUp' ? -1 : 1, isList)
      } else if (event.key === 'Tab' && !event.shiftKey && canToggle) {
        event.preventDefault()
        onToggleTab()
      } else if (event.key === 'Enter' && hasSelection && !event.shiftKey) {
        event.preventDefault()
        onCopy()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchRef, hasSelection, canToggle, onFocusSearch, onNavigate, onToggleTab, onCopy, onEscapeSearch])
}
