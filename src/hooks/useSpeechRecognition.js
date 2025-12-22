import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = ({ onResult, onNoSpeech, onError, onStart, onSpeechStart }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Use refs for callbacks to avoid re-initializing the recognition engine when they change
  const callbacks = useRef({ onResult, onNoSpeech, onError, onStart, onSpeechStart });
  useEffect(() => {
    callbacks.current = { onResult, onNoSpeech, onError, onStart, onSpeechStart };
  }, [onResult, onNoSpeech, onError, onStart, onSpeechStart]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('unsupported-browser');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true; // Enabled for better feedback
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsListening(true);
        if (callbacks.current.onStart) callbacks.current.onStart();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onspeechstart = () => {
        if (callbacks.current.onSpeechStart) callbacks.current.onSpeechStart();
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          if (callbacks.current.onResult) {
            callbacks.current.onResult(transcript.toLowerCase().trim());
          }
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          if (callbacks.current.onNoSpeech) callbacks.current.onNoSpeech();
        } else {
          setError(event.error);
          if (callbacks.current.onError) callbacks.current.onError(event.error);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
        setError('start-failed');
        if (callbacks.current.onError) callbacks.current.onError('start-failed');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, error, startListening, stopListening };
};

export default useSpeechRecognition;