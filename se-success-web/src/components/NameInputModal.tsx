'use client';
import { useState, useEffect } from 'react';

interface NameInputModalProps {
  isOpen: boolean;
  onNameSubmit: (name: string) => void;
  defaultName?: string;
}

export default function NameInputModal({ isOpen, onNameSubmit, defaultName = '' }: NameInputModalProps) {
  const [name, setName] = useState(defaultName);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
      setIsVisible(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleSubmit(e as any);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">研究者の名前を入力</h2>
          <p className="text-gray-300 text-sm">あなたの研究者キャラクターの名前を決めてください</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="研究者の名前を入力..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              maxLength={20}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors transform hover:scale-105 disabled:hover:scale-100"
            >
              決定
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            Enterキーでも決定できます
          </p>
        </div>
      </div>
    </div>
  );
}
