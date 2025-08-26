import React, { useState } from 'react';
import logo from '../assets/images/logo.svg';

interface StartScreenProps {
  onStartQuiz: (quizId?: string) => void;
  headingText?: string;
  buttonText?: string;
  loading?: boolean;
  customStyles?: string;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartQuiz,
  headingText = "Feedback Evento",
  buttonText = "Inizia il Feedback",
  loading = false,
  customStyles = "",
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(loading);

  const handleStartClick = () => {
    setIsLoading(true);
    onStartQuiz("feedbackId123");
  };

  return (
    <div
      className={`relative text-center animate-fadeIn max-w-md w-full mt-60 md:mt-24 ${customStyles}`}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        <span className="block">Conta e Cammina</span>
        <span className="block text-2xl mt-2">raccolta feedback</span>
      </h1>
      <p className="text-gray-600 mb-6">
        Aiutaci a migliorare! Condividi la tua esperienza e le tue opinioni sull'evento a cui hai partecipato.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Il questionario richiede solo 2-3 minuti per essere completato.
      </p>
      <button
        onClick={handleStartClick}
        className="bg-custom-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-custom-green-dark transition-colors hover:pulse"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loader">Caricamento...</span>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default StartScreen;