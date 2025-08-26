import React from 'react';
import { FeedbackQuestion } from '../data/questions';

interface QuestionCardProps {
  question: FeedbackQuestion;
  onFeedback: (questionText: string, rating: number) => void;
  currentIndex: number;
  total: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onFeedback, currentIndex, total }) => {
  const ratingOptions = [
    { value: 1, label: 'Totalmente in disaccordo', emoji: '😞' },
    { value: 2, label: 'In disaccordo', emoji: '😕' },
    { value: 3, label: 'Neutrale', emoji: '😐' },
    { value: 4, label: 'D\'accordo', emoji: '🙂' },
    { value: 5, label: 'Totalmente d\'accordo', emoji: '😊' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn max-w-2xl w-full">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Domanda {currentIndex + 1} di {total}</span>
          {question.category && (
            <span className="text-sm px-2 py-1 bg-red-50 text-custom-red rounded">
              {question.category}
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-custom-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>
      
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">
        {question.questionText}
      </h2>
      
      <div className="space-y-3">
        {ratingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFeedback(question.questionText, option.value)}
            className="w-full bg-gray-50 hover:bg-custom-green hover:text-white text-gray-800 py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-200 hover:border-custom-green flex items-center justify-between group"
          >
            <span className="flex items-center space-x-3">
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-medium">{option.label}</span>
            </span>
            <span className="w-10 h-10 rounded-full bg-gray-200 group-hover:bg-white group-hover:text-custom-green flex items-center justify-center font-bold">
              {option.value}
            </span>
          </button>
        ))}
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Seleziona un valore da 1 a 5
      </p>
    </div>
  );
};

export default QuestionCard;