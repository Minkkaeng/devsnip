import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.tsx'
import { snipItems } from '../src/data/index.ts'
import { useSnipStore } from '../src/store/useSnipStore.ts'

it('Tab toggles the code language once, then moves focus on the next press', async () => {
  const user = userEvent.setup()
  useSnipStore.getState().setStack('react')
  useSnipStore.getState().setCodeTab('ts')
  render(<App />)
  const input = screen.getByRole('searchbox')
  input.focus()
  await user.keyboard('{Tab}')
  expect(input).toHaveFocus()
  expect(screen.getByRole('tab', { name: /JavaScript/ })).toHaveAttribute('aria-selected', 'true')
  await user.keyboard('{Tab}')
  expect(input).not.toHaveFocus()
  expect(screen.getByRole('tab', { name: /JavaScript/ })).toHaveAttribute('aria-selected', 'true')
})

describe('사용자 작업 흐름', () => {
  beforeEach(() => {
    useSnipStore.getState().setStack('react')
    useSnipStore.getState().setCodeTab('ts')
  })
  it('키보드만으로 검색 → 이동 → 언어 전환 → 정확한 코드 복사를 수행한다', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')
    const input = screen.getByRole('searchbox')
    expect(input).toHaveFocus()
    await user.type(input, 'use')
    const previousId = useSnipStore.getState().selectedItemId
    await user.keyboard('{ArrowDown}')
    expect(useSnipStore.getState().selectedItemId).not.toBe(previousId)
    expect(input).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(screen.getByRole('tab', { name: /JavaScript/ })).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveFocus()
    await user.keyboard('{Enter}')
    const selected = snipItems.find((item) => item.id === useSnipStore.getState().selectedItemId)!
    expect(writeText).toHaveBeenCalledWith(selected.code.js)
    expect(await screen.findByText(/코드를 복사했어요/)).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('')
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(input).not.toHaveFocus()
  })
  it('검색 결과가 없으면 이전 코드를 복사하지 않는다', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<App />)
    await user.type(screen.getByRole('searchbox'), 'zzzzzzzzzz')
    expect(screen.getByText('일치하는 스니펫이 없어요')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /코드 복사/ })).not.toBeInTheDocument()
    await user.keyboard('{Enter}')
    expect(writeText).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '필터 초기화' }))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'TypeScript 코드 복사' })).toBeInTheDocument()
  })
  it('스택·카테고리 변경과 TS 전용 스니펫을 처리한다', async () => {
    const user = userEvent.setup()
    render(<App />)
    const stackNav = screen.getByRole('navigation', { name: '기술 스택' })
    await user.click(within(stackNav).getByRole('button', { name: /TypeScript/ }))
    await user.click(screen.getByRole('button', { name: /Utility types/ }))
    expect(screen.getByRole('tab', { name: /JavaScript/ })).toBeDisabled()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('type User')
    const list = screen.getByRole('group', { name: '스니펫 선택' })
    expect(within(list).queryByRole('button', { name: /Generics/ })).not.toBeInTheDocument()
  })
  it('CSS 스택에서 CSS를 하이라이트하고 정확히 복사한다', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<App />)
    await user.click(
      within(screen.getByRole('navigation', { name: '기술 스택' })).getByRole('button', {
        name: /CSS/,
      }),
    )
    expect(screen.getByRole('tab', { name: 'CSS' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel').querySelector('code')).toHaveClass('language-css')
    await user.click(screen.getByRole('button', { name: 'CSS 코드 복사' }))
    expect(writeText).toHaveBeenCalledWith(
      snipItems.find((item) => item.id === 'css-flexbox-center')!.code.css,
    )
  })
  it('목록의 방향키는 실제 포커스도 이동한다', async () => {
    const user = userEvent.setup()
    render(<App />)
    const first = screen.getByRole('button', { name: 'useState' })
    first.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'useRef' })).toHaveFocus()
  })
  it('코드를 HTML로 실행하지 않고 하이라이팅된 텍스트로 표시한다', () => {
    render(<App />)
    const panel = screen.getByRole('tabpanel')
    expect(panel.querySelector('.token.keyword')).not.toBeNull()
    expect(panel.querySelector('button')).toBeNull()
    expect(panel.querySelector('code')!.textContent).toBe(snipItems[0].code.ts)
  })
  it('복사 실패는 오류 토스트로 안내하고 성공 표시를 하지 않는다', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'))
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    })
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'TypeScript 코드 복사' }))
    expect(await screen.findByText(/복사하지 못했어요/)).toBeInTheDocument()
    expect(screen.queryByText('복사 완료')).not.toBeInTheDocument()
  })
  it('한글 조합 중에는 Enter와 방향키 단축키를 실행하지 않는다', () => {
    render(<App />)
    const input = screen.getByRole('searchbox')
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowDown', isComposing: true })
    expect(useSnipStore.getState().selectedItemId).toBe('react-usestate')
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
    expect(screen.queryByText(/코드를 복사했어요/)).not.toBeInTheDocument()
  })
  it('메뉴의 native dialog를 열고 닫는다', async () => {
    const user = userEvent.setup()
    render(<App />)
    // CSS viewport visibility is tested manually; the button exists in the DOM.
    await user.click(screen.getByRole('button', { name: '스택과 카테고리 메뉴 열기' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('open')
    await user.click(screen.getByRole('button', { name: '메뉴 닫기' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
