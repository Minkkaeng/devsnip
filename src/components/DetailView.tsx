import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { techStacks } from '../data/index.ts'
import { getAvailableCodeTabs, getCodeTab } from '../lib/selection.ts'
import { useSnipStore } from '../store/useSnipStore.ts'
import type { CodeTab, SnipItem } from '../types/snip.ts'
import { CodeBlock } from './CodeBlock.tsx'

export function DetailView({
  item,
  copiedCode,
  onCopy,
}: {
  item: SnipItem | null
  copiedCode: string | null
  onCopy: () => void
}) {
  const preferredTab = useSnipStore((state) => state.activeCodeTab)
  const setTab = useSnipStore((state) => state.setCodeTab)
  const setMobileView = useSnipStore((state) => state.setMobileView)
  const tab = getCodeTab(item, preferredTab)
  function activateTab(next: CodeTab) {
    setTab(next)
    document.getElementById(`code-tab-${next}`)?.focus()
  }
  if (!item)
    return (
      <section className="detail-panel detail-empty" aria-label="스니펫 상세">
        <Code2 size={38} />
        <h2>다음 코드가 기다리고 있어요.</h2>
        <p>검색어와 카테고리를 변경해 스니펫을 찾아보세요.</p>
      </section>
    )
  const stack = techStacks.find((tech) => tech.id === item.stack)!
  const code = item.code[tab]!
  const copied = copiedCode === code
  const language =
    tab === 'css'
      ? 'css'
      : item.stack === 'react'
        ? `${tab}x`
        : tab === 'js'
          ? 'javascript'
          : 'typescript'
  const availableTabs = getAvailableCodeTabs(item)
  const tabOptions: readonly CodeTab[] = item.code.css ? ['css'] : ['js', 'ts']
  const codeTabLabels: Record<CodeTab, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    css: 'CSS',
  }
  const filename = `${item.title === 'useState' ? 'Counter' : item.title.replace(/[^a-zA-Z0-9]/g, '') || 'snippet'}.${language === 'jsx' || language === 'tsx' ? language : tab}`
  return (
    <section className="detail-panel" aria-label="스니펫 상세">
      <div className="detail-topbar">
        <button className="back-button" onClick={() => setMobileView('list')}>
          <ArrowLeft size={16} />
          목록
        </button>
        <div className="breadcrumb">
          <span>{stack.label}</span>
          <ChevronRight size={12} />
          <span>{item.category}</span>
          <ChevronRight size={12} />
          <strong>{item.title}</strong>
        </div>
        <span className="detail-topbar-label">THE QUICK REFERENCE</span>
      </div>
      <div className="detail-scroll" id="detail-scroll">
        <div className="detail-intro">
          <div className="detail-eyebrow">
            <span className={`stack-dot ${item.stack}`} />
            {stack.label.toUpperCase()} / {item.category.toUpperCase()}
          </div>
          <div className="detail-title-row">
            <h2>{item.title}</h2>
            <a href={item.docsUrl} className="docs-link" target="_blank" rel="noreferrer">
              공식 문서
              <ArrowUpRight size={14} />
            </a>
          </div>
          <p className="detail-summary">{item.summary}</p>
          <div className="detail-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="code-window">
          <div className="code-toolbar">
            <div className="code-tabs" role="tablist" aria-label="코드 언어">
              {tabOptions.map((codeTab) => (
                <button
                  key={codeTab}
                  role="tab"
                  id={`code-tab-${codeTab}`}
                  aria-selected={tab === codeTab}
                  aria-controls="snippet-code-panel"
                  tabIndex={tab === codeTab ? 0 : -1}
                  disabled={!item.code[codeTab]}
                  title={
                    codeTab === 'js' && !item.code.js
                      ? 'TypeScript 전용 타입 선언입니다'
                      : undefined
                  }
                  onClick={() => setTab(codeTab)}
                  onKeyDown={(event) => {
                    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                      event.preventDefault()
                      activateTab(
                        event.key === 'Home'
                          ? availableTabs[0]
                          : event.key === 'End'
                            ? availableTabs.at(-1)!
                            : availableTabs[
                                (availableTabs.indexOf(tab) +
                                  (event.key === 'ArrowRight' ? 1 : -1) +
                                  availableTabs.length) %
                                  availableTabs.length
                              ],
                      )
                    }
                  }}
                  className={`code-tab ${tab === codeTab ? 'is-active' : ''}`}
                >
                  <span className={`language-badge ${codeTab}`} aria-hidden="true">
                    {codeTab.toUpperCase()}
                  </span>
                  <span>{codeTabLabels[codeTab]}</span>
                  {tab === codeTab && (
                    <motion.span
                      className="tab-indicator"
                      layoutId="code-tab-indicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button
              className={`copy-button ${copied ? 'is-copied' : ''}`}
              onClick={onCopy}
              aria-label={`${codeTabLabels[tab]} 코드 복사`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? '복사 완료' : '코드 복사'}</span>
              <kbd>↵</kbd>
            </button>
          </div>
          <div className="file-bar">
            <div className="window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span>{filename}</span>
            <span className="file-bar-right">{code.split('\n').length} lines</span>
          </div>
          <CodeBlock
            code={code}
            language={language}
            panelId="snippet-code-panel"
            tabId={`code-tab-${tab}`}
          />
          <div className="code-bottom">
            <span>
              <span className="status-dot" />
              Ready to copy
            </span>
            <span>UTF-8</span>
          </div>
        </div>
        <div className="gotchas-section">
          <div className="gotchas-heading">
            <TriangleAlert size={17} />
            <h3>잠깐, 이것만 확인하세요</h3>
            <span>
              {item.gotchas.length} GOTCHA{item.gotchas.length > 1 ? 'S' : ''}
            </span>
          </div>
          {item.gotchas.map((gotcha, index) => (
            <details className="gotcha" key={`${item.id}-${index}`} open={index === 0}>
              <summary>
                <span className="gotcha-number">0{index + 1}</span>
                <span>{gotcha.title}</span>
                <ChevronDown size={16} />
              </summary>
              <p>{gotcha.description}</p>
            </details>
          ))}
        </div>
        <div className="detail-tip">
          <Lightbulb size={16} />
          <p>
            검색창에서 <kbd>↑</kbd> <kbd>↓</kbd>로 탐색, <kbd>Tab</kbd>으로 언어 전환, 다시{' '}
            <kbd>Tab</kbd>으로 포커스 이동, <kbd>Enter</kbd>로 복사하세요.
          </p>
        </div>
      </div>
    </section>
  )
}
