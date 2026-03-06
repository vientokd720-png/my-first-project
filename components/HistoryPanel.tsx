'use client'

import { useState } from 'react'
import { History, ChevronDown, Trash2, X, Clock } from 'lucide-react'
import type { AnalysisEntry } from '@/types'
import { getPreview, formatDate } from '@/utils'
import { MAX_HISTORY } from '@/constants'

interface HistoryPanelProps {
  entries: AnalysisEntry[]
  onSelect: (entry: AnalysisEntry) => void
  onRemove: (id: string) => void
  onClear: () => void
}

// 履歴パネルコンポーネント
export function HistoryPanel({ entries, onSelect, onRemove, onClear }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (entries.length === 0) return null

  return (
    <div className="relative">
      {/* トグルボタン */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 hover:bg-white/90 backdrop-blur-xl border border-white/60 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium text-gray-700"
        style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)' }}
      >
        <History className="w-4 h-4 text-indigo-500" />
        <span>履歴 {entries.length}/{MAX_HISTORY}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ドロップダウンパネル */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/60 overflow-hidden z-40"
          style={{
            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.05)',
            animation: 'historyIn 0.2s cubic-bezier(0.34,1.4,0.64,1) both',
            minWidth: '320px',
          }}
        >
          {/* パネルヘッダー */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100/80">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">分析履歴</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClear}
                className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />全削除
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* エントリーリスト */}
          <div className="divide-y divide-gray-50">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-start gap-3 px-4 py-3 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                onClick={() => { onSelect(entry); setIsOpen(false) }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium truncate">
                    {getPreview(entry.inputText)}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(entry.id) }}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes historyIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
