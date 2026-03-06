'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { TextInput } from '@/components/TextInput'
import { AnalysisResult } from '@/components/AnalysisResult'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { HistoryPanel } from '@/components/HistoryPanel'
import { useHistory } from '@/hooks/useHistory'
import type { AnalysisEntry } from '@/types'
import { Lightbulb, Brain, Zap } from 'lucide-react'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [analyzedText, setAnalyzedText] = useState('')  // 分析済みテキストを記録
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { entries, addEntry, removeEntry, clearHistory } = useHistory()

  // テキストが変わったら結果をクリア（古い分析が残らないように）
  const handleTextChange = useCallback((newText: string) => {
    setText(newText)
    if (result && newText !== analyzedText) {
      setResult('')
      setError('')
    }
  }, [result, analyzedText])

  // 分析実行
  const handleAnalyze = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    setError('')
    setResult('')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || '分析に失敗しました')
        return
      }

      setResult(data.result)
      setAnalyzedText(text)  // 分析済みテキストを記録
      addEntry(text, data.result)
    } catch {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [text, isLoading, addEntry])

  // 履歴から復元
  const handleSelectHistory = (entry: AnalysisEntry) => {
    setText(entry.inputText)
    setResult(entry.result)
    setAnalyzedText(entry.inputText)  // 履歴復元時も同期
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-x-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-400/8 to-orange-400/8 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="relative pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">

        {/* ページタイトル */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-3">
            あなたの文体を分析する
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            文章を入力するだけで、AIツールに渡せるライティングルールを自動生成します
          </p>
        </div>

        {/* 機能紹介（初回のみ表示） */}
        {!result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Brain, title: '文体を解析', desc: '語調・文の長さ・語彙の特徴など7項目を分析' },
              { icon: Zap, title: '即座に生成', desc: 'Gemini AIが数秒でライティングルールを生成' },
              { icon: Lightbulb, title: 'AIに活用', desc: 'ChatGPT・Claude等にそのままコピー&ペースト' },
            ].map((item) => (
              <div key={item.title}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* テキスト入力 */}
        <TextInput
          value={text}
          onChange={handleTextChange}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* 履歴パネル */}
        {entries.length > 0 && (
          <div className="mt-3">
            <HistoryPanel
              entries={entries}
              onSelect={handleSelectHistory}
              onRemove={removeEntry}
              onClear={clearHistory}
            />
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200/60 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ローディング */}
        {isLoading && (
          <div className="mt-6">
            <LoadingAnimation />
          </div>
        )}

        {/* 分析結果 */}
        {result && !isLoading && (
          <div className="mt-6" style={{ animation: 'resultIn 0.4s ease-out both' }}>
            <AnalysisResult result={result} />
          </div>
        )}

        {/* フッター注記 */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            このアプリはGemini APIの無料枠を利用しています。入力した文章はGoogleのサービス改善に使用される場合があります。<br />
            個人情報や機密情報は入力しないでください。
          </p>
        </div>
      </main>

      <style>{`
        @keyframes resultIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
