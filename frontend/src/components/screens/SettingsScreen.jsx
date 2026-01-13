import React, { useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    SimpleGrid,
    Switch,
    VStack,
    HStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Select,
    FormControl,
    FormLabel,
    Input,
    Badge,
    Divider,
    useColorModeValue
} from '@chakra-ui/react';

// Material Symbol Helper
const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
    <Box as="span" className={`material-symbols-outlined`} fontSize={fontSize} {...props}>
        {icon}
    </Box>
);

const SettingsGroup = ({ title, children }) => (
    <Box
        className="glass-card"
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}
        mb={6}
        bg={useColorModeValue('white', 'whiteAlpha.50')}
    >
        <Heading
            fontSize="md"
            color={useColorModeValue('gray.900', 'white')}
            mb={6}
            fontWeight="semibold"
            letterSpacing="wide"
            display="flex"
            alignItems="center"
            gap={3}
        >
            {title}
        </Heading>
        <VStack spacing={6} align="stretch">
            {children}
        </VStack>
    </Box>
);

const SettingItem = ({ label, description, control }) => (
    <Flex justify="space-between" align="center" gap={4}>
        <Box>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('gray.900', 'gray.200')}>{label}</Text>
            {description && <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')} mt={0.5}>{description}</Text>}
        </Box>
        <Box>{control}</Box>
    </Flex>
);

const SettingsScreen = () => {
    // Mock State for Settings
    const [vadSensitivity, setVadSensitivity] = useState(50);
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [echoCancellation, setEchoCancellation] = useState(true);
    const [autoGain, setAutoGain] = useState(false);

    const [asrModel, setAsrModel] = useState('whisper-v3-large');
    const [language, setLanguage] = useState('fr-FR');

    return (
        <Flex direction="column" w="full" minH="100vh" p={{ base: 4, md: 6, lg: 8 }}>

            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'stretch', md: 'center' }}
                mb={{ base: 6, md: 8, lg: 10 }}
                gap={{ base: 4, md: 0 }}
            >
                <Box>
                    <Heading
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="bold"
                        color={useColorModeValue('gray.900', 'white')}
                        letterSpacing="tight"
                    >
                        Settings
                    </Heading>
                    <Text
                        color={useColorModeValue('gray.600', 'gray.400')}
                        mt={1}
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        Configure audio processing and recognition engine parameters.
                    </Text>
                </Box>
                <HStack spacing={{ base: 2, md: 3 }}>
                    <Button
                        variant="ghost"
                        color={useColorModeValue('gray.600', 'gray.400')}
                        size={{ base: "sm", md: "md" }}
                    >
                        Reset Defaults
                    </Button>
                    <Button
                        colorScheme="brand"
                        px={{ base: 4, md: 8 }}
                        boxShadow="lg"
                        size={{ base: "sm", md: "md" }}
                    >
                        Save Changes
                    </Button>
                </HStack>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, md: 8 }} alignItems="start">

                {/* Column 1: Audio Processing */}
                <Box>
                    <SettingsGroup title={<><MaterialSymbol icon="graphic_eq" color="#6366F1" /> Audio Input Pipeline</>}>
                        <SettingItem
                            label="VAD Sensitivity"
                            description="Threshold for voice activity detection. Lower values are more sensitive."
                            control={
                                <Box w="150px">
                                    <Slider aria-label="vad-sensitivity" value={vadSensitivity} onChange={setVadSensitivity} colorScheme="brand">
                                        <SliderTrack bg={useColorModeValue('gray.200', 'whiteAlpha.200')}><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb boxSize={4} borderColor="brand.200" />
                                    </Slider>
                                    <Text textAlign="right" fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')} mt={1}>{vadSensitivity}%</Text>
                                </Box>
                            }
                        />
                        <Divider borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')} />
                        <SettingItem
                            label="Noise Suppression"
                            description="AI-based background noise filtering."
                            control={<Switch colorScheme="brand" isChecked={noiseSuppression} onChange={(e) => setNoiseSuppression(e.target.checked)} />}
                        />
                        <SettingItem
                            label="Echo Cancellation"
                            description="Prevents speaker output feedback."
                            control={<Switch colorScheme="brand" isChecked={echoCancellation} onChange={(e) => setEchoCancellation(e.target.checked)} />}
                        />
                        <SettingItem
                            label="Auto Gain Control"
                            description="Automatically adjust microphone volume."
                            control={<Switch colorScheme="brand" isChecked={autoGain} onChange={(e) => setAutoGain(e.target.checked)} />}
                        />
                    </SettingsGroup>

                    <SettingsGroup title={<><MaterialSymbol icon="hub" color="#6366F1" /> System Info</>}>
                        <SettingItem
                            label="Audio Driver"
                            control={<Badge colorScheme="green" variant="subtle" px={2} borderRadius="md">WebAudio API (WASM)</Badge>}
                        />
                        <SettingItem
                            label="Latency (Roundtrip)"
                            control={<Text color={useColorModeValue('gray.700', 'gray.300')} fontWeight="mono" fontSize="sm">42ms</Text>}
                        />
                        <SettingItem
                            label="Sample Rate"
                            control={<Text color={useColorModeValue('gray.700', 'gray.300')} fontWeight="mono" fontSize="sm">48kHz</Text>}
                        />
                    </SettingsGroup>
                </Box>

                {/* Column 2: ASR & Interface */}
                <Box>
                    <SettingsGroup title={<><MaterialSymbol icon="psychology" color="#6366F1" /> Recognition Engine (ASR)</>}>
                        <SettingItem
                            label="Model Architecture"
                            description="Select the inference model for speech-to-text."
                            control={
                                <Select
                                    value={asrModel} onChange={(e) => setAsrModel(e.target.value)}
                                    w="180px" size="sm" borderRadius="md"
                                    bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
                                    border="1px solid"
                                    borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                                    color={useColorModeValue('gray.900', 'white')}
                                    _focus={{ bg: useColorModeValue('white', 'whiteAlpha.200'), borderColor: 'brand.500' }}
                                >
                                    <option style={{ color: '#1A202C' }} value="whisper-v3-large">Whisper v3 (Large)</option>
                                    <option style={{ color: '#1A202C' }} value="whisper-v3-medium">Whisper v3 (Medium)</option>
                                    <option style={{ color: '#1A202C' }} value="nova-2">Deepgram Nova-2</option>
                                </Select>
                            }
                        />
                        <Divider borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')} />
                        <SettingItem
                            label="Target Language"
                            control={
                                <Select
                                    value={language} onChange={(e) => setLanguage(e.target.value)}
                                    w="180px" size="sm" borderRadius="md"
                                    bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
                                    border="1px solid"
                                    borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                                    color={useColorModeValue('gray.900', 'white')}
                                    _focus={{ bg: useColorModeValue('white', 'whiteAlpha.200'), borderColor: 'brand.500' }}
                                >
                                    <option style={{ color: '#1A202C' }} value="fr-FR">French (France)</option>
                                    <option style={{ color: '#1A202C' }} value="fr-CA">French (Canada)</option>
                                </Select>
                            }
                        />
                        <SettingItem
                            label="Strict Phoneme Matching"
                            description="Enforce exact IPA symbol matching for grading."
                            control={<Switch colorScheme="brand" defaultChecked />}
                        />
                    </SettingsGroup>

                    <SettingsGroup title={<><MaterialSymbol icon="tune" color="#6366F1" /> Developer Overrides</>}>
                        <FormControl mb={4}>
                            <FormLabel fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>Custom API Endpoint</FormLabel>
                            <Input
                                placeholder="wss://api.vocalis.dev/v1/socket"
                                size="sm"
                                borderRadius="md"
                                bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                                border="1px solid"
                                borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                                color={useColorModeValue('gray.900', 'white')}
                                _focus={{ bg: useColorModeValue('white', 'whiteAlpha.100'), borderColor: 'brand.500' }}
                            />
                        </FormControl>
                        <SettingItem
                            label="Debug Mode"
                            description="Show raw JSON output and confidence scores."
                            control={<Switch colorScheme="orange" />}
                        />
                    </SettingsGroup>
                </Box>

            </SimpleGrid>
        </Flex>
    );
};

export default SettingsScreen;
