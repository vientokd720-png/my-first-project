
# Writing Style Analyzer

文章からあなた特有の文体・ライティングルールを抽出し、AIツールで活用しやすい形式で出力するアプリ。

## 機能

- **文体分析** — 入力した文章（50〜2000文字）からGemini AIが7項目の文体特徴を抽出
- **MarkDown出力** — ChatGPT・Claude等にそのままコピーできるルール集を生成
- **ワンクリックコピー** — 分析結果をクリップボードにコピー
- **履歴保存** — 最大5件の分析結果をlocalStorageに保存・復元

## セットアップ

```bash
npm install
cp .env.local.example .env.local  # APIキーを設定
npm run dev
```

`.env.local` に Gemini API キーを設定：
```
GEMINI_API_KEY=your_api_key_here
```

APIキーは [Google AI Studio](https://aistudio.google.com/) で取得できます。

## コマンド

```bash
npm run dev       # 開発サーバー起動 (http://localhost:3000)
npm run build     # プロダクションビルド
npm run lint      # ESLint
npm test          # テスト実行
```

## 使用モデル

**Gemini 2.0 Flash** — 無料枠内で利用可能な高速モデル

> 無料枠での利用はGoogleのサービス改善に使用される場合があります。
> 個人情報・機密情報は入力しないでください。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4.x
- Gemini AI (`@google/genai`)
- Vitest + React Testing Library

## ディレクトリ構成

```
├── app/
│   ├── api/analyze/route.ts  # Gemini API サーバールート
│   ├── page.tsx              # メインページ
│   └── globals.css
├── components/
│   ├── Header.tsx            # Glassmorphismヘッダー
│   ├── TextInput.tsx         # 文章入力エリア
│   ├── AnalysisResult.tsx    # 分析結果（Markdown表示・コピー）
│   ├── LoadingAnimation.tsx  # 分析中アニメーション
│   └── HistoryPanel.tsx      # 履歴ドロップダウン
├── hooks/
│   └── useHistory.ts         # 履歴管理フック
├── types/index.ts
├── constants/index.ts        # モデル名・プロンプト・定数
└── utils/index.ts
```