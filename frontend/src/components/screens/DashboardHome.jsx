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

// Helper for Material Symbols
const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
    <Box as="span" className={`material-symbols-outlined`} fontSize={fontSize} {...props}>
        {icon}
    </Box>
);

// Practice Mode Card
const PracticeModeCard = ({ icon, title, description, onClick }) => (
    <Box
        className="glass-card"
        p={{ base: 4, md: 5, lg: 6 }}
        borderRadius={{ base: "lg", md: "xl" }}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
            transform: 'translateY(-2px)',
            borderColor: 'brand.500',
            boxShadow: 'md'
        }}
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'transparent')}
        bg={useColorModeValue('white', 'whiteAlpha.50')}
        onClick={onClick}
    >
        <Flex align="center" gap={{ base: 2, md: 3 }} mb={2}>
            <MaterialSymbol icon={icon} fontSize={{ base: "20px", md: "24px" }} color="brand.500" />
            <Heading fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color={useColorModeValue('gray.900', 'white')}>
                {title}
            </Heading>
        </Flex>
        <Text fontSize={{ base: "xs", md: "sm" }} color={useColorModeValue('gray.600', 'gray.400')}>
            {description}
        </Text>
    </Box>
);

const DashboardHome = () => {
    const navigate = useNavigate();
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    const handleStartPractice = () => {
        navigate('/practice');
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
                >
                    Welcome back, Alex 👋
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

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 3, md: 4 }}>
                    <PracticeModeCard
                        icon="record_voice_over"
                        title="Speaking Practice"
                        description="Practice pronunciation with AI feedback"
                        onClick={handleStartPractice}
                    />
                    <PracticeModeCard
                        icon="quiz"
                        title="Phonetic Quiz"
                        description="Test your knowledge with MCQ"
                        onClick={handleStartPractice}
                    />
                    <PracticeModeCard
                        icon="shuffle"
                        title="Mixed Mode"
                        description="Speaking and quiz combined"
                        onClick={handleStartPractice}
                    />
                </SimpleGrid>
            </Box>
        </Flex>
    );
};

export default DashboardHome;
