import type { AnalysisEntry } from '@/types'
import { STORAGE_KEY, MAX_HISTORY } from '@/constants'

// ユニークID生成
export function generateId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// 履歴をローカルストレージから読み込む
export function loadHistory(): AnalysisEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as AnalysisEntry[]
  } catch {
    return []
  }
}

// 履歴をローカルストレージに保存
export function saveHistory(entries: AnalysisEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // 容量超過時は無視
  }
}

// 新しいエントリを履歴に追加（最大件数を超えたら古いものを削除）
export function addToHistory(
  entries: AnalysisEntry[],
  newEntry: AnalysisEntry
): AnalysisEntry[] {
  const updated = [newEntry, ...entries]
  return updated.slice(0, MAX_HISTORY)
}

// 文章の先頭プレビューテキストを生成
export function getPreview(text: string, maxLen = 60): string {
  const oneliner = text.replace(/\n/g, ' ').trim()
  return oneliner.length > maxLen ? oneliner.slice(0, maxLen) + '…' : oneliner
}

// 日付を「YYYY/MM/DD HH:mm」形式に変換
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
