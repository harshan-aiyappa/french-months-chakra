import React from 'react';
import { Alert, AlertIcon, AlertDescription, Box } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);

const Feedback = ({ message, type }) => {
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
          <Alert status={getStatus(type)} borderRadius="xl" variant="subtle">
            <AlertIcon />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default Feedback;