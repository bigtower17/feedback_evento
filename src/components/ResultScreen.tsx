import React from 'react';
import nostalgico from '../assets/images/nostalgico.jpg';
import equilibrista from '../assets/images/equilibrista.jpg';
import visionario from '../assets/images/visionario.jpg';

interface ResultScreenProps {
  score: number;
  isSaving?: boolean;
  saveError?: string | null;
  onRetry?: () => Promise<void>;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, isSaving, saveError, onRetry }) => {
  let profile = {
    title: '',
    tagline: '',
    description: '',
    advice: '',
    image: ''
  };

  if (score <= 9) {
    profile = {
      title: 'Il Nostalgico della carta',
      tagline: '“Carta canta, ma il tempo vola!”',
      description:
        'Sei affezionato ai metodi di una volta. L’agenda è la tua compagna di viaggio, ma a volte le cose si perdono, si dimenticano o si fanno due volte. Il tuo lavoro è impeccabile, ma la gestione ti ruba tempo prezioso e ti fa rincorrere le urgenze.',
      advice:
        'Con Officina in Cloud puoi fare un salto di qualità senza perdere la tua esperienza: digitalizza tutto, risparmia ore ogni settimana e non dimenticare più nulla.',
      image: nostalgico
    };
  } else if (score <= 13) {
    profile = {
      title: "L'Equilibrista",
      tagline: '“Un piede nel futuro, uno nei foglietti”',
      description:
        'Hai iniziato ad adottare qualche strumento digitale e capisci il valore del tempo. Ma spesso ti trovi a fare salti mortali tra file, app diverse e WhatsApp con i clienti. C’è ordine… ma manca la regia.',
      advice:'Officina in Cloud è l’alleato che ti permette di integrare tutto. Una sola piattaforma',
      image: equilibrista
    };
  } else {
    profile = {
      title: 'Il Visionario',
      tagline: '“Il tempo è il tuo miglior investimento”',
      description:
        'Complimenti! Hai capito che l’efficienza non è solo tecnica, ma anche organizzativa. Usi già strumenti digitali e cerchi sempre modi per migliorare. Sei il gommista che guarda avanti, automatizza e crea valore anche fuori dall’officina.',
      advice:
        'Officina in Cloud è il partner perfetto per portare la tua visione ancora più in alto. Automatizza, delega e continua a crescere. Tu sei il futuro delle officine.',
      image: visionario
    };
  }

  return (
    <div className="text-center animate-fadeIn bg-white p-6 rounded-lg shadow-lg w-full mx-auto min-h-[400px] flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        {profile.title}
      </h2>
      <p className="text-lg italic text-gray-600 mb-4">{profile.tagline}</p>
      <div className="flex-grow overflow-y-auto mb-6">
        <img
          src={profile.image}
          alt={profile.title}
          className="w-full h-auto mb-6 rounded-lg"
        />
        <p className="text-gray-700 mb-4">{profile.description}</p>
        <p className="text-gray-700 font-semibold">{profile.advice}</p>
      </div>
      {isSaving && (
        <p className="text-gray-600 mb-4">Salvataggio dei dati in corso...</p>
      )}
      {saveError && (
        <div className="mb-4">
          <p className="text-red-500 mb-2">{saveError}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isSaving}
              className={`bg-custom-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-custom-green-dark transition-colors hover:pulse ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Riprova
            </button>
          )}
        </div>
      )}
      <a
        href="https://www.officinaincloud.it"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-custom-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-custom-green-dark transition-colors hover:pulse"
      >
        Scopri Officina in Cloud!
      </a>
    </div>
  );
};

export default ResultScreen;