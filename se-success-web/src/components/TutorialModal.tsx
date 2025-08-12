'use client';
import { useState, useEffect } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // モーダルが開かれるたびに最初のステップから開始
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const tutorialSteps = [
    {
      title: "SE Success へようこそ！",
      content: "あなたは新米の研究者として、様々な能力を高めながら研究活動を行います。",
      icon: "🎓"
    },
    {
      title: "能力値について",
      content: "9つの能力値があります。各能力値は行動によって変化し、ランク（S, A, B, C, D, E）で評価されます。",
      icon: "📊"
    },
    {
      title: "行動の選択",
      content: "毎週、研究・学習・休憩などの行動を選択できます。各行動にはスタミナコストと能力値への効果があります。",
      icon: "⚡"
    },
    {
      title: "スタミナ管理",
      content: "行動にはスタミナが必要です。スタミナが不足した場合は休憩を取って回復させましょう。",
      icon: "💪"
    },
    {
      title: "目標",
      content: "52週間で研究者として成長し、高い能力値を目指しましょう！",
      icon: "🎯"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最後のステップでは少し遅延を入れてから閉じる
      // プログレスバーが完全に表示されるのを待つ
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            {tutorialSteps[currentStep].icon}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {tutorialSteps[currentStep].content}
          </p>
        </div>
        
        {/* プログレスバー */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-gray-400 text-sm">
            {currentStep + 1} / {tutorialSteps.length}
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors transform hover:scale-105"
          >
            スキップ
          </button>
          <button
            onClick={handleNext}
            className={`px-8 py-3 rounded-lg transition-colors transform hover:scale-105 ${
              currentStep === tutorialSteps.length - 1 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {currentStep === tutorialSteps.length - 1 ? '開始' : '次へ'}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            チュートリアルは後からヘルプボタンから確認できます
          </p>
        </div>
      </div>
    </div>
  );
}
