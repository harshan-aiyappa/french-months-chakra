import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Box, Alert, AlertIcon, Heading, Text, Flex, useToast, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import { MONTHS_DATA, calculateSimilarity } from './constants';

const MAX_RETRIES = 3;

function App() {
  const [gameState, setGameState] = useState('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [appError, setAppError] = useState(null);
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

  const currentMonth = useMemo(() => MONTHS_DATA[currentIndex], [currentIndex]);
  const score = useMemo(() => sessionResults.filter(r => r.status === 'correct').length, [sessionResults]);
  const progress = useMemo(() => (sessionResults.length / MONTHS_DATA.length) * 100, [sessionResults]);

  const resetFeedback = useCallback(() => setFeedback({ message: '', type: '' }), []);

  const handleSpeechResult = useCallback((transcript) => {
    const expected = currentMonth.answer.toLowerCase();
    const isCorrect = transcript === expected;
    const similarity = calculateSimilarity(transcript, expected);
    let status, message;
    if (isCorrect) { status = 'correct'; message = `Correct! "${currentMonth.question}" → "${currentMonth.answer}"`; } 
    else if (similarity >= 0.7) { status = 'partial'; message = `Close! You said "${transcript}". Correct answer: "${currentMonth.answer}"`; } 
    else { status = 'incorrect'; message = `Incorrect. You said "${transcript}". Correct answer: "${currentMonth.answer}"`; }
    setFeedback({ message, type: status });
    setSessionResults(prev => [...prev, { ...currentMonth, transcript, status, retries: retryCount }]);
  }, [currentMonth, retryCount]);

  const handleNoSpeech = useCallback(() => {
    showToast('warning', 'No Speech Detected (R-1)', 'The system did not hear anything.');
    if (retryCount + 1 >= MAX_RETRIES) {
      setFeedback({ message: `No speech detected after ${MAX_RETRIES} attempts. Moving on.`, type: 'warning' });
      setSessionResults(prev => [...prev, { ...currentMonth, transcript: '', status: 'skipped', retries: retryCount + 1 }]);
    } else {
      setRetryCount(prev => prev + 1);
      setFeedback({ message: `No speech detected. Try again (${retryCount + 1}/${MAX_RETRIES})`, type: 'warning' });
    }
  }, [retryCount, currentMonth, showToast]);
  
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
    onResult: handleSpeechResult, onNoSpeech: handleNoSpeech, onError: handleGenericError,
    onStart: () => showToast('info', 'Listening... (L-1)', 'The engine has started.'),
    onSpeechStart: () => showToast('info', 'Speech Detected! (L-2)', 'Your voice is being picked up.'),
  });
  
  useEffect(() => {
    if (speechRecognitionError === 'unsupported-browser') {
      const err = { title: 'Browser Not Supported (M-6)', description: 'This app requires the Web Speech API.' };
      setAppError(err);
      showToast('error', err.title, err.description);
    }
  }, [speechRecognitionError, showToast]);

  const startGame = useCallback(() => {
    setCurrentIndex(0); setSessionResults([]); setRetryCount(0); resetFeedback(); setGameState('playing');
  }, [resetFeedback]);

  const nextPrompt = useCallback(() => {
    resetFeedback(); setRetryCount(0);
    if (currentIndex < MONTHS_DATA.length - 1) { setCurrentIndex(prev => prev + 1); } 
    else { setGameState('results'); }
  }, [resetFeedback, currentIndex]);

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

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {gameState === 'start' && <StartScreen onBegin={startGame} />}
          {gameState === 'playing' && (
            <GameScreen
              month={currentMonth} isListening={isListening} startListening={startListening} nextPrompt={nextPrompt}
              feedback={feedback} showNextButton={!!sessionResults[currentIndex]} showToast={showToast}
            />
          )}
          {gameState === 'results' && <ResultsScreen results={sessionResults} restartGame={startGame} />}
        </motion.div>
      </AnimatePresence>
    );
  };
  
  return (
    <Flex align="center" justify="center" minH="100vh" w="100vw" p={4}>
      <Container
        maxW="container.sm"
        bg="white"
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 6, md: 8 }}
        border="1px"
        borderColor="slate.200"
      >
        <VStack spacing={8} w="100%">
          <Header score={score} total={MONTHS_DATA.length} progress={progress} />
          <Box as="main" w="100%" minH={{ base: "420px", md: "450px" }}>
            {renderContent()}
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}

export default App;