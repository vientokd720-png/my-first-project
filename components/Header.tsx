import { PenLine } from 'lucide-react'

// Glassmorphism ヘッダー
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/75 backdrop-blur-2xl border-b border-black/[0.06]"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px -4px rgba(0,0,0,0.06)' }}
      />
      <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[14px] shadow-lg"
            style={{ boxShadow: '0 4px 14px -2px rgba(99,102,241,0.5)' }}
          >
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Writing Style Analyzer
            </h1>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              あなたの文体をAIに伝えるルールを生成
            </p>
          </div>
        </div>

        {/* 無料枠利用の注記 */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] text-amber-700 font-medium">Gemini 無料枠利用中（サービス改善に使われます）</span>
        </div>
      </div>
    </header>
  )
}
