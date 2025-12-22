import React from 'react';
import { VStack, Heading, Text, Button, Box, HStack, SimpleGrid, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, WarningIcon, CloseIcon, ArrowForwardIcon, RepeatIcon } from '@chakra-ui/icons';
import confetti from 'canvas-confetti';

const MotionBox = motion.create(Box);

const StatCard = ({ label, value, color = "slate.800" }) => (
  <MotionBox
    p={6}
    bg="white"
    border="1px solid"
    borderColor="slate.100"
    boxShadow="xl"
    borderRadius="2xl"
    textAlign="center"
    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
    whileHover={{ translateY: -8, boxShadow: '2xl', borderColor: 'brand.200' }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Text fontSize={{ base: "2xs", md: "xs" }} color="slate.500" fontWeight="bold" textTransform="uppercase" mb={2}>{label}</Text>
    <Heading size={{ base: "lg", md: "xl" }} color={color} fontWeight="black">{value}</Heading>
  </MotionBox>
);

const ResultItem = ({ result }) => {
  const getIcon = (status) => {
    if (status === 'correct') return <CheckCircleIcon color="success.500" boxSize={5} />;
    if (status === 'partial') return <WarningIcon color="warning.500" boxSize={5} />;
    if (status === 'skipped') return <ArrowForwardIcon color="slate.400" boxSize={5} />;
    return <CloseIcon color="error.500" boxSize={5} />;
  };

  return (
    <HStack
      w="100%"
      bg="white"
      p={4}
      borderRadius="xl"
      border="1px solid"
      borderColor="slate.100"
      boxShadow="sm"
    >
      <Box w={{ base: "24px", md: "30px" }} flexShrink={0}>{getIcon(result.status)}</Box>
      <Box flex="1">
        <HStack justify="space-between">
          <Text fontWeight="bold" color="slate.800" fontSize={{ base: "sm", md: "md" }}>{result.question} → {result.answer}</Text>
          <Text fontSize={{ base: "3xs", md: "xs" }} fontWeight="bold" color="slate.300" textTransform="uppercase">
            {result.type}
          </Text>
        </HStack>
        <Text fontSize={{ base: "xs", md: "sm" }} color="slate.500" mt={1}>
          {result.transcript ? (
            <>You said: <Text as="span" fontWeight="semibold" color="slate.700">"{result.transcript}"</Text></>
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
          colors: ['#6366F1', '#10B981']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366F1', '#10B981']
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
    visible: { y: 0, opacity: 1 },
  };

  return (
    <VStack as={motion.div} spacing={10} variants={containerVariants} initial="hidden" animate="visible" py={6}>
      <VStack spacing={3} textAlign="center">
        <Heading as="h2" size={{ base: "xl", md: "2xl" }} fontWeight="black" color="slate.800">
          {percentage >= 85 ? "Magnifique! 🎉" : percentage >= 60 ? "Great Progress! 👍" : "Keep Practicing! 💪"}
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="slate.500" maxW="md">
          You've completed the French Months unit. Take a look at your stats below.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="100%">
        <StatCard label="Score" value={`${correct}/${results.length}`} color="brand.500" />
        <StatCard label="Accuracy" value={`${percentage}%`} color="accent.500" />
        <StatCard label="Partial" value={partial} color="warning.500" />
        <StatCard label="Incorrect" value={incorrect} color="error.500" />
      </SimpleGrid>

      <Box w="100%">
        <HStack justify="space-between" mb={6}>
          <Heading size={{ base: "sm", md: "md" }} color="slate.800">Review Summary</Heading>
          <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight="bold" bg="slate.100" px={2} py={1} borderRadius="md" color="slate.500">
            {results.length} ITEMS
          </Text>
        </HStack>
        <VStack w="100%" align="stretch" spacing={4}>
          {results.map((result, idx) => (
            <MotionBox key={idx} variants={itemVariants}>
              <ResultItem result={result} />
            </MotionBox>
          ))}
        </VStack>
      </Box>

      <Button
        bg="brand.500"
        color="white"
        size={{ base: "md", md: "lg" }}
        h={{ base: "55px", md: "65px" }}
        w="100%"
        maxW="xs"
        onClick={restartGame}
        as={motion.button}
        whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        _hover={{ bg: 'brand.600' }}
        leftIcon={<RepeatIcon />}
        borderRadius="2xl"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="bold"
      >
        Practice Again
      </Button>
    </VStack>
  );
};

export default ResultsScreen;