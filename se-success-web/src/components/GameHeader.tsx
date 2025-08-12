interface GameHeaderProps {
  week: number;
  stamina: number;
  maxStamina: number;
  money?: number;
  turnCount?: number;
  weeksUntilMatch?: number;
  weeksUntilClear?: number;
}

export default function GameHeader({ 
  week, 
  stamina, 
  maxStamina, 
  money = 0, 
  turnCount = 0, 
  weeksUntilMatch = 0, 
  weeksUntilClear = 44 
}: GameHeaderProps) {
  const staminaPercentage = (stamina / maxStamina) * 100;
  
  return (
    <div className="w-full mb-6">
      {/* メインタイトル */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-white mb-2 animate-pulse hover:animate-bounce transition-all duration-300">
          SE研究者サクセス
        </h1>
        <p className="text-xl text-gray-200 hover:text-white transition-colors duration-300">
          能力値を育てて研究者として成長しよう！
        </p>
      </div>
      
      {/* ゲーム情報バー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 週数・学年 */}
        <div className="bg-blue-600 text-white p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg flex flex-col items-center justify-center">
          <div className="text-base font-bold">2年生 10月 1週</div>
          <div className="text-5xl font-bold">Week {week}</div>
        </div>
        
        {/* スタミナ */}
        <div className="bg-green-600 text-white p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
          <div className="text-base font-bold">⚡ スタミナ</div>
          <div className="text-xl font-bold">{stamina}/{maxStamina}</div>
          <div className="w-full bg-green-800 rounded-full h-2 mt-1 overflow-hidden">
            <div 
              className="bg-green-300 h-2 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${staminaPercentage}%` }}
            >
              {/* スタミナバーの光沢効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          {/* スタミナ警告表示 */}
          {staminaPercentage < 30 && (
            <div className="text-sm text-yellow-200 mt-1 animate-pulse">
              ⚠️ スタミナ不足
            </div>
          )}
        </div>
        
        {/* 所持金 */}
        <div className="bg-yellow-600 text-white p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
          <div className="text-base font-bold">所持金</div>
          <div className="text-xl font-bold hover:text-yellow-200 transition-colors duration-300">
            {money.toLocaleString()}円
          </div>
          {/* お金の絵文字 */}
          <div className="text-2xl mt-1">💰</div>
        </div>
        
        {/* ターン数・試合情報 */}
        <div className="bg-gray-600 text-white p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
          <div className="text-base font-bold">ターン数</div>
          <div className="text-sm hover:text-yellow-200 transition-colors duration-300">
            試合まで {weeksUntilMatch}週
          </div>
          <div className="text-sm hover:text-yellow-200 transition-colors duration-300">
            クリアまで {weeksUntilClear}週
          </div>
          {/* 進捗インジケーター */}
          <div className="text-2xl mt-1">
            {weeksUntilClear <= 10 ? '🔥' : weeksUntilClear <= 20 ? '⚡' : '📚'}
          </div>
        </div>
      </div>
    </div>
  );
}
