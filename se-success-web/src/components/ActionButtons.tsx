import { Action, Stats } from '@/types/game';
import { ACTIONS } from '@/constants/gameConstants';
import { useState } from 'react';

interface ActionButtonsProps {
  stats: Stats & { stamina: number }; // 現在のスタミナ状態を含む
  onAction: (action: Action) => void;
}

export default function ActionButtons({ stats, onAction }: ActionButtonsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // デフォルトのアクション名を定義（フォールバック用）
  const DEFAULT_ACTION_NAMES: Record<string, string> = {
    seminar: 'セミナー参加',
    coding: 'コーディング',
    writing: '論文執筆',
    reading: '国際論文読み',
    rest: '休む',
    networking: '懇親会参加',
    workout: '筋トレ',
    ta: 'TA（ティーチ）',
  };

  const getActionLabel = (action: Action) =>
    (action.name && action.name.trim()) || DEFAULT_ACTION_NAMES[action.id] || action.id;

  const canExecuteAction = (action: Action): boolean => {
    // 休むはいつでも実行可能
    if (action.id === 'rest') return true;
    // スタミナが不足している場合は実行不可
    return stats.stamina >= action.staminaCost;
  };

  const getActionIcon = (actionId: string) => {
    const icons: Record<string, string> = {
      seminar: '🎓',
      coding: '💻',
      writing: '✍️',
      reading: '📚',
      rest: '😴',
      networking: '🍻',
      workout: '🏋️',
      ta: '👨‍🏫',
    };
    return icons[actionId] || '❓';
  };

  const getActionLevel = (actionId: string) => {
    // 簡単なレベル計算（実際のゲームではより複雑なロジック）
    const levels: Record<string, number> = {
      seminar: 2,
      coding: 3,
      writing: 2,
      reading: 1,
      rest: 1,
      networking: 1,
      workout: 2,
      ta: 2,
    };
    return levels[actionId] || 1;
  };

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

  const getStatName = (statKey: string) => {
    const statNames: Record<string, string> = {
      writing: '論文',
      coding: '実装',
      presentation: 'プレゼン',
      collaboration: '共同研究',
      power: '体力',
      catchup: 'キャッチアップ',
      english: '英語',
      communication: 'コミュ力',
      insight: 'ひらめき',
    };
    return statNames[statKey] || statKey;
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 text-center text-white animate-pulse">
        行動メニュー / ACTION MENU
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
        {ACTIONS.map((action) => {
          const canExecute = canExecuteAction(action);
          const isDisabled = !canExecute;
          const icon = getActionIcon(action.id);
          const level = getActionLevel(action.id);
          const isHovered = hoveredAction === action.id;
          
          return (
            <div key={action.id} className="relative flex flex-col">
                              <button
                onClick={() => onAction(action)}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                disabled={isDisabled}
                className={`
                  relative p-4 pb-8 rounded-lg border-2 text-center transition-all duration-300
                  h-[180px] overflow-hidden flex flex-col
                  transform active:scale-95
                  ${isDisabled 
                    ? 'relative !bg-slate-50 before:absolute before:inset-0 before:bg-gray-500/50 before:rounded-lg border-gray-600 text-gray-400 cursor-not-allowed' 
                    : '!bg-slate-50 border-blue-400 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/25 cursor-pointer'
                  }
                `}
              >
                {/* レベル表示 - アニメーション付き */}
                <div className={`
                  absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold
                  transition-all duration-300 transform
                  ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
                `}>
                  Lv.{level}
                </div>
                
                {/* アイコン：固定高さの枠でレイアウトを安定させる */}
                <div className="h-12 mb-2 flex items-center justify-center"> {/* ← 枠は常に高さ固定 */}
                  <span
                    className={`
                      text-3xl inline-block transition-transform duration-300
                      ${isHovered ? 'scale-110 animate-bounce' : 'scale-100'}
                    `}
                    style={{ transformOrigin: 'center' }}
                  >
                    {icon}
                  </span>
                </div>
                
                {/* タイトル：念のため最小高さを確保 */}
                <div className="font-bold text-sm mb-1 text-gray-900 line-clamp-2 leading-snug min-h-[1.5rem]"
                     style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {getActionLabel(action)}
                </div>
                
                {/* スタミナ消費/回復 */}
                <div className="text-xs text-gray-700 mb-1">
                  {action.id === 'rest' ? (
                    <>
                      <span className="font-medium">スタミナ回復: </span>
                      <span className="text-green-600">
                        +{Math.floor(10 + (stats.power / 100) * 20)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">スタミナ: </span>
                      <span className={action.staminaCost === 0 ? "text-green-600" : "text-red-600"}>
                        {action.staminaCost === 0 ? "なし" : `-${action.staminaCost}`}
                      </span>
                    </>
                  )}
                </div>
                
                {/* 簡易効果表示（位置を絶対下部に固定、常に表示） */}
                {!isDisabled && (
                  <div className="absolute bottom-2 left-0 right-0 text-sm text-gray-400">
                    <div className="flex justify-center items-center gap-1 h-7 leading-none">
                      {action.id === 'rest' ? (
                        // 休む行動の場合はスタミナ回復アイコンを表示
                        <span className="text-green-500 text-lg">⚡</span>
                      ) : (
                        // その他の行動は従来通り
                        (() => {
                          const entries = Object.entries(action.effect).filter(([_, v]) => v !== 0 && v !== undefined);
                          const shown = entries.slice(0, 4);
                          const rest = entries.length - shown.length;
                          
                          return (
                            <>
                              {shown.map(([key, value]) => {
                                const isPositive = value! > 0;
                                const statIcon = getStatIcon(key);
                                return (
                                  <span 
                                    key={key} 
                                    className={`
                                      text-lg transition-all duration-200
                                      ${isPositive ? 'text-green-500' : 'text-red-500'}
                                    `}
                                  >
                                    {statIcon}
                                  </span>
                                );
                              })}
                              {rest > 0 && (
                                <span className="px-1.5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold align-middle">
                                  +{rest}
                                </span>
                              )}
                            </>
                          );
                        })()
                      )}
                    </div>
                  </div>
                )}
              </button>

                          {/* 詳細は絶対配置でボタンの外側。レイアウトを押し広げない */}
            {isHovered && !isDisabled && (
              <div
                className="absolute left-0 right-0 top-full mt-2 z-20
                           bg-gray-800 border border-gray-600 rounded-lg p-3
                           text-white text-sm shadow-lg"
              >
                  <div className="font-medium text-blue-400 mb-2 text-center">能力向上値</div>
                  <div className="space-y-2">
                    {(() => {
                      const entries = Object.entries(action.effect).filter(([_, v]) => v !== 0 && v !== undefined);
                      if (entries.length === 0) {
                        return <div className="text-gray-400 text-center">なし</div>;
                      }
                      
                      return entries.map(([key, value], index) => {
                        const isPositive = value! > 0;
                        const statIcon = getStatIcon(key);
                        const statName = getStatName(key);
                        return (
                          <div 
                            key={key} 
                            className={`
                              flex items-center justify-between transition-all duration-200
                              ${isPositive ? 'text-green-400' : 'text-red-400'}
                            `}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{statIcon}</span>
                              <span className="text-xs">{statName}</span>
                            </div>
                            <span className="font-bold text-sm">
                              {isPositive ? '+' : ''}{value}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
