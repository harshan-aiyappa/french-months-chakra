import React, { useEffect, useState } from 'react';
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
  Progress,
  CircularProgress,
  CircularProgressLabel
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
  startListening,
  stopListening,
  nextPrompt,
  feedback,
  showNextButton,
  dynamicThreshold,
  onRetry
}) => {
  // Determine the word to display
  const wordKey = month.question || month.word || "Janvier"; // Fallback
  const ipa = month.ipa || "/ʒɑ̃.vje/"; // Fallback/Placeholder

  const [shouldShowRetry, setShouldShowRetry] = useState(false);

  // Theme colors
  const cardBg = useColorModeValue('white', 'whiteAlpha.50');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const ipaColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Flex direction="column" align="center" justify="center" w="full" maxW="1200px" mx="auto" minH="70vh" pos="relative">
      {/* Ambient Background Glows (if dark mode mostly) */}
      <Box position="absolute" top="-10%" left="-10%" w="50%" h="50%" bg="brand.500" opacity="0.1" filter="blur(120px)" borderRadius="full" pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-10%" w="40%" h="40%" bg="cyan.400" opacity="0.1" filter="blur(120px)" borderRadius="full" pointerEvents="none" />

      {/* Progress Bar Section (Mock for now, can be passed via props) */}
      <Box w="full" maxW="640px" mb={8}>
        <Flex justify="space-between" align="flex-end" mb={2}>
          <Text color="gray.400" fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider">
            Pronunciation Task
          </Text>
          <Text color="white" fontSize="xs" fontWeight="bold">
            Step {month.index !== undefined ? month.index + 1 : 1}
          </Text>
        </Flex>
        <Box h="1.5" w="full" bg="whiteAlpha.100" borderRadius="full" overflow="hidden">
          <Box h="full" bg="brand.500" borderRadius="full" w="65%" />
        </Box>
      </Box>

      {/* Central Glass Card */}
      <Box
        className="glass-card"
        w="full"
        maxW="640px"
        borderRadius="3xl"
        p={{ base: 8, md: 12 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        boxShadow="xl"
        position="relative"
        overflow="hidden"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
      >
        {/* Subtle Gradient Overlay */}
        <Box position="absolute" inset="0" bgGradient="linear(to-b, brand.500, transparent)" opacity="0.05" pointerEvents="none" />

        <Text color="brand.500" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="0.2em" mb={4}>
          Pronounce this word
        </Text>

        <Heading as="h1" color={headingColor} fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }} fontWeight="bold" letterSpacing="tight" mb={4}>
          {wordKey}
        </Heading>

        <Text color={ipaColor} fontSize={{ base: "xl", md: "2xl" }} fontWeight="medium" mb={8} fontFamily="serif" fontStyle="italic">
          {ipa}
        </Text>

        <Flex gap={4}>
          <Button
            variant="unstyled"
            display="flex"
            alignItems="center"
            gap={2}
            px={6}
            py={3}
            className="glass"
            _hover={{ bg: 'whiteAlpha.100' }}
            borderRadius="xl"
            transition="all 0.2s"
            onClick={() => {
              // Play audio logic here if available
              console.log("Play audio");
            }}
          >
            <MaterialSymbol icon="volume_up" color="#6366F1" />
            <Text fontSize="sm" fontWeight="bold">Listen to Native</Text>
          </Button>
        </Flex>

        {/* Feedback Panel */}
        <AnimatePresence>
          {feedback?.type && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ width: '100%', marginTop: '2.5rem' }}
            >
              <Flex
                direction="column"
                align="center"
                justify="space-between"
                gap={4}
                borderRadius="2xl"
                bg="whiteAlpha.50"
                p={4}
                border="1px solid"
                borderColor={feedback.type === 'correct' ? 'green.500' : 'red.400'}
              >
                <Flex direction="column" gap={1}>
                  <Text color={feedback.type === 'correct' ? 'green.400' : 'red.400'} fontSize="sm" fontWeight="bold" textTransform="uppercase" tracking="wider">
                    {feedback.type === 'correct' ? 'Excellent!' : 'Try Again'}
                  </Text>
                  <Text color="white" fontSize="md">
                    {feedback.message}
                  </Text>
                </Flex>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Waveform Visualizer */}
      <Flex w="full" maxW="400px" h="24" mt={12} align="center" justify="center" gap={1.5}>
        {[4, 8, 12, 16, 20, 24, 16, 20, 14, 10, 6, 3].map((h, i) => (
          <Box
            key={i}
            w="1.5"
            h={`${h * (isListening ? 1.5 : 1)}px`}
            bg={isListening ? (i % 2 === 0 ? "brand.400" : "cyan.400") : "whiteAlpha.200"}
            borderRadius="full"
            transition="height 0.1s ease-in-out"
            animation={isListening ? `pulse 0.5s infinite ${i * 0.1}s alternate` : 'none'}
          />
        ))}
      </Flex>

      {/* Footer Control Area */}
      <Flex p={10} direction="column" align="center" w="full">
        <Box position="relative" role="group">
          {isListening && (
            <Box position="absolute" inset="0" bg="brand.500" borderRadius="full" filter="blur(20px)" opacity="0.4" animation="pulse 1.5s infinite" />
          )}
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            w="24"
            h="24"
            borderRadius="full"
            bgGradient="linear(to-tr, brand.500, cyan.400)"
            _hover={{ transform: 'scale(1.05)' }}
            _active={{ transform: 'scale(0.95)' }}
            boxShadow="0 0 40px rgba(89, 76, 230, 0.4)"
            className="mic-glow"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <MaterialSymbol icon={isListening ? "mic_off" : "mic"} fontSize="40px" color="white" />
          </Button>
        </Box>

        <Text mt={6} color="cyan.400" fontWeight="bold" letterSpacing="widest" fontSize="xs" textTransform="uppercase" visibility={isListening ? "visible" : "hidden"} className="animate-pulse">
          Listening...
        </Text>

        <HStack mt={12} spacing={8}>
          {/* Previous Button (Optional/Mock) */}
          {/* Next Button */}
          {showNextButton && (
            <Button
              bg="brand.500"
              _hover={{ bg: 'brand.400' }}
              color="white"
              px={8}
              py={6}
              borderRadius="xl"
              fontWeight="bold"
              rightIcon={<MaterialSymbol icon="arrow_forward" fontSize="lg" />}
              onClick={nextPrompt}
            >
              Next Task
            </Button>
          )}
        </HStack>
      </Flex>
    </Flex>
  );
};

export default GameScreen;