interface ActionLogProps {
  log: string[];
}

export default function ActionLog({ log }: ActionLogProps) {
  const getActionIcon = (logEntry: string) => {
    if (logEntry.includes('セミナー')) return '🎓';
    if (logEntry.includes('コーディング')) return '💻';
    if (logEntry.includes('国際論文')) return '📚';
    if (logEntry.includes('論文')) return '✍️';
    if (logEntry.includes('休む')) return '😴';
    if (logEntry.includes('懇親会')) return '🍻';
    if (logEntry.includes('筋トレ')) return '🏋️';
    if (logEntry.includes('TA')) return '👨‍🏫';
    if (logEntry.includes('スタミナ')) return '⚡';
    if (logEntry.includes('体力')) return '💪';
    return '📋';
  };

  const getLogColor = (logEntry: string) => {
    if (logEntry.includes('スタミナ不足')) return 'border-red-500 bg-red-50';
    if (logEntry.includes('+')) return 'border-green-500 bg-green-50';
    if (logEntry.includes('-')) return 'border-orange-500 bg-orange-50';
    return 'border-blue-500 bg-white';
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold mb-3 text-center text-white animate-pulse">
        行動ログ / ACTION LOG
      </h3>
      <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto border border-gray-600">
        {log.length === 0 ? (
          <div className="text-gray-400 text-center text-sm py-8">
            <div className="text-4xl mb-2">📋</div>
            <p>まだ行動を実行していません</p>
            <p className="text-xs mt-1">行動メニューから行動を選択してください</p>
          </div>
        ) : (
          <div className="space-y-2">
            {log.map((entry, index) => (
              <div 
                key={index} 
                className={`
                  text-sm p-3 rounded border-l-4 transition-all duration-300 transform
                  hover:scale-105 hover:shadow-md cursor-pointer
                  ${getLogColor(entry)}
                `}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInFromRight 0.5s ease-out forwards'
                }}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg flex-shrink-0">
                    {getActionIcon(entry)}
                  </span>
                  <span className="text-gray-700 leading-relaxed">
                    {entry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* ログの統計情報 */}
      {log.length > 0 && (
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-400">
            総実行回数: <span className="text-blue-400 font-bold">{log.length}</span>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
