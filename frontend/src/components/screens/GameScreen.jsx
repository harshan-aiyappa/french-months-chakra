import React, { useEffect, useState } from 'react';
import VoiceVisualizer from '../ui/VoiceVisualizer';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

// Material Symbol Helper
const MaterialSymbol = ({ icon, className, fontSize = "24px", ...props }) => (
  <Box as="span" className={`material-symbols-outlined ${className || ''}`} fontSize={fontSize} {...props}>
    {icon}
  </Box>
);

const WaveformBar = ({ height, delay, isActive }) => (
  <Box
    w="1.5"
    h={height}
    bg={isActive ? "vocalis.cyan" : "whiteAlpha.300"}
    borderRadius="full"
    animation={isActive ? `pulse-height 0.5s ease-in-out infinite alternate ${delay}s` : undefined}
    transition="all 0.2s"
    className="waveform-bar"
  />
);

const GameScreen = ({
  month, // Current activity/word data
  isListening,
  isConnecting,
  activeEngine,
  startListening,
  stopListening,
  nextPrompt,
  feedback,
  showNextButton,
  showToast,
  dynamicThreshold,
  onRetry,
  onExit,       // New
  currentIndex, // New
  total,        // New
}) => {
  // Determine the word to display
  const wordKey = month.question || month.word || "Janvier"; // Fallback
  const ipa = month.ipa || "/ʒɑ̃.vje/"; // Fallback/Placeholder

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.900', 'white'); // Original headingColor
  const textColor = useColorModeValue('gray.600', 'gray.400'); // Original textColor
  const ipaColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100'); // Original borderColor
  const engineBadgeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const buttonBg = useColorModeValue('brand.50', 'whiteAlpha.200');
  const buttonHoverBg = useColorModeValue('brand.100', 'whiteAlpha.300');
  const feedbackBgSuccess = useColorModeValue('green.50', 'whiteAlpha.100');
  const feedbackBgError = useColorModeValue('red.50', 'whiteAlpha.100');
  const feedbackTextMain = useColorModeValue('gray.700', 'white');
  // Hook definitions for UI colors

  return (
    <Flex direction="column" align="center" justify="center" w="full" maxW="1200px" mx="auto" minH={{ base: "auto", lg: "70vh" }} py={{ base: 8, lg: 0 }} pos="relative">




      {/* Central Card */}
      <Box
        w="full"
        maxW="600px" // Changed from 640px
        borderRadius="3xl"
        p={{ base: 6, md: 8 }} // Changed from 10
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        boxShadow="2xl"
        position="relative"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
      >

        {/* Intregrated Header: Exit & Progress */}
        <Flex w="full" justify="space-between" align="center" mb={6}>
          <IconButton
            icon={<MaterialSymbol icon="close" fontSize="24px" />}
            onClick={onExit}
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'red.500', bg: 'red.50' }}
            rounded="full"
            aria-label="Exit Practice"
          />

          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.400"
            letterSpacing="wide"
          >
            {currentIndex + 1} / {total}
          </Text>
        </Flex>

        <Text color="brand.500" fontWeight="bold" fontSize="xs" textTransform="uppercase" letterSpacing="widest" mb={2}>
          Pronounce this word
        </Text>

        <Heading as="h1" color={headingColor} fontSize={{ base: "5xl", md: "7xl" }} fontWeight="800" letterSpacing="-0.02em" lineHeight="1" mb={2}>
          {wordKey}
        </Heading>

        <Text color={ipaColor} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="medium" mb={10} fontFamily="serif" fontStyle="italic" opacity="0.8">
          {ipa}
        </Text>

        <VStack spacing={6}>
          <Button
            size="lg"
            rounded="full"
            bg={buttonBg}
            color="brand.600"
            fontWeight="bold"
            fontSize="md"
            px={8}
            h="14"
            leftIcon={<MaterialSymbol icon="volume_up" fontSize="24px" />}
            _hover={{
              bg: buttonHoverBg,
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            _active={{
              transform: 'translateY(0)',
              bg: buttonBg
            }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            boxShadow="md"
            onClick={() => {
              if (!wordKey) return;
              const u = new SpeechSynthesisUtterance(wordKey);
              u.lang = "fr-FR";
              window.speechSynthesis.speak(u);
            }}
          >
            Listen to Native
          </Button>

          {/* ASR Engine Indicator */}
          {activeEngine && (
            <HStack
              spacing={2}
              p={2}
              px={4}
              mt={4}
              borderRadius="full"
              bg={engineBadgeBg}
              border="1px solid"
              borderColor="brand.200"
              boxShadow="sm"
            >
              <MaterialSymbol icon={activeEngine === 'hybrid' ? 'high_quality' : 'mic'} fontSize="16px" color="brand.500" />
              <Text fontSize="xs" fontWeight="bold" color="brand.600" textTransform="uppercase" letterSpacing="wider">
                {activeEngine === 'hybrid' ? 'Hybrid ASR (Whisper)' : 'Native ASR (Browser)'}
              </Text>
            </HStack>
          )}
        </VStack>

        {/* Feedback Panel */}

        <AnimatePresence>
          {feedback?.type && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{ width: '100%', marginTop: '2rem' }}
            >
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap={3}
                borderRadius="2xl"
                bg={feedback.type === 'correct' ? feedbackBgSuccess : feedbackBgError}
                p={5}
                border="1px solid"
                borderColor={feedback.type === 'correct' ? 'green.200' : 'red.200'}
                boxShadow="sm"
              >
                <HStack spacing={2}>
                  <MaterialSymbol
                    icon={feedback.type === 'correct' ? 'check_circle' : 'error'}
                    fontSize="20px"
                    color={feedback.type === 'correct' ? 'green.500' : 'red.500'}
                    fill={1}
                  />
                  <Text
                    color={feedback.type === 'correct' ? 'green.600' : 'red.600'}
                    fontSize="xs"
                    fontWeight="800"
                    textTransform="uppercase"
                    letterSpacing="widest"
                  >
                    {feedback.type === 'correct' ? 'Excellent' : 'Try Again'}
                  </Text>
                </HStack>

                <Text
                  color={feedbackTextMain}
                  fontSize="md"
                  textAlign="center"
                  lineHeight="1.5"
                  fontWeight="medium"
                >
                  {feedback.message}
                </Text>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer / Controls Section */}
        <Box w="full" mt={10} pt={6} borderTop="1px solid" borderColor="gray.100">

          <Box w="full" h="1px" bg={useColorModeValue('gray.100', 'whiteAlpha.100')} my={6} />

          {/* Voice Activity Visualizer (VAD) */}
          <Flex w="full" h="16" align="center" justify="center" mb={6}>
            <VoiceVisualizer isListening={isListening} />
          </Flex>

          {/* Action Row */}
          <Flex w="full" align="center" justify="center" position="relative" mt={8}>

            <VStack spacing={2} display="flex" flexDirection="column" alignItems="center">
              <Box position="relative" role="group">
                {isListening && (
                  <Box position="absolute" inset="0" bg="brand.500" borderRadius="full" filter="blur(20px)" opacity="0.4" animation="pulse 1.5s infinite" />
                )}
                <Button
                  onClick={isListening ? stopListening : startListening}
                  size="lg"
                  w="20"
                  h="20"
                  borderRadius="full"
                  bgGradient="linear(to-tr, brand.500, brand.600)"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
                  _active={{ transform: 'scale(0.95)' }}
                  boxShadow="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MaterialSymbol icon={isListening ? "mic_off" : "mic"} fontSize="32px" color="white" />
                </Button>
              </Box>
              <Text color={isListening ? "brand.500" : "gray.400"} fontWeight="bold" letterSpacing="widest" fontSize="10px" textTransform="uppercase" visibility={isListening || isConnecting ? "visible" : "hidden"} className="animate-pulse">
                {isConnecting ? "Connecting..." : "Listening..."}
              </Text>
            </VStack>

            {/* Next Button (Absolute Right) */}
            <AnimatePresence>
              {showNextButton && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ position: 'absolute', right: 0 }}
                >
                  <Button
                    bg="gray.900"
                    _hover={{ bg: 'black', transform: 'translateY(-2px)' }}
                    color="white"
                    size="md"
                    px={6}
                    borderRadius="xl"
                    fontWeight="bold"
                    fontSize="sm"
                    boxShadow="md"
                    rightIcon={<MaterialSymbol icon="arrow_forward" fontSize="18px" />}
                    onClick={nextPrompt}
                  >
                    Next
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Flex>
        </Box>
      </Box >
    </Flex >
  );
};

export default GameScreen;