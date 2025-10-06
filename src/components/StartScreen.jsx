import React from 'react';
import { VStack, Heading, Text, Button, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const StartScreen = ({ onBegin }) => {
  return (
    <VStack spacing={8} textAlign="center" py={8}>
      <Heading as="h2" size="xl" fontWeight="bold" color="slate.800">Practice Unit</Heading>
      <Text fontSize="lg" color="slate.500" maxW="md">
        This unit contains a mix of speaking and multiple-choice questions.
      </Text>
      <List spacing={4} textAlign="left" maxW="sm" w="100%" px={4}>
        <ListItem color="slate.700"><ListIcon as={CheckCircleIcon} color="green.500" />Your mic will be calibrated once.</ListItem>
        <ListItem color="slate.700"><ListIcon as={CheckCircleIcon} color="green.500" />Answer speaking and MCQ prompts.</ListItem>
        <ListItem color="slate.700"><ListIcon as={CheckCircleIcon} color="green.500" />The system will adapt if needed.</ListItem>
      </List>
      <Button
        size="lg" h="60px" px={12} onClick={onBegin} as={motion.button}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        bg="brand.500" color="white" boxShadow="lg"
        _hover={{ bg: 'brand.600', boxShadow: 'xl' }}
      >
        Begin Unit
      </Button>
    </VStack>
  );
};

export default StartScreen;