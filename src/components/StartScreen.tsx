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
  headingText = "Benvenuto al Test del Gommista!",
  buttonText = "Inizia il Test",
  loading = false,
  customStyles = "",
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(loading);

  const handleStartClick = () => {
    setIsLoading(true);
    onStartQuiz("quizId123");
  };

  return (
    <div
      className={`relative text-center animate-fadeIn max-w-md w-full mt-60 md:mt-24 ${customStyles}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${logo})`,
          opacity: 0.05,
          zIndex: -1,
        }}
      />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        <span className="block">Benvenuto al</span>
        <span className="block">Test del Gommista</span>
      </h1>
      <p className="text-gray-600 mb-6">
        Per iniziare il quiz, ti chiediamo di inserire alcune informazioni per personalizzare la tua esperienza.
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