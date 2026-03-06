import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistory } from '@/hooks/useHistory'
import { MAX_HISTORY } from '@/constants'

beforeEach(() => localStorage.clear())

describe('useHistory', () => {
  it('初期状態は空配列', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current.entries).toEqual([])
  })

  it('addEntryで履歴を追加できる', () => {
    const { result } = renderHook(() => useHistory())
    act(() => { result.current.addEntry('テスト文章', '# 結果') })
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].inputText).toBe('テスト文章')
  })

  it('removeEntryで指定IDを削除できる', () => {
    const { result } = renderHook(() => useHistory())
    let id = ''
    act(() => { id = result.current.addEntry('文章', '結果').id })
    act(() => { result.current.removeEntry(id) })
    expect(result.current.entries).toHaveLength(0)
  })

  it('clearHistoryで全削除できる', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry('A', '結果A')
      result.current.addEntry('B', '結果B')
    })
    act(() => { result.current.clearHistory() })
    expect(result.current.entries).toHaveLength(0)
  })

  it(`最大${MAX_HISTORY}件を超えない`, () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      for (let i = 0; i < MAX_HISTORY + 2; i++) {
        result.current.addEntry(`文章${i}`, `結果${i}`)
      }
    })
    expect(result.current.entries.length).toBe(MAX_HISTORY)
  })

  it('localStorageに保存される', () => {
    const { result } = renderHook(() => useHistory())
    act(() => { result.current.addEntry('保存テスト', '結果') })
    const saved = localStorage.getItem('writing-style-history')
    expect(saved).not.toBeNull()
    expect(JSON.parse(saved!)[0].inputText).toBe('保存テスト')
  })
})
