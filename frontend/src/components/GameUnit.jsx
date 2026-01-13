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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import Header from "./ui/Header";
import StartScreen from "./screens/StartScreen";
import GameScreen from "./screens/GameScreen";
import ResultsScreen from "./screens/ResultsScreen";
import AdvancedGameScreen from "./screens/AdvancedGameScreen";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useLiveKit from "../hooks/useLiveKit";
import useUnifiedASR from "../hooks/useUnifiedASR";
import { fetchLiveKitToken } from "../utils/tokenService";
import { UNIT_DATA } from "../constants";
import MCQScreen from "./screens/MCQScreen";
import evaluatePronunciation from "../utils/pronunciationEvaluator";
import CalibrationScreen from "./screens/CalibrationScreen";
import { ERROR_MAP } from "../constants/errors";
import { ASR_ENGINE_TYPES, detectBestASRMode } from "../utils/asrService";

// Utils
import { getBrowserInfo, checkFeatureSupport } from "../utils/browserDetection";
// Redux Store
import {
  selectGameStatus,
  selectGameMode,
  selectCurrentActivity,
  selectHistory,
  selectRetryCount,
  selectFeedback,
  selectDynamicThreshold,
  selectScore,
  selectProgress,
  selectTotal,
  selectCurrentIndex,
  selectAsrMode,
  startGame,
  setCalibrationComplete,
  submitResult,
  setFeedback,
  nextActivity,
  retryCurrent,
  incrementRetry,
  triggerRecalibration,
  resetGame,
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
  const location = useLocation();
  const navigate = useNavigate();
  const { modeId } = useParams();

  // Prioritize URL param, fallback to state, then default
  const passedMode = modeId || location.state?.mode || 'mixed';
  const passedAsrMode = location.state?.asrMode || 'native';

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
  const asrMode = useSelector(selectAsrMode);
  const currentMode = useSelector(selectGameMode);

  // ========================================================================
  // LOCAL STATE & HOOKS
  // ========================================================================

  const [appError, setAppError] = React.useState(null);
  const toast = useToast();

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Skip calibration for Advanced Mode
  useEffect(() => {
    if (gameState === 'calibrating' && currentMode === 'advanced-practice') {
      console.log("[Game] Skipping Calibration for Advanced Mode");
      dispatch(setCalibrationComplete(50)); // Default threshold
    }
  }, [gameState, currentMode, dispatch]);

  // State to hold the actually determined ASR mode (esp. for 'auto' mode)
  const [determinedAsrMode, setDeterminedAsrMode] = React.useState(null);

  // Reset game state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetGame());
    };
  }, [dispatch]);

  // Auto-start game or switch modes when parameters change
  useEffect(() => {
    const initASR = async () => {
      if (asrMode === 'auto') {
        const bestMode = await detectBestASRMode();
        setDeterminedAsrMode(bestMode || 'native');
      } else {
        setDeterminedAsrMode(asrMode);
      }
    };

    initASR();

    // Start or Restart if mode changes
    if (gameState === "start" || currentMode !== passedMode) {
      console.log(`[GameUnit] Initializing Game: ${passedMode} (Previous: ${currentMode})`);
      dispatch(startGame({ mode: passedMode, asrMode: passedAsrMode }));
    }
  }, [gameState, dispatch, passedMode, passedAsrMode, asrMode, currentMode]);

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
    console.log("[Game] Moving to next activity...");
    resetFeedback(); // Ensure feedback is cleared for the next card
    dispatch(nextActivity());
  }, [dispatch, resetFeedback]);


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
    } else if (retryCount === 1) {
      // Second failure: Trigger re-calibration (BEST APPROACH criteria)
      showToast(
        "info",
        "Adjusting Mic... (C-4)",
        "Let's recalibrate to make sure I can hear you clearly."
      );
      dispatch(triggerRecalibration());
      dispatch(incrementRetry());
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
    startListening: startUnifiedListening,
    stopListening: stopUnifiedListening,
    isConnecting,
    activeEngine,
    liveKitRoom
  } = useUnifiedASR({
    selectedMode: asrMode,
    onResult: (transcript) => {
      stopUnifiedListening();
      showToast("success", "Speech Captured! (A-1)", `Captured: "${transcript}"`);
      handleSpeechResult(transcript);
    },
    onNoSpeech: () => {
      stopUnifiedListening();
      handleNoSpeech();
    },
    onError: (error) => {
      stopUnifiedListening();
      const err = ERROR_MAP[error] || {
        id: "E-X",
        title: "Unknown Error",
        desc: error || "An unexpected error occurred.",
      };
      showToast("error", `${err.title} (${err.id})`, err.desc);
    },
    onStart: () => {
      // Suppress default "Listening" toast here if handled by onStatusChange for granularity
      // But we keep it as a fallback
    },
    onStatusChange: (status, message) => {
      // Map Status to Toast
      switch (status) {
        case 'connecting':
          showToast('info', 'Connecting...', message);
          break;
        case 'room-created':
          showToast('info', 'Room Ready', message);
          break;
        case 'connected':
          showToast('success', 'System Online', message, Globe);
          break;
        case 'whisper-partial':
          // Optional: Show subtle processing indicator
          // showToast('info', 'Whisper Active', message);
          break;
        case 'whisper-final':
          showToast('success', 'Transcription', message);
          break;
        case 'disconnected':
          showToast('warning', 'Link Terminated', message);
          break;
        case 'listening':
          showToast('info', 'Listening...', message);
          break;
        case 'error':
          // Errors handled by onError usually
          break;
        default:
          break;
      }
    }
  });

  // Mocked credentials for simulation for now
  // Real backend connection for Hybrid ASR
  const startListening = useCallback(async () => {
    try {
      // Only fetch token if in Hybrid/Auto mode
      let options = {};
      const liveKitUrl = "wss://kimo-zg71lj4i.livekit.cloud";

      if (determinedAsrMode === 'hybrid' || asrMode === 'hybrid' || asrMode === 'auto') {
        const participantIdentity = `user-${Math.floor(Math.random() * 10000)}`;
        const roomName = "vocalis-practice-room";
        const token = await fetchLiveKitToken(roomName, participantIdentity);
        options = { url: liveKitUrl, token };
      }

      startUnifiedListening(options);
    } catch (err) {
      console.error("Failed to start listening:", err);
      showToast("error", "Connection Failed", "Could not connect to ASR server. Falling back to native if possible.");
    }
  }, [startUnifiedListening, determinedAsrMode, asrMode, showToast]);

  const stopListening = stopUnifiedListening;

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
    console.log("[Game] MCQ Answer received:", isCorrect);
    const status = isCorrect ? "correct" : "incorrect";
    dispatch(submitResult({
      ...currentActivity,
      status,
      transcript: isCorrect ? "Correct" : "Incorrect",
    }));
    // Instant transition on 'Continue' click
    dispatch(nextActivity());
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
        if (currentMode === 'advanced-practice') {
          content = (
            <AdvancedGameScreen
              month={currentActivity}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              feedback={feedback}
              activeEngine={activeEngine}
              onExit={handleExit}
              currentIndex={currentIndex}
              total={total}
              showToast={showToast}
              liveKitRoom={liveKitRoom}
            />
          );
        } else if (currentActivity.type === "MCQ") {
          content = (
            <MCQScreen
              activity={currentActivity}
              onAnswer={handleMCQAnswer}
              onExit={handleExit}
              currentIndex={currentIndex}
              total={total}
            />
          );
        } else {
          content = (
            <GameScreen
              month={currentActivity}
              isListening={isListening}
              isConnecting={isConnecting}
              activeEngine={activeEngine}
              startListening={startListening}
              stopListening={stopListening}
              nextPrompt={handleNextActivity}
              feedback={feedback}
              showNextButton={!!sessionResults[currentIndex]}
              showToast={showToast}
              dynamicThreshold={dynamicThreshold}
              onRetry={handleRetry}
              onExit={handleExit}
              currentIndex={currentIndex}
              total={total}
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

  // Cleanup on unmount (e.g. browser back button, route change)
  useEffect(() => {
    return () => {
      console.log("[Game] ASR Cleanup Triggered (Unmount/Stop).");
      if (stopListening) stopListening();
    };
  }, [stopListening]);

  const handleExit = () => {
    console.log("[Game] User requested exit. Stopping ASR/Recording.");
    if (stopListening) stopListening();

    showToast("info", "Microphone Off", "Recording stopped safely.");
    navigate('/dashboard');
  };

  return (
    <VStack spacing={{ base: 3, md: 5 }} w="100%" h="full">
      <Box as="main" w="100%" flex="1" minH="500px">
        {renderContent()}
      </Box>
    </VStack>
  );
}

export default GameUnit;
