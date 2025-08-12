import { Action, Stats } from '@/types/game';
import { STAT_NAMES } from '@/constants/gameConstants';

interface ActionNotificationProps {
  action: Action;
  previousStats: Stats;
  currentStats: Stats;
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function ActionNotification({ 
  action, 
  previousStats, 
  currentStats, 
  isVisible, 
  onClose,
  onConfirm
}: ActionNotificationProps) {
  if (!isVisible) return null;

  // 各能力値に対応するアイコンを取得する関数
  const getStatIcon = (statKey: string) => {
    const statIcons: Record<string, string> = {
      writing: '✍️',
      coding: '💻',
      presentation: '🎤',
      collaboration: '🤝',
      power: '💪',
      catchup: '📡',
      english: '🌍',
      communication: '💬',
      insight: '💡',
    };
    return statIcons[statKey] || '❓';
  };

  // 能力値の変化を計算
  const statChanges = Object.entries(action.effect)
    .filter(([_, value]) => value !== 0 && value !== undefined)
    .map(([key, value]) => {
      const statName = key === 'power' ? '体力' : STAT_NAMES[key as keyof Stats];
      return { key, name: statName, value, isPositive: value > 0 };
    });

  // スタミナの変化を計算
  const staminaChange = action.id === 'rest' 
    ? Math.floor(10 + (previousStats.power / 100) * 20) // 休む場合は体力に応じて回復
    : -action.staminaCost;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fadeIn"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        // 背景クリックでも閉じないようにする
        e.stopPropagation();
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* アバター画像エリア */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-center relative">
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="/rearcher_avator.png" 
                alt="研究者アバター" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* レベル表示 */}
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
              Lv.1
            </div>
          </div>
          
          {/* アクション名 */}
          <div className="mt-4 text-white">
            <div className="text-lg font-bold">{action.name}</div>
            <div className="text-sm opacity-90">を実行しました！</div>
          </div>
        </div>

        {/* 会話ウィンドウエリア */}
        <div className="p-6 bg-gray-50">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-gray-800 mb-2">
              能力値の変化
            </div>
          </div>

          {/* 能力値の変化表示 */}
          <div className="space-y-3 mb-4">
            {statChanges.map((change, index) => (
              <div 
                key={change.key}
                className={`
                  flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300
                  ${change.isPositive 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                  }
                  animate-slideIn
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {getStatIcon(change.key)}
                  </span>
                  <span className="font-medium">{change.name}</span>
                </div>
                <span className={`font-bold text-lg ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {change.isPositive ? '+' : ''}{change.value}
                </span>
              </div>
            ))}

            {/* スタミナの変化表示 */}
            {staminaChange !== 0 && (
              <div 
                className={`
                  flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300
                  ${staminaChange > 0 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                  }
                  animate-slideIn
                `}
                style={{ animationDelay: `${statChanges.length * 100}ms` }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    ⚡
                  </span>
                  <span className="font-medium">スタミナ</span>
                </div>
                <span className={`font-bold text-lg ${staminaChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {staminaChange > 0 ? '+' : ''}{staminaChange}
                </span>
              </div>
            )}

            {/* お金の報酬表示 */}
            {action.moneyReward && action.moneyReward > 0 && (
              <div 
                className="flex items-center justify-between p-3 rounded-lg border-2 bg-yellow-50 border-yellow-200 text-yellow-800 transition-all duration-300 animate-slideIn"
                style={{ animationDelay: `${(statChanges.length + (staminaChange !== 0 ? 1 : 0)) * 100}ms` }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💰</span>
                  <span className="font-medium">報酬</span>
                </div>
                <span className="font-bold text-lg text-yellow-600">
                  +{action.moneyReward}円
                </span>
              </div>
            )}
          </div>

          {/* 閉じるボタン */}
          <div className="text-center">
            <button
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 font-medium"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
