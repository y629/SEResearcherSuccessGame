import { ITEMS } from '@/constants/items';
import { useState, useEffect, useCallback } from 'react';

interface ItemListProps {
  inventory: string[];
  onClose: () => void;
  isOpen: boolean;
  onItemUse: (itemId: string) => void;
}

export default function ItemList({ inventory, onClose, isOpen, onItemUse }: ItemListProps) {
  // Escで閉じる
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isOpen, handleKeydown]);

  // isOpenがfalseの場合は何も表示しない
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    // 背景は見せつつ、わずかに暗く＆ぼかす
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="所持アイテムリスト"
    >
      {/* パネルにホバー浮遊＋入場アニメ */}
      <div
        onClick={stop}
        className={`
          max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto
          border-2 border-purple-400/80 rounded-2xl p-6
          bg-gray-900/80 backdrop-blur-xl
          shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          transform transition-all duration-200
          animate-fadeIn
          hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_16px_60px_rgba(0,0,0,0.55)]
        `}
        style={{ willChange: 'transform' }}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">所持アイテム</h2>
          <div className="text-right">
            <div className="text-sm text-gray-400">所持数</div>
            <div className="text-xl font-bold text-purple-400">{inventory.length}個</div>
          </div>
        </div>

        {/* アイテム一覧 */}
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <div className="text-xl text-gray-400 mb-2">所持アイテムがありません</div>
            <div className="text-sm text-gray-500">ショップでアイテムを購入してください</div>
          </div>
        ) : (
          <div className="space-y-4">
            {(() => {
              // アイテムごとの所持数をカウント
              const itemCounts: Record<string, number> = {};
              inventory.forEach(itemId => {
                itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
              });
              
              // ユニークなアイテムIDのリストを作成
              const uniqueItemIds = Object.keys(itemCounts);
              
              return uniqueItemIds.map((itemId) => {
                const item = ITEMS.find(i => i.id === itemId);
                const count = itemCounts[itemId];
                if (!item) return null;
                
                return (
                  <div key={itemId} className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-purple-400 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg">{item.name}</h3>
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            所持数: {count}個
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{item.description}</p>
                        
                        {/* 効果 */}
                        {Object.keys(item.effect).length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">効果:</div>
                            <div className="text-xs text-purple-300 bg-purple-900/30 rounded p-2 border border-purple-600/50">
                              {getEffectText(item.effect)}
                            </div>
                          </div>
                        )}
                        
                        {/* 持続期間 */}
                        <div className="text-xs text-gray-400 mb-3">
                          効果持続: {item.duration === 1 ? '1ターン' : `${item.duration}ターン`}
                        </div>
                        
                        {/* 使用ボタン */}
                        <button
                          onClick={() => onItemUse(itemId)}
                          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors border-2 border-purple-400 hover:border-purple-300"
                        >
                          使用する
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* 閉じるボタン */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

// 効果テキストを生成する関数
const getEffectText = (effects: any) => {
  const effectStrings: string[] = [];
  Object.entries(effects).forEach(([key, value]) => {
    if (value !== undefined && value !== 0 && value !== null) {
      const numValue = value as number;
      const isPositive = numValue > 0;
      const sign = isPositive ? '+' : '';
      effectStrings.push(`${sign}${numValue} ${getStatName(key)}`);
    }
  });
  return effectStrings.join(', ');
};

// ステータス名を取得する関数
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
