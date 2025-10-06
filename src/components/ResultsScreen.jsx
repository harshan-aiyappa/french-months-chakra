import React from 'react';
import { VStack, Heading, Text, Button, Box, HStack, SimpleGrid, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, WarningIcon, CloseIcon, ArrowForwardIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

const StatCard = ({ label, value }) => (
  <MotionBox
    p={5}
    bg="white"
    border="1px"
    borderColor="slate.200"
    boxShadow="md"
    borderRadius="lg"
    textAlign="center"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ translateY: -5, boxShadow: 'lg' }}
  >
    <Text fontSize="sm" color="slate.500">{label}</Text>
    <Heading size="lg" color="slate.800">{value}</Heading>
  </MotionBox>
);

const ResultItem = ({ result }) => {
  const getIcon = (status) => {
    if (status === 'correct') return <CheckCircleIcon color="green.500" />;
    if (status === 'partial') return <WarningIcon color="yellow.500" />;
    if (status === 'skipped') return <ArrowForwardIcon color="slate.500" />;
    return <CloseIcon color="red.500" />;
  };

  return (
    <HStack w="100%" bg="slate.50" p={3} borderRadius="md">
      <Box w="24px" flexShrink={0}>{getIcon(result.status)}</Box>
      <Box flex="1">
        <Text fontWeight="bold" color="slate.800">{result.question} → {result.answer}</Text>
        <Text fontSize="sm" color="slate.500">
          You said: "{result.transcript || 'No response'}"
        </Text>
      </Box>
    </HStack>
  );
};

const ResultsScreen = ({ results, restartGame }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const correct = results.filter(r => r.status === 'correct').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const incorrect = results.length - correct - partial;
  const percentage = results.length > 0 ? ((correct / results.length) * 100).toFixed(0) : 0;

  return (
    <VStack as={motion.div} spacing={8} variants={containerVariants} initial="hidden" animate="visible">
      <VStack spacing={2}>
        <Heading as="h2" size="2xl" fontWeight="bold">Game Complete!</Heading>
        <Text fontSize="lg" color="slate.500">Here's your performance breakdown:</Text>
      </VStack>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5} w="100%">
        <StatCard label="Final Score" value={`${correct} / ${results.length}`} />
        <StatCard label="Accuracy" value={`${percentage}%`} />
        <StatCard label="Close" value={partial} />
        <StatCard label="Incorrect" value={incorrect} />
      </SimpleGrid>

      <Divider />

      <VStack w="100%" align="stretch" spacing={3}>
        <Heading size="md" mb={2}>Detailed Summary:</Heading>
        {results.map(result => (
          <MotionBox key={result.id} variants={itemVariants}>
            <ResultItem result={result} />
          </MotionBox>
        ))}
      </VStack>

      <Button
        colorScheme="brand"
        size="lg"
        onClick={restartGame}
        as={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Play Again
      </Button>
    </VStack>
  );
};

export default ResultsScreen;