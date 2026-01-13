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
// Components
import Header from "./ui/Header";
import StartScreen from "./screens/StartScreen";
import AdvancedGameScreen from "./screens/AdvancedGameScreen";

// ... existing imports ...

// Inside component:

// Skip calibration for Advanced Mode
useEffect(() => {
  if (gameState === 'calibrating' && currentMode === 'advanced-practice') {
    console.log("[Game] Skipping Calibration for Advanced Mode");
    dispatch(setCalibrationComplete(50)); // Default threshold
  }
}, [gameState, currentMode, dispatch]);

const renderContent = () => {
  if (appError) {
    // ... (error alert logic)
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
