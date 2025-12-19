import React from 'react';
import { VStack, Heading, Text, Button, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const StartScreen = ({ onBegin }) => {
  return (
    <VStack spacing={10} textAlign="center" py={12} px={6}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Box
          p={6}
          bg="brand.50"
          borderRadius="full"
          display="inline-block"
          boxShadow="inner"
        >
          <Image src="/assets/favicon1.png" boxSize="80px" />
        </Box>
      </motion.div>

      <Box>
        <Heading as="h2" size="2xl" fontWeight="black" color="slate.800" mb={3}>
          Ready to Practice?
        </Heading>
        <Text fontSize="lg" color="slate.500" maxW="md" mx="auto" lineHeight="tall">
          Master the French months through interactive speaking and logic activities.
        </Text>
      </Box>

      <VStack spacing={4} align="stretch" w="100%" maxW="xs">
        {[
          { text: "Mic Calibration included", icon: CheckCircleIcon },
          { text: "Speaking & MCQ prompts", icon: CheckCircleIcon },
          { text: "Adaptive learning system", icon: CheckCircleIcon },
        ].map((item, i) => (
          <HStack
            key={i}
            as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            bg="slate.50"
            p={3}
            borderRadius="xl"
            border="1px solid"
            borderColor="slate.100"
          >
            <ListIcon as={item.icon} color="accent.500" />
            <Text fontSize="sm" fontWeight="medium" color="slate.700">{item.text}</Text>
          </HStack>
        ))}
      </VStack>

      <Button
        size="lg"
        h="65px"
        w="100%"
        maxW="xs"
        onClick={onBegin}
        as={motion.button}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        bg="brand.500"
        color="white"
        fontSize="xl"
        fontWeight="bold"
        borderRadius="2xl"
        _hover={{ bg: 'brand.600' }}
      >
        Begin Unit
      </Button>
    </VStack>
  );
};

export default StartScreen;