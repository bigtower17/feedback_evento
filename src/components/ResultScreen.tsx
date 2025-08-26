import React from 'react';

interface ResultScreenProps {
  isSaving?: boolean;
  saveError?: string | null;
  onRetry?: () => Promise<void>;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isSaving, saveError, onRetry }) => {

  return (
    <div className="text-center animate-fadeIn bg-white p-8 rounded-lg shadow-lg w-full mx-auto max-w-md">
      <div className="mb-6">
        <svg className="w-20 h-20 mx-auto text-custom-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Grazie per il tuo feedback!
        </h2>
        <p className="text-lg text-gray-600">
          Le tue risposte sono state registrate con successo.
        </p>
      </div>

      <div className="bg-red-50 border-l-4 border-custom-red p-4 mb-6">
        <p className="text-custom-red">
          Il tuo contributo ci aiuterà a migliorare i prossimi eventi.
        </p>
      </div>

      {isSaving && (
        <div className="mb-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-green mr-3"></div>
          <p className="text-gray-600">Salvataggio delle risposte in corso...</p>
        </div>
      )}
      
      {saveError && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700 mb-2">{saveError}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isSaving}
              className={`bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Riprova
            </button>
          )}
        </div>
      )}

      {!isSaving && !saveError && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Ti terremo aggiornato sui prossimi eventi!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-custom-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-custom-green-dark transition-colors w-full"
          >
            Compila un nuovo feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;