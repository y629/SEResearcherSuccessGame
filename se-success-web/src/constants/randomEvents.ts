import { RandomEvent } from '@/types/game';

// ランダムイベントの定義
export const RANDOM_EVENTS: RandomEvent[] = [
  // セミナー関連イベント
  {
    id: 'seminar_famous_researcher',
    title: '著名研究者との出会い',
    description: 'セミナーで偶然著名研究者と出会い、コラボレーションの話が持ち上がった！',
    effect: { collaboration: 5, communication: 3, money: 1000 },
    probability: 0.15,
    triggerAction: 'seminar',
  },
  {
    id: 'seminar_inspiration',
    title: '閃きの瞬間',
    description: 'セミナーの内容から新しい研究アイデアが浮かんだ！',
    effect: { insight: 8, research: 5 },
    probability: 0.2,
    triggerAction: 'seminar',
  },

  // コーディング関連イベント
  {
    id: 'coding_bug_swamp',
    title: 'バグ沼にハマる',
    description: 'コーディング中に予想外のバグが発生し、解決に時間がかかった...',
    effect: { stamina: -10 },
    probability: 0.25,
    triggerAction: 'coding',
  },
  {
    id: 'coding_breakthrough',
    title: '技術的ブレークスルー',
    description: 'コーディング中に革新的な解決方法を発見した！',
    effect: { coding: 8, insight: 5, research: 10 },
    probability: 0.1,
    triggerAction: 'coding',
  },

  // 論文執筆関連イベント
  {
    id: 'writing_rejection',
    title: '予想外のReject',
    description: '論文投稿が予想外の理由でRejectされた...',
    effect: { research: 3 },
    probability: 0.2,
    triggerAction: 'writing',
  },
  {
    id: 'writing_acceptance',
    title: '論文受理！',
    description: '論文が受理され、研究が評価された！',
    effect: { writing: 5, money: 5000, research: 15 },
    probability: 0.1,
    triggerAction: 'writing',
  },

  // 国際論文読み関連イベント
  {
    id: 'reading_collaboration',
    title: '国際共同研究の提案',
    description: '読んだ論文の著者から共同研究の提案があった！',
    effect: { collaboration: 8, english: 3, money: 2000 },
    probability: 0.08,
    triggerAction: 'reading',
  },

  // 懇親会関連イベント
  {
    id: 'networking_job_offer',
    title: '就職の話',
    description: '懇親会で企業の研究者から就職の話が持ち上がった！',
    effect: { money: 3000, collaboration: 5 },
    probability: 0.05,
    triggerAction: 'networking',
  },

  // 筋トレ関連イベント
  {
    id: 'workout_injury',
    title: '軽い怪我',
    description: '筋トレ中に軽い怪我をしてしまった...',
    effect: { stamina: -5 },
    probability: 0.15,
    triggerAction: 'workout',
  },

  // 全般イベント（どの行動の後でも発生可能）
  {
    id: 'random_breakthrough',
    title: '突然のひらめき',
    description: '何気ない瞬間に素晴らしいアイデアが浮かんだ！',
    effect: { insight: 10, research: 8 },
    probability: 0.05,
  },
  {
    id: 'good_mood',
    title: '良い気分',
    description: '何となく気分が良くなった！',
    effect: { stamina: 5 },
    probability: 0.1,
  },
];

// ランダムイベントを取得する関数
export const getRandomEvent = (
  actionId: string, 
  stats: any
): RandomEvent | null => {
  const possibleEvents = RANDOM_EVENTS.filter(event => {
    // 特定の行動の後に発生するイベントか、全般イベントかチェック
    if (event.triggerAction && event.triggerAction !== actionId) {
      return false;
    }
    
    // 条件をチェック
    if (event.condition) {
      const statValue = stats[event.condition.stat];
      switch (event.condition.op) {
        case '>=': return statValue >= event.condition.value;
        case '<': return statValue < event.condition.value;
        case '>': return statValue > event.condition.value;
        default: return true;
      }
    }
    
    return true;
  });

  // 確率に基づいてイベントを選択
  for (const event of possibleEvents) {
    if (Math.random() < event.probability) {
      return event;
    }
  }

  return null;
};
