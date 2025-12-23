import React from 'react';
import { VStack, Heading, Text, Button, Icon, Box, SimpleGrid, Image, Flex } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Zap, Mic, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setMode as setReduxMode } from '../store/gameSlice';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const ModeCard = ({ mode, isSelected, onClick }) => (
  <MotionBox
    variants={itemVariants}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    cursor="pointer"
    p={5}
    bg={isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
    backdropFilter="blur(16px)"
    borderRadius="2xl"
    border="1px solid"
    borderColor={isSelected ? 'brand.400' : 'rgba(255,255,255,0.1)'}
    boxShadow={isSelected ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none'}
    transition="all 0.3s ease"
    position="relative"
    overflow="hidden"
  >
    {isSelected && (
      <MotionBox
        position="absolute"
        top="-50%"
        left="-50%"
        width="200%"
        height="200%"
        bg="radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        zIndex={-1}
      />
    )}
    <VStack spacing={3} align="flex-start">
      <Flex
        w={10}
        h={10}
        align="center"
        justify="center"
        borderRadius="xl"
        bg={isSelected ? 'brand.500' : 'rgba(255,255,255,0.1)'}
        color={isSelected ? 'white' : 'slate.400'}
        boxShadow={isSelected ? 'lg' : 'none'}
      >
        <Icon as={mode.IconComponent} boxSize={5} strokeWidth={2.5} />
      </Flex>
      <Box>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={isSelected ? 'brand.100' : 'slate.200'}
          mb={1}
        >
          {mode.label}
        </Text>
        <Text
          fontSize="sm"
          color={isSelected ? 'brand.200' : 'slate.500'}
          lineHeight="short"
        >
          {mode.description}
        </Text>
      </Box>
    </VStack>
  </MotionBox>
);

const StartScreen = ({ onBegin }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = React.useState('mixed');

  const modes = [
    {
      id: 'mixed',
      label: 'Mix Mode',
      IconComponent: Zap,
      description: 'The full experience: Speaking & Quiz challenges combined.'
    },
    {
      id: 'speech',
      label: 'Speaking Only',
      IconComponent: Mic,
      description: 'Focus purely on perfecting your pronunciation.'
    },
    {
      id: 'mcq',
      label: 'Quiz Only',
      IconComponent: FileText,
      description: 'Test your knowledge with rapid-fire questions.'
    },
  ];

  return (
    <VStack
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      spacing={8}
      w="100%"
      py={6}
      px={{ base: 2, md: 6 }}
    >
      <VStack spacing={4} textAlign="center">
        <MotionBox
          variants={itemVariants}
          whileHover={{ rotate: 10, scale: 1.1 }}
          p={4}
          bg="rgba(255,255,255,0.05)"
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.1)"
          boxShadow="glass"
        >
          <Image src="/assets/favicon1.png" boxSize="60px" />
        </MotionBox>

        <Box>
          <Heading
            as={motion.h1}
            variants={itemVariants}
            size="2xl"
            fontWeight="black"
            letterSpacing="tight"
            bgGradient="linear(to-r, brand.300, accent.400)"
            bgClip="text"
            textShadow="0 0 20px rgba(99, 102, 241, 0.3)"
          >
            French Months
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize="lg"
            color="slate.400"
            maxW="md"
            mx="auto"
            mt={2}
          >
            Master pronunciation through AI-powered interactive challenges
          </Text>
        </Box>
      </VStack>

      <Box w="100%">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {modes.map((m) => (
            <ModeCard
              key={m.id}
              mode={m}
              isSelected={mode === m.id}
              onClick={() => {
                setMode(m.id);
                dispatch(setReduxMode(m.id));
              }}
            />
          ))}
        </SimpleGrid>
      </Box>

      <MotionButton
        variants={itemVariants}
        size="lg"
        h="70px"
        w="100%"
        maxW="300px"
        onClick={() => onBegin(mode)}
        colorScheme="brand"
        fontSize="xl"
        rightIcon={<Sparkles size={20} />}
        boxShadow="glow"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)',
          bg: 'brand.400'
        }}
      >
        Start Learning
      </MotionButton>

      <Flex
        as={motion.div}
        variants={itemVariants}
        gap={6}
        justify="center"
        wrap="wrap"
        pt={4}
      >
        {[
          "AI Speech Analysis",
          "Real-time Scoring",
          "Adaptive Difficulty"
        ].map((feature, i) => (
          <Flex key={i} align="center" gap={2} opacity={0.7}>
            <Icon as={CheckCircleIcon} color="success.400" />
            <Text fontSize="sm" color="slate.400" fontWeight="medium">{feature}</Text>
          </Flex>
        ))}
      </Flex>
    </VStack>
  );
};

export default StartScreen;