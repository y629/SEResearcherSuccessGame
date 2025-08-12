import { Stats, Action } from '@/types/game';

// 体力からスタミナ回復量を計算する関数
export const getStaminaRecovery = (powerStat: number): number => {
  // 体力0で回復量10、体力100で回復量30
  // 最小値10から最大値30の間で体力に応じて比例配分
  return Math.floor(10 + (powerStat / 100) * 20);
};

// 能力値の初期化関数
export const initStats = (): Stats => {
  // ランダムな初期能力値を生成（10-20の範囲）
  const getRandomStat = (): number => Math.floor(Math.random() * 11) + 10; // 10-20
  
  return {
    writing: getRandomStat(),            // ランダム値（Gランク）
    coding: getRandomStat(),             // ランダム値（Gランク）
    presentation: getRandomStat(),       // ランダム値（Gランク）
    collaboration: getRandomStat(),      // ランダム値（Gランク）
    power: getRandomStat(),              // ランダム値（Gランク）
    catchup: getRandomStat(),            // ランダム値（Gランク）
    english: getRandomStat(),            // ランダム値（Gランク）
    communication: getRandomStat(),      // ランダム値（Gランク）
    insight: getRandomStat(),            // ランダム値（Gランク）
  };
};

// 能力値の表示名マッピング
export const STAT_NAMES: Record<keyof Stats, string> = {
  writing: '論文執筆力',
  coding: '実験・実装力',
  presentation: 'プレゼン力',
  collaboration: '共同研究・交渉力',
  power: '体力',  // 体力パラメータ
  catchup: '最新技術キャッチアップ力',
  english: '英語力',
  communication: 'コミュ力',
  insight: 'ひらめき力',
};

// 行動の定義
export const ACTIONS: Action[] = [
  {
    id: 'seminar',
    name: 'セミナー参加',
    description: '研究セミナーに参加して知識を深める',
    effect: { presentation: 3, communication: 2, catchup: 2, insight: 1 },
    staminaCost: 15,
  },
  {
    id: 'coding',
    name: 'コーディング集中',
    description: '実験や実装に集中して取り組む',
    effect: { coding: 5, catchup: 1, insight: 2 },
    staminaCost: 18,
  },
  {
    id: 'writing',
    name: '論文執筆',
    description: '論文の執筆に取り組む',
    effect: { writing: 5, english: 2, insight: 3 },
    staminaCost: 17,
  },
  {
    id: 'reading',
    name: '国際論文読み（英語）',
    description: '英語の国際論文を読んで最新技術をキャッチアップ',
    effect: { english: 4, catchup: 3, insight: 2 },
    staminaCost: 16,
  },
  {
    id: 'rest',
    name: '休む',
    description: 'スタミナを回復する',
    effect: {}, // 能力値は変化しない、スタミナのみ回復
    staminaCost: 0,
  },
  {
    id: 'networking',
    name: '懇親会参加',
    description: '研究者の懇親会に参加して人脈を広げる',
    effect: { communication: 5, collaboration: 2, insight: 1 },
    staminaCost: 16,
  },
  {
    id: 'workout',
    name: '筋トレ',
    description: '体力を向上させるトレーニングを行う',
    effect: { power: 3 },
    staminaCost: 14,
  },
  {
    id: 'ta',
    name: 'TA（ティーチングアシスタント）',
    description: '授業のTAをして報酬をもらう',
    effect: {},
    staminaCost: 16,
    moneyReward: 2000, // 報酬として2000円
  },
];

// 能力値を0-100の範囲にクランプする関数
export const clampStat = (value: number): number => Math.max(0, Math.min(100, value));

// 能力値をパワプロ風のランクに変換する関数
export const getStatRank = (value: number): string => {
  if (value === 100) return 'S';
  if (value >= 80 && value <= 99) return 'A';
  if (value >= 70 && value <= 79) return 'B';
  if (value >= 60 && value <= 69) return 'C';
  if (value >= 50 && value <= 59) return 'D';
  if (value >= 40 && value <= 49) return 'E';
  if (value >= 30 && value <= 39) return 'F';
  if (value >= 1 && value <= 29) return 'G';
  return 'G'; // 0の場合はG
};

// ランクの色を取得する関数
export const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'S': return 'text-pink-300';      // 薄ピンク
    case 'A': return 'text-pink-600';      // 濃いピンク
    case 'B': return 'text-red-500';       // 赤色
    case 'C': return 'text-orange-600';    // 濃いめオレンジ
    case 'D': return 'text-orange-300';    // 薄めオレンジ
    case 'E': return 'text-lime-500';      // 緑と黄緑の中間くらい
    case 'F': return 'text-blue-300';      // 薄めの青
    case 'G': return 'text-gray-500';      // 見やすいグレー
    default: return 'text-gray-300';
  }
};

// 行動を適用する関数
export const applyAction = (stats: Stats, action: Action): Stats => {
  const newStats = { ...stats };
  
  // 各能力値に効果を適用
  Object.entries(action.effect).forEach(([key, value]) => {
    if (value !== undefined) {
      const statKey = key as keyof Stats;
      newStats[statKey] = clampStat(newStats[statKey] + value);
    }
  });
  
  return newStats;
};
