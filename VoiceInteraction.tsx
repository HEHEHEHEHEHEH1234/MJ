import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { chatWithAI } from '../../services/api';
import { ErrorMessage } from '../ErrorMessage';

export const VoiceInteraction: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleUserInput(transcript);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
  }, []);

  const handleUserInput = async (input: string) => {
    setLoading(true);
    setError(null);
    try {
      const aiResponse = await chatWithAI(input);
      setResponse(aiResponse);
      speakResponse(aiResponse);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setResponse('');
      setError(null);
      recognition.start();
      setIsListening(true);
    }
  };

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Voice Interaction</h2>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-center">
          <button
            onClick={toggleListening}
            disabled={loading || !recognition}
            className={`p-6 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
        </div>

        {transcript && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">You said:</h3>
            <p className="text-gray-700">{transcript}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {response && (
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Volume2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">AI Response:</h3>
                <p className="text-gray-700">{response}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          {recognition ? (
            'Click the microphone button and start speaking'
          ) : (
            'Speech recognition is not supported in your browser'
          )}
        </div>
      </div>
    </div>
  );
};