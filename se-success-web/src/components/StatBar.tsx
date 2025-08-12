import { Stats } from '@/types/game';
import { STAT_NAMES, getStatRank, getRankColor } from '@/constants/gameConstants';
import { useState } from 'react';

interface StatBarProps {
  stats: Stats;
  previousStats?: Stats;
}

export default function StatBar({ stats, previousStats }: StatBarProps) {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const getStatIcon = (statKey: string) => {
    const icons: Record<string, string> = {
      writing: '✍️',
      coding: '⚡',
      presentation: '🎤',
      collaboration: '🤝',
      stamina: '💪',
      catchup: '📡',
      english: '🌍',
      communication: '💬',
      insight: '💡',
    };
    return icons[statKey] || '❓';
  };

  const getStatChange = (statKey: keyof Stats) => {
    if (!previousStats) return null;
    const change = stats[statKey] - previousStats[statKey];
    if (change === 0) return null;
    return change > 0 ? `+${change}` : `${change}`;
  };

  const getStatDescription = (statKey: string) => {
    const descriptions: Record<string, string> = {
      writing: '論文執筆の能力',
      coding: 'プログラミング・実装の能力',
      presentation: 'プレゼンテーションの能力',
      collaboration: '共同研究・交渉の能力',
      stamina: '研究活動の体力',
      catchup: '最新技術の習得能力',
      english: '英語でのコミュニケーション能力',
      communication: '人とのコミュニケーション能力',
      insight: '新しいアイデアを生み出す能力',
    };
    return descriptions[statKey] || '能力値';
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 text-center text-white animate-pulse">
        能力値 / ABILITIES
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => {
          const statKey = key as keyof Stats;
          const statName = STAT_NAMES[statKey];
          const rank = getStatRank(value);
          const rankColor = getRankColor(rank);
          const change = getStatChange(statKey);
          const isHovered = hoveredStat === statKey;
          
          return (
            <div 
              key={statKey} 
              className={`
                bg-gray-800 border border-gray-600 rounded-lg p-3 text-center
                transform transition-all duration-300 cursor-pointer
                ${isHovered 
                  ? 'scale-105 border-blue-400 shadow-lg shadow-blue-500/25' 
                  : 'hover:scale-102 hover:border-gray-500'
                }
              `}
              onMouseEnter={() => setHoveredStat(statKey)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              {/* ランク（アルファベット）を大きく表示 - ホバー時にアニメーション */}
              <div className={`
                text-4xl font-bold ${rankColor} mb-2 transition-all duration-300
                ${isHovered ? 'scale-110 animate-pulse' : 'scale-100'}
              `}>
                {rank}
              </div>
              
              {/* 数値を小さく表示 - ホバー時に強調 */}
              <div className={`
                text-sm text-gray-400 mb-2 transition-all duration-300
                ${isHovered ? 'text-white text-base' : 'text-gray-400'}
              `}>
                {value}
              </div>
              
              {/* 変化量 - アニメーション付き */}
              {change && (
                <div className={`
                  text-xs font-bold mb-2 transition-all duration-300
                  ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}
                  ${isHovered ? 'scale-110 animate-bounce' : 'scale-100'}
                `}>
                  {change}
                </div>
              )}
              
              {/* 能力値名の前に絵文字を配置 - ホバー時にアニメーション */}
              <div className="text-base text-gray-300 leading-tight">
                <span className={`
                  text-lg transition-all duration-300 inline-block
                  ${isHovered ? 'scale-125 animate-bounce' : 'scale-100'}
                `}>
                  {getStatIcon(statKey)}
                </span> 
                <span className={isHovered ? 'text-white' : 'text-gray-300'}>
                  {statName}
                </span>
              </div>
              
              {/* ホバー時の詳細説明 */}
              {isHovered && (
                <div className="mt-2 p-2 bg-blue-900/50 rounded text-xs text-blue-200 animate-fadeIn">
                  {getStatDescription(statKey)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
