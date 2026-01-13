import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Icon,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Helper for Material Symbols
const MaterialSymbol = ({ icon, className, fontSize = "24px", ...props }) => (
  <Box as="span" className={`material-symbols-outlined ${className || ''}`} fontSize={fontSize} {...props}>
    {icon}
  </Box>
);

const ModeCard = ({ icon, title, description, isActive, onClick }) => (
  <Box
    onClick={onClick}
    className={`glass-card ${isActive ? 'card-active' : ''}`}
    p={8}
    borderRadius="xl"
    cursor="pointer"
    display="flex"
    flexDirection="column"
    alignItems="center"
    textAlign="center"
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-4px)', bg: 'white', shadow: 'xl' }}
    role="group"
  >
    <Flex
      boxSize="16"
      borderRadius="full"
      bg={isActive ? 'brand.50' : 'gray.100'}
      align="center"
      justify="center"
      mb={6}
      transition="colors 0.3s"
      _groupHover={{ bg: 'brand.50' }}
    >
      <MaterialSymbol
        icon={icon}
        fontSize="36px"
        color={isActive || 'var(--chakra-colors-gray-400)'}
        className={isActive ? 'text-primary' : 'group-hover:text-primary'}
        style={{ color: isActive ? '#594ce6' : undefined }}
      />
    </Flex>
    <Heading fontSize="xl" fontWeight="bold" mb={3} color="slate.900">
      {title}
    </Heading>
    <Text color="slate.600" fontSize="sm" lineHeight="relaxed">
      {description}
    </Text>
  </Box>
);

const StartScreen = ({ onBegin }) => {
  const [selectedMode, setSelectedMode] = React.useState('mixed');

  return (
    <Flex direction="column" align="center" justify="center" px={4} py={8} w="full" maxW="1200px" mx="auto">
      <Box textAlign="center" mb={12}>
        <Heading fontSize="40px" fontWeight="bold" letterSpacing="tight" mb={3} color="slate.900">
          Ready to refine your voice?
        </Heading>
        <Text fontSize="lg" color="slate.600" maxW="lg" mx="auto">
          Select your preferred practice mode to begin. Each session is tailored to your vocal profile.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full" mb={16}>
        <ModeCard
          icon="dynamic_feed"
          title="Mixed"
          description="The Full Experience. Balance pronunciation, comprehension, and real-time feedback."
          isActive={selectedMode === 'mixed'}
          onClick={() => setSelectedMode('mixed')}
        />
        <ModeCard
          icon="mic_external_on"
          title="Speaking Only"
          description="Focus on Fluency. High-intensity speech practice and deep phoneme analysis."
          isActive={selectedMode === 'speaking'}
          onClick={() => setSelectedMode('speaking')}
        />
        <ModeCard
          icon="psychology"
          title="Quiz Only"
          description="Test Your Knowledge. Rapid-fire listening, grammar checks, and vocabulary challenges."
          isActive={selectedMode === 'quiz'}
          onClick={() => setSelectedMode('quiz')}
        />
      </SimpleGrid>

      <Flex direction="column" align="center" gap={6}>
        <Button
          bgGradient="linear(to-r, brand.500, #7c71f5)"
          color="white"
          h="16"
          px={10}
          borderRadius="full"
          fontSize="lg"
          fontWeight="bold"
          gap={3}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.05)' }}
          _active={{ transform: 'scale(0.95)' }}
          boxShadow="0 4px 20px rgba(89, 76, 230, 0.3)"
          onClick={() => onBegin(selectedMode)}
        >
          <MaterialSymbol icon="play_circle" />
          Start Practice
        </Button>
      </Flex>

      <Box w="full" maxW="3xl" mt={20}>
        <Box className="glass" borderRadius="xl" overflow="hidden" boxShadow="sm" bg="whiteAlpha.400" border="1px solid" borderColor="whiteAlpha.500">
          <Flex px={6} py={4} align="center" justify="space-between" borderBottom="1px solid" borderColor="brand.50">
            <Flex align="center" gap={3}>
              <MaterialSymbol icon="developer_board" color="brand.500" />
              <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="slate.900">
                Industry-Standard Architecture
              </Text>
            </Flex>
            <MaterialSymbol icon="expand_more" color="gray.400" />
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} p={6}>
            <Flex gap={4}>
              <MaterialSymbol icon="bolt" color="brand.500" />
              <Box>
                <Heading fontSize="sm" fontWeight="bold" mb={1} color="slate.900">LiveKit Integration</Heading>
                <Text fontSize="xs" color="slate.600">Low-latency global WebRTC infrastructure for instantaneous feedback.</Text>
              </Box>
            </Flex>
            <Flex gap={4}>
              <MaterialSymbol icon="graphic_eq" color="brand.500" />
              <Box>
                <Heading fontSize="sm" fontWeight="bold" mb={1} color="slate.900">OpenAI Whisper</Heading>
                <Text fontSize="xs" color="slate.600">High-fidelity transcription engine for nuanced pronunciation mapping.</Text>
              </Box>
            </Flex>
          </SimpleGrid>
        </Box>
      </Box>

      <Box p={8} textAlign="center">
        <Text fontSize="xs" letterSpacing="widest" textTransform="uppercase" fontWeight="medium" color="slate.400">
          Vocalis Engine v2.4.0 — Premium Speech Analysis
        </Text>
      </Box>
    </Flex>
  );
};

export default StartScreen;