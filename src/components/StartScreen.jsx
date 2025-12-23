import React from 'react';
import { VStack, Heading, Text, Button, Icon, Box, HStack, Image } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const StartScreen = ({ onBegin }) => {
  return (
    <VStack spacing={{ base: 4, md: 6 }} textAlign="center" py={{ base: 2, md: 4 }} px={{ base: 2, md: 4 }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.8
        }}
      >
        <Box
          p={{ base: 3, md: 4 }}
          bg="brand.50"
          _dark={{ bg: 'whiteAlpha.200' }}
          borderRadius="full"
          display="inline-block"
          boxShadow="inner"
        >
          <Image src="/assets/favicon1.png" boxSize={{ base: "50px", md: "65px" }} />
        </Box>
      </motion.div>

      <Box>
        <Heading as="h2" size={{ base: "lg", md: "xl" }} fontWeight="black" color="text" mb={1}>
          Ready to Practice?
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color="textMuted" maxW="md" mx="auto" lineHeight="short">
          Master the French months through interactive speaking and logic activities.
        </Text>
      </Box>

      <VStack spacing={2} align="stretch" w="100%" maxW="xs">
        {[
          { text: "Mic Calibration included", icon: CheckCircleIcon },
          { text: "Speaking & MCQ prompts", icon: CheckCircleIcon },
          { text: "Adaptive learning system", icon: CheckCircleIcon },
        ].map((item, i) => (
          <HStack
            key={i}
            as={motion.div}
            initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              delay: 0.4 + i * 0.12,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            bg="card"
            p={{ base: 2, md: 2.5 }}
            borderRadius="xl"
            border="1px solid"
            borderColor="border"
          >
            <Icon as={item.icon} color="accent.500" boxSize={4} />
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="text">{item.text}</Text>
          </HStack>
        ))}
      </VStack>

      <Button
        size={{ base: "sm", md: "md" }}
        h={{ base: "45px", md: "55px" }}
        w="100%"
        maxW="240px"
        onClick={onBegin}
        as={motion.button}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        bg="brand.500"
        color="white"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        borderRadius="2xl"
        _hover={{ bg: 'brand.600' }}
        aria-label="Begin French Months Unit"
      >
        Begin Unit
      </Button>
    </VStack >
  );
};

export default StartScreen;