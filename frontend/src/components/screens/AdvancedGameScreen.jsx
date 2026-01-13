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
    Container,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceVisualizer from '../ui/VoiceVisualizer';
import { BarVisualizer, LiveKitRoom } from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

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
    activeEngine,
    selectedAsrMode, // The mode selected from Redux (native/hybrid/auto)
    showToast,
    liveKitRoom
}) => {
    // Force specific theme or just use a very distinct dark style
    // consistently for "Pro" mode regardless of system theme?
    // Let's stick to a "Dark Tech" theme for Advanced Mode

    useEffect(() => {
        showToast('info', 'Advanced Practice Ready', 'High-fidelity audio engine initialized.');
    }, [showToast]);

    const bg = useColorModeValue("white", "gray.900");
    const color = useColorModeValue("gray.800", "white");
    const shadow = useColorModeValue("xl", "dark-lg");
    const border = useColorModeValue("1px solid", "none");
    const borderColor = useColorModeValue("gray.100", "transparent");
    const accentColor = "brand.500";
    const subTextColor = useColorModeValue("gray.500", "whiteAlpha.600");

    return (
        <Box
            w="full"
            minH="calc(100vh - 120px)"
            bg={bg}
            color={color}
            boxShadow={shadow}
            border={border}
            borderColor={borderColor}
            borderRadius="3xl"
            position="relative"
            overflow="hidden"
        >
            <Container maxW="container.lg" h="full" p={6} pt={10}>
                <VStack h="full" justify="space-between" spacing={8}>

                    {/* BREADCRUMB NAVIGATION */}
                    <Breadcrumb
                        w="full"
                        fontSize="sm"
                        color={subTextColor}
                        separator={<MaterialSymbol icon="chevron_right" fontSize="16px" />}
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" _hover={{ color: accentColor }}>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/advanced-practice" _hover={{ color: accentColor }}>
                                Advanced Practice
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink color={color} fontWeight="semibold">
                                {selectedAsrMode === 'hybrid' ? 'Hybrid ASR' :
                                    selectedAsrMode === 'native' ? 'Native ASR' : 'Auto Mode'}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    {/* TOP BAR */}
                    <Flex w="full" justify="space-between" align="center">
                        <HStack>
                            <IconButton
                                icon={<MaterialSymbol icon="close" />}
                                variant="ghost"
                                color={subTextColor}
                                _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.200') }}
                                onClick={onExit}
                                aria-label="Exit"
                            />
                            <Text fontSize="sm" color={subTextColor} letterSpacing="widest" textTransform="uppercase">
                                Advanced Practice
                            </Text>
                        </HStack>

                        <HStack spacing={2}>
                            {(selectedAsrMode === 'hybrid' || (selectedAsrMode === 'auto' && activeEngine === 'hybrid')) ? (
                                <>
                                    <Badge display="flex" alignItems="center" px={2} py={1} borderRadius="md" colorScheme="purple" variant="subtle">
                                        <MaterialSymbol icon="cloud_sync" fontSize="16px" style={{ marginRight: '4px' }} />
                                        LiveKit
                                    </Badge>
                                    <Badge display="flex" alignItems="center" px={2} py={1} borderRadius="md" colorScheme="green" variant="subtle">
                                        <MaterialSymbol icon="psychology" fontSize="16px" style={{ marginRight: '4px' }} />
                                        Whisper AI
                                    </Badge>
                                </>
                            ) : selectedAsrMode === 'auto' && !activeEngine ? (
                                <Badge display="flex" alignItems="center" px={2} py={1} borderRadius="md" colorScheme="cyan" variant="subtle">
                                    <MaterialSymbol icon="auto_awesome" fontSize="16px" style={{ marginRight: '4px' }} />
                                    Auto Mode
                                </Badge>
                            ) : (
                                <Badge display="flex" alignItems="center" px={2} py={1} borderRadius="md" colorScheme="blue" variant="subtle">
                                    <MaterialSymbol icon="mic" fontSize="16px" style={{ marginRight: '4px' }} />
                                    Native ASR
                                </Badge>
                            )}
                            <Text fontSize="sm" fontWeight="bold" color={color} ml={2}>
                                {currentIndex + 1} <Text as="span" color={subTextColor}>/</Text> {total}
                            </Text>
                        </HStack>
                    </Flex>


                    {/* MAIN CONTENT CENTER */}
                    <VStack spacing={6} flex="1" justify="center" w="full">

                        {/* The Prompt Word */}
                        <VStack spacing={1}>
                            <Text fontSize="xs" color={accentColor} fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
                                Say this word
                            </Text>
                            <Heading
                                fontSize={{ base: "4xl", md: "5xl" }}
                                fontWeight="800"
                                bgGradient={`linear(to-r, ${useColorModeValue('brand.600', 'white')}, ${accentColor})`}
                                bgClip="text"
                            >
                                {month.question}
                            </Heading>
                            <Text fontSize="md" color={subTextColor} fontStyle="italic">
                                {month.pronunciation}
                            </Text>
                        </VStack>

                        {/* Visualizer Section */}
                        <Box position="relative" display="flex" alignItems="center" justifyContent="center" w="full">
                            {/* Visualizer Background Ring */}
                            <Box
                                position="absolute"
                                w="200px" h="200px"
                                borderRadius="full"
                                border="1px solid"
                                borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                                opacity={isListening ? 1 : 0.2}
                                transition="opacity 0.5s"
                            />

                            {/* Actual Visualizer */}
                            <Box h="80px" w="full" maxW="350px" display="flex" alignItems="center" justifyContent="center">
                                {activeEngine === 'hybrid' && liveKitRoom ? (
                                    <BarVisualizer
                                        state={{ participant: liveKitRoom.localParticipant, source: Track.Source.Microphone }}
                                        barCount={15}
                                        options={{ barWidth: 6, minHeight: 10 }}
                                    />
                                ) : (
                                    <VoiceVisualizer isListening={isListening} />
                                )}
                            </Box>
                        </Box>

                        {/* Feedback / Instructions */}
                        <Box h="60px" textAlign="center">
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
                                            <Text fontSize="lg" fontWeight="medium" color={color}>
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
                                        <Text color={subTextColor}>
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
