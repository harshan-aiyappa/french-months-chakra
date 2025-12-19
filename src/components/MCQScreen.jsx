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
      return { variant: 'outline', colorScheme: 'brand', borderColor: 'slate.200' };
    }
    if (option === activity.answer) {
      return { variant: 'solid', bg: 'success.500', color: 'white', _hover: { bg: 'success.600' } };
    }
    if (option === selected && option !== activity.answer) {
      return { variant: 'solid', bg: 'error.500', color: 'white', _hover: { bg: 'error.600' } };
    }
    return { variant: 'outline', opacity: 0.4, borderColor: 'slate.100' };
  };

  return (
    <VStack spacing={10} align="stretch" py={4}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Box
          p={{ base: 8, md: 10 }}
          bg="white"
          borderRadius="3xl"
          border="1px"
          borderColor="slate.100"
          textAlign="center"
          boxSize="border-box"
        >
          <Text fontSize="sm" color="brand.500" fontWeight="bold" mb={2} textTransform="uppercase" letterSpacing="widest">
            Multiple Choice
          </Text>
          <Heading as="h2" size="xl" color="slate.800" lineHeight="base">
            {activity.question}
          </Heading>
        </Box>
      </motion.div>

      <VStack spacing={4}>
        {activity.options.map((option, i) => (
          <Button
            key={option}
            size="lg"
            h="64px"
            w="100%"
            onClick={() => handleSelect(option)}
            isDisabled={isAnswered}
            {...getButtonProps(option)}
            as={motion.button}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={!isAnswered ? { scale: 1.02, x: 5 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
            borderRadius="2xl"
            fontSize="lg"
            boxShadow={!isAnswered ? "sm" : "none"}
          >
            {option}
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};

export default MCQScreen;