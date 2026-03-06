import { useState, useCallback } from 'react'
import type { AnalysisEntry } from '@/types'
import { generateId, loadHistory, saveHistory, addToHistory } from '@/utils'

export function useHistory() {
  const [entries, setEntries] = useState<AnalysisEntry[]>(() => loadHistory())

  // 新しい分析結果を履歴に追加
  const addEntry = useCallback((inputText: string, result: string) => {
    const newEntry: AnalysisEntry = {
      id: generateId(),
      inputText,
      result,
      createdAt: Date.now(),
    }
    setEntries((prev) => {
      const updated = addToHistory(prev, newEntry)
      saveHistory(updated)
      return updated
    })
    return newEntry
  }, [])

  // 指定IDの履歴を削除
  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      saveHistory(updated)
      return updated
    })
  }, [])

  // 全履歴を削除
  const clearHistory = useCallback(() => {
    setEntries([])
    saveHistory([])
  }, [])

  return { entries, addEntry, removeEntry, clearHistory }
}
