import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Box,
  Alert,
  AlertIcon,
  Heading,
  Text,
  Flex,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import ResultsScreen from "./components/ResultsScreen";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import { UNIT_DATA } from "./constants";
import MCQScreen from "./components/MCQScreen";
import evaluatePronunciation from "./utils/pronunciationEvaluator";
import CalibrationScreen from "./components/CalibrationScreen";
import NeuralBackground from "./components/NeuralBackground";
import DeveloperAttribution from "./components/DeveloperAttribution";

const MAX_RETRIES = 3;

const ERROR_MAP = {
  network: { id: "R-2", title: "Network Error", desc: "A network issue prevented the speech from being recognized. Please check your connection." },
  "audio-capture": { id: "R-3", title: "Microphone Disconnected", desc: "The audio source was lost during recognition. Please check your microphone." },
  "not-allowed": { id: "R-4", title: "Service Not Allowed", desc: "The speech recognition service was blocked. This may be due to a browser extension or network policy." },
  "service-not-allowed": { id: "R-4", title: "Service Not Allowed", desc: "The speech recognition service was blocked. This may be due to a browser extension or network policy." },
  aborted: { id: "R-5", title: "Recognition Canceled", desc: "The listening session was canceled because the page became inactive." },
  "start-failed": { id: "L-3", title: "Recognition Failed to Start", desc: "There was an issue initializing the speech recognition engine." },
};

function App() {
  const [gameState, setGameState] = useState("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [feedback, setFeedback] = useState({
    message: "",
    type: "",
    highlightedPhrase: [],
  });
  const [appError, setAppError] = useState(null);
  const [dynamicThreshold, setDynamicThreshold] = useState(30);
  const toast = useToast();

  // iOS Safari AudioContext fix: Resume AudioContext on first interaction
  useEffect(() => {
    const resumeAudio = () => {
      if (window.AudioContext || window.webkitAudioContext) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log('[App] AudioContext resumed');
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('touchstart', resumeAudio);
          });
        }
      }
    };
    window.addEventListener('click', resumeAudio);
    window.addEventListener('touchstart', resumeAudio);
    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
  }, []);

  const showToast = useCallback(
    (status, title, description) => {
      const id = title + description;
      if (!toast.isActive(id)) {
        toast({
          id,
          position: "top-right",
          duration: 4000,
          isClosable: true,
          render: () => (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <Alert
                status={status}
                borderRadius="xl"
                boxShadow="lg"
                p={4}
                variant="solid"
              >
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
    },
    [toast]
  );

  const currentActivity = useMemo(
    () => UNIT_DATA[currentIndex],
    [currentIndex]
  );
  const score = useMemo(
    () => sessionResults.filter((r) => r.status === "correct").length,
    [sessionResults]
  );
  const progress = useMemo(
    () => (sessionResults.length / UNIT_DATA.length) * 100,
    [sessionResults]
  );
  const resetFeedback = useCallback(
    () => setFeedback({ message: "", type: "", highlightedPhrase: [] }),
    []
  );

  const handleSpeechResult = useCallback(
    (transcript) => {
      const isSpeakingTask = currentActivity.type === 'SPEAKING';
      const targetPhrase = isSpeakingTask ? currentActivity.question : currentActivity.answer;
      const sourcePhrase = transcript;
      let evaluationResult;

      if (currentActivity.evaluationMode === "EXACT") {
        const isCorrect =
          targetPhrase.toLowerCase() === sourcePhrase.toLowerCase();
        if (isCorrect) {
          evaluationResult = {
            status: "success",
            message: `Perfect! You said "${transcript}".`,
            highlightedPhrase: [],
          };
        } else {
          evaluationResult = {
            status: "fail",
            message: `Not quite. You said "${transcript}", but the answer is "${targetPhrase}".`,
            highlightedPhrase: [],
          };
        }
      } else {
        const useLevenshtein = currentActivity.evaluationMode === "LEVENSHTEIN";
        evaluationResult = evaluatePronunciation(
          targetPhrase,
          sourcePhrase,
          useLevenshtein,
          "fr-FR"
        );
      }

      const newStatus =
        evaluationResult.status === "success"
          ? "correct"
          : evaluationResult.status === "partial"
            ? "partial"
            : "incorrect";

      setFeedback({
        message: evaluationResult.message,
        type: newStatus,
        highlightedPhrase: evaluationResult.highlightedPhrase,
      });

      setSessionResults((prev) => [
        ...prev,
        {
          ...currentActivity,
          transcript,
          status: newStatus,
          retries: retryCount,
          evaluation: evaluationResult,
        },
      ]);
    },
    [currentActivity, retryCount]
  );

  const {
    isListening,
    error: speechRecognitionError,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      stopListening();
      showToast("success", "Speech Captured! (A-1)", `Captured: "${transcript}"`);
      handleSpeechResult(transcript);
    },
    onNoSpeech: () => {
      stopListening();
      handleNoSpeech();
    },
    onError: (error) => {
      stopListening();
      const err = ERROR_MAP[error] || {
        id: "E-X",
        title: "Unknown Error",
        desc: "An unexpected error occurred.",
      };
      showToast("error", `${err.title} (${err.id})`, err.desc);
    },
    onStart: () => showToast("info", "Listening... (L-1)", "The speech recognition engine has started."),
    onSpeechStart: () =>
      showToast("info", "Speech Detected! (L-2)", "Your voice is being picked up by the microphone. Keep going!"),
  });

  const handleNoSpeech = useCallback(() => {
    showToast(
      "warning",
      "No Speech Detected (R-1)",
      "The system did not hear anything. Please make sure to speak after clicking the button."
    );
    resetFeedback();

    // As per doc: Failure triggers re-calibration flow
    setGameState("calibrating");

    if (retryCount + 1 >= MAX_RETRIES) {
      setFeedback({
        message: `No speech detected after ${MAX_RETRIES} attempts. Moving on.`,
        type: "warning",
      });
      setSessionResults((prev) => [
        ...prev,
        {
          ...currentActivity,
          transcript: "",
          status: "skipped",
          retries: retryCount + 1,
        },
      ]);
    } else {
      setRetryCount((prev) => prev + 1);
    }
  }, [retryCount, currentActivity, showToast, resetFeedback]);

  useEffect(() => {
    if (speechRecognitionError === "unsupported-browser") {
      const err = {
        title: "Browser Not Supported (M-6)",
        description: "Your browser does not support the Web Speech API. Please use a recent version of Chrome or Safari.",
      };
      setAppError(err);
      showToast("error", err.title, err.description);
    }
  }, [speechRecognitionError, showToast]);

  const startUnit = useCallback(() => {
    setCurrentIndex(0);
    setSessionResults([]);
    setRetryCount(0);
    resetFeedback();
    setGameState("calibrating");
  }, [resetFeedback]);

  const nextActivity = useCallback(() => {
    resetFeedback();
    setRetryCount(0);
    if (currentIndex < UNIT_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState("results");
    }
  }, [resetFeedback, currentIndex]);

  const handleMCQAnswer = (isCorrect) => {
    const status = isCorrect ? "correct" : "incorrect";
    setSessionResults((prev) => [
      ...prev,
      {
        ...currentActivity,
        status,
        transcript: isCorrect ? "Correct" : "Incorrect",
      },
    ]);
    setTimeout(() => {
      nextActivity();
    }, 1000);
  };

  const handleCalibrationComplete = useCallback((newThreshold) => {
    setDynamicThreshold(newThreshold);
    setGameState("playing");
  }, []);

  const renderContent = () => {
    if (appError) {
      return (
        <Alert
          status="error"
          variant="solid"
          flexDirection="column"
          textAlign="center"
          p={8}
          borderRadius="xl"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <Heading mt={4} mb={1} size="md">
            {appError.title}
          </Heading>
          <Text>{appError.description}</Text>
        </Alert>
      );
    }

    let content;
    switch (gameState) {
      case "start":
        content = <StartScreen onBegin={startUnit} />;
        break;
      case "calibrating":
        content = (
          <CalibrationScreen
            onCalibrationComplete={handleCalibrationComplete}
            showToast={showToast}
          />
        );
        break;
      case "playing":
        if (currentActivity.type === "MCQ") {
          content = (
            <MCQScreen activity={currentActivity} onAnswer={handleMCQAnswer} />
          );
        } else {
          content = (
            <GameScreen
              month={currentActivity}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              nextPrompt={nextActivity}
              feedback={feedback}
              showNextButton={!!sessionResults[currentIndex]}
              showToast={showToast}
              dynamicThreshold={dynamicThreshold}
            />
          );
        }
        break;
      case "results":
        content = (
          <ResultsScreen results={sessionResults} restartGame={startUnit} />
        );
        break;
      default:
        content = null;
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState === "playing" ? `playing-${currentIndex}` : gameState}
          initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: "circOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <NeuralBackground />
      <DeveloperAttribution />
      <Flex
        align="center"
        justify="center"
        h={{ base: "100dvh", md: "100dvh" }}
        className="full-h-mobile"
        w="100vw"
        position="fixed"
        top={0}
        left={0}
        overflow="hidden"
        p={{ base: 2, md: 4 }}
        pt={{ base: "calc(env(safe-area-inset-top) + 8px)", md: 4 }}
        pb={{ base: "calc(env(safe-area-inset-bottom) + 60px)", md: "calc(env(safe-area-inset-bottom) + 24px)" }}
        pl={{ base: "calc(env(safe-area-inset-left) + 8px)", md: 4 }}
        pr={{ base: "calc(env(safe-area-inset-right) + 8px)", md: 4 }}
      >
        <Container
          maxW={{ base: "100%", md: "container.sm", lg: "container.md" }}
          maxH="100%"
          bg="white"
          borderRadius={{ base: "xl", md: "3xl" }}
          boxShadow="2xl"
          p={{ base: 3, md: 6, lg: 8 }}
          pb={{ base: 12, md: 8 }} // Extra padding inside container
          border="1px"
          borderColor="slate.100"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: '4px' },
          }}
        >
          <VStack spacing={{ base: 3, md: 5 }} w="100%">
            <Header score={score} total={UNIT_DATA.length} progress={progress} />
            <Box as="main" w="100%" minH={{ base: "auto", md: "380px" }} flex="1">
              {renderContent()}
            </Box>
          </VStack>
        </Container>
      </Flex>
    </>
  );
}

export default App;
