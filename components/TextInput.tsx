'use client'

import { useRef } from 'react'
import { Sparkles, X } from 'lucide-react'
import { MAX_INPUT_LENGTH } from '@/constants'

interface TextInputProps {
  value: string
  onChange: (v: string) => void
  onAnalyze: () => void
  isLoading: boolean
}

// 文章入力エリア
export function TextInput({ value, onChange, onAnalyze, isLoading }: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charCount = value.length
  const isOverLimit = charCount > MAX_INPUT_LENGTH
  const isTooShort = value.trim().length < 50
  const canAnalyze = !isLoading && !isOverLimit && !isTooShort

  return (
    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden"
      style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.05)' }}
    >
      {/* テキストエリア */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="分析したい文章を貼り付けてください&#10;&#10;ブログ記事・SNS投稿・メール・日記など、あなたが書いた文章をここに入力すると、その文体・ライティングスタイルを分析します。&#10;（最低50文字・最大2000文字）"
        className="w-full h-56 md:h-64 p-5 bg-transparent resize-none outline-none text-gray-800 text-sm leading-relaxed placeholder:text-gray-400"
        aria-label="分析する文章"
      />

      {/* フッター（文字数・ボタン） */}
      <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-gray-100/80">
        <div className="flex items-center gap-3">
          {/* 文字数カウンター */}
          <span className={`text-xs font-mono font-medium transition-colors ${
            isOverLimit ? 'text-red-500' : charCount > MAX_INPUT_LENGTH * 0.9 ? 'text-amber-500' : 'text-gray-400'
          }`}>
            {charCount.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()}
          </span>

          {/* クリアボタン */}
          {value && (
            <button
              onClick={() => onChange('')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3 h-3" />
              クリア
            </button>
          )}
        </div>

        {/* 分析ボタン */}
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`
            group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
            transition-all duration-200
            ${canAnalyze
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          style={canAnalyze ? { boxShadow: '0 4px 14px -2px rgba(99,102,241,0.5)' } : {}}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              分析中…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
              文体を分析
            </>
          )}
        </button>
      </div>

      {/* 入力ガイド */}
      {isTooShort && value.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-amber-600">あと {50 - value.trim().length} 文字以上入力してください</p>
        </div>
      )}
      {isOverLimit && (
        <div className="px-4 pb-3">
          <p className="text-xs text-red-500">{charCount - MAX_INPUT_LENGTH} 文字オーバーです</p>
        </div>
      )}
    </div>
  )
}
