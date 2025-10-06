import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Spinner } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import MicVisualizer from './MicVisualizer';
import Feedback from './Feedback';

const MotionBox = motion(Box);

const GameScreenComponent = ({ month, isListening, startListening, nextPrompt, feedback, showNextButton, showToast }) => {
  const [micError, setMicError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    setMicError(null);
  }, [month]);
  
  return (
    <VStack spacing={8} align="stretch">
      <AnimatePresence mode="wait">
        <MotionBox
          key={month.id}
          p={{ base: 6, md: 8 }}
          bg="white"
          borderRadius="2xl"
          border="1px"
          borderColor="slate.200"
          textAlign="center"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          boxShadow={isSpeaking ? 'glow-green' : 'lg'}
          transition="box-shadow 0.3s ease-in-out"
        >
          <Heading as="h2" size={{ base: 'xl', md: '2xl' }} color="brand.500" fontWeight="bold">
            {month.question}
          </Heading>
          <Text fontStyle="italic" color="slate.500" mt={2}>
            {month.pronunciation}
          </Text>
        </MotionBox>
      </AnimatePresence>

      <VStack spacing={4} align="center">
        <MicVisualizer 
          isListening={isListening} 
          setIsSpeaking={setIsSpeaking} 
          setMicError={setMicError} 
          showToast={showToast}
        />
        <Text my={2} color={micError ? 'red.500' : 'slate.500'} h="24px" fontWeight="medium" fontSize="sm">
          {micError || (isListening ? 'Listening...' : 'Mic ready - Click to speak')}
        </Text>
        
        {!showNextButton ? (
          <Button
            size="lg"
            h="60px"
            px={12}
            minW="240px"
            onClick={startListening}
            isDisabled={!!micError || isListening}
            as={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            bg="brand.500"
            color="white"
            boxShadow="lg"
            _hover={{ bg: 'brand.600', boxShadow: 'xl' }}
            _active={{ bg: 'brand.700', transform: 'scale(0.97)' }}
            _disabled={{ bg: 'slate.300', boxShadow: 'none', cursor: 'not-allowed' }}
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Spinner size="sm" />
                </motion.div>
              ) : (
                <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Start Speaking
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        ) : (
          <Button size="lg" onClick={nextPrompt} variant="ghost" colorScheme="brand">
            Next →
          </Button>
        )}
      </VStack>

      <Box h="70px" mt={2}>
        <Feedback message={feedback.message} type={feedback.type} />
      </Box>
    </VStack>
  );
};

const GameScreen = React.memo(GameScreenComponent);
export default GameScreen;