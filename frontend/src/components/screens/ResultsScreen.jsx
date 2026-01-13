import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';

const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
  <Box as="span" className={`material-symbols-outlined`} fontSize={fontSize} {...props}>
    {icon}
  </Box>
);

const ResultCard = ({ word, ipa, score, isCorrect }) => {
  const cardBg = useColorModeValue('white', 'whiteAlpha.50');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.50');
  const wordColor = useColorModeValue('gray.900', 'white');
  const ipaColor = useColorModeValue('gray.500', 'whiteAlpha.400');
  const labelColor = useColorModeValue('gray.400', 'whiteAlpha.400');

  return (
    <Flex
      align="center"
      justify="space-between"
      p={4}
      borderRadius="xl"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }}
      transition="all 0.2s"
    >
      <Flex align="center" gap={4}>
        <Flex
          boxSize="10"
          borderRadius="lg"
          bg={isCorrect ? useColorModeValue('green.50', 'green.900') : useColorModeValue('red.50', 'red.900')}
          align="center"
          justify="center"
        >
          <MaterialSymbol
            icon={isCorrect ? 'check_circle' : 'cancel'}
            color={isCorrect ? '#10B981' : '#F43F5E'}
          />
        </Flex>
        <Box>
          <Text fontWeight="semibold" color={wordColor}>{word}</Text>
          <Text fontSize="xs" color={ipaColor} fontStyle="italic">{ipa}</Text>
        </Box>
      </Flex>

      <Flex align="center" gap={6}>
        <Box textAlign="right">
          <Text fontSize="10px" color={labelColor} fontWeight="bold" textTransform="uppercase" letterSpacing="widest">Score</Text>
          <Text fontWeight="bold" color={isCorrect ? '#10B981' : '#F43F5E'}>{score}%</Text>
        </Box>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="brand"
          rightIcon={<MaterialSymbol icon="replay" fontSize="16px" />}
        >
          Retry
        </Button>
      </Flex>
    </Flex>
  );
};

const ResultsScreen = ({ results, restartGame }) => {
  // Calculate stats
  const totalQuestions = results.length;
  // Mock data if results are empty for visual check
  const mockResults = results.length > 0 ? results : [
    { word: 'Enchanté', ipa: '[ɑ̃.ʃɑ̃.te]', score: 98, status: 'correct' },
    { word: "S'il vous plaît", ipa: '[si vu ple]', score: 95, status: 'correct' },
    { word: 'Bibliothèque', ipa: '[bi.bli.jɔ.tɛk]', score: 64, status: 'incorrect' },
    { word: 'Délicieux', ipa: '[de.li.sjø]', score: 91, status: 'correct' },
    { word: 'Au revoir', ipa: '[o ʁə.vwaʁ]', score: 89, status: 'partial' },
  ];

  const totalWords = mockResults.length;
  const masteredWords = mockResults.filter(r => r.status === 'correct').length;
  const scorePercentage = Math.round((masteredWords / totalWords) * 100);

  // Theme colors
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.50');

  return (
    <Flex direction="column" align="center" justify="center" minH="80vh" w="full" maxW="1000px" mx="auto" p={{ base: 4, md: 6 }}>
      {/* Main Card */}
      <Box w="full" borderRadius="3xl" overflow="hidden" position="relative" display="flex" flexDirection="column" bg={useColorModeValue('white', 'gray.800')} boxShadow="2xl" border="1px solid" borderColor={borderColor}>

        {/* Header Section */}
        <Box p={{ base: 6, md: 8 }} pb={4} textAlign="center" borderBottom="1px solid" borderColor={borderColor}>
          <Box position="relative" display="inline-flex" mb={4}>
            <CircularProgress value={scorePercentage} size="120px" thickness="8px" color="brand.500" trackColor={useColorModeValue('gray.100', 'whiteAlpha.100')} capIsRound>
              <CircularProgressLabel fontSize="2xl" fontWeight="bold" color={headingColor}>
                {scorePercentage}%
              </CircularProgressLabel>
            </CircularProgress>
          </Box>

          <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color={headingColor} mb={2} letterSpacing="tight">
            Magnifique!
          </Heading>
          <Text color={textColor} fontSize={{ base: "md", md: "lg" }}>
            You mastered {masteredWords} out of {totalWords} phrases in this session.
          </Text>

          <Box mt={8} maxW="md" mx="auto">
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>Session Mastery</Text>
              <Text fontSize="sm" fontWeight="bold" color="brand.500">{scorePercentage}%</Text>
            </Flex>
            <Box h="2" w="full" bg={useColorModeValue('gray.100', 'whiteAlpha.100')} borderRadius="full" overflow="hidden">
              <Box h="full" w={`${scorePercentage}%`} bg="brand.500" borderRadius="full" boxShadow="0 0 10px rgba(89,76,230,0.5)" />
            </Box>
            <Text fontSize="xs" color={textColor} mt={3}>
              You're almost there! Just a few nuances left to polish.
            </Text>
          </Box>
        </Box>

        {/* Scrollable Content: Word Breakdown */}
        <Box flex="1" overflowY="auto" p={8} pt={0} maxH="400px" className="no-scrollbar">
          <Heading fontSize="xl" fontWeight="bold" color={headingColor} position="sticky" top={0} bg={useColorModeValue('white', 'gray.800')} py={6} zIndex={20}>
            Word Breakdown
          </Heading>
          <VStack spacing={3} pb={8} align="stretch">
            {mockResults.map((result, idx) => (
              <ResultCard
                key={idx}
                word={result.word || result.question || "Unknown"}
                ipa={result.ipa || ""}
                score={result.score || (result.status === 'correct' ? 95 : 60)}
                isCorrect={result.status === 'correct'}
              />
            ))}
          </VStack>
        </Box>

        {/* Footer Actions */}
        <Flex p={8} borderTop="1px solid" borderColor={borderColor} gap={4}>
          <Button
            flex="1"
            py={7}
            variant="ghost"
            color="brand.600"
            _hover={{ bg: 'brand.50' }}
            borderRadius="xl"
            fontSize="md"
            fontWeight="semibold"
            onClick={restartGame}
            leftIcon={<MaterialSymbol icon="replay" />}
          >
            Retry Unit
          </Button>
          <Button
            flex="1.5"
            py={7}
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)' }}
            borderRadius="xl"
            fontSize="md"
            fontWeight="bold"
            boxShadow="lg"
            rightIcon={<MaterialSymbol icon="arrow_forward" />}
            onClick={() => window.location.reload()} // Mock dashboard return for now
          >
            Back to Dashboard
          </Button>
        </Flex>

      </Box>
    </Flex>
  );
};

export default ResultsScreen;