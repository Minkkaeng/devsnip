import { beforeEach, describe, expect, it } from 'vitest'
import { getCategories, snipItems } from '../src/data/index.ts'
import { getVisibleItems } from '../src/lib/fuse.ts'
import { getNextItemId, getSelectedItem } from '../src/lib/selection.ts'
import { useSnipStore } from '../src/store/useSnipStore.ts'
import type { SnipFilters } from '../src/types/snip.ts'

const filters: SnipFilters = { selectedStack: 'react', selectedCategory: null, searchQuery: '' }

describe('스니펫 데이터와 검색', () => {
  it('고유 ID와 필수 필드, 공식 문서 주소를 갖는다', () => {
    expect(new Set(snipItems.map((item) => item.id)).size).toBe(snipItems.length)
    for (const item of snipItems) {
      expect(['react', 'typescript', 'javascript']).toContain(item.stack)
      for (const field of [item.id, item.category, item.title, item.summary, item.code.ts]) expect(field.trim().length).toBeGreaterThan(0)
      expect(item.tags.length).toBeGreaterThan(0)
      expect(item.gotchas.length).toBeGreaterThan(0)
      for (const gotcha of item.gotchas) {
        expect(gotcha.title.trim()).not.toBe('')
        expect(gotcha.description.trim()).not.toBe('')
      }
      expect(new URL(item.docsUrl).protocol).toBe('https:')
      expect(['react.dev', 'www.typescriptlang.org', 'developer.mozilla.org']).toContain(new URL(item.docsUrl).hostname)
    }
  })
  it('정확한 이름과 오타 검색에서 useState를 첫 결과로 반환한다', () => {
    for (const searchQuery of ['useState', 'useStte', 'USESTATE', ' useState ']) {
      expect(getVisibleItems({ ...filters, searchQuery })[0]?.id).toBe('react-usestate')
    }
  })
  it('태그와 한국어 설명으로도 검색한다', () => {
    expect(getVisibleItems({ ...filters, searchQuery: 'cleanup' })[0]?.id).toBe('react-useeffect')
    expect(getVisibleItems({ ...filters, searchQuery: '타이머' }).some((item) => item.id === 'react-useeffect')).toBe(true)
  })
  it('현재 스택과 카테고리를 동시에 적용한다', () => {
    const results = getVisibleItems({ ...filters, selectedCategory: 'State', searchQuery: 'hook' })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((item) => item.stack === 'react' && item.category === 'State')).toBe(true)
    expect(getVisibleItems({ ...filters, searchQuery: 'zzzzzzzzzz' })).toEqual([])
    expect(getVisibleItems({ ...filters, selectedStack: 'javascript', searchQuery: 'Promise.all' })[0]?.id).toBe('js-promise-all')
  })
  it('공백 검색은 전체 목록이며 카테고리는 중복되지 않는다', () => {
    expect(getVisibleItems({ ...filters, searchQuery: '   ' })).toEqual(getVisibleItems(filters))
    expect(new Set(getCategories('react')).size).toBe(getCategories('react').length)
  })
})

describe('필터·선택·코드 언어 상태', () => {
  beforeEach(() => { useSnipStore.getState().setStack('react'); useSnipStore.getState().setCodeTab('ts') })
  it('검색 결과가 없어지면 선택과 복사 대상도 사라진다', () => {
    useSnipStore.getState().setSearchQuery('zzzzzzzzzz')
    const state = useSnipStore.getState()
    expect(state.selectedItemId).toBeNull()
    expect(getSelectedItem(getVisibleItems(state), state.selectedItemId)).toBeNull()
    state.setSearchQuery('useRef')
    expect(useSnipStore.getState().selectedItemId).toBe('react-useref')
  })
  it('스택 전환은 검색·카테고리를 초기화하고 새 스택의 항목을 선택한다', () => {
    useSnipStore.getState().setCategory('State')
    useSnipStore.getState().setSearchQuery('useState')
    useSnipStore.getState().setStack('typescript')
    const state = useSnipStore.getState()
    expect(state.searchQuery).toBe('')
    expect(state.selectedCategory).toBeNull()
    expect(state.selectedItemId).toBe('ts-generics')
  })
  it('카테고리 변경 시 숨겨진 항목을 선택한 채 남지 않는다', () => {
    useSnipStore.getState().setCategory('Effects')
    expect(useSnipStore.getState().selectedItemId).toBe('react-useeffect')
  })
  it('이동은 목록 양 끝에서 멈추고 빈 목록에서도 안전하다', () => {
    const items = getVisibleItems(filters)
    expect(getNextItemId(items, items[0].id, -1)).toBe(items[0].id)
    expect(getNextItemId(items, items.at(-1)!.id, 1)).toBe(items.at(-1)!.id)
    expect(getNextItemId([], null, 1)).toBeNull()
    useSnipStore.getState().moveSelection(1)
    expect(useSnipStore.getState().selectedItemId).toBe('react-useref')
  })
  it('타입 전용 스니펫에서는 TS로 전환하고 JS 선택을 차단한다', () => {
    useSnipStore.getState().setCodeTab('js')
    useSnipStore.getState().setStack('typescript')
    useSnipStore.getState().selectItem('ts-utility-types')
    expect(useSnipStore.getState().activeCodeTab).toBe('ts')
    useSnipStore.getState().toggleCodeTab()
    expect(useSnipStore.getState().activeCodeTab).toBe('ts')
  })
})
