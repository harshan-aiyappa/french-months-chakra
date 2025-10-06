import React, { useState } from 'react';
// THE FIX IS HERE: Add 'Box' to the import list from Chakra UI.
import { VStack, Heading, Text, Button, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MCQScreen = ({ activity, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const isAnswered = selected !== null;
  
  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelected(option);
    const isCorrect = option === activity.answer;
    onAnswer(isCorrect);
  };

  const getButtonProps = (option) => {
    if (!isAnswered) {
      return { variant: 'outline', colorScheme: 'slate' };
    }
    if (option === activity.answer) {
      return { variant: 'solid', colorScheme: 'green' };
    }
    if (option === selected && option !== activity.answer) {
      return { variant: 'solid', colorScheme: 'red' };
    }
    return { variant: 'outline', colorScheme: 'gray', _disabled: { opacity: 0.5 } };
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box
        p={{ base: 6, md: 8 }}
        bg="white"
        borderRadius="2xl"
        border="1px"
        borderColor="slate.200"
        textAlign="center"
        boxShadow="lg"
      >
        <Heading as="h2" size="lg" color="slate.800">
          {activity.question}
        </Heading>
      </Box>
      
      <VStack spacing={4}>
        {activity.options.map((option) => (
          <Button
            key={option}
            size="lg"
            h="56px"
            w="100%"
            onClick={() => handleSelect(option)}
            isDisabled={isAnswered}
            {...getButtonProps(option)}
            as={motion.button}
            whileHover={!isAnswered ? { scale: 1.03 } : {}}
            whileTap={!isAnswered ? { scale: 0.97 } : {}}
          >
            {option}
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};

export default MCQScreen;