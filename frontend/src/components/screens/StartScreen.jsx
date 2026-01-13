import React from 'react';
import { VStack, Heading, Text, Button, Icon, Box, SimpleGrid, Image, Badge, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Code, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Zap, Mic, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setMode as setReduxMode } from '../../store/gameSlice';


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

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
    boxShadow={isSelected ? '0 10px 30px -5px rgba(99, 102, 241, 0.4)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'}
    _hover={{
      borderColor: isSelected ? 'brand.600' : 'brand.300',
      boxShadow: isSelected ? '0 15px 35px -5px rgba(99, 102, 241, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }}
    position="relative"
    overflow="hidden"
  >
    <VStack spacing={2}>
      <Icon
        as={mode.IconComponent}
        boxSize={8}
        color={isSelected ? 'white' : 'brand.500'}
        strokeWidth={2}
      />
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
  const dispatch = useDispatch();
  const [mode, setMode] = React.useState('mixed');

  const modes = [
    {
      id: 'mixed',
      label: 'Mix Mode',
      IconComponent: Zap,
      description: 'Speaking + Quiz challenges'
    },
    {
      id: 'speech',
      label: 'Speaking',
      IconComponent: Mic,
      description: 'Pronunciation practice only'
    },
    {
      id: 'mcq',
      label: 'Quiz',
      IconComponent: FileText,
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
          as={motion.h1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.8 }}
          size="2xl"
          fontWeight="black"
          letterSpacing="tight"
          bgGradient="linear(to-r, brand.300, accent.400)"
          bgClip="text"
          textShadow="0 0 20px rgba(99, 102, 241, 0.3)"
        >
          Vocalis
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
              onClick={() => {
                setMode(m.id);
                dispatch(setReduxMode(m.id));
              }}
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
        aria-label="Begin Speech Training Unit"
        boxShadow="lg"
      >
        Start Learning →
      </Button>

      <Accordion allowToggle w="100%" maxW="lg" mt={2}>
        <AccordionItem border="none" bg="whiteAlpha.500" borderRadius="xl" _dark={{ bg: 'whiteAlpha.100' }}>
          <h2>
            <AccordionButton _hover={{ bg: 'whiteAlpha.200' }} borderRadius="xl" px={4} py={3}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xs" color="textMuted" letterSpacing="wide" textTransform="uppercase">
                ⚙️ &nbsp; Industry-Standard Architecture
              </Box>
              <AccordionIcon color="textMuted" />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" color="text">
                We use the <b>production-proven approach</b> trusted by Google Meet, Zoom, and Teams — powered by open-source tech.
              </Text>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="textMuted" mb={1} textTransform="uppercase">The Standard Flow</Text>
                <Code p={3} borderRadius="md" w="100%" display="block" fontSize="2xs" lineHeight="tall" colorScheme="gray">
                  Mic (Web/iOS) → WebRTC (LiveKit)<br />
                  → Noise Calibration (1s) → RMS Gate<br />
                  → VAD (webrtcvad) → Chunking (2.5s)<br />
                  → Whisper ASR (Base Model)<br />
                  → Partial + Final Transcripts
                </Code>
              </Box>

              <SimpleGrid columns={2} spacing={2}>
                <Box p={2} bg="bg" borderRadius="md" border="1px solid" borderColor="border">
                  <Text fontSize="2xs" color="textMuted" fontWeight="bold">TRANSPORT</Text>
                  <Text fontSize="xs" fontWeight="semibold">LiveKit (WebRTC)</Text>
                </Box>
                <Box p={2} bg="bg" borderRadius="md" border="1px solid" borderColor="border">
                  <Text fontSize="2xs" color="textMuted" fontWeight="bold">ASR MODEL</Text>
                  <Text fontSize="xs" fontWeight="semibold">Whisper (OpenAI)</Text>
                </Box>
                <Box p={2} bg="bg" borderRadius="md" border="1px solid" borderColor="border">
                  <Text fontSize="2xs" color="textMuted" fontWeight="bold">DETECTION</Text>
                  <Text fontSize="xs" fontWeight="semibold">webrtcvad + RMS</Text>
                </Box>
                <Box p={2} bg="bg" borderRadius="md" border="1px solid" borderColor="border">
                  <Text fontSize="2xs" color="textMuted" fontWeight="bold">APPROACH</Text>
                  <Text fontSize="xs" fontWeight="semibold">Server-Side Norm.</Text>
                </Box>
              </SimpleGrid>

              <Text fontSize="xs" color="textMuted" fontStyle="italic">
                Solves iOS dropouts, frequency shifts, and false triggers by moving processing to the server.
              </Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default StartScreen;