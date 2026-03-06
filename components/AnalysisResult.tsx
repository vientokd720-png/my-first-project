'use client'

import { useState } from 'react'
import { Copy, Check, FileText } from 'lucide-react'

interface AnalysisResultProps {
  result: string
}

// XSS対策: HTMLの特殊文字をエスケープ
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// マークダウンを安全なHTMLに変換
// ※ 必ずescapeHtmlで処理した文字列を入力とすること
function renderMarkdown(raw: string): string {
  // 先にHTMLエスケープして安全にする
  const escaped = escapeHtml(raw)

  return escaped
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-6 mb-3 pb-1 border-b border-gray-100">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-4 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono text-indigo-700">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2 text-gray-700"><span class="text-indigo-400 mt-0.5 flex-shrink-0">•</span><span>$1</span></li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (m) => `<ul class="space-y-1.5 my-2">${m}</ul>`)
    // [hul] に修正（| はリテラルでなく文字クラス内では OR 不要）
    .replace(/^(?!<[hul]).+$/gm, (line) => line.trim() ? `<p class="text-gray-700 leading-relaxed">${line}</p>` : '')
}

// 分析結果表示コンポーネント
export function AnalysisResult({ result }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden"
      style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.05)' }}
    >
      {/* ヘッダーバー */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100/80 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-800">文体分析レポート</span>
        </div>

        {/* コピーボタン */}
        <button
          onClick={handleCopy}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white/60 text-gray-600 border-gray-200/80 hover:bg-white hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" />コピー済み</>
          ) : (
            <><Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />コピー</>
          )}
        </button>
      </div>

      {/* マークダウンレンダリング（エスケープ済み） */}
      <div
        className="px-6 py-5 text-sm overflow-auto max-h-[60vh]"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
      />
    </div>
  )
}
