import { describe, expect, it, vi } from 'vitest'
import { copyToClipboard } from '../src/lib/clipboard.ts'

describe('클립보드', () => {
  it('Clipboard API로 문자열을 변경 없이 전달한다', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const code = '<button>복사</button>\nconst count = 0;'
    await copyToClipboard(code)
    expect(writeText).toHaveBeenCalledWith(code)
  })
  it('API 거부 시 fallback을 사용하고 입력 포커스·선택·임시 요소를 복원한다', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) } })
    Object.defineProperty(document, 'execCommand', { configurable: true, value: vi.fn().mockReturnValue(true) })
    const input = document.createElement('input')
    input.value = 'useState'
    document.body.append(input)
    input.focus()
    input.setSelectionRange(1, 4)
    await copyToClipboard('code')
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(document.activeElement).toBe(input)
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 4])
    expect(document.querySelector('textarea')).toBeNull()
    input.remove()
  })
  it('양쪽 복사가 실패하면 성공으로 처리하지 않고 오류를 반환한다', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    Object.defineProperty(document, 'execCommand', { configurable: true, value: vi.fn().mockReturnValue(false) })
    await expect(copyToClipboard('code')).rejects.toThrow('Clipboard unavailable')
    expect(document.querySelector('textarea')).toBeNull()
  })
})
