import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { GEMINI_MODEL, ANALYSIS_PROMPT, MAX_INPUT_LENGTH } from '@/constants'
import type { AnalyzeResponse } from '@/types'

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const { text } = await req.json()

    // 入力バリデーション
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ result: '', error: '文章を入力してください' }, { status: 400 })
    }
    if (text.trim().length < 50) {
      return NextResponse.json({ result: '', error: '50文字以上の文章を入力してください' }, { status: 400 })
    }
    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json({ result: '', error: `${MAX_INPUT_LENGTH}文字以内で入力してください` }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ result: '', error: 'APIキーが設定されていません' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: ANALYSIS_PROMPT + text,
    })

    const result = response.text ?? ''
    return NextResponse.json({ result })
  } catch (err) {
    console.error('[analyze] エラー:', err)

    // Gemini API エラーを解析してユーザーに分かりやすいメッセージを返す
    const message = err instanceof Error ? err.message : ''
    if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
      return NextResponse.json(
        { result: '', error: 'APIキーが無効です。.env.local の GEMINI_API_KEY を確認してください。' },
        { status: 500 }
      )
    }
    if (message.includes('RESOURCE_EXHAUSTED') || message.includes('quota')) {
      return NextResponse.json(
        { result: '', error: 'APIの利用制限に達しました。しばらく待ってから再試行してください。' },
        { status: 429 }
      )
    }
    if (message.includes('SAFETY')) {
      return NextResponse.json(
        { result: '', error: '入力内容がGeminiの安全ポリシーに該当しました。別の文章をお試しください。' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { result: '', error: '分析中にエラーが発生しました。しばらく待ってから再試行してください。' },
      { status: 500 }
    )
  }
}
