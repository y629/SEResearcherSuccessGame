import { RandomEvent } from '@/types/game';
import { useState, useEffect } from 'react';

interface RandomEventModalProps {
  event: RandomEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyEffects: (effects: any) => void;
}

export default function RandomEventModal({ event, isOpen, onClose, onApplyEffects }: RandomEventModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (event && isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      // 自動で閉じる機能を削除
    }
  }, [event, isOpen]);

  if (!event || !isOpen || !isVisible) return null;

  const handleConfirm = () => {
    // 確認ボタンが押された時の処理
    onApplyEffects(event.effect);
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 500);
  };

  const getEffectText = () => {
    const effects: string[] = [];
    Object.entries(event.effect).forEach(([key, value]) => {
      if (value !== undefined && value !== 0) {
        const isPositive = value > 0;
        const sign = isPositive ? '+' : '';
        const icon = getStatIcon(key);
        effects.push(`${icon} ${sign}${value} ${getStatName(key)}`);
      }
    });
    return effects.join(', ');
  };

  const getStatIcon = (key: string) => {
    const statIcons: Record<string, string> = {
      writing: '📝',
      coding: '💻',
      presentation: '🎤',
      collaboration: '🤝',
      power: '💪',
      catchup: '📚',
      english: '🌍',
      communication: '💬',
      insight: '💡',
      money: '💰',
      stamina: '⚡',
      research: '🔬',
    };
    return statIcons[key] || '📊';
  };

  const getStatName = (key: string) => {
    const statNames: Record<string, string> = {
      writing: '論文執筆力',
      coding: 'コーディング力',
      presentation: 'プレゼン力',
      collaboration: '共同研究力',
      power: '体力',
      catchup: 'キャッチアップ力',
      english: '英語力',
      communication: 'コミュ力',
      insight: 'ひらめき力',
      money: 'お金',
      stamina: 'スタミナ',
      research: '研究進捗',
    };
    return statNames[key] || key;
  };

  const getEventIcon = () => {
    // イベントの種類に応じてアイコンを返す
    if (event.effect.money && event.effect.money > 0) return '💰';
    if (event.effect.insight && event.effect.insight > 0) return '💡';
    if (event.effect.collaboration && event.effect.collaboration > 0) return '🤝';
    if (event.effect.stamina && event.effect.stamina < 0) return '😰';
    return '🎉';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`
        relative bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-blue-400 
        rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl
        transform transition-all duration-500 ease-out
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* 装飾的な背景要素 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg"></div>
        
        {/* ヘッダー */}
        <div className="relative text-center mb-4">
          <div className="text-4xl mb-2 animate-bounce">
            {getEventIcon()}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {event.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* イベント説明 */}
        <div className="relative mb-6">
          <p className="text-gray-200 text-center leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* 効果表示 */}
        {Object.keys(event.effect).length > 0 && (
          <div className="relative mb-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">効果</h3>
              <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-600/50">
                <p className="text-white font-medium">
                  {getEffectText()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 確認ボタン */}
        <div className="relative text-center mb-4">
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg 
                     hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105
                     shadow-lg hover:shadow-xl border border-blue-400"
          >
            確認
          </button>
        </div>

        {/* 装飾的なフッター */}
        <div className="relative text-center">
          <div className="text-xs text-blue-300 opacity-70">
            確認ボタンを押してイベントを適用してください
          </div>
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 500);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
