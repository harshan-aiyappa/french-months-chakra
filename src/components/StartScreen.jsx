import React from 'react';
import { VStack, Heading, Text, Button, Icon, Box, SimpleGrid, Image, Badge } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const ModeCard = ({ mode, isSelected, onClick, delay }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    cursor="pointer"
    p={4}
    bg={isSelected ? 'brand.500' : 'card'}
    borderRadius="2xl"
    border="2px solid"
    borderColor={isSelected ? 'brand.500' : 'border'}
    boxShadow={isSelected ? '0 10px 30px -5px rgba(99, 102, 241, 0.4)' : 'sm'}
    transition="all 0.2s"
    _hover={{
      borderColor: isSelected ? 'brand.600' : 'brand.300',
      boxShadow: isSelected ? '0 15px 35px -5px rgba(99, 102, 241, 0.5)' : 'md',
    }}
    position="relative"
    overflow="hidden"
  >
    {isSelected && (
      <Badge
        position="absolute"
        top={2}
        right={2}
        colorScheme="green"
        fontSize="2xs"
        borderRadius="md"
      >
        Selected
      </Badge>
    )}
    <VStack spacing={2}>
      <Text fontSize="3xl" role="img" aria-label={mode.label}>
        {mode.icon}
      </Text>
      <Text
        fontSize="md"
        fontWeight="bold"
        color={isSelected ? 'white' : 'text'}
      >
        {mode.label}
      </Text>
      <Text
        fontSize="2xs"
        color={isSelected ? 'whiteAlpha.900' : 'textMuted'}
        textAlign="center"
      >
        {mode.description}
      </Text>
    </VStack>
  </MotionBox>
);

const StartScreen = ({ onBegin }) => {
  const [mode, setMode] = React.useState('mixed');

  const modes = [
    {
      id: 'mixed',
      label: 'Mix Mode',
      icon: '⚡',
      description: 'Speaking + Quiz challenges'
    },
    {
      id: 'speech',
      label: 'Speaking',
      icon: '🎤',
      description: 'Pronunciation practice only'
    },
    {
      id: 'mcq',
      label: 'Quiz',
      icon: '📝',
      description: 'Multiple choice only'
    },
  ];

  return (
    <VStack spacing={{ base: 5, md: 7 }} textAlign="center" py={{ base: 2, md: 4 }} px={{ base: 2, md: 4 }}>
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
        <Heading
          as="h1"
          size={{ base: "xl", md: "2xl" }}
          fontWeight="black"
          color="text"
          mb={2}
          bgGradient="linear(to-r, brand.500, brand.600)"
          bgClip="text"
        >
          French Months
        </Heading>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="textMuted"
          maxW="md"
          mx="auto"
          lineHeight="tall"
          fontWeight="medium"
        >
          Master pronunciation through interactive challenges
        </Text>
      </Box>

      <Box w="100%" maxW="lg">
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="textMuted"
          textTransform="uppercase"
          letterSpacing="wider"
          mb={3}
        >
          Choose Your Mode
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} w="100%">
          {modes.map((m, i) => (
            <ModeCard
              key={m.id}
              mode={m}
              isSelected={mode === m.id}
              onClick={() => setMode(m.id)}
              delay={0.6 + i * 0.1}
            />
          ))}
        </SimpleGrid>
      </Box>

      <VStack spacing={2} w="100%" maxW="xs">
        {[
          { text: "Smart mic calibration", icon: CheckCircleIcon },
          { text: "Real-time feedback", icon: CheckCircleIcon },
          { text: "Adaptive difficulty", icon: CheckCircleIcon },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
            style={{ width: '100%' }}
          >
            <Box
              bg="card"
              p={2.5}
              borderRadius="lg"
              border="1px solid"
              borderColor="border"
              w="100%"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Icon as={item.icon} color="success.500" boxSize={4} />
                <Text fontSize="sm" fontWeight="medium" color="text">{item.text}</Text>
              </Box>
            </Box>
          </motion.div>
        ))}
      </VStack>

      <Button
        size={{ base: "md", md: "lg" }}
        h={{ base: "50px", md: "60px" }}
        w="100%"
        maxW="280px"
        onClick={() => onBegin(mode)}
        as={motion.button}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -5px rgba(99, 102, 241, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        bg="brand.500"
        color="white"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="black"
        borderRadius="2xl"
        _hover={{ bg: 'brand.600' }}
        aria-label="Begin French Months Unit"
        boxShadow="lg"
      >
        Start Learning →
      </Button>
    </VStack>
  );
};

export default StartScreen;