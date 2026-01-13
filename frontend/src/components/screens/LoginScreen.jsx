
import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    useToast,
    Container,
    InputGroup,
    InputRightElement,
    IconButton,
    Flex,
    Image,
    Divider,
    HStack
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import NeuralBackground from '../ui/NeuralBackground';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast({
                title: 'Error',
                description: 'Please enter both email and password.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await login(email, password);
            // AuthContext will update state and App will rerender
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: 'Something went wrong.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box minH="100vh" position="relative" overflow="hidden">
            <NeuralBackground />

            <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" justifyContent="center">
                <Flex
                    w="full"
                    maxW="1000px"
                    h={{ base: "auto", md: "600px" }}
                    bg="card"
                    borderRadius="3xl"
                    boxShadow="2xl"
                    overflow="hidden"
                    flexDirection={{ base: "column", md: "row" }}
                    zIndex="10"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                >
                    {/* Left Side - Branding */}
                    <Box
                        flex="1"
                        bgGradient="linear(to-br, brand.600, brand.800)"
                        p={12}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        position="relative"
                        overflow="hidden"
                    >
                        {/* Abstract Shapes */}
                        <Box position="absolute" top="-20%" left="-20%" boxSize="300px" bg="whiteAlpha.100" borderRadius="full" filter="blur(50px)" />
                        <Box position="absolute" bottom="-10%" right="-10%" boxSize="200px" bg="accent.400" opacity="0.3" borderRadius="full" filter="blur(40px)" />

                        <Box zIndex="1">
                            <HStack mb={6}>
                                <Box p={2} bg="whiteAlpha.200" borderRadius="lg">
                                    <Image src="/assets/favicon1.png" boxSize="32px" />
                                </Box>
                                <Text color="white" fontWeight="bold" fontSize="lg" letterSpacing="wide">VOCALIS</Text>
                            </HStack>

                            <Heading color="white" size="2xl" mb={4} lineHeight="shorter">
                                Master your <br /> pronunciation.
                            </Heading>
                            <Text color="whiteAlpha.800" fontSize="lg">
                                Join thousands of learners improving their accent with AI-powered feedback.
                            </Text>
                        </Box>

                        <Box zIndex="1">
                            <HStack spacing={4} mt={8}>
                                <Box p={3} bg="whiteAlpha.200" borderRadius="xl" backdropFilter="blur(10px)">
                                    <Text color="white" fontWeight="bold" fontSize="2xl">24+</Text>
                                    <Text color="whiteAlpha.800" fontSize="xs">Modules</Text>
                                </Box>
                                <Box p={3} bg="whiteAlpha.200" borderRadius="xl" backdropFilter="blur(10px)">
                                    <Text color="white" fontWeight="bold" fontSize="2xl">98%</Text>
                                    <Text color="whiteAlpha.800" fontSize="xs">Accuracy</Text>
                                </Box>
                            </HStack>
                        </Box>
                    </Box>

                    {/* Right Side - Form */}
                    <Box flex="1" p={{ base: 8, md: 12 }} bg="card" display="flex" flexDirection="column" justifyContent="center">

                        <VStack align="start" spacing={1} mb={8}>
                            <Heading size="lg" color="text">Welcome Back</Heading>
                            <Text color="textMuted">Please enter your details to sign in.</Text>
                        </VStack>

                        <form onSubmit={handleLogin} style={{ width: '100%' }}>
                            <VStack spacing={5}>
                                <FormControl>
                                    <FormLabel color="textMuted" fontSize="sm">Email Address</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                        borderRadius="xl"
                                        focusBorderColor="brand.500"
                                        _placeholder={{ color: 'gray.400' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="textMuted" fontSize="sm">Password</FormLabel>
                                    <InputGroup size="lg">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            borderRadius="xl"
                                            focusBorderColor="brand.500"
                                            _placeholder={{ color: 'gray.400' }}
                                        />
                                        <InputRightElement width="4.5rem">
                                            <IconButton
                                                h="1.75rem"
                                                size="sm"
                                                onClick={() => setShowPassword(!showPassword)}
                                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                variant="ghost"
                                                colorScheme="brand"
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="brand"
                                    size="lg"
                                    w="full"
                                    isLoading={isSubmitting}
                                    loadingText="Signing in..."
                                    borderRadius="xl"
                                    bgGradient="linear(to-r, brand.500, brand.600)"
                                    _hover={{ bgGradient: "linear(to-r, brand.600, brand.700)", boxShadow: 'lg' }}
                                >
                                    Sign In
                                </Button>

                                <HStack w="full" justify="space-between" pt={2}>
                                    <Divider w="30%" />
                                    <Text fontSize="xs" color="textMuted" whiteSpace="nowrap">OR CONTINUE WITH</Text>
                                    <Divider w="30%" />
                                </HStack>

                                <Button w="full" variant="outline" borderRadius="xl" leftIcon={<Text fontSize="md">G</Text>}>
                                    Google
                                </Button>

                            </VStack>
                        </form>

                        <Text mt={8} textAlign="center" fontSize="sm" color="textMuted">
                            Don't have an account? <Button variant="link" colorScheme="brand" size="sm">Sign up</Button>
                        </Text>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default LoginScreen;
