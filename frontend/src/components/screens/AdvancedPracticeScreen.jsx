import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Radio,
    RadioGroup,
    Stack,
    useColorModeValue,
    Badge
} from '@chakra-ui/react';

// Material Symbol Helper
const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
    <Box as="span" className={`material-symbols-outlined`} fontSize={fontSize} {...props}>
        {icon}
    </Box>
);

const AdvancedPracticeScreen = () => {
    const navigate = useNavigate();
    const [asrMode, setAsrMode] = useState('auto');

    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'whiteAlpha.50');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const handleStartPractice = () => {
        // Navigate to practice with selected ASR mode
        navigate('/practice', { state: { asrMode } });
    };

    const asrModes = [
        {
            id: 'native',
            name: 'Native ASR',
            description: 'Browser\'s built-in Web Speech API',
            tech: 'Web Speech API',
            icon: 'mic',
            color: 'blue.500',
            features: ['Fast', 'Free', 'No setup required'],
            recommended: false
        },
        {
            id: 'hybrid',
            name: 'Hybrid ASR',
            description: 'LiveKit + OpenAI Whisper for professional accuracy',
            tech: 'LiveKit + Whisper',
            icon: 'high_quality',
            color: 'purple.500',
            features: ['High accuracy', 'Multi-language', 'Cloud-powered'],
            recommended: true
        },
        {
            id: 'auto',
            name: 'Auto Mode',
            description: 'Dynamically selects best ASR based on conditions',
            tech: 'Intelligent Selection',
            icon: 'auto_awesome',
            color: 'green.500',
            features: ['Smart detection', 'Fallback support', 'Best of both'],
            recommended: false
        }
    ];

    return (
        <Flex direction="column" align="center" justify="center" minH="80vh" w="full" maxW="900px" mx="auto" p={{ base: 4, md: 6 }}>
            {/* Header */}
            <VStack spacing={2} mb={8} textAlign="center">
                <Flex align="center" gap={2}>
                    <MaterialSymbol icon="workspace_premium" fontSize="32px" color="brand.500" />
                    <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={headingColor}>
                        Advanced Practice
                    </Heading>
                </Flex>
                <Text fontSize={{ base: "sm", md: "md" }} color={textColor} maxW="600px">
                    Choose your ASR (Automatic Speech Recognition) mode for professional-grade pronunciation practice
                </Text>
            </VStack>

            {/* ASR Mode Selection */}
            <Box
                className="glass-card"
                w="full"
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
            >
                <Heading fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color={headingColor} mb={6}>
                    Select ASR Mode
                </Heading>

                <RadioGroup value={asrMode} onChange={setAsrMode}>
                    <Stack spacing={4}>
                        {asrModes.map((mode) => (
                            <Box
                                key={mode.id}
                                p={5}
                                borderRadius="xl"
                                border="2px solid"
                                borderColor={asrMode === mode.id ? mode.color : borderColor}
                                bg={asrMode === mode.id ? useColorModeValue(`${mode.color.split('.')[0]}.50`, 'whiteAlpha.50') : 'transparent'}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ borderColor: mode.color, transform: 'translateY(-2px)' }}
                                onClick={() => setAsrMode(mode.id)}
                            >
                                <Radio value={mode.id} colorScheme={mode.color.split('.')[0]} size="lg">
                                    <Flex align="start" gap={4} ml={2}>
                                        <Box mt={1}>
                                            <MaterialSymbol icon={mode.icon} fontSize="28px" color={mode.color} />
                                        </Box>
                                        <Box flex="1">
                                            <Flex align="center" gap={2} mb={1}>
                                                <Heading fontSize="md" fontWeight="semibold" color={headingColor}>
                                                    {mode.name}
                                                </Heading>
                                                {mode.recommended && (
                                                    <Badge colorScheme="purple" fontSize="xs">Recommended</Badge>
                                                )}
                                            </Flex>
                                            <Text fontSize="sm" color={textColor} mb={3}>
                                                {mode.description}
                                            </Text>
                                            <HStack spacing={2} flexWrap="wrap">
                                                <Badge colorScheme="gray" fontSize="xs" px={2} py={1}>
                                                    {mode.tech}
                                                </Badge>
                                                {mode.features.map((feature, idx) => (
                                                    <Badge key={idx} variant="outline" colorScheme={mode.color.split('.')[0]} fontSize="xs" px={2} py={1}>
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>
                                    </Flex>
                                </Radio>
                            </Box>
                        ))}
                    </Stack>
                </RadioGroup>

                {/* Mode Details */}
                <Box mt={6} p={4} borderRadius="lg" bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                    <Flex align="start" gap={2}>
                        <MaterialSymbol icon="info" fontSize="20px" color="brand.500" />
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" color={headingColor} mb={1}>
                                {asrMode === 'native' && 'Native ASR Mode'}
                                {asrMode === 'hybrid' && 'Hybrid ASR Mode'}
                                {asrMode === 'auto' && 'Auto Mode'}
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                                {asrMode === 'native' && 'Uses your browser\'s built-in speech recognition. Fast and free, works offline in some browsers.'}
                                {asrMode === 'hybrid' && 'Connects to LiveKit server and uses OpenAI Whisper for transcription. Requires backend setup and API keys.'}
                                {asrMode === 'auto' && 'Automatically detects network conditions and browser capabilities to select the best ASR engine. Falls back to Native if Hybrid is unavailable.'}
                            </Text>
                        </Box>
                    </Flex>
                </Box>

                {/* Start Button */}
                <Button
                    mt={6}
                    w="full"
                    size="lg"
                    colorScheme="brand"
                    rightIcon={<MaterialSymbol icon="arrow_forward" fontSize="20px" />}
                    onClick={handleStartPractice}
                >
                    Start Advanced Practice
                </Button>
            </Box>

            {/* Back Button */}
            <Button
                mt={4}
                variant="ghost"
                leftIcon={<MaterialSymbol icon="arrow_back" fontSize="20px" />}
                onClick={() => navigate('/dashboard')}
            >
                Back to Dashboard
            </Button>
        </Flex>
    );
};

export default AdvancedPracticeScreen;
