// @vitest-environment node
import path from 'node:path'
import ts from 'typescript'
import { expect, it } from 'vitest'
import { snipItems } from '../src/data/index.ts'

it('모든 TS 스니펫은 strict 타입 검사를 통과하고 JS 스니펫은 구문 오류가 없다', () => {
  const files = new Map<string, string>()
  for (const item of snipItems) {
    const extension = item.stack === 'react' ? 'tsx' : 'ts'
    files.set(
      path.resolve('src', `__snippet_${item.id}_ts.${extension}`),
      item.code.ts + '\nexport {};',
    )
    if (item.code.js) {
      files.set(
        path.resolve('src', `__snippet_${item.id}_js.${item.stack === 'react' ? 'jsx' : 'js'}`),
        item.code.js + '\nexport {};',
      )
    }
  }
  const options: ts.CompilerOptions = {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    allowJs: true,
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    types: ['react'],
    lib: ['lib.es2023.d.ts', 'lib.dom.d.ts'],
  }
  const host = ts.createCompilerHost(options)
  const originalGetSourceFile = host.getSourceFile.bind(host)
  const originalFileExists = host.fileExists.bind(host)
  const originalReadFile = host.readFile.bind(host)
  host.fileExists = (filename) => files.has(path.resolve(filename)) || originalFileExists(filename)
  host.readFile = (filename) => files.get(path.resolve(filename)) ?? originalReadFile(filename)
  host.getSourceFile = (filename, languageVersion, onError, shouldCreateNewSourceFile) => {
    const text = files.get(path.resolve(filename))
    return text === undefined
      ? originalGetSourceFile(filename, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(filename, text, languageVersion, true)
  }
  const program = ts.createProgram([...files.keys()], options, host)
  expect(
    program.getSourceFiles().filter((file) => files.has(path.resolve(file.fileName))),
  ).toHaveLength(files.size)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  expect(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => '\n',
    }),
  ).toBe('')
}, 15000)
