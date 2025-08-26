import React from 'react';

interface Question {
  questionText: string;
  answers: { text: string; points: number }[];
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (points: number, answerText: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const renderQuestionText = (text: string) => {
    const parts = text.split('NON');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <strong className="font-bold">NON</strong>}
        {part}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn max-w-md w-full h-[400px] flex flex-col">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center flex-shrink-0">
        {renderQuestionText(question.questionText)}
      </h2>
      <div className="space-y-3 flex-grow overflow-y-auto">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswer(answer.points, answer.text)}
            className="w-[95%] mx-auto bg-custom-green text-white py-3 px-6 rounded-lg hover:bg-custom-green-dark transition-colors hover:pulse whitespace-normal text-sm md:text-base min-h-[60px] flex items-center justify-center"
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;