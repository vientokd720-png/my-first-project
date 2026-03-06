// 分析履歴エントリ
export interface AnalysisEntry {
  id: string
  inputText: string     // 分析した文章（先頭100文字プレビュー用）
  result: string        // マークダウン形式の分析結果
  createdAt: number
}

// API レスポンス
export interface AnalyzeResponse {
  result: string
  error?: string
}
