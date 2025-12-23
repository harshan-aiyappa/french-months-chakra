import React from 'react';
import { VStack, Heading, Text, Button, Box, HStack, SimpleGrid, Flex, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, WarningIcon, CloseIcon, ArrowForwardIcon, RepeatIcon } from '@chakra-ui/icons';
import { Trophy, Activity, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const StatCard = ({ label, value, color, icon }) => (
  <MotionBox
    p={5}
    bg="rgba(255, 255, 255, 0.05)"
    backdropFilter="blur(16px)"
    border="1px solid"
    borderColor="rgba(255,255,255,0.1)"
    boxShadow="glass"
    borderRadius="2xl"
    textAlign="center"
    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
    whileHover={{
      y: -5,
      boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
      bg: 'rgba(255, 255, 255, 0.1)'
    }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    <VStack spacing={1}>
      <Icon as={icon} color={color} boxSize={5} opacity={0.8} mb={1} />
      <Text fontSize="xs" color="slate.400" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">{label}</Text>
      <Heading size="lg" color="white" fontWeight="black">{value}</Heading>
    </VStack>
  </MotionBox>
);

const ResultItem = ({ result }) => {
  const getStatusConfig = (status) => {
    if (status === 'correct') return { icon: CheckCircleIcon, color: 'success.400', bg: 'rgba(16, 185, 129, 0.1)' };
    if (status === 'partial') return { icon: WarningIcon, color: 'warning.400', bg: 'rgba(245, 158, 11, 0.1)' };
    if (status === 'skipped') return { icon: ArrowForwardIcon, color: 'slate.400', bg: 'rgba(148, 163, 184, 0.1)' };
    return { icon: CloseIcon, color: 'error.400', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const config = getStatusConfig(result.status);

  return (
    <HStack
      w="100%"
      bg="rgba(255, 255, 255, 0.03)"
      p={4}
      borderRadius="xl"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.05)"
      _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
      transition="background 0.2s"
      spacing={4}
    >
      <Flex
        w={10}
        h={10}
        align="center"
        justify="center"
        borderRadius="full"
        bg={config.bg}
        color={config.color}
      >
        <Icon as={config.icon} boxSize={5} />
      </Flex>

      <Box flex="1">
        <HStack justify="space-between" mb={1}>
          <Text fontWeight="bold" color="slate.200" fontSize="md">
            {result.question} <Text as="span" color="slate.500" mx={1}>→</Text> {result.answer}
          </Text>
          <Box px={2} py={0.5} borderRadius="md" bg="rgba(255,255,255,0.05)" border="1px solid rgba(255,255,255,0.1)">
            <Text fontSize="2xs" fontWeight="bold" color="slate.400" textTransform="uppercase">
              {result.type}
            </Text>
          </Box>
        </HStack>
        <Text fontSize="sm" color="slate.400">
          {result.transcript ? (
            <>You said: <Text as="span" color={config.color} fontWeight="medium">"{result.transcript}"</Text></>
          ) : 'No response detected'}
        </Text>
      </Box>
    </HStack>
  );
};

const ResultsScreen = ({ results, restartGame }) => {
  const correct = results.filter(r => r.status === 'correct').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const incorrect = results.length - correct - partial;
  const percentage = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

  React.useEffect(() => {
    if (percentage >= 70) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22d3ee', '#818cf8']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22d3ee', '#818cf8']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [percentage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
  };

  return (
    <VStack as={motion.div} spacing={8} variants={containerVariants} initial="hidden" animate="visible" py={4} w="100%">
      <VStack spacing={2} textAlign="center">
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          mb={2}
        >
          <Box p={4} bg="brand.500" borderRadius="full" boxShadow="glow">
            <Trophy size={40} color="white" />
          </Box>
        </MotionBox>

        <Heading as="h2" size="xl" fontWeight="black" color="white" bgGradient="linear(to-r, white, slate.400)" bgClip="text">
          {percentage >= 85 ? "Magnifique! 🎉" : percentage >= 60 ? "Great Progress! 👍" : "Keep Practicing! 💪"}
        </Heading>
        <Text fontSize="md" color="slate.400" maxW="md">
          Unit complete. Check out your breakdown below.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="100%">
        <StatCard label="Score" value={`${correct}/${results.length}`} color="brand.400" icon={Target} />
        <StatCard label="Accuracy" value={`${percentage}%`} color="success.400" icon={Activity} />
        <StatCard label="Partial" value={partial} color="warning.400" icon={Zap} />
        <StatCard label="Incorrect" value={incorrect} color="error.400" icon={CloseIcon} />
      </SimpleGrid>

      <Box w="100%">
        <HStack justify="space-between" mb={4} px={1}>
          <Heading size="sm" color="slate.300" textTransform="uppercase" letterSpacing="wide">Session History</Heading>
          <Text fontSize="xs" fontWeight="bold" bg="rgba(255,255,255,0.1)" px={2} py={1} borderRadius="md" color="brand.200">
            {results.length} ITEMS
          </Text>
        </HStack>
        <VStack w="100%" align="stretch" spacing={3}>
          {results.map((result, idx) => (
            <MotionBox key={idx} variants={itemVariants}>
              <ResultItem result={result} />
            </MotionBox>
          ))}
        </VStack>
      </Box>

      <MotionButton
        bgGradient="linear(to-r, brand.500, brand.600)"
        color="white"
        size="lg"
        h="60px"
        w="100%"
        maxW="xs"
        onClick={restartGame}
        whileHover={{ scale: 1.05, boxShadow: "glow" }}
        whileTap={{ scale: 0.95 }}
        leftIcon={<RepeatIcon />}
        borderRadius="2xl"
        fontSize="lg"
        fontWeight="bold"
        boxShadow="lg"
      >
        Practice Again
      </MotionButton>
    </VStack>
  );
};

export default ResultsScreen;