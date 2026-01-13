import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    SimpleGrid,
    HStack,
    Icon,
    VStack
} from '@chakra-ui/react';

// Material Symbol Helper
const MaterialSymbol = ({ icon, className, fontSize = "24px", ...props }) => (
    <Box as="span" className={`material-symbols-outlined ${className || ''}`} fontSize={fontSize} {...props}>
        {icon}
    </Box>
);

const KPICard = ({ icon, label, value, trend, subLabel }) => (
    <Box className="glass-card" p={6} borderRadius="xl" display="flex" flexDirection="column" gap={2}>
        <Flex align="center" gap={2} mb={2}>
            <MaterialSymbol icon={icon} color="#6366F1" fontSize="24px" />
            <Text color="#9995c6" fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider">
                {label}
            </Text>
        </Flex>
        <Text fontSize="3xl" fontWeight="bold" color="white">{value}</Text>
        <Text color="green.400" fontSize="xs" fontWeight="medium">
            {trend} <Text as="span" color="whiteAlpha.500" ml={1}>{subLabel}</Text>
        </Text>
    </Box>
);

const WeakWordItem = ({ word, score, colorScheme }) => (
    <Flex align="center" justify="space-between" p={3} borderRadius="xl" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.50" _hover={{ borderColor: 'whiteAlpha.100' }} transition="all 0.2s">
        <Flex direction="column">
            <Text fontSize="sm" fontWeight="bold" color="white" letterSpacing="wide">{word}</Text>
            <Text fontSize="10px" color={colorScheme === 'red' ? 'red.400' : 'yellow.400'} fontWeight="medium" textTransform="uppercase">
                {score} Match
            </Text>
        </Flex>
        <HStack spacing={2}>
            <Button size="sm" variant="ghost" className="glass-card" p={0} minW="8" h="8" color="whiteAlpha.700" _hover={{ bg: 'brand.500', color: 'white' }}>
                <MaterialSymbol icon="record_voice_over" fontSize="16px" />
            </Button>
            <Button size="sm" bg="brand.500" p={0} minW="8" h="8" color="white" _hover={{ bg: 'brand.400' }} boxShadow="0 0 10px rgba(89,76,230,0.2)">
                <MaterialSymbol icon="play_arrow" fontSize="16px" />
            </Button>
        </HStack>
    </Flex>
);

const StatsScreen = () => {
    return (
        <Flex direction="column" w="full" h="full" bgGradient="linear(to-br, #131121, #0a0a0c)" overflow="hidden">

            {/* Header */}
            <Flex align="center" justify="space-between" mb={8}>
                <Heading fontSize="2xl" fontWeight="bold" letterSpacing="tight" color="white">
                    Performance Analytics
                </Heading>
                <HStack spacing={4}>
                    <Flex bg="whiteAlpha.50" borderRadius="xl" p={1} border="1px solid" borderColor="whiteAlpha.100">
                        <Button size="xs" colorScheme="whiteAlpha" variant="solid" bg="whiteAlpha.200">30 Days</Button>
                        <Button size="xs" variant="ghost" color="#9995c6" _hover={{ color: 'white' }}>90 Days</Button>
                        <Button size="xs" variant="ghost" color="#9995c6" _hover={{ color: 'white' }}>Year</Button>
                    </Flex>
                    <Button p={2} minW="auto" className="glass-card" borderRadius="xl" color="white">
                        <MaterialSymbol icon="calendar_today" fontSize="20px" />
                    </Button>
                    <Button p={2} minW="auto" className="glass-card" borderRadius="xl" color="white">
                        <MaterialSymbol icon="notifications" fontSize="20px" />
                    </Button>
                </HStack>
            </Flex>

            {/* Dashboard Content */}
            <Flex direction="column" gap={8} h="full" overflowY="auto" className="no-scrollbar">

                {/* Tabs */}
                <Flex borderBottom="1px solid" borderColor="whiteAlpha.100" gap={8}>
                    {['Overview', 'Pronunciation', 'Vocabulary', 'Fluency'].map((tab, i) => (
                        <Button
                            key={tab}
                            variant="unstyled"
                            pb={4}
                            fontSize="sm"
                            fontWeight="bold"
                            color={i === 1 ? 'white' : '#9995c6'}
                            borderBottom={i === 1 ? '2px solid' : '2px solid transparent'}
                            borderColor={i === 1 ? 'brand.500' : 'transparent'}
                            borderRadius={0}
                            _hover={{ color: 'white' }}
                        >
                            {tab}
                        </Button>
                    ))}
                </Flex>

                {/* Top Row Charts */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                    {/* Accuracy Chart */}
                    <Box gridColumn={{ lg: 'span 2' }} className="glass-card" borderRadius="xl" p={6}>
                        <Flex justify="space-between" align="start" mb={6}>
                            <Box>
                                <Heading fontSize="lg" fontWeight="semibold" color="white" mb={1}>Pronunciation Accuracy</Heading>
                                <HStack spacing={2}>
                                    <Text fontSize="3xl" fontWeight="bold" color="white">92%</Text>
                                    <Text color="green.400" fontSize="sm" fontWeight="medium" display="flex" alignItems="center">
                                        <MaterialSymbol icon="trending_up" fontSize="14px" /> +5.4%
                                    </Text>
                                </HStack>
                            </Box>
                            <Text fontSize="xs" fontWeight="medium" color="#9995c6" textTransform="uppercase" letterSpacing="widest">Global Progress</Text>
                        </Flex>

                        {/* Mock SVG Chart */}
                        <Box h="250px" w="full" position="relative">
                            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#594ce6" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#594ce6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,40 T500,60 L500,200 L0,200 Z" fill="url(#chartGradient)" />
                                <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,40 T500,60" fill="none" stroke="#594ce6" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(89,76,230,0.5))' }} />
                                {/* Dots */}
                                <circle cx="100" cy="100" r="4" fill="#594ce6" />
                                <circle cx="200" cy="80" r="4" fill="#594ce6" />
                                <circle cx="300" cy="120" r="4" fill="#594ce6" />
                                <circle cx="400" cy="40" r="6" fill="#fff" stroke="#594ce6" strokeWidth="3" />
                            </svg>
                            <Flex justify="space-between" mt={4} width="100%">
                                {['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4'].map(label => (
                                    <Text key={label} fontSize="10px" fontWeight="bold" color="#9995c6">{label}</Text>
                                ))}
                            </Flex>
                        </Box>
                    </Box>

                    {/* Radar Chart */}
                    <Box className="glass-card" borderRadius="xl" p={6} display="flex" flexDirection="column">
                        <Heading fontSize="lg" fontWeight="semibold" color="white" mb={6}>Phonetic Mastery</Heading>
                        <Box flex="1" display="flex" alignItems="center" justifyContent="center" position="relative">
                            {/* Simulated Radar */}
                            <Box position="relative" w="48" h="48" borderRadius="full" border="1px solid" borderColor="whiteAlpha.100" display="flex" alignItems="center" justifyContent="center">
                                <Box position="absolute" inset="0" borderRadius="full" border="1px solid" borderColor="whiteAlpha.100" transform="scale(0.75)" />
                                <Box position="absolute" inset="0" borderRadius="full" border="1px solid" borderColor="whiteAlpha.100" transform="scale(0.5)" />
                                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', transform: 'rotate(45deg)' }}>
                                    <polygon points="50,10 80,40 70,80 30,80 20,40" fill="rgba(89, 76, 230, 0.3)" stroke="#594ce6" strokeWidth="2" />
                                </svg>
                            </Box>
                            {/* Labels */}
                            <Text position="absolute" top="0" fontSize="10px" fontWeight="bold" color="#9995c6">VOWELS</Text>
                            <Text position="absolute" bottom="0" fontSize="10px" fontWeight="bold" color="#9995c6">CONSONANTS</Text>
                            <Text position="absolute" left="0" top="50%" transform="translate(-1rem, -50%)" fontSize="10px" fontWeight="bold" color="#9995c6">INTONATION</Text>
                            <Text position="absolute" right="0" top="50%" transform="translate(1rem, -50%)" fontSize="10px" fontWeight="bold" color="#9995c6">STRESS</Text>
                        </Box>
                        <Box mt={6} w="full">
                            <Flex justify="space-between" fontSize="xs" mb={2}>
                                <Text color="#9995c6">Top Strength</Text>
                                <Text color="white" fontWeight="bold">Vowels (94%)</Text>
                            </Flex>
                            <Box w="full" bg="whiteAlpha.100" h="1.5" borderRadius="full" overflow="hidden">
                                <Box bg="brand.500" h="full" w="94%" />
                            </Box>
                        </Box>
                    </Box>
                </SimpleGrid>

                {/* Bottom Row */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                    {/* KPIs */}
                    <Box gridColumn={{ lg: 'span 2' }}>
                        <SimpleGrid columns={3} spacing={6} mb={6}>
                            <KPICard icon="local_fire_department" label="Best Streak" value="14 Days" trend="+2" subLabel="from prev." />
                            <KPICard icon="menu_book" label="Mastered" value="1,284" trend="+156" subLabel="new" />
                            <KPICard icon="auto_graph" label="Accuracy Trend" value="+12%" trend="Up 3%" subLabel="this week" />
                        </SimpleGrid>

                        {/* Context Card */}
                        <Box className="glass-card" borderRadius="xl" p={6} display="flex" alignItems="center" justifyContent="space-between">
                            <HStack spacing={4}>
                                <Flex boxSize="12" borderRadius="xl" bg="green.400" bgOpacity="0.2" align="center" justify="center">
                                    <MaterialSymbol icon="verified" color="#10B981" />
                                </Flex>
                                <Box>
                                    <Heading fontSize="md" fontWeight="bold" color="white">Advanced Proficiency Reached</Heading>
                                    <Text fontSize="xs" color="#9995c6">You've improved your accent reduction score by 15% in the last month.</Text>
                                </Box>
                            </HStack>
                            <Button size="sm" bg="brand.500" color="white" _hover={{ bg: 'brand.400' }} boxShadow="0 0 20px rgba(89, 76, 230, 0.2)">
                                View Report
                            </Button>
                        </Box>
                    </Box>

                    {/* Weakest Words List */}
                    <Box className="glass-card" borderRadius="xl" p={6} display="flex" flexDirection="column">
                        <Heading fontSize="lg" fontWeight="semibold" color="white" mb={6}>Weakest Words</Heading>
                        <VStack spacing={4} align="stretch" overflowY="auto" maxH="350px" pr={2} className="no-scrollbar">
                            <WeakWordItem word="Pneumonia" score="62%" colorScheme="red" />
                            <WeakWordItem word="Thorough" score="68%" colorScheme="red" />
                            <WeakWordItem word="Queue" score="74%" colorScheme="yellow" />
                            <WeakWordItem word="Wednesday" score="78%" colorScheme="yellow" />
                        </VStack>
                        <Button mt={6} w="full" variant="outline" borderColor="brand.500" color="brand.500" _hover={{ bg: 'brand.500', color: 'white' }} fontSize="xs" fontWeight="bold">
                            Practice All
                        </Button>
                    </Box>
                </SimpleGrid>
            </Flex>
        </Flex>
    );
};

export default StatsScreen;
