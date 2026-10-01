import { create } from 'zustand'
import { getVisibleItems } from '../lib/fuse.ts'
import {
  getAvailableCodeTabs,
  getCodeTab,
  getNextItemId,
  getSelectedItem,
} from '../lib/selection.ts'
import type { CodeTab, SnipFilters, StackId } from '../types/snip.ts'

interface SnipState extends SnipFilters {
  selectedItemId: string | null
  activeCodeTab: CodeTab
  mobileView: 'list' | 'detail'
  setStack: (stack: StackId) => void
  setCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  selectItem: (id: string, openDetail?: boolean) => void
  moveSelection: (direction: -1 | 1) => void
  setCodeTab: (tab: CodeTab) => void
  toggleCodeTab: () => void
  setMobileView: (view: 'list' | 'detail') => void
  resetFilters: () => void
}

export const useSnipStore = create<SnipState>((set, get) => {
  function updateFilters(filters: SnipFilters, currentId: string | null) {
    const item = getSelectedItem(getVisibleItems(filters), currentId)
    set({
      ...filters,
      selectedItemId: item?.id ?? null,
      activeCodeTab: getCodeTab(item, get().activeCodeTab),
      mobileView: 'list',
    })
  }

  return {
    selectedStack: 'react',
    selectedCategory: null,
    searchQuery: '',
    selectedItemId: 'react-usestate',
    activeCodeTab: 'ts',
    mobileView: 'list',
    setStack: (selectedStack) =>
      updateFilters({ selectedStack, selectedCategory: null, searchQuery: '' }, null),
    setCategory: (selectedCategory) =>
      updateFilters({ ...get(), selectedCategory }, get().selectedItemId),
    setSearchQuery: (searchQuery) => updateFilters({ ...get(), searchQuery }, get().selectedItemId),
    selectItem: (id, openDetail = false) => {
      const item = getVisibleItems(get()).find((candidate) => candidate.id === id)
      if (!item) return
      set({
        selectedItemId: id,
        activeCodeTab: getCodeTab(item, get().activeCodeTab),
        ...(openDetail ? { mobileView: 'detail' as const } : {}),
      })
    },
    moveSelection: (direction) => {
      const id = getNextItemId(getVisibleItems(get()), get().selectedItemId, direction)
      if (id) get().selectItem(id)
    },
    setCodeTab: (tab) => {
      const item = getSelectedItem(getVisibleItems(get()), get().selectedItemId)
      set({ activeCodeTab: getCodeTab(item, tab) })
    },
    toggleCodeTab: () => {
      const item = getSelectedItem(getVisibleItems(get()), get().selectedItemId)
      if (!item) return
      const tabs = getAvailableCodeTabs(item)
      const currentIndex = tabs.indexOf(get().activeCodeTab)
      get().setCodeTab(tabs[(currentIndex + 1) % tabs.length])
    },
    setMobileView: (mobileView) => set({ mobileView }),
    resetFilters: () =>
      updateFilters({ ...get(), selectedCategory: null, searchQuery: '' }, get().selectedItemId),
  }
})
