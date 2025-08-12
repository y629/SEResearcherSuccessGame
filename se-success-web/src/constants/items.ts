import { Item } from '@/types/game';

// アイテムの定義
export const ITEMS: Item[] = [
  // 飲み物系アイテム
  {
    id: 'coffee',
    name: 'カフェイン飲料',
    description: '次の行動のスタミナ消費を軽減する',
    effect: { stamina: 5 },
    price: 300,
    duration: 1,
    icon: '☕',
  },
  {
    id: 'energy_drink',
    name: 'エナジードリンク',
    description: '次の行動のスタミナ消費を大幅に軽減する',
    effect: { stamina: 10 },
    price: 800,
    duration: 1,
    icon: '🥤',
  },
  {
    id: 'green_tea',
    name: '緑茶',
    description: '集中力を向上させる',
    effect: { insight: 2 },
    price: 200,
    duration: 1,
    icon: '🍵',
  },

  // 研究支援アイテム
  {
    id: 'paper_template',
    name: '論文テンプレート',
    description: '論文執筆の効率を向上させる',
    effect: { writing: 3 },
    price: 1500,
    duration: 3,
    icon: '📝',
  },
  {
    id: 'coding_book',
    name: 'プログラミング本',
    description: 'コーディングの効率を向上させる',
    effect: { coding: 3, catchup: 2 },
    price: 2000,
    duration: 5,
    icon: '📚',
  },
  {
    id: 'presentation_guide',
    name: 'プレゼン指南書',
    description: 'プレゼンテーションの効果を向上させる',
    effect: { presentation: 4, communication: 2 },
    price: 1800,
    duration: 4,
    icon: '🎤',
  },

  // 高級アイテム
  {
    id: 'high_end_pc',
    name: '高性能PC',
    description: 'コーディングと研究の効率を大幅に向上させる',
    effect: { coding: 8, catchup: 5, research: 10 },
    price: 15000,
    duration: 10,
    icon: '💻',
  },
  {
    id: 'conference_ticket',
    name: '国際会議チケット',
    description: '研究発表の機会を提供し、名声を高める',
    effect: { presentation: 10, collaboration: 8, money: 5000 },
    price: 25000,
    duration: 1,
    icon: '✈️',
  },
  {
    id: 'research_grant',
    name: '研究助成金',
    description: '研究活動を支援する資金',
    effect: { money: 10000, research: 20 },
    price: 50000,
    duration: 1,
    icon: '💰',
  },
];

// アイテムを取得する関数
export const getItem = (id: string): Item | undefined => {
  return ITEMS.find(item => item.id === id);
};

// アイテムをカテゴリ別に分類する関数
export const getItemsByCategory = () => {
  return {
    drinks: ITEMS.filter(item => ['coffee', 'energy_drink', 'green_tea'].includes(item.id)),
    research: ITEMS.filter(item => ['paper_template', 'coding_book', 'presentation_guide'].includes(item.id)),
    premium: ITEMS.filter(item => ['high_end_pc', 'conference_ticket', 'research_grant'].includes(item.id)),
  };
};
