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
