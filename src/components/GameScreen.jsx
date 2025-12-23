import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Spinner, HStack, Icon, Flex } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaArrowRight, FaUndo } from 'react-icons/fa';
import { Mic } from 'lucide-react';
import MicVisualizer from './MicVisualizer';
import Feedback from './Feedback';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const GameScreenComponent = ({
  month, isListening, startListening, stopListening, nextPrompt, feedback, showNextButton, showToast,
  dynamicThreshold, onRetry
}) => {
  const [micError, setMicError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => { setMicError(null); }, [month]);

  return (
    <VStack spacing={{ base: 6, md: 8 }} align="stretch" py={{ base: 2, md: 4 }} w="100%">

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={month.question}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Box
            p={{ base: 8, md: 12 }}
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(20px)"
            borderRadius="3xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.2)"
            textAlign="center"
            boxShadow="glass"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative glow behind text */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="150px"
              h="150px"
              bg="brand.500"
              filter="blur(80px)"
              opacity={0.15}
              zIndex={-1}
            />

            <Text
              fontSize="sm"
              color="brand.200"
              textTransform="uppercase"
              letterSpacing="wider"
              fontWeight="bold"
              mb={2}
            >
              Translate this Month
            </Text>

            <Heading
              as="h2"
              size={{ base: "3xl", md: "4xl" }}
              color="white"
              fontWeight="black"
              letterSpacing="tight"
              textShadow="0 10px 30px rgba(0,0,0,0.2)"
            >
              {month.question}
            </Heading>

            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="medium"
              color="brand.300"
              mt={4}
              opacity={0.9}
            >
              /{month.pronunciation}/
            </Text>
          </Box>
        </MotionBox>
      </AnimatePresence>

      {/* Controls & Visualizer */}
      <VStack spacing={6} align="center" w="100%">
        <Box h="60px" w="100%" display="flex" alignItems="center" justifyContent="center">
          <MicVisualizer
            isListening={isListening}
            setIsSpeaking={setIsSpeaking}
            setMicError={setMicError}
            dynamicThreshold={dynamicThreshold}
            onSilence={isListening && stopListening ? stopListening : undefined}
          />
        </Box>

        <Box minH="24px">
          <AnimatePresence mode="wait">
            {micError ? (
              <MotionBox key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Text color="error.400" fontWeight="bold" fontSize="sm">{micError}</Text>
              </MotionBox>
            ) : (
              <MotionBox key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Text
                  color={isListening ? (isSpeaking ? 'brand.300' : 'brand.400') : 'slate.400'}
                  fontSize="sm"
                  fontWeight="semibold"
                  letterSpacing="wide"
                >
                  {isListening ? (isSpeaking ? 'Listening...' : 'Waiting for speech...') : 'Tap mic to start'}
                </Text>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        {!showNextButton ? (
          <MotionButton
            size="lg"
            h={{ base: "80px", md: "90px" }}
            w={{ base: "80px", md: "90px" }}
            borderRadius="full"
            onClick={startListening}
            isDisabled={!!micError || isListening}
            bg={isListening ? 'error.500' : 'brand.500'}
            color="white"
            _hover={{
              transform: 'scale(1.1)',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)'
            }}
            _active={{ transform: 'scale(0.95)' }}
            boxShadow="glow"
            whileTap={{ scale: 0.9 }}
            animate={isListening ? {
              boxShadow: [
                "0 0 0 0px rgba(239, 68, 68, 0.4)",
                "0 0 0 20px rgba(239, 68, 68, 0)",
              ],
            } : {}}
            transition={{
              boxShadow: { duration: 1.5, repeat: Infinity }
            }}
          >
            {isListening ? (
              <Spinner size="lg" color="white" thickness="3px" />
            ) : (
              <Mic size={32} />
            )}
          </MotionButton>
        ) : (
          <HStack spacing={4} w="100%" justify="center">
            <Button
              leftIcon={<FaUndo />}
              size="lg"
              h="60px"
              flex={1}
              onClick={onRetry}
              variant="outline"
              colorScheme="whiteAlpha"
              color="white"
              borderRadius="2xl"
              borderWidth="2px"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Retry
            </Button>
            <Button
              rightIcon={<FaArrowRight />}
              size="lg"
              h="60px"
              flex={1}
              onClick={nextPrompt}
              colorScheme="brand"
              borderRadius="2xl"
              boxShadow="glow"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>

      <Feedback
        message={feedback.message}
        type={feedback.type}
        highlightedPhrase={feedback.highlightedPhrase}
      />
    </VStack>
  );
};

const GameScreen = React.memo(GameScreenComponent);
export default GameScreen;