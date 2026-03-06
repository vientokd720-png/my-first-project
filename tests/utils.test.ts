import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateId,
  loadHistory,
  saveHistory,
  addToHistory,
  getPreview,
  formatDate,
} from '@/utils'
import { MAX_HISTORY } from '@/constants'
import type { AnalysisEntry } from '@/types'

const makeEntry = (id: string): AnalysisEntry => ({
  id,
  inputText: `テスト文章 ${id}`,
  result: `# 分析結果 ${id}`,
  createdAt: Date.now(),
})

describe('generateId', () => {
  it('ユニークなIDを生成する', () => {
    expect(generateId()).not.toBe(generateId())
    expect(generateId()).toMatch(/^entry-/)
  })
})

describe('loadHistory / saveHistory', () => {
  beforeEach(() => localStorage.clear())

  it('空の場合は空配列を返す', () => {
    expect(loadHistory()).toEqual([])
  })

  it('保存した履歴を読み込める', () => {
    const entries = [makeEntry('1')]
    saveHistory(entries)
    expect(loadHistory()).toEqual(entries)
  })

  it('不正なJSONは空配列を返す', () => {
    localStorage.setItem('writing-style-history', 'bad json')
    expect(loadHistory()).toEqual([])
  })
})

describe('addToHistory', () => {
  it('先頭に追加される', () => {
    const existing = [makeEntry('old')]
    const newEntry = makeEntry('new')
    const result = addToHistory(existing, newEntry)
    expect(result[0].id).toBe('new')
  })

  it(`最大${MAX_HISTORY}件を超えない`, () => {
    const existing = Array.from({ length: MAX_HISTORY }, (_, i) => makeEntry(String(i)))
    const result = addToHistory(existing, makeEntry('extra'))
    expect(result.length).toBe(MAX_HISTORY)
  })
})

describe('getPreview', () => {
  it('60文字以下はそのまま返す', () => {
    expect(getPreview('短い文章')).toBe('短い文章')
  })

  it('60文字を超えると省略される', () => {
    const long = 'あ'.repeat(70)
    const preview = getPreview(long)
    expect(preview.endsWith('…')).toBe(true)
    expect(preview.length).toBeLessThanOrEqual(61)
  })

  it('改行をスペースに変換する', () => {
    expect(getPreview('行1\n行2')).toBe('行1 行2')
  })
})

describe('formatDate', () => {
  it('YYYY/MM/DD HH:mm形式で返す', () => {
    const ts = new Date('2026-03-06T09:05:00').getTime()
    expect(formatDate(ts)).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/)
  })
})
