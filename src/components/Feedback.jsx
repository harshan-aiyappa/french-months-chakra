import React from 'react';
import { Alert, AlertIcon, AlertDescription, Box, HStack, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);

const HighlightedWord = ({ word, color }) => {
  const colorMap = {
    green: 'green.500',
    orange: 'orange.500',
    red: 'red.500',
  };
  return (
    <Text as="span" fontWeight="bold" color={colorMap[color] || 'slate.800'}>
      {word}{' '}
    </Text>
  );
};

const Feedback = ({ message, type, highlightedPhrase }) => {
  const getStatus = (type) => {
    switch (type) {
      case 'correct': return 'success';
      case 'incorrect': return 'error';
      case 'partial': return 'warning';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <AnimatePresence>
      {message && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Alert
            status={getStatus(type)}
            borderRadius="xl"
            variant="subtle"
            flexDirection="column"
            alignItems="start"
            p={4}
          >
            <HStack>
              <AlertIcon />
              <AlertDescription fontWeight="semibold">{message}</AlertDescription>
            </HStack>
            
            {highlightedPhrase && highlightedPhrase.length > 0 && type !== 'correct' && (
              <Box mt={3} p={3} bg="blackAlpha.50" borderRadius="md" w="100%">
                <Text fontSize="sm" color="slate.600" mb={1}>
                  Your pronunciation analysis:
                </Text>
                <HStack wrap="wrap">
                  {highlightedPhrase.map((wordInfo, index) => (
                    <HighlightedWord key={index} word={wordInfo.word} color={wordInfo.color} />
                  ))}
                </HStack>
              </Box>
            )}
          </Alert>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default Feedback;