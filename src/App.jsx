import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Box, Alert, AlertIcon, Heading, Text, Flex, useToast, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import { UNIT_DATA } from './constants';
import MCQScreen from './components/MCQScreen';
import evaluatePronunciation from './utils/pronunciationEvaluator';

const MAX_RETRIES = 3;

function App() {
  const [gameState, setGameState] = useState('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '', highlightedPhrase: [] });
  const [appError, setAppError] = useState(null);
  
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [dynamicThreshold, setDynamicThreshold] = useState(30);
  const [needsRecalibration, setNeedsRecalibration] = useState(false);
  const [calibrationKey, setCalibrationKey] = useState(0);

  const toast = useToast();

  const showToast = useCallback((status, title, description) => {
    const id = title + description;
    if (!toast.isActive(id)) {
      toast({
        id,
        position: 'top-right',
        duration: 4000,
        isClosable: true,
        render: () => (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
            <Alert status={status} borderRadius="xl" boxShadow="lg" p={4} variant="solid">
              <AlertIcon />
              <Box flex="1">
                <Text fontWeight="bold">{title}</Text>
                <Text fontSize="sm">{description}</Text>
              </Box>
            </Alert>
          </motion.div>
        ),
      });
    }
  }, [toast]);

  const currentActivity = useMemo(() => UNIT_DATA[currentIndex], [currentIndex]);
  const score = useMemo(() => sessionResults.filter(r => r.status === 'correct').length, [sessionResults]);
  const progress = useMemo(() => (sessionResults.length / UNIT_DATA.length) * 100, [sessionResults]);
  
  const resetFeedback = useCallback(() => setFeedback({ message: '', type: '', highlightedPhrase: [] }), []);

  const handleSpeechResult = useCallback((transcript) => {
    const targetPhrase = currentActivity.answer;
    const sourcePhrase = transcript;
    
    let evaluationResult = {};
    let newStatus, message;

    if (currentActivity.evaluationMode === 'EXACT') {
      const isCorrect = targetPhrase.toLowerCase() === sourcePhrase.toLowerCase();
      if (isCorrect) {
        newStatus = 'correct';
        message = `Perfect! You said "${transcript}".`;
        evaluationResult = { status: 'success', highlightedPhrase: [] };
      } else {
        newStatus = 'incorrect';
        message = `Not quite. You said "${transcript}", but the answer is "${targetPhrase}".`;
        evaluationResult = { status: 'fail', highlightedPhrase: [] };
      }
    } else {
      const useLevenshtein = currentActivity.evaluationMode === 'LEVENSHTEIN';
      evaluationResult = evaluatePronunciation(targetPhrase, sourcePhrase, useLevenshtein, 'en-US');
      
      if (evaluationResult.status === 'success') {
        newStatus = 'correct';
        message = `Perfect! You said "${transcript}".`;
      } else if (evaluationResult.status === 'partial') {
        newStatus = 'partial';
        message = `Good try! Let's review the pronunciation.`;
      } else { // 'fail'
        newStatus = 'incorrect';
        message = `Not quite. The correct answer is "${targetPhrase}".`;
      }
    }

    setFeedback({ message, type: newStatus, highlightedPhrase: evaluationResult.highlightedPhrase });
    setSessionResults(prev => [...prev, {
      ...currentActivity,
      transcript,
      status: newStatus,
      retries: retryCount,
      evaluation: evaluationResult,
    }]);
  }, [currentActivity, retryCount]);

  const handleNoSpeech = useCallback(() => {
    showToast('warning', 'No Speech Detected (R-1)', 'The system did not hear anything.');
    resetFeedback();
    setCalibrationKey(prevKey => prevKey + 1);
    setNeedsRecalibration(true); 
    if (retryCount + 1 >= MAX_RETRIES) {
      setFeedback({ message: `No speech detected after ${MAX_RETRIES} attempts. Moving on.`, type: 'warning' });
      setSessionResults(prev => [...prev, { ...currentActivity, transcript: '', status: 'skipped', retries: retryCount + 1 }]);
    } else {
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount, currentActivity, showToast, resetFeedback]);
  
  const handleGenericError = useCallback((error) => {
    const errorMap = {
      'network': { id: 'R-2', title: 'Network Error', desc: 'A network issue prevented recognition.' },
      'audio-capture': { id: 'R-3', title: 'Microphone Disconnected', desc: 'The audio source was lost.' },
      'not-allowed': { id: 'R-4', title: 'Service Not Allowed', desc: 'Recognition was blocked.' },
      'service-not-allowed': { id: 'R-4', title: 'Service Not Allowed', desc: 'Recognition was blocked.' },
      'aborted': { id: 'R-5', title: 'Recognition Canceled', desc: 'The session was canceled.' },
      'start-failed': { id: 'L-3', title: 'Recognition Failed to Start', desc: 'There was an internal issue.' },
    };
    const err = errorMap[error] || { id: 'E-X', title: 'Unknown Error', desc: 'An unexpected error occurred.' };
    showToast('error', `${err.title} (${err.id})`, err.desc);
  }, [showToast]);

  const { isListening, error: speechRecognitionError, startListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onNoSpeech: handleNoSpeech,
    onError: handleGenericError,
    onStart: () => showToast('info', 'Listening... (L-1)', 'Engine started.'),
    onSpeechStart: () => showToast('info', 'Speech Detected! (L-2)', 'Voice detected.'),
  });
  
  useEffect(() => {
    if (speechRecognitionError === 'unsupported-browser') {
      const err = { title: 'Browser Not Supported (M-6)', description: 'This app requires the Web Speech API.' };
      setAppError(err);
      showToast('error', err.title, err.description);
    }
  }, [speechRecognitionError, showToast]);

  const startUnit = useCallback(() => {
    setCurrentIndex(0); setSessionResults([]); setRetryCount(0); resetFeedback();
    setCalibrationKey(prevKey => prevKey + 1);
    setGameState('calibrating');
    setIsCalibrated(false);
  }, [resetFeedback]);

  const nextActivity = useCallback(() => {
    resetFeedback(); setRetryCount(0); setNeedsRecalibration(false);
    if (currentIndex < UNIT_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  }, [resetFeedback, currentIndex]);

  const handleMCQAnswer = (isCorrect) => {
    const status = isCorrect ? 'correct' : 'incorrect';
    setSessionResults(prev => [...prev, { ...currentActivity, status, transcript: isCorrect ? 'Correct' : 'Incorrect' }]);
    setTimeout(() => { nextActivity(); }, 1000);
  };

  const handleCalibrationComplete = useCallback((newThreshold) => {
    setDynamicThreshold(newThreshold);
    setIsCalibrated(true);
    setNeedsRecalibration(false);
    setGameState('playing');
  }, []);

  const renderContent = () => {
    if (appError) {
      return (
        <Alert status="error" variant="solid" flexDirection="column" textAlign="center" p={8} borderRadius="xl">
          <AlertIcon boxSize="40px" mr={0} />
          <Heading mt={4} mb={1} size="md">{appError.title}</Heading>
          <Text>{appError.description}</Text>
        </Alert>
      );
    }

    let content;
    switch (gameState) {
      case 'start':
        content = <StartScreen onBegin={startUnit} />;
        break;
      case 'calibrating':
      case 'playing':
        if (currentActivity.type === 'MCQ') {
          content = <MCQScreen activity={currentActivity} onAnswer={handleMCQAnswer} />;
        } else {
          content = (
            <GameScreen
              month={currentActivity}
              isListening={isListening}
              startListening={startListening}
              nextPrompt={nextActivity}
              feedback={feedback}
              showNextButton={!!sessionResults[currentIndex]}
              showToast={showToast}
              isCalibrated={isCalibrated}
              needsRecalibration={needsRecalibration}
              calibrationKey={calibrationKey}
              onCalibrationComplete={handleCalibrationComplete}
              dynamicThreshold={dynamicThreshold}
            />
          );
        }
        break;
      case 'results':
        content = <ResultsScreen results={sessionResults} restartGame={startUnit} />;
        break;
      default:
        content = null;
    }
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };
  
  return (
    <Flex align="center" justify="center" minH="100vh" w="100vw" p={4}>
      <Container maxW="container.sm" bg="white" borderRadius="2xl" boxShadow="xl" p={{ base: 6, md: 8 }} border="1px" borderColor="slate.200">
        <VStack spacing={8} w="100%">
          <Header score={score} total={UNIT_DATA.length} progress={progress} />
          <Box as="main" w="100%" minH={{ base: "420px", md: "450px" }}>
            {renderContent()}
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}

export default App;