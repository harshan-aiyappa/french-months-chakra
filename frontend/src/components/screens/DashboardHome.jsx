import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Heading,
    Text,
    SimpleGrid,
    useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Helper for Material Symbols
const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
    <Box as="span" className={`material-symbols-outlined`} fontSize={fontSize} {...props}>
        {icon}
    </Box>
);

// Practice Mode Card
const PracticeModeCard = ({ icon, title, description, techs = [], onClick }) => (
    <Box
        as={motion.div}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        p={{ base: 4, md: 5, lg: 6 }}
        borderRadius={{ base: "xl", md: "2xl" }}
        cursor="pointer"
        transition="all 0.2s"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        onClick={onClick}
        display="flex"
        flexDirection="column"
        h="full"
        _hover={{
            borderColor: 'brand.500',
            boxShadow: 'xl',
        }}
    >
        <Flex align="center" gap={{ base: 2, md: 3 }} mb={3}>
            <Flex
                as={motion.div}
                whileHover={{ scale: 1.1, rotate: 5 }}
                align="center"
                justify="center"
                w={10}
                h={10}
                borderRadius="lg"
                bg={useColorModeValue('brand.50', 'whiteAlpha.100')}
                color="brand.500"
            >
                <MaterialSymbol icon={icon} fontSize={{ base: "20px", md: "24px" }} />
            </Flex>
            <Heading fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={useColorModeValue('gray.900', 'white')}>
                {title}
            </Heading>
        </Flex>

        <Text fontSize={{ base: "sm", md: "md" }} color={useColorModeValue('gray.600', 'gray.400')} mb={6} flex="1" lineHeight="tall">
            {description}
        </Text>

        <Flex gap={2} flexWrap="wrap" mt="auto">
            {techs.map((tech, i) => (
                <Flex
                    key={i}
                    align="center"
                    gap={1.5}
                    px={2.5}
                    py={1}
                    borderRadius="md"
                    bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                >
                    <MaterialSymbol icon={tech.icon} fontSize="14px" color="gray.500" />
                    <Text fontSize="xs" fontWeight="semibold" color={useColorModeValue('gray.600', 'gray.300')}>
                        {tech.label}
                    </Text>
                </Flex>
            ))}
        </Flex>
    </Box>
);

const DashboardHome = () => {
    const navigate = useNavigate();
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    const handleStartPractice = (mode) => {
        navigate(`/practice/${mode}`);
    };

    return (
        <Flex
            direction="column"
            gap={{ base: 6, md: 8 }}
            w="full"
            maxW="1400px"
            mx="auto"
            px={{ base: 4, md: 6, lg: 0 }}
        >
            {/* Welcome Header */}
            <Box>
                <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    letterSpacing="tight"
                    color={headingColor}
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    Welcome back, Alex <MaterialSymbol icon="waving_hand" color="brand.500" fontSize="32px" />
                </Heading>
                <Text
                    color={textColor}
                    fontSize={{ base: "sm", md: "md" }}
                    mt={1}
                >
                    Choose your practice mode to get started
                </Text>
            </Box>

            {/* Practice Modes */}
            <Box>
                <Heading
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="bold"
                    color={headingColor}
                    mb={{ base: 3, md: 4 }}
                >
                    Choose Practice Mode
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
                    <PracticeModeCard
                        icon="record_voice_over"
                        title="Speaking Practice"
                        description="Practice your pronunciation by speaking French words aloud. No quizzes, just speech."
                        techs={[
                            { icon: 'mic', label: 'Native ASR' },
                            { icon: 'graphic_eq', label: 'VAD Visuals' }
                        ]}
                        onClick={() => handleStartPractice('speech')}
                    />
                    <PracticeModeCard
                        icon="quiz"
                        title="Phonetic Quiz"
                        description="Test your listening skills by identifying the correct French words. No microphone required."
                        techs={[
                            { icon: 'volume_up', label: 'TTS Engine' },
                            { icon: 'checklist', label: 'Instant Eval' }
                        ]}
                        onClick={() => handleStartPractice('mcq')}
                    />
                    <PracticeModeCard
                        icon="shuffle"
                        title="Mixed Mode"
                        description="The ultimate challenge. Switch between Speaking and Listening tasks to test your full range of skills."
                        techs={[
                            { icon: 'mic', label: 'Speech' },
                            { icon: 'quiz', label: 'Quiz Check' }
                        ]}
                        onClick={() => handleStartPractice('mixed')}
                    />
                    <PracticeModeCard
                        icon="auto_awesome"
                        title="Advanced Practice"
                        description="Experience low-latency, real-time feedback powered by LiveKit and OpenAI Whisper."
                        techs={[
                            { icon: 'cloud_sync', label: 'LiveKit' },
                            { icon: 'model_training', label: 'Whisper AI' }
                        ]}
                        onClick={() => navigate('/advanced-practice')}
                    />
                </SimpleGrid>
            </Box>
        </Flex>
    );
};

export default DashboardHome;
