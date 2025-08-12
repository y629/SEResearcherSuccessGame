'use client';
import { useState, useEffect } from "react";
import { Stats, Action } from "@/types/game";
import { initStats, applyAction, getStatRank, getRankColor, STAT_NAMES, getStaminaRecovery } from "@/constants/gameConstants";
import ActionButtons from "@/components/ActionButtons";
import GameHeader from "@/components/GameHeader";
import ActionLog from "@/components/ActionLog";
import RadarChart from "@/components/RadarChart";
import ActionNotification from "@/components/ActionNotification";
import NameInputModal from "@/components/NameInputModal";
import TutorialModal from "@/components/TutorialModal";

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
  
  // 名前の状態管理
  const [researcherName, setResearcherName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  
  // チュートリアルの状態管理
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  
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
  
  // チュートリアルを閉じる関数
  const closeTutorial = () => {
    setShowTutorial(false);
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
            <button
              onClick={() => setShowTutorial(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 flex items-center gap-2"
            >
              <span>❓</span>
              ヘルプ
            </button>
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
    </main>
  );
}
