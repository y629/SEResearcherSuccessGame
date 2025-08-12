'use client';
import { useState, useEffect } from "react";
import { Stats, Action } from "@/types/game";
import { initStats, applyAction, getStatRank, getRankColor, STAT_NAMES, getStaminaRecovery } from "@/constants/gameConstants";
import { getRandomEvent } from "@/constants/randomEvents";
import { ITEMS } from "@/constants/items";
import ActionButtons from "@/components/ActionButtons";
import GameHeader from "@/components/GameHeader";
import ActionLog from "@/components/ActionLog";
import RadarChart from "@/components/RadarChart";
import ActionNotification from "@/components/ActionNotification";
import RandomEventModal from "@/components/RandomEventModal";
import NameInputModal from "@/components/NameInputModal";
import TutorialModal from "@/components/TutorialModal";
import ItemShop from "@/components/ItemShop";
import ItemList from "@/components/ItemList"; // Added import for ItemList

export default function Home() {
  const [stats, setStats] = useState<Stats>(initStats());
  const [previousStats, setPreviousStats] = useState<Stats | undefined>(undefined);
  const [week, setWeek] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  
  // 現在のスタミナ状態（上限100で固定）
  const [currentStamina, setCurrentStamina] = useState(100);
  const maxStamina = 100; // スタミナは上限100で固定
  
  // 所持金の状態管理
  const [money, setMoney] = useState(11350);
  
  // 通知ウィンドウの状態管理
  const [notificationAction, setNotificationAction] = useState<Action | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  
  // ランダムイベントの状態管理
  const [randomEvent, setRandomEvent] = useState<any>(null);
  const [isRandomEventVisible, setIsRandomEventVisible] = useState(false);
  
  // 名前の状態管理
  const [researcherName, setResearcherName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  
  // チュートリアルの状態管理
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  
  // アイテムショップの状態管理
  const [showItemShop, setShowItemShop] = useState<boolean>(false);
  
  // アイテムリストの状態管理
  const [showItemList, setShowItemList] = useState<boolean>(false);
  
  // 所持アイテムの状態管理
  const [inventory, setInventory] = useState<string[]>([]);
  
  // 購入通知の状態管理
  const [purchaseNotification, setPurchaseNotification] = useState<{itemName: string, price: number, nextCount: number} | null>(null);
  const [showPurchaseNotification, setShowPurchaseNotification] = useState<boolean>(false);
  
  // アイテム使用の状態管理
  const [useItemNotification, setUseItemNotification] = useState<{itemName: string, effects: string} | null>(null);
  const [showUseItemNotification, setShowUseItemNotification] = useState<boolean>(false);
  
  // クリアまでの残り週数を計算（例：52週でクリアと仮定）
  const totalWeeksToClear = 52;
  const weeksUntilClear = Math.max(0, totalWeeksToClear - week);
  
  // 初回起動時またはリセット時に名前入力モーダルを表示
  useEffect(() => {
    const savedName = localStorage.getItem('researcherName');
    if (savedName) {
      setResearcherName(savedName);
    } else {
      setShowNameInput(true);
    }
  }, []);
  
  // 名前が決定された時の処理
  const handleNameSubmit = (name: string) => {
    setResearcherName(name);
    localStorage.setItem('researcherName', name);
    setShowNameInput(false);
    // 名前入力完了後にチュートリアルを表示
    setShowTutorial(true);
  };
  
  // 通知ウィンドウを閉じる関数
  const closeNotification = () => {
    setIsNotificationVisible(false);
    setNotificationAction(null);
  };
  
  // ランダムイベントモーダルを閉じる関数
  const closeRandomEvent = () => {
    setIsRandomEventVisible(false);
    setRandomEvent(null);
    
    // ランダムイベントの効果を適用
    if (randomEvent) {
      handleRandomEventEffects(randomEvent.effect);
    }
  };

  // チュートリアルを閉じる関数
  const closeTutorial = () => {
    setShowTutorial(false);
  };

  // アイテムショップを開く関数
  const openItemShop = () => {
    setShowItemShop(true);
  };

  // アイテムショップを閉じる関数
  const closeItemShop = () => {
    setShowItemShop(false);
  };

  // アイテムリストを開く関数
  const openItemList = () => {
    setShowItemList(true);
  };

  // アイテムリストを閉じる関数
  const closeItemList = () => {
    setShowItemList(false);
  };

  // アイテム効果のテキストを生成
  const getItemEffectsText = (effects: any) => {
    if (!effects) return '';
    
    const effectStrings: string[] = [];
    Object.entries(effects).forEach(([key, value]) => {
      if (value !== undefined && value !== 0 && value !== null) {
        const numValue = value as number;
        const isPositive = numValue > 0;
        const sign = isPositive ? '+' : '';
        const statName = getStatNameForItem(key);
        effectStrings.push(`${sign}${numValue} ${statName}`);
      }
    });
    return effectStrings.join(', ');
  };

  // アイテム用のステータス名を取得
  const getStatNameForItem = (key: string) => {
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

  // 所持数を返すヘルパー
  const getOwnedCount = (itemId: string) =>
    inventory.reduce((acc, id) => acc + (id === itemId ? 1 : 0), 0);

  // アイテム購入処理
  const handleItemPurchase = (item: any) => {
    if (money >= item.price) {
      const nextCount = getOwnedCount(item.id) + 1;
      
      setMoney(prev => prev - item.price);
      // 購入したアイテムをインベントリに追加
      setInventory(prev => [...prev, item.id]);
      
      // 購入通知を表示（購入後の所持数を含む）
      setPurchaseNotification({ itemName: item.name, price: item.price, nextCount });
      setShowPurchaseNotification(true);
      
      // 3秒後に通知を自動で閉じる
      setTimeout(() => {
        setShowPurchaseNotification(false);
        setPurchaseNotification(null);
      }, 3000);
      
      console.log(`アイテム ${item.id} を購入しました（所持数: ${nextCount}）`);
    }
  };

  // アイテム使用処理
  const handleItemUse = (itemId: string) => {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return;

    // アイテムの効果を適用
    if (item.effect) {
      // スタミナの更新
      if (item.effect.stamina) {
        setCurrentStamina(prev => Math.max(0, Math.min(maxStamina, prev + (item.effect?.stamina || 0))));
      }
      
      // お金の更新
      if (item.effect.money) {
        setMoney(prev => Math.max(0, prev + (item.effect?.money || 0)));
      }
      
      // その他のステータス更新
      if (item.effect.research || item.effect.insight || item.effect.collaboration || item.effect.english || item.effect.communication) {
        setStats(prev => ({
          ...prev,
          research: Math.max(0, Math.min(100, prev.research + (item.effect?.research || 0))),
          insight: Math.max(0, Math.min(100, prev.insight + (item.effect?.insight || 0))),
          collaboration: Math.max(0, Math.min(100, prev.collaboration + (item.effect?.collaboration || 0))),
          english: Math.max(0, Math.min(100, prev.english + (item.effect?.english || 0))),
          communication: Math.max(0, Math.min(100, prev.communication + (item.effect?.communication || 0))),
        }));
      }
    }

    // 使用したアイテムをインベントリから1個削除
    setInventory(prev => {
      const index = prev.indexOf(itemId);
      if (index > -1) {
        const newInventory = [...prev];
        newInventory.splice(index, 1);
        return newInventory;
      }
      return prev;
    });

    // 使用通知を表示
    const effectsText = getItemEffectsText(item.effect);
    setUseItemNotification({ itemName: item.name, effects: effectsText });
    setShowUseItemNotification(true);
    
    // 3秒後に通知を自動で閉じる
    setTimeout(() => {
      setShowUseItemNotification(false);
      setUseItemNotification(null);
    }, 3000);

    console.log(`アイテム ${item.name} を使用しました（残り所持数: ${getOwnedCount(itemId) - 1}個）`);
  };

  const handleAction = (action: Action) => {
    if (action.id !== 'rest' && currentStamina < action.staminaCost) {
      return;
    }

    setPreviousStats(stats);
    const newStats = applyAction(stats, action);
    setStats(newStats);
    
    // スタミナの更新
    if (action.id === 'rest') {
      // 休む場合は体力パラメータに基づいてスタミナを回復
      const recovery = getStaminaRecovery(stats.power);
      setCurrentStamina(prev => Math.min(maxStamina, prev + recovery));
    } else {
      // その他の行動ではスタミナを消費
      setCurrentStamina(prev => Math.max(0, prev - action.staminaCost));
    }
    
    // お金の報酬を処理
    if (action.moneyReward !== undefined && action.moneyReward > 0) {
      setMoney(prev => prev + action.moneyReward);
    }
    
    setWeek(week + 1);
    
    const changes = Object.entries(action.effect)
      .filter(([_, value]) => value !== 0 && value !== undefined)
      .map(([key, value]) => {
        const statName = key === 'stamina' ? '体力' : STAT_NAMES[key as keyof Stats];
        return `${statName}: ${value > 0 ? '+' : ''}${value}`;
      })
      .join(', ');
    
    const logEntry = `Week ${week}: ${action.name} / ${changes}`;
    setLog(prev => [logEntry, ...prev]);
    console.log(logEntry);
    
    // 通知ウィンドウを表示
    setNotificationAction(action);
    setIsNotificationVisible(true);
  };

  // 通知ウィンドウの確認ボタンが押された後の処理
  const handleNotificationConfirm = () => {
    closeNotification();
    
    // ランダムイベントのチェック
    const event = getRandomEvent('general', { ...stats, money });
    if (event) {
      setRandomEvent(event);
      setIsRandomEventVisible(true);
      
      // ランダムイベントのログを追加
      const eventLogEntry = `Week ${week}: 🎲 ランダムイベント: ${event.title}`;
      setLog(prev => [eventLogEntry, ...prev]);
    }
  };

  // ランダムイベントの効果を適用する関数
  const handleRandomEventEffects = (effects: any) => {
    // スタミナの更新
    if (effects.stamina) {
      setCurrentStamina(prev => Math.max(0, Math.min(maxStamina, prev + effects.stamina)));
    }
    
    // お金の更新
    if (effects.money) {
      setMoney(prev => Math.max(0, prev + effects.money));
    }
    
    // その他のステータス更新
    if (effects.research || effects.insight || effects.collaboration || effects.english || effects.communication) {
      setStats(prev => ({
        ...prev,
        research: Math.max(0, Math.min(100, prev.research + (effects.research || 0))),
        insight: Math.max(0, Math.min(100, prev.insight + (effects.insight || 0))),
        collaboration: Math.max(0, Math.min(100, prev.collaboration + (effects.collaboration || 0))),
        english: Math.max(0, Math.min(100, prev.english + (effects.english || 0))),
        communication: Math.max(0, Math.min(100, prev.communication + (effects.communication || 0))),
      }));
    }
  };

  // ゲームリセット関数
  const handleGameReset = () => {
    setStats(initStats());
    setPreviousStats(undefined);
    setWeek(1);
    setLog([]);
    setCurrentStamina(100);
    setMoney(11350);
    setShowNameInput(true); // リセット時にも名前入力モーダルを表示
    setShowTutorial(false); // チュートリアルをリセット
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <GameHeader 
          week={week}
          stamina={currentStamina}
          maxStamina={maxStamina}
          money={money}
          weeksUntilMatch={0}
          weeksUntilClear={weeksUntilClear}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <div className="bg-gray-700 border border-gray-600 rounded-xl shadow-lg p-4 text-center mb-6">
              <div className="relative group mb-4">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-blue-400 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                  <img 
                    src="/rearcher_avator.png" 
                    alt="研究者アバター" 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                  Lv.{Math.floor(week / 4) + 1}
                </div>
              </div>
              
              <div className="text-white text-sm">
                <div className="font-bold mb-2">{researcherName || '研究者'}</div>
              </div>
            </div>

            {/* レーダーチャート - 高さを固定して行動メニューと揃える */}
            <div className="bg-gray-700 border border-gray-600 rounded-xl shadow-lg p-4">
              <RadarChart stats={stats} previousStats={previousStats} />
            </div>
          </div>

          <div className="lg:w-3/5">
            <div className="bg-gray-700 border border-gray-600 rounded-xl shadow-lg p-6 h-full">
              <ActionButtons stats={{ ...stats, stamina: currentStamina }} onAction={handleAction} />
            </div>
          </div>

          <div className="lg:w-1/5">
            <ActionLog log={log} />
          </div>
        </div>

        <div className="mt-8 bg-gray-700 border border-gray-600 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setShowTutorial(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 flex items-center gap-2"
              >
                <span>❓</span>
                ヘルプ
              </button>
              <button
                onClick={openItemShop}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors transform hover:scale-105 flex items-center gap-2 font-semibold"
              >
                <span>🛒</span>
                ショップ
              </button>
              <button
                onClick={openItemList}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors transform hover:scale-105 flex items-center gap-2 font-semibold"
              >
                <span>📦</span>
                アイテム
              </button>
            </div>
            <button
              onClick={handleGameReset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105"
            >
              ゲームをリセット
            </button>
          </div>
        </div>
      </div>
      
      {/* 通知ウィンドウ */}
      {notificationAction && (
        <ActionNotification
          action={notificationAction}
          previousStats={previousStats || stats}
          currentStats={stats}
          isVisible={isNotificationVisible}
          onClose={closeNotification}
          onConfirm={handleNotificationConfirm}
        />
      )}
      
      {/* ランダムイベントモーダル */}
      {randomEvent && (
        <RandomEventModal
          event={randomEvent}
          isOpen={isRandomEventVisible}
          onClose={closeRandomEvent}
          onApplyEffects={handleRandomEventEffects}
        />
      )}
      
      {/* 名前入力モーダル */}
      <NameInputModal
        isOpen={showNameInput}
        onNameSubmit={handleNameSubmit}
        defaultName={researcherName}
      />
      
      {/* チュートリアルモーダル */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={closeTutorial}
      />
      
      {/* アイテムショップモーダル */}
      <ItemShop
        money={money}
        onPurchase={handleItemPurchase}
        onClose={closeItemShop}
        isOpen={showItemShop}
        inventory={inventory}
      />
      
      {/* アイテムリストモーダル */}
      <ItemList
        inventory={inventory}
        onClose={closeItemList}
        isOpen={showItemList}
        onItemUse={handleItemUse}
      />
      
      {/* 購入通知 */}
      {purchaseNotification && showPurchaseNotification && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-4 rounded-lg shadow-lg border-2 border-yellow-400 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-bold text-lg">購入完了！</div>
              <div className="text-sm">
                {purchaseNotification.itemName} を ¥{purchaseNotification.price.toLocaleString()} で購入しました
                <span className="text-yellow-800 font-semibold"> (所持数: {purchaseNotification.nextCount})</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* アイテム使用通知 */}
      {useItemNotification && showUseItemNotification && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg border-2 border-green-400 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <div className="font-bold text-lg">アイテム使用完了！</div>
              <div className="text-sm">
                {useItemNotification.itemName} を使用しました
                {useItemNotification.effects && (
                  <span className="text-green-100 font-semibold"> (効果: {useItemNotification.effects})</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
