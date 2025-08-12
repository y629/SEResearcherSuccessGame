import { Item } from '@/types/game';
import { ITEMS, getItemsByCategory } from '@/constants/items';
import { useState, useEffect, useCallback } from 'react';

interface ItemShopProps {
  money: number;
  onPurchase: (item: Item) => void;
  onClose: () => void;
  isOpen: boolean;
  inventory: string[];
}

export default function ItemShop({ money, onPurchase, onClose, isOpen, inventory }: ItemShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('drinks');

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

  const categories = getItemsByCategory();
  const categoryNames = {
    drinks: '飲み物',
    research: '研究支援',
    premium: '高級アイテム',
  };

  const canAfford = (item: Item) => money >= item.price;

  // 所持数を返すヘルパー
  const getOwnedCount = (itemId: string) =>
    inventory.reduce((acc, id) => acc + (id === itemId ? 1 : 0), 0);

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

  return (
    // 背景は見せつつ、わずかに暗く＆ぼかす
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="アイテムショップ"
    >
      {/* パネルにホバー浮遊＋入場アニメ */}
      <div
        onClick={stop}
        className={`
          max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto
          border-2 border-yellow-400/80 rounded-2xl p-6
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
          <h2 className="text-2xl font-bold text-white">アイテムショップ</h2>
          <div className="text-right">
            <div className="text-sm text-gray-400">所持金</div>
            <div className="text-xl font-bold text-yellow-400">¥{money.toLocaleString()}</div>
          </div>
        </div>

        {/* カテゴリ選択 */}
        <div className="flex gap-2 mb-6">
          {Object.entries(categories).map(([key, items]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2
                ${selectedCategory === key
                  ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                }
              `}
            >
              {categoryNames[key as keyof typeof categoryNames]}
            </button>
          ))}
        </div>

        {/* アイテム一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories[selectedCategory as keyof typeof categories]?.map((item) => {
            const affordable = canAfford(item);
            
            return (
              <div
                key={item.id}
                className={`
                  relative bg-gray-800 border-2 rounded-lg p-4 transition-all duration-200
                  ${affordable
                    ? 'border-yellow-500 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25'
                    : 'border-gray-600 opacity-60'
                  }
                `}
              >
                {/* アイコンとタイトル */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      {item.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-yellow-500 text-yellow-300 bg-yellow-900/30">
                        所持: {getOwnedCount(item.id)} 個
                      </span>
                    </h3>
                    <div className="text-xs text-gray-400">
                      ¥{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 説明 */}
                <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* 効果 */}
                {Object.keys(item.effect).length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">効果:</div>
                    <div className="text-xs text-yellow-300 bg-yellow-900/30 rounded p-2 border border-yellow-600/50">
                      {getEffectText(item.effect)}
                    </div>
                  </div>
                )}

                {/* 持続期間 */}
                <div className="text-xs text-gray-400 mb-3">
                  効果持続: {item.duration === 1 ? '1ターン' : `${item.duration}ターン`}
                </div>

                {/* 購入ボタン */}
                <button
                  onClick={() => affordable && onPurchase(item)}
                  disabled={!affordable}
                  className={`
                    w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 border-2
                    ${affordable
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-400 shadow-md hover:shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500'
                    }
                  `}
                >
                  {affordable ? '購入する' : 'お金が足りません'}
                </button>
              </div>
            );
          })}
        </div>

        {/* 閉じるボタン */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
