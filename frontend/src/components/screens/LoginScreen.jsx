import React, { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    Heading,
    Text,
    Button,
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    Checkbox,
    Link,
    Icon,
    Image,
    useToast,
    Container,
    Divider,
    HStack,
    SimpleGrid,
    useColorModeValue
} from '@chakra-ui/react';

import { useAuth } from '../../context/AuthContext';
import VantaBackground from '../ui/VantaBackground';

const MaterialSymbol = ({ icon, className, ...props }) => (
    <Box as="span" className={`material-symbols-outlined ${className || ''}`} {...props}>
        {icon}
    </Box>
);

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            toast({
                title: "Login Failed",
                description: "Check your credentials and try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" w="full" bg={useColorModeValue('#e8f4f8', '#131121')} color={useColorModeValue('gray.800', 'white')} overflow="hidden" fontFamily="Inter, sans-serif">

            {/* Left Side: Branding & Immersive Elements */}
            <Box
                display={{ base: "none", lg: "flex" }}
                w="50%"
                flexDir="column"
                position="relative"
                overflow="hidden"
                bgGradient="linear(to-br, #7dd3fc, #38bdf8, #0ea5e9)"
                borderRight="1px solid"
                borderColor={useColorModeValue('cyan.200', 'whiteAlpha.50')}
            >
                {/* Content Container */}
                <Flex position="relative" zIndex={10} flexDir="column" justify="space-between" h="full" p={16} color="white">
                    {/* Top Brand */}
                    <Box>
                        <Flex align="center" gap={3} mb={12}>
                            <Flex boxSize="40px" bg="white" borderRadius="lg" align="center" justify="center" boxShadow="0 0 20px rgba(255,255,255,0.3)">
                                <MaterialSymbol icon="graphic_eq" fontSize="24px" color="#0ea5e9" />
                            </Flex>
                            <Heading fontSize="3xl" fontWeight="bold" letterSpacing="tight">Vocalis</Heading>
                        </Flex>

                        <Heading fontSize="6xl" fontWeight="bold" lineHeight="1.1" mb={6} maxW="md">
                            Master your <Text as="span" color="white" textShadow="0 2px 20px rgba(255,255,255,0.3)">pronunciation</Text>.
                        </Heading>
                        <Text color="blue.50" fontSize="xl" maxW="sm" fontWeight="light">
                            The world's most advanced AI-driven speech analysis platform.
                        </Text>
                    </Box>

                    {/* Stats Grid */}
                    <SimpleGrid columns={2} spacing={6} maxW="lg">
                        <Box bg="whiteAlpha.200" backdropFilter="blur(10px)" p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.300" transition="transform 0.3s" _hover={{ transform: 'translateY(-4px)' }} display="flex" flexDirection="column" gap={2}>
                            <Flex justify="space-between" align="start">
                                <Text color="blue.50" fontSize="sm" fontWeight="medium">Accuracy Rate</Text>
                                <MaterialSymbol icon="verified" className="text-white text-xl" color="white" />
                            </Flex>
                            <Text fontSize="3xl" fontWeight="bold">98.4%</Text>
                            <Flex align="center" gap={1} fontSize="xs" fontWeight="medium" color="emerald.200">
                                <MaterialSymbol icon="trending_up" fontSize="12px" />
                                <Text>+2.1% this week</Text>
                            </Flex>
                        </Box>

                        <Box bg="whiteAlpha.200" backdropFilter="blur(10px)" p={6} mt={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.300" transition="transform 0.3s" _hover={{ transform: 'translateY(-4px)' }} display="flex" flexDirection="column" gap={2}>
                            <Flex justify="space-between" align="start">
                                <Text color="blue.50" fontSize="sm" fontWeight="medium">AI Analysis</Text>
                                <MaterialSymbol icon="psychology" color="white" />
                            </Flex>
                            <Text fontSize="3xl" fontWeight="bold">Real-time</Text>
                            <Text color="blue.100" fontSize="xs" fontWeight="medium">Latency &lt; 40ms</Text>
                        </Box>
                    </SimpleGrid>

                    {/* Footer */}
                    <Text color="blue.100" fontSize="sm">
                        © 2024 Vocalis by Lingotran. All rights reserved.
                    </Text>
                </Flex>
            </Box>

            {/* Right Side: Form */}
            <Flex flex={1} align="center" justify="center" p={{ base: 6, sm: 12 }} position="relative" bg={useColorModeValue('white', '#131121')}>

                <Box w="full" maxW="440px" zIndex={10}>
                    <Box className="glass-card" p={{ base: 8, sm: 10 }} borderRadius="3xl" w="full" bg={useColorModeValue('white', 'whiteAlpha.50')} boxShadow="xl">
                        {/* Mobile Branding */}
                        <Flex display={{ lg: "none" }} align="center" justify="center" gap={2} mb={8}>
                            <Flex boxSize="32px" bg="brand.500" borderRadius="md" align="center" justify="center">
                                <MaterialSymbol icon="graphic_eq" fontSize="18px" color="white" />
                            </Flex>
                            <Heading fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.900', 'white')}>Vocalis</Heading>
                        </Flex>

                        <Box mb={10} textAlign={{ base: "center", lg: "left" }}>
                            <Heading fontSize="3xl" fontWeight="bold" mb={2} color={useColorModeValue('gray.900', 'white')}>Welcome Back</Heading>
                            <Text color={useColorModeValue('gray.600', '#9995c6')} fontSize="sm">Log in to continue your journey to fluency.</Text>
                        </Box>

                        {/* Social Buttons */}
                        <SimpleGrid columns={2} spacing={4} mb={8}>
                            <Button
                                variant="outline"
                                h="auto"
                                py={3}
                                px={4}
                                borderRadius="xl"
                                fontSize="sm"
                                fontWeight="medium"
                                gap={2}
                                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                                bg={useColorModeValue('white', 'whiteAlpha.50')}
                                _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }}
                            >
                                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKB29yuepQ4iV9ZfTrOjKlOmzXw0ExPqiRN4Wnfg3Vu_A_ccSh11j820Xu0Sdm9gqRN49oVWnrvw5P1afE5lL27uwnbZkbaVQDNdY4STkRr7le2K0Mqr7NeuTr4fp4376np0W0M1UlChqBZETpZ6MFqa04wA9uMVKrPClPmMLfj4EErl1X9VGT86hv5IMYdCIiiPRMoox-bo5GacpJlVGYo9PcC4wBzfzMEV1Vyeq1ZPu_t58D7ROOjmEA8lBPdp1nqYpnkZ4HyEIe" boxSize="16px" alt="Google" />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                h="auto"
                                py={3}
                                px={4}
                                borderRadius="xl"
                                fontSize="sm"
                                fontWeight="medium"
                                gap={2}
                                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                                bg={useColorModeValue('white', 'whiteAlpha.50')}
                                _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }}
                            >
                                <MaterialSymbol icon="ios" fontSize="18px" />
                                Apple
                            </Button>
                        </SimpleGrid>

                        <Flex align="center" py={4} mb={6}>
                            <Divider borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')} />
                            <Text px={4} color={useColorModeValue('gray.400', 'whiteAlpha.300')} fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" whiteSpace="nowrap">Or with email</Text>
                            <Divider borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')} />
                        </Flex>

                        <form onSubmit={handleLogin}>
                            <VStack spacing={5} align="stretch">
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight="medium" color={useColorModeValue('gray.700', 'whiteAlpha.700')} ml={1}>Email Address</FormLabel>
                                    <Box position="relative" className="group">
                                        <Box position="absolute" insetY={0} left={0} pl={4} display="flex" alignItems="center" pointerEvents="none">
                                            <MaterialSymbol icon="mail" color={useColorModeValue('#94a3b8', 'rgba(255,255,255,0.3)')} />
                                        </Box>
                                        <Input
                                            type="email"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            pl={10}
                                            py={6}
                                            bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                                            border="1px solid"
                                            borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                                            borderRadius="xl"
                                            _focus={{ ring: 0, borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', bg: useColorModeValue('white', 'whiteAlpha.100') }}
                                            _placeholder={{ color: useColorModeValue('gray.400', 'whiteAlpha.200') }}
                                            color={useColorModeValue('gray.900', 'white')}
                                        />
                                    </Box>
                                </FormControl>

                                <FormControl>
                                    <Flex justify="space-between" align="center" ml={1} mb={1}>
                                        <FormLabel fontSize="sm" fontWeight="medium" color={useColorModeValue('gray.700', 'whiteAlpha.700')} m={0}>Password</FormLabel>
                                        <Link fontSize="xs" color="brand.500" _hover={{ color: 'brand.600' }} fontWeight="medium" href="#">Forgot?</Link>
                                    </Flex>
                                    <Box position="relative" className="group">
                                        <Box position="absolute" insetY={0} left={0} pl={4} display="flex" alignItems="center" pointerEvents="none">
                                            <MaterialSymbol icon="lock" color={useColorModeValue('#94a3b8', 'rgba(255,255,255,0.3)')} />
                                        </Box>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            pl={10}
                                            py={6}
                                            bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                                            border="1px solid"
                                            borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                                            borderRadius="xl"
                                            _focus={{ ring: 0, borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', bg: useColorModeValue('white', 'whiteAlpha.100') }}
                                            _placeholder={{ color: useColorModeValue('gray.400', 'whiteAlpha.200') }}
                                            color={useColorModeValue('gray.900', 'white')}
                                        />
                                    </Box>
                                </FormControl>

                                <Flex align="center" mt={2}>
                                    <Checkbox
                                        colorScheme="brand"
                                        defaultChecked
                                        sx={{
                                            'span.chakra-checkbox__control': {
                                                borderRadius: '4px',
                                                bg: useColorModeValue('white', 'whiteAlpha.50'),
                                                borderColor: useColorModeValue('gray.300', 'whiteAlpha.200')
                                            }
                                        }}
                                    >
                                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'whiteAlpha.500')} ml={1}>Remember me</Text>
                                    </Checkbox>
                                </Flex>

                                <Button
                                    type="submit"
                                    mt={4}
                                    w="full"
                                    py={7}
                                    bgGradient="linear(to-r, brand.500, #7c72ff)"
                                    _hover={{ opacity: 0.9 }}
                                    borderRadius="xl"
                                    boxShadow="0 4px 20px rgba(89,76,230,0.4)"
                                    color="white"
                                    fontWeight="bold"
                                    isLoading={isLoading}
                                    loadingText="Login to Vocalis"
                                >
                                    Login to Vocalis
                                </Button>
                            </VStack>
                        </form>

                        <Text mt={8} textAlign="center" fontSize="sm" color={useColorModeValue('gray.600', '#9995c6')}>
                            Don't have an account? <Link color={useColorModeValue('brand.500', 'white')} fontWeight="bold" _hover={{ color: 'brand.600' }} ml={1}>Create account</Link>
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

export default LoginScreen;
