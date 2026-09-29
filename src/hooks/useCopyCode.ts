import { useCallback, useEffect, useRef, useState } from 'react'
import { copyToClipboard } from '../lib/clipboard.ts'

export interface CopyToast {
  id: number
  kind: 'success' | 'error'
  message: string
}

export function useCopyCode() {
  const [toast, setToast] = useState<CopyToast | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pending = useRef(false)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current) }
  }, [])
  const copy = useCallback(async (code: string, label: string) => {
    if (pending.current) return
    pending.current = true
    let result: Omit<CopyToast, 'id'>
    try {
      await copyToClipboard(code)
      result = { kind: 'success', message: `${label} 코드를 복사했어요` }
      if (mounted.current) setCopiedCode(code)
    } catch {
      result = { kind: 'error', message: '복사하지 못했어요. 코드를 선택한 뒤 직접 복사해 주세요.' }
      if (mounted.current) setCopiedCode(null)
    } finally { pending.current = false }
    if (!mounted.current) return
    if (timer.current) clearTimeout(timer.current)
    setToast({ ...result, id: Date.now() })
    timer.current = setTimeout(() => { setToast(null); setCopiedCode(null) }, result.kind === 'error' ? 6000 : 2400)
  }, [])
  return { copy, toast, copiedCode }
}
