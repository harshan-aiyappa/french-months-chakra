// ============================================================================
// VOCALIS - Main Application Component
// ============================================================================
//
// PURPOSE:
// Interactive pronunciation training app (Vocalis) for learning French month names.
// Uses speech recognition (ASR) and voice activity detection (VAD) to provide
// real-time feedback on pronunciation accuracy.
//
// KEY TECHNOLOGIES:
// - React 18 with Hooks (useState, useEffect, useCallback)
// - Redux Toolkit for centralized state management
// - Chakra UI for component library and theming
// - Framer Motion for smooth animations
// - Web Speech API for speech recognition (browser-native ASR)
// - Web Audio API for voice activity detection (microphone level monitoring)
// - Lucide React for SVG icons
//
// GAME MODES:
// 1. Mix Mode (24 activities) - 12 Speaking + 12 Multiple Choice Questions
// 2. Speaking Mode (12 activities) - Pronunciation practice only
// 3. Quiz Mode (12 activities) - Multiple choice only (no microphone needed)
//
// ARCHITECTURE:
// - Redux manages game state (mode, status, progress, history)
// - Components are organized by screen (Start, Calibration, Game, MCQ, Results)
// - Custom hooks handle speech recognition and audio processing
// - Memoized selectors optimize performance
//
// ============================================================================
// IMPORTS
// ============================================================================

// React & Hooks
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { Globe, CheckCircle, XCircle } from "lucide-react";

// Components
// Components
import Header from "./ui/Header";
import StartScreen from "./screens/StartScreen";
import GameScreen from "./screens/GameScreen";
import ResultsScreen from "./screens/ResultsScreen";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { UNIT_DATA } from "../constants";
import MCQScreen from "./screens/MCQScreen";
import evaluatePronunciation from "../utils/pronunciationEvaluator";
import CalibrationScreen from "./screens/CalibrationScreen";
import { ERROR_MAP } from "../constants/errors";

// Utils
import { getBrowserInfo, checkFeatureSupport } from "../utils/browserDetection";
// Redux Store
import {
  selectGameStatus,
  selectCurrentActivity,
  selectHistory,
  selectRetryCount,
  selectFeedback,
  selectDynamicThreshold,
  selectScore,
  selectProgress,
  selectTotal,
  selectCurrentIndex,
  startGame,
  setCalibrationComplete,
  submitResult,
  setFeedback,
  nextActivity,
  retryCurrent,
  incrementRetry,
  triggerRecalibration,
} from "../store/gameSlice";

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_RETRIES = 3;

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function GameUnit() {
  // ========================================================================
  // REDUX STATE & DISPATCH
  // ========================================================================

  const dispatch = useDispatch();

  // Redux selectors
  const gameState = useSelector(selectGameStatus);
  const currentActivity = useSelector(selectCurrentActivity);
  const sessionResults = useSelector(selectHistory);
  const retryCount = useSelector(selectRetryCount);
  const feedback = useSelector(selectFeedback);
  const dynamicThreshold = useSelector(selectDynamicThreshold);
  const score = useSelector(selectScore);
  const progress = useSelector(selectProgress);
  const total = useSelector(selectTotal);
  const currentIndex = useSelector(selectCurrentIndex);

  // ========================================================================
  // LOCAL STATE & HOOKS
  // ========================================================================

  const [appError, setAppError] = React.useState(null);
  const toast = useToast();

  // ========================================================================
  // EFFECTS
  // ========================================================================

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

  // ========================================================================
  // TOAST NOTIFICATIONS
  // ========================================================================

  const showToast = useCallback(
    (status, title, description, IconComponent = null) => {
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
                {IconComponent ? (
                  <Box mr={3}>
                    <IconComponent size={20} />
                  </Box>
                ) : (
                  <AlertIcon />
                )}
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

  // Show browser info and feature compatibility toasts on load
  useEffect(() => {
    const browserInfo = getBrowserInfo();
    const features = checkFeatureSupport();

    // Browser info toast (blue)
    setTimeout(() => {
      showToast(
        'info',
        browserInfo.fullName,
        `Running on ${browserInfo.os} • ${browserInfo.isSupported ? 'Fully supported' : 'Limited support'}`,
        Globe
      );
    }, 500);

    // Feature compatibility toasts (green for supported, red for not supported)
    setTimeout(() => {
      Object.values(features).forEach((feature, index) => {
        setTimeout(() => {
          showToast(
            feature.status,
            feature.name,
            feature.supported ? 'Available and ready' : 'Not supported in this browser',
            feature.supported ? CheckCircle : XCircle
          );
        }, index * 300);
      });
    }, 1000);
  }, [showToast]);

  const resetFeedback = useCallback(
    () => dispatch(setFeedback({ message: "", type: "", highlightedPhrase: [] })),
    [dispatch]
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

      console.log(`[Game] Evaluation: ${evaluationResult.status.toUpperCase()} - Final confidence impact: ${evaluationResult.message}`);

      const newStatus =
        evaluationResult.status === "success"
          ? "correct"
          : evaluationResult.status === "partial"
            ? "partial"
            : "incorrect";

      dispatch(setFeedback({
        message: evaluationResult.message,
        type: newStatus,
        highlightedPhrase: evaluationResult.highlightedPhrase,
      }));

      dispatch(submitResult({
        ...currentActivity,
        transcript,
        status: newStatus,
        retries: retryCount,
        evaluation: evaluationResult,
      }));
    },
    [currentActivity, retryCount, dispatch]
  );

  const handleNextActivity = useCallback(() => {
    dispatch(nextActivity());
  }, [dispatch]);



  const handleNoSpeech = useCallback(() => {
    console.log(`[Game] No speech detected. Failure count: ${retryCount + 1}`);

    if (retryCount === 0) {
      // First failure: Just a warning toast and simple retry
      showToast(
        "warning",
        "Didn't catch that (R-1)",
        "Try speaking a bit louder or closer to the mic."
      );
      dispatch(incrementRetry());
      resetFeedback();
      // We STAY in "playing" state
    } else if (retryCount === 1) {
      // Second failure: Trigger re-calibration (BEST APPROACH criteria)
      showToast(
        "info",
        "Adjusting Mic... (C-4)",
        "Let's recalibrate to make sure I can hear you clearly."
      );
      dispatch(triggerRecalibration());
      dispatch(incrementRetry()); // Progress to final retry attempt
    } else {
      // Final failure: Move on
      showToast(
        "error",
        "Moving On (R-1)",
        "Still couldn't hear you. Let's try the next one."
      );
      dispatch(setFeedback({
        message: `No speech detected after ${MAX_RETRIES} attempts. Moving on.`,
        type: "warning",
      }));
      dispatch(submitResult({
        ...currentActivity,
        transcript: "",
        status: "skipped",
        retries: MAX_RETRIES,
      }));
      // Wait a moment so the user sees the feedback before skipping
      setTimeout(() => dispatch(nextActivity()), 1500);
    }
  }, [retryCount, currentActivity, showToast, resetFeedback, dispatch]);

  const handleRetry = useCallback(() => {
    console.log("[Game] Retrying current prompt...");
    dispatch(retryCurrent());
  }, [dispatch]);

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

  const startUnit = useCallback((mode = "mixed") => {
    dispatch(startGame(mode));
  }, [dispatch]);


  const handleMCQAnswer = (isCorrect) => {
    const status = isCorrect ? "correct" : "incorrect";
    dispatch(submitResult({
      ...currentActivity,
      status,
      transcript: isCorrect ? "Correct" : "Incorrect",
    }));
    setTimeout(() => {
      dispatch(nextActivity());
    }, 1000);
  };

  const handleCalibrationComplete = useCallback((newThreshold) => {
    dispatch(setCalibrationComplete(newThreshold));
  }, [dispatch]);

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
              nextPrompt={handleNextActivity}
              feedback={feedback}
              showNextButton={!!sessionResults[currentIndex]}
              showToast={showToast}
              dynamicThreshold={dynamicThreshold}
              onRetry={handleRetry}
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
      <AnimatePresence mode="wait" onExitComplete={() => console.log(`[App] Transitioned to: ${gameState}`)}>
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
    <Container
      w="100%"
      maxW={{ base: "100%", sm: "90%", md: "container.sm", lg: "container.md" }}
      minH={{ base: "auto", md: "400px" }}
      maxH="calc(100vh - 100px)"
      bg="card"
      borderRadius={{ base: "xl", md: "3xl" }}
      boxShadow="2xl"
      p={{ base: 3, md: 6, lg: 8 }}
      pb={{ base: 12, md: 8 }}
      border="1px"
      borderColor="border"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: '4px' },
      }}
    >
      <VStack spacing={{ base: 3, md: 5 }} w="100%">
        <Header score={score} total={total} progress={progress} />
        <Box as="main" w="100%" minH="380px" flex="1">
          {renderContent()}
        </Box>
      </VStack>
    </Container>
  );
}

export default GameUnit;
