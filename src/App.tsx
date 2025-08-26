import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import RegistrationScreen from './components/RegistrationScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import { questions } from './data/questions';
import './style.css';

interface GoogleScriptErrorResponse {
  status: string;
  message?: string;
}

interface RegistrationData {
  name: string;
  ragionesociale: string;
  email: string;
  phone: string;
  consent: boolean;
}

type Screen = 'start' | 'registration' | 'feedback' | 'results';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackResponses, setFeedbackResponses] = useState<{question: string, rating: number}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const saveTriggeredRef = useRef(false);
  const lastSaveAttemptRef = useRef<number>(0);

  const handleStartQuiz = () => {
    setScreen('registration');
  };

  const handleRegister = (data: RegistrationData) => {
    setRegistrationData({
      name: data.name,
      ragionesociale: '',
      email: '',
      phone: '',
      consent: false
    });
    setScreen('feedback');
  };

  const handleFeedback = (questionText: string, rating: number) => {
    setFeedbackResponses(prevResponses => {
      const newResponses = [...prevResponses, {question: questionText, rating}];
      console.log('Feedback responses updated:', newResponses);
      return newResponses;
    });
    setCurrentQuestionIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      console.log('Moving to question index:', newIndex);
      return newIndex;
    });
  };

  const handleRestart = () => {
    setScreen('start');
    setRegistrationData(null);
    setCurrentQuestionIndex(0);
    setFeedbackResponses([]);
    setIsSaving(false);
    setSaveError(null);
    setHasSaved(false);
    saveTriggeredRef.current = false;
    lastSaveAttemptRef.current = 0;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleGoBackFromRegistration = () => {
    setScreen('start');
    setRegistrationData(null);
  };

  const saveToGoogleSheets = useCallback(async () => {
    const now = Date.now();
    if (now - lastSaveAttemptRef.current < 3000) {
      console.log('Save skipped: debounced (too soon)');
      return;
    }
    lastSaveAttemptRef.current = now;

    if (!registrationData) {
      setSaveError('Registration data is missing.');
      saveTriggeredRef.current = false;
      return;
    }
    if (!registrationData.name) {
      setSaveError('Name is required.');
      saveTriggeredRef.current = false;
      return;
    }
    if (isSaving || hasSaved) {
      console.log('Save skipped: already saving or saved');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const data = {
      timestamp: new Date().toISOString(),
      name: registrationData.name,
      ragionesociale: registrationData.ragionesociale,
      email: registrationData.email,
      phone: registrationData.phone,
      consent: registrationData.consent,
      feedbackResponses,
    };
    const dataString = JSON.stringify(data);
    console.log('Data to send:', dataString);

    try {
      const response = await axios.get(
        'https://script.google.com/macros/s/AKfycbxpoLTYK6MpAJEPXQZ0_v39z477f7551h6RkDsvRhMh1Ps5ObGqBwv4Ob0G5Y_Avp1g1A/exec',
        {
          params: {
            data: dataString
          },
          signal: controller.signal,
        }
      );
      console.log('Response from Google Sheets:', response.data);
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to save data');
      }
      setHasSaved(true);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return;
      }
      const axiosError = error as AxiosError<GoogleScriptErrorResponse>;
      let errorMessage = axiosError.message || 'Failed to save data';
      if (axiosError.response?.status === 429) {
        errorMessage = 'Too many requests. Retrying in 5 seconds...';
        setTimeout(saveToGoogleSheets, 5000);
      } else if (axiosError.response?.status === 411) {
        errorMessage = 'Content-Length header issue. Please try again.';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
      console.error('Error saving to Google Sheets:', {
        message: errorMessage,
        response: axiosError.response?.data || null,
        status: axiosError.response?.status || null,
      });
      setSaveError(`Error: ${errorMessage}. Please try again.`);
      saveTriggeredRef.current = false;
    } finally {
      setIsSaving(false);
      abortControllerRef.current = null;
    }
  }, [registrationData, feedbackResponses, isSaving, hasSaved]);

  useEffect(() => {
    if (
      screen === 'feedback' &&
      currentQuestionIndex >= questions.length &&
      registrationData &&
      !saveTriggeredRef.current &&
      !isSaving &&
      !hasSaved
    ) {
      console.log('Feedback completed, triggering save via useEffect');
      saveTriggeredRef.current = true;
      saveToGoogleSheets();
      setScreen('results');
    }
  }, [screen, currentQuestionIndex, registrationData, isSaving, hasSaved, saveToGoogleSheets]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header onHome={handleRestart} showHomeButton={screen !== 'start'} />
      <main className="flex-grow flex items-start justify-center px-4 pt-20 pb-32">
        {screen === 'start' && <StartScreen onStartQuiz={handleStartQuiz} />}
        {screen === 'registration' && (
          <RegistrationScreen
            onRegister={handleRegister}
            onGoBack={handleGoBackFromRegistration}
          />
        )}
        {screen === 'feedback' && currentQuestionIndex < questions.length && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onFeedback={handleFeedback}
            currentIndex={currentQuestionIndex}
            total={questions.length}
          />
        )}
        {screen === 'results' && (
          <div className="w-full max-w-md">
            <ResultScreen
              isSaving={isSaving}
              saveError={saveError}
              onRetry={saveToGoogleSheets}
            />
        
          </div>
        )}
      </main>
      
    </div>
  );
};

export default App;