// 能力値の型定義
export interface Stats {
  writing: number;        // 論文執筆力
  coding: number;         // 実験・実装力
  presentation: number;   // プレゼン力
  collaboration: number;  // 共同研究・交渉力
  power: number;          // 体力パラメータ
  catchup: number;        // 最新技術キャッチアップ力
  english: number;        // 英語力
  communication: number;  // コミュ力
  insight: number;        // ひらめき力
  money: number;          // お金（新規追加）
  research: number;       // 研究進捗（新規追加）
}

// 現在のスタミナ状態
export interface StaminaState {
  current: number;        // 現在のスタミナ
  max: number;            // 最大スタミナ（体力パラメータから計算）
}

// 行動の効果の型定義
export interface ActionEffect {
  writing?: number;
  coding?: number;
  presentation?: number;
  collaboration?: number;
  power?: number;         // 体力パラメータへの効果
  catchup?: number;
  english?: number;
  communication?: number;
  insight?: number;
  money?: number;         // お金への効果（新規追加）
  research?: number;      // 研究進捗への効果（新規追加）
  stamina?: number;       // スタミナへの効果（新規追加）
}

// 行動の型定義
export interface Action {
  id: string;
  name: string;
  description: string;
  effect: ActionEffect;
  staminaCost: number;    // スタミナ消費量
  moneyReward?: number;   // 報酬（お金）
}

// ランダムイベントの型定義（新規追加）
export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  effect: ActionEffect;
  probability: number;    // 発生確率（0-1）
  triggerAction?: string; // どの行動の後に発生するか
  condition?: {           // 発生条件
    stat: keyof Stats;
    op: '>=' | '<' | '>';
    value: number;
  };
}

// アイテムの型定義（新規追加）
export interface Item {
  id: string;
  name: string;
  description: string;
  effect: ActionEffect;
  price: number;          // 購入価格
  duration: number;       // 効果持続ターン数（0は即座に消費）
  icon: string;           // アイコン
}

// 成果物の型定義（新規追加）
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;     // 何週目で解除されたか
  type: 'paper' | 'oss' | 'conference' | 'other';
}
