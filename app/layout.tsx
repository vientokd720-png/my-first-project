import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Writing Style Analyzer - あなたの文体をAIに伝える',
  description: '文章を入力するだけで、ChatGPT・Claude等のAIツールに渡せるライティングルールを自動生成するアプリ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
