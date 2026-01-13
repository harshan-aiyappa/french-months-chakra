import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Spinner, HStack, Icon } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaArrowRight } from 'react-icons/fa';
import MicVisualizer from '../ui/MicVisualizer';
import Feedback from '../ui/Feedback';

const GameScreenComponent = ({
  month, isListening, startListening, stopListening, nextPrompt, feedback, showNextButton, showToast,
  dynamicThreshold, onRetry
}) => {
  const [micError, setMicError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => { setMicError(null); }, [month]);

  return (
    <VStack spacing={{ base: 3, md: 6 }} align="stretch" py={{ base: 1, md: 2 }}>
      <motion.div
        key={month.question}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Box
          className={isSpeaking ? 'vad-speaking' : ''}
          p={{ base: 5, md: 8, lg: 10 }}
          bg="card"
          borderRadius="3xl"
          border="1px"
          borderColor="border"
          textAlign="center"
          boxShadow={isSpeaking ? 'none' : 'xl'}
          transition="all 0.3s ease-in-out"
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" top={0} left={0} right={0} h="4px" bg="brand.500" />
          <Heading as="h2" size={{ base: "xl", md: "2xl" }} color="text" fontWeight="black" letterSpacing="tight">
            {month.question}
          </Heading>
          <Text fontSize={{ base: "lg", md: "lg" }} fontWeight="semibold" color="brand.500" mt={2} letterSpacing="wide" textTransform="uppercase">
            {month.pronunciation}
          </Text>
        </Box>
      </motion.div>

      <VStack spacing={4} align="center">
        <MicVisualizer
          isListening={isListening}
          setIsSpeaking={setIsSpeaking}
          setMicError={setMicError}
          dynamicThreshold={dynamicThreshold}
          onSilence={isListening && stopListening ? stopListening : undefined}
        />
        <Text my={1} color={micError ? 'error.500' : 'textMuted'} h="18px" fontWeight="bold" fontSize={{ base: "2xs", md: "2xs" }} textTransform="uppercase" letterSpacing="widest">
          {micError || (isListening ? (isSpeaking ? 'Voice Detected...' : 'Listening...') : 'Ready to Capture')}
        </Text>

        {!showNextButton ? (
          <Button
            leftIcon={!isListening ? <Icon as={FaMicrophone} /> : null}
            size={{ base: "sm", md: "md" }}
            h={{ base: "45px", md: "55px" }}
            w="100%"
            maxW="240px"
            onClick={startListening}
            isDisabled={!!micError || isListening}
            as={motion.button}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            bg="brand.500"
            color="white"
            borderRadius="2xl"
            _hover={{ bg: 'brand.600' }}
            _active={{ bg: 'brand.700' }}
            fontSize="lg"
            fontWeight="black"
            boxShadow="lg"
            aria-label="Start speaking practice"
          >
            <AnimatePresence mode="wait">
              {isListening ? (<motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}> <Spinner size="sm" thickness="3px" mr={2} /> Listening... </motion.div>)
                : (<motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}> Start Practice </motion.span>)}
            </AnimatePresence>
          </Button>
        ) : (
          <HStack spacing={4} w="100%" justify="center">
            <Button
              leftIcon={<Icon as={FaMicrophone} />}
              size={{ base: "sm", md: "md" }}
              h={{ base: "42px", md: "50px" }}
              w="100%"
              maxW="140px"
              onClick={onRetry}
              variant="outline"
              colorScheme="brand"
              borderRadius="xl"
              fontWeight="bold"
              fontSize="lg"
              aria-label="Retry pronunciation"
            >
              Retry
            </Button>
            <Button
              rightIcon={<Icon as={FaArrowRight} />}
              size={{ base: "sm", md: "md" }}
              h={{ base: "42px", md: "50px" }}
              w="100%"
              maxW="140px"
              onClick={nextPrompt}
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              borderRadius="xl"
              fontWeight="bold"
              fontSize="lg"
              aria-label="Continue to next task"
            >
              Continue
            </Button>
          </HStack>
        )}
      </VStack>

      <Box minH={{ base: '70px', md: '60px' }} mt={1}>
        <Feedback
          message={feedback.message}
          type={feedback.type}
          highlightedPhrase={feedback.highlightedPhrase}
        />
      </Box>
    </VStack>
  );
};

const GameScreen = React.memo(GameScreenComponent);
export default GameScreen;