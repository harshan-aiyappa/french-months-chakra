import React from 'react';
import { VStack, Heading, Text, Button, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const StartScreen = ({ onBegin }) => {
  return (
    <VStack spacing={8} textAlign="center" py={8}>
      <Heading as="h2" size="xl" fontWeight="bold" color="slate.800">French Months</Heading>
      <Text fontSize="lg" color="slate.500" maxW="md">
        Test your pronunciation by speaking the English translation of each month.
      </Text>
      
      <List spacing={4} textAlign="left" maxW="sm" w="100%" px={4}>
        <ListItem color="slate.700"><ListIcon as={CheckCircleIcon} color="green.500" />See a French month.</ListItem>
        <ListItem color="slate.700"><ListIcon as={CheckCircleIcon} color="green.500" />Say the English translation.</ListItem>
        <ListItem color="slate.700"><ListIcon as={CheckCircleIcon} color="green.500" />Get instant feedback.</ListItem>
      </List>

      <Button
        size="lg"
        h="60px"
        px={12}
        onClick={onBegin}
        as={motion.button}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        bg="brand.500"
        color="white"
        boxShadow="lg"
        _hover={{ bg: 'brand.600', boxShadow: 'xl' }}
      >
        Begin Game
      </Button>
    </VStack>
  );
};

export default StartScreen;