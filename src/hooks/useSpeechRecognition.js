import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = ({ onResult, onNoSpeech, onError, onStart, onSpeechStart }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('unsupported-browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => { setIsListening(true); if (onStart) onStart(); };
    recognition.onend = () => { setIsListening(false); };
    recognition.onspeechstart = () => { if (onSpeechStart) onSpeechStart(); };
    recognition.onresult = (event) => {
      if (event.results[0].isFinal) {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        if (onResult) onResult(transcript);
      }
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') { if (onNoSpeech) onNoSpeech(); } 
      else { setError(event.error); if (onError) onError(event.error); }
    };
    recognitionRef.current = recognition;
  }, [onResult, onNoSpeech, onError, onStart, onSpeechStart]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try { recognitionRef.current.start(); } 
      catch (err) {
        console.error("Error starting recognition:", err);
        setError('start-failed');
        if (onError) onError('start-failed');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, error, startListening, stopListening };
};
export default useSpeechRecognition;