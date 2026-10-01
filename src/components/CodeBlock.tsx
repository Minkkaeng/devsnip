import Prism from 'prismjs'
import 'prismjs/components/prism-css.js'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-tsx.js'
import { useMemo } from 'react'
import type { ReactNode } from 'react'

// React owns the DOM; Prism is used only as a tokenizer.
Prism.manual = true

interface TokenNode {
  type: string
  content: string | TokenNode | (string | TokenNode)[]
  alias?: string | string[]
}

function renderTokens(
  tokens: string | TokenNode | (string | TokenNode)[],
  path = 'token',
): ReactNode {
  if (typeof tokens === 'string') return tokens
  if (Array.isArray(tokens))
    return tokens.map((token, index) => renderTokens(token, `${path}-${index}`))
  const aliases = tokens.alias ? (Array.isArray(tokens.alias) ? tokens.alias : [tokens.alias]) : []
  return (
    <span key={path} className={['token', tokens.type, ...aliases].join(' ')}>
      {renderTokens(tokens.content, path)}
    </span>
  )
}

export function CodeBlock({
  code,
  language,
  panelId,
  tabId,
}: {
  code: string
  language: string
  panelId: string
  tabId: string
}) {
  const highlighted = useMemo(
    () =>
      renderTokens(Prism.tokenize(code, Prism.languages[language] ?? Prism.languages.javascript)),
    [code, language],
  )
  return (
    <div className="code-panel" role="tabpanel" id={panelId} aria-labelledby={tabId}>
      <div className="code-scroll">
        <div className="line-numbers" aria-hidden="true">
          {code.split('\n').map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        <pre
          tabIndex={0}
          data-shortcuts="code"
          aria-label="코드 예제. Tab으로 언어 전환, Enter로 복사"
        >
          <code className={`language-${language}`}>{highlighted}</code>
        </pre>
      </div>
    </div>
  )
}
