import { Check, TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CopyToast } from '../hooks/useCopyCode.ts'

export function Toast({ toast }: { toast: CopyToast | null }) {
  return <div className="toast-region" role="status" aria-live="polite" aria-atomic="true"><AnimatePresence>{toast && <motion.div key={toast.id} className={`toast toast-${toast.kind}`} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}>{toast.kind === 'success' ? <Check size={18} /> : <TriangleAlert size={18} />}<span>{toast.message}</span></motion.div>}</AnimatePresence></div>
}
