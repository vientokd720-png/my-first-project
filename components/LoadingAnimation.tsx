// 分析中ローディングアニメーション
export function LoadingAnimation() {
  const steps = [
    '文章を解析中…',
    '語彙パターンを検出中…',
    '文体の特徴を抽出中…',
    'ライティングルールを生成中…',
  ]

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-8"
      style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.05)' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* スピニングリング */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-400 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
        </div>

        {/* ステップインジケーター */}
        <div className="space-y-2 w-full max-w-xs">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3"
              style={{ animation: `fadeInStep 0.5s ease-out ${i * 0.4}s both` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: '#6366f1',
                  animation: `pulse 1.5s ease-in-out ${i * 0.4}s infinite`,
                }}
              />
              <span className="text-sm text-gray-500">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInStep {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
