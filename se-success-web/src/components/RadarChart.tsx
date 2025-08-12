import { Stats } from '@/types/game';
import { STAT_NAMES, getStatRank, getRankColor } from '@/constants/gameConstants';
import { useState } from 'react';

interface RadarChartProps {
  stats: Stats;
  previousStats?: Stats;
}

export default function RadarChart({ stats, previousStats }: RadarChartProps) {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const getStatIcon = (statKey: string) => {
    const statIcons: Record<string, string> = {
      writing: '✍️',
      coding: '💻',
      presentation: '🎤',
      collaboration: '🤝',
      power: '💪',
      catchup: '📡',
      english: '🌍',
      communication: '💬',
      insight: '💡',
    };
    return statIcons[statKey] || '❓';
  };

  const getStatDescription = (statKey: string) => {
    const descriptions: Record<string, string> = {
      writing: '論文執筆の能力。研究の成果を文章にまとめる力。',
      coding: 'プログラミング・実装の能力。実験やシステム開発の力。',
      presentation: 'プレゼンテーションの能力。研究成果を発表する力。',
      collaboration: '共同研究・交渉の能力。他者と協力する力。',
      stamina: '研究活動のスタミナ。長時間の研究に耐える力。',
      catchup: '最新技術の習得能力。新しい知識を吸収する力。',
      english: '英語でのコミュニケーション能力。国際的な研究活動の力。',
      communication: '人とのコミュニケーション能力。情報交換の力。',
      insight: '新しいアイデアを生み出す能力。創造的な思考の力。',
    };
    return descriptions[statKey] || '能力値';
  };

  const getStatChange = (statKey: keyof Stats) => {
    if (!previousStats) return null;
    const change = stats[statKey] - previousStats[statKey];
    if (change === 0) return null;
    return change > 0 ? `+${change}` : `${change}`;
  };

  // レーダーチャートの中心座標とサイズ
  const centerX = 110;
  const centerY = 120;
  const radius = 100;
  
  // レーダーチャートに表示する統計値のみを定義（お金などは除外）
  const radarStatKeys: (keyof Stats)[] = [
    'writing',
    'coding', 
    'presentation',
    'collaboration',
    'power',
    'catchup',
    'english',
    'communication',
    'insight'
  ];
  
  const numStats = radarStatKeys.length;

  // 各能力値の角度を計算（上から時計回り）
  const getAngle = (index: number) => {
    return (index * (2 * Math.PI) / numStats) - Math.PI / 2;
  };

  // 能力値の座標を計算
  const getStatPosition = (statKey: keyof Stats, value: number) => {
    const index = radarStatKeys.indexOf(statKey);
    const angle = getAngle(index);
    const normalizedValue = value / 100; // 0-1に正規化
    const x = centerX + Math.cos(angle) * radius * normalizedValue;
    const y = centerY + Math.sin(angle) * radius * normalizedValue;
    return { x, y };
  };

  // 軸の端の座標を計算（ラベル表示用）
  const getAxisEndPosition = (index: number) => {
    const angle = getAngle(index);
    const x = centerX + Math.cos(angle) * (radius + 40);
    const y = centerY + Math.sin(angle) * (radius + 40);
    return { x, y };
  };

  // レーダーチャートの多角形のパスを生成
  const generateRadarPath = () => {
    const points = radarStatKeys.map(statKey => {
      const { x, y } = getStatPosition(statKey, stats[statKey]);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  // 前回の能力値の多角形のパスを生成（変化量表示用）
  const generatePreviousRadarPath = () => {
    if (!previousStats) return '';
    const points = radarStatKeys.map(statKey => {
      const { x, y } = getStatPosition(statKey, previousStats[statKey]);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  // 各ランクの基準線のパスを生成
  const generateRankBaselinePath = (rank: string) => {
    const rankMinValue = getRankMinValue(rank);
    const points = radarStatKeys.map(statKey => {
      const { x, y } = getStatPosition(statKey, rankMinValue);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  // ランクの最低値を取得
  const getRankMinValue = (rank: string): number => {
    switch (rank) {
      case 'S': return 100;
      case 'A': return 80;
      case 'B': return 70;
      case 'C': return 60;
      case 'D': return 50;
      case 'E': return 40;
      case 'F': return 30;
      case 'G': return 1;
      default: return 0;
    }
  };

  // ランクの色を取得（基準線用）
  const getRankBaselineColor = (rank: string): string => {
    switch (rank) {
      case 'S': return 'rgba(249, 168, 212, 0.3)';      // 薄ピンク
      case 'A': return 'rgba(219, 39, 119, 0.3)';       // 濃いピンク
      case 'B': return 'rgba(239, 68, 68, 0.3)';        // 赤色
      case 'C': return 'rgba(234, 88, 12, 0.3)';        // 濃いめオレンジ
      case 'D': return 'rgba(253, 186, 116, 0.3)';      // 薄めオレンジ
      case 'E': return 'rgba(132, 204, 22, 0.3)';       // 緑と黄緑の中間
      case 'F': return 'rgba(147, 197, 253, 0.3)';      // 薄めの青
      case 'G': return 'rgba(107, 114, 128, 0.3)';      // 見やすいグレー
      default: return 'rgba(209, 213, 219, 0.3)';
    }
  };

  // ランクの境界線の色を取得
  const getRankBorderColor = (rank: string): string => {
    switch (rank) {
      case 'S': return 'rgba(249, 168, 212, 0.6)';      // 薄ピンク
      case 'A': return 'rgba(219, 39, 119, 0.6)';       // 濃いピンク
      case 'B': return 'rgba(239, 68, 68, 0.6)';        // 赤色
      case 'C': return 'rgba(234, 88, 12, 0.6)';        // 濃いめオレンジ
      case 'D': return 'rgba(253, 186, 116, 0.6)';      // 薄めオレンジ
      case 'E': return 'rgba(132, 204, 22, 0.6)';       // 緑と黄緑の中間
      case 'F': return 'rgba(147, 197, 253, 0.6)';      // 薄めの青
      case 'G': return 'rgba(107, 114, 128, 0.6)';      // 見やすいグレー
      default: return 'rgba(209, 213, 219, 0.6)';
    }
  };

  // ランクの色を直接スタイルに適用
  const getRankStyle = (rank: string) => {
    switch (rank) {
      case 'S': return { fill: '#f9a8d4' };      // 薄ピンク
      case 'A': return { fill: '#db2777' };      // 濃いピンク
      case 'B': return { fill: '#ef4444' };      // 赤色
      case 'C': return { fill: '#ea580c' };      // 濃いめオレンジ
      case 'D': return { fill: '#fdba74' };      // 薄めオレンジ
      case 'E': return { fill: '#84cc16' };      // 緑と黄緑の中間
      case 'F': return { fill: '#93c5fd' };      // 薄めの青
      case 'G': return { fill: '#6b7280' };      // 見やすいグレー
      default: return { fill: '#d1d5db' };
    }
  };

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-xl shadow-lg p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-white">能力値レーダー</h3>
      </div>
      
      {/* SVGレーダーチャート */}
      <div className="flex justify-center mb-4 relative">
        <svg
          width="240"
          height="240"
          viewBox="-24 -24 288 288"
          style={{ overflow: 'visible' }}
          className="transform -rotate-90"
        >
          {/* 背景の円とグリッド */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#374151" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={radius * 0.75} fill="none" stroke="#374151" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="none" stroke="#374151" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={radius * 0.25} fill="none" stroke="#374151" strokeWidth="1" />
          
          {/* 軸線 */}
          {radarStatKeys.map((statKey, index) => {
            const angle = getAngle(index);
            const endX = centerX + Math.cos(angle) * radius;
            const endY = centerY + Math.sin(angle) * radius;
            return (
              <line
                key={statKey}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#374151"
                strokeWidth="1"
              />
            );
          })}

          {/* 各ランクの基準線（先に描く） */}
          {['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map(rank => (
            <path
              key={`baseline-${rank}`}
              d={generateRankBaselinePath(rank)}
              stroke={getRankBorderColor(rank)}
              strokeWidth="1"
              strokeDasharray="5,5"
              fill="none"
            />
          ))}

          {/* 前回の能力値の多角形（変化量表示用） */}
          {previousStats && (
            <path
              d={generatePreviousRadarPath()}
              fill="#3b82f6"
              fillOpacity="0.2"
              stroke="#3b82f6"
              strokeOpacity="0.6"
              strokeWidth="2"
            />
          )}

          {/* 現在の能力値の多角形（いちばん手前にしたい要素） */}
          <path
            d={generateRadarPath()}
            fill="#3b82f6"
            fillOpacity="0.4"
            stroke="#3b82f6"
            strokeWidth="3"
          />

          {/* 各能力値のポイント */}
          {radarStatKeys.map((statKey) => {
            const { x, y } = getStatPosition(statKey, stats[statKey]);
            return (
              <circle
                key={statKey}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          
          {/* 各能力値のラベル */}
          {radarStatKeys.map((statKey, index) => {
            const { x, y } = getAxisEndPosition(index);
            const value = stats[statKey];
            const rank = getStatRank(value);
            const statIcon = getStatIcon(statKey);
            const isHovered = hoveredStat === statKey;
            
            return (
              <g 
                key={statKey}
                onMouseEnter={() => setHoveredStat(statKey)}
                onMouseLeave={() => setHoveredStat(null)}
                className="cursor-pointer select-none"
              >
                {/* 絵文字 */}
                <text
                  x={x}
                  y={y - 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '20px' }}
                  transform={`rotate(90, ${x}, ${y - 20})`}
                >
                  {statIcon}
                </text>

                {/* アルファベット（ランク） */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    ...getRankStyle(rank)
                  }}
                  transform={`rotate(90, ${x}, ${y})`}
                >
                  {rank}
                </text>

                {/* 数字（能力値） */}
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fill: '#ffffff'
                  }}
                  transform={`rotate(90, ${x}, ${y + 20})`}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ホバー時の詳細情報（レーダーの下に表示） */}
        {hoveredStat && (
          <div 
            className="absolute bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm shadow-lg z-10"
            style={{
              top: '260px', // 280pxから260pxに上に移動
              left: '50%',
              transform: 'translateX(-50%)',
              minWidth: '200px'
            }}
          >
            <div className="font-bold mb-2 text-blue-400">
              {STAT_NAMES[hoveredStat as keyof Stats]}
            </div>
            <div className="mb-2">
              {getStatDescription(hoveredStat as keyof Stats)}
            </div>
            <div className="text-gray-300">
              現在値: {stats[hoveredStat as keyof Stats]}
              {previousStats && (
                <span className="ml-2">
                  (変化: {stats[hoveredStat as keyof Stats] - previousStats[hoveredStat as keyof Stats] > 0 ? '+' : ''}{stats[hoveredStat as keyof Stats] - previousStats[hoveredStat as keyof Stats]})
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
