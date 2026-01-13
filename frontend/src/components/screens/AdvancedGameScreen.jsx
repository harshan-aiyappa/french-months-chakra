import React, { useEffect } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Heading,
    IconButton,
    Button,
    useColorMode,
    useColorModeValue,
    Badge,
    Container
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceVisualizer from '../ui/VoiceVisualizer';

// Custom Material Symbol
const MaterialSymbol = ({ icon, fontSize = "24px", color, ...props }) => (
    <Box as="span" className="material-symbols-outlined" fontSize={fontSize} color={color} {...props}>
        {icon}
    </Box>
);

const AdvancedGameScreen = ({
    month, // Current activity
    isListening,
    startListening,
    stopListening,
    feedback, // { message, type, highlightedPhrase }
    onExit,
    currentIndex,
    total,
    onSkip, // optional
    activeEngine
}) => {
    // Force specific theme or just use a very distinct dark style
    // consistently for "Pro" mode regardless of system theme?
    // Let's stick to a "Dark Tech" theme for Advanced Mode

    const bgGradient = "linear(to-br, gray.900, gray.800)";
    const accentColor = "cyan.400";

    return (
        <Box
            w="100vw"
            h="calc(100vh - 80px)"
            bg="gray.900"
            color="white"
            overflow="hidden"
            position="fixed"
            top="0"
            left="0"
            zIndex="1000" // Overlay everything
        >
            <Container maxW="container.lg" h="full" p={6}>
                <VStack h="full" justify="space-between" spacing={8}>

                    {/* TOP BAR */}
                    <Flex w="full" justify="space-between" align="center">
                        <HStack>
                            <IconButton
                                icon={<MaterialSymbol icon="close" />}
                                variant="ghost"
                                color="whiteAlpha.700"
                                _hover={{ bg: 'whiteAlpha.200' }}
                                onClick={onExit}
                                aria-label="Exit"
                            />
                            <Text fontSize="sm" color="whiteAlpha.600" letterSpacing="widest" textTransform="uppercase">
                                Advanced Practice
                            </Text>
                        </HStack>

                        <HStack spacing={4}>
                            <Badge
                                variant="subtle"
                                colorScheme={activeEngine === 'hybrid' ? 'purple' : 'blue'}
                                fontSize="xs"
                                px={2}
                            >
                                {activeEngine === 'hybrid' ? 'LIVEKIT + WHISPER' : 'NATIVE ASR'}
                            </Badge>
                            <Text fontSize="sm" fontWeight="bold" color="whiteAlpha.800">
                                {currentIndex + 1} <Text as="span" color="whiteAlpha.400">/</Text> {total}
                            </Text>
                        </HStack>
                    </Flex>


                    {/* MAIN CONTENT CENTER */}
                    <VStack spacing={10} flex="1" justify="center" w="full">

                        {/* The Prompt Word */}
                        <VStack spacing={2}>
                            <Text fontSize="sm" color={accentColor} fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
                                Say this word
                            </Text>
                            <Heading
                                fontSize={{ base: "5xl", md: "7xl" }}
                                fontWeight="900"
                                bgGradient={`linear(to-r, white, ${accentColor})`}
                                bgClip="text"
                                filter="drop-shadow(0 0 20px rgba(0,255,255,0.3))"
                            >
                                {month.question}
                            </Heading>
                            <Text fontSize="xl" color="whiteAlpha.600" fontFamily="monospace">
                                /{month.pronunciation}/
                            </Text>
                        </VStack>

                        {/* Visualizer / Interaction Zone */}
                        <Box w="full" h="200px" position="relative" display="flex" alignItems="center" justifyContent="center">
                            {/* Visualizer Background Ring */}
                            <Box
                                position="absolute"
                                w="300px" h="300px"
                                borderRadius="full"
                                border="1px solid"
                                borderColor="whiteAlpha.100"
                                opacity={isListening ? 1 : 0.2}
                                transition="opacity 0.5s"
                            />

                            {/* Actual Visualizer */}
                            <Box h="100px" w="full" maxW="400px">
                                <VoiceVisualizer isListening={isListening} />
                            </Box>
                        </Box>

                        {/* Feedback / Instructions */}
                        <Box h="100px" textAlign="center">
                            <AnimatePresence mode="wait">
                                {feedback.message ? (
                                    <motion.div
                                        key="feedback"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <VStack>
                                            <MaterialSymbol
                                                icon={feedback.type === 'correct' ? 'check_circle' : 'error'}
                                                fontSize="40px"
                                                color={feedback.type === 'correct' ? 'green.400' : 'red.400'}
                                            />
                                            <Text fontSize="lg" fontWeight="medium" color="whiteAlpha.900">
                                                {feedback.message}
                                            </Text>
                                        </VStack>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="prompt"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <Text color="whiteAlpha.500">
                                            {isListening ? "Listening..." : "Tap microphone to start"}
                                        </Text>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>

                    </VStack>


                    {/* BOTTOM CONTROLS */}
                    <HStack w="full" justify="center" spacing={8} pb={10}>
                        {/* Main Mic Button */}
                        <Button
                            size="lg"
                            w="80px" h="80px"
                            borderRadius="full"
                            bg={isListening ? "red.500" : accentColor}
                            _hover={{ transform: 'scale(1.05)', boxShadow: `0 0 30px ${isListening ? 'red' : 'cyan'}` }}
                            _active={{ transform: 'scale(0.95)' }}
                            onClick={isListening ? stopListening : startListening}
                            boxShadow="2xl"
                            transition="all 0.2s"
                        >
                            <MaterialSymbol
                                icon={isListening ? "stop" : "mic"}
                                fontSize="32px"
                                color="white"
                            />
                        </Button>
                    </HStack>

                </VStack>
            </Container>
        </Box>
    );
};

export default AdvancedGameScreen;
