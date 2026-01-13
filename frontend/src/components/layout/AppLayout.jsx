import React, { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    Tooltip,
    Image,
    Icon,
    Button
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Icons need to be imported or used from a library like react-icons or lucide-react
// Assuming Material Symbols are loaded via Google Fonts in index.html, we use standard Text or specialized Icon component
// For better type safety and integration, I'll use simple Box/Text wrappers for Material Symbols if not using an icon lib.
const MaterialSymbol = ({ icon, size = "24px", ...props }) => (
    <Box as="span" className="material-symbols-outlined" fontSize={size} {...props}>
        {icon}
    </Box>
);

const AppLayout = ({ children, activeView, onNavigate }) => {
    const { user, logout } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const bgColor = useColorModeValue('background-light', '#131121'); // Using user's design dark color
    const navText = useColorModeValue('gray.500', 'gray.400');
    const navTextActive = 'white';
    const navBgActive = 'brand.500';

    const SidebarItem = ({ id, icon, label, isActive, onClick }) => (
        <HStack
            as="button"
            onClick={onClick}
            w="full"
            px={4}
            py={3}
            borderRadius="xl"
            bg={isActive ? navBgActive : 'transparent'}
            color={isActive ? navTextActive : navText}
            _hover={{ bg: isActive ? navBgActive : 'whiteAlpha.50', color: isActive ? navTextActive : 'white' }}
            cursor="pointer"
            justify={isSidebarCollapsed ? 'center' : 'flex-start'}
            transition="all 0.2s"
            whiteSpace="nowrap"
            overflow="hidden"
            role="group"
        >
            <MaterialSymbol icon={icon} />
            {!isSidebarCollapsed && (
                <Text fontSize="sm" fontWeight={isActive ? "semibold" : "medium"} ml={3}>
                    {label}
                </Text>
            )}
        </HStack>
    );

    return (
        <Flex h="100vh" w="full" bg={bgColor} overflow="hidden" pos="relative" fontFamily="Inter, sans-serif">
            {/* Background Orbs - using standard CSS/Box for these absolute positioned elements */}
            <Box className="organic-blob blob-1" />
            <Box className="organic-blob blob-2" />
            <Box className="organic-blob blob-3" />

            {/* Sidebar - Hidden on mobile */}
            <Box
                as="aside"
                w={isSidebarCollapsed ? "80px" : "280px"}
                className="glass-nav"
                h="full"
                transition="width 0.3s ease"
                px={4}
                py={6}
                zIndex={50}
                display={{ base: "none", lg: "flex" }}
                flexDirection="column"
                justifyContent="space-between"
            >
                <VStack spacing={8} align="stretch" h="full">
                    {/* Logo */}
                    <Flex align="center" px={2} gap={3}>
                        <Flex
                            bg="brand.500"
                            borderRadius="xl"
                            p={2}
                            align="center"
                            justify="center"
                            minW="40px"
                        >
                            <MaterialSymbol icon="graphic_eq" color="white" />
                        </Flex>
                        {!isSidebarCollapsed && (
                            <Box overflow="hidden" whiteSpace="nowrap">
                                <Text color={useColorModeValue('gray.900', 'white')} fontSize="lg" fontWeight="bold" lineHeight="tight">Vocalis</Text>
                                <Text color="gray.400" fontSize="xs" fontWeight="medium" letterSpacing="widest" textTransform="uppercase">by Lingotran</Text>
                            </Box>
                        )}
                    </Flex>

                    {/* Nav Items */}
                    <VStack spacing={2} align="stretch" flex={1}>
                        <SidebarItem
                            id="dashboard"
                            icon="dashboard"
                            label="Dashboard"
                            isActive={activeView === 'dashboard'}
                            onClick={() => onNavigate('dashboard')}
                        />
                        {/* Lessons - Integrated into Dashboard */}
                        {/* <SidebarItem
                            id="lessons"
                            icon="school"
                            label="Lessons"
                            isActive={activeView === 'lessons'}
                            onClick={() => onNavigate('lessons')}
                        /> */}
                        {/* Analytics - Commented out for now */}
                        {/* <SidebarItem
                            id="analytics"
                            icon="analytics"
                            label="Analytics"
                            isActive={activeView === 'analytics'}
                            onClick={() => onNavigate('analytics')}
                        /> */}
                        <SidebarItem
                            id="settings"
                            icon="settings"
                            label="Settings"
                            isActive={activeView === 'settings'}
                            onClick={() => onNavigate('settings')}
                        />
                    </VStack>

                    {/* Bottom Actions */}
                    <VStack spacing={4} align="stretch" mt="auto">
                        <Button
                            variant="ghost"
                            justifyContent={isSidebarCollapsed ? 'center' : 'flex-start'}
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            color="gray.400"
                            _hover={{ color: 'white', bg: 'whiteAlpha.50' }}
                            h="auto"
                            py={3}
                            px={4}
                            border="1px solid"
                            borderColor="whiteAlpha.100"
                        >
                            <MaterialSymbol icon={isSidebarCollapsed ? "last_page" : "first_page"} />
                            {!isSidebarCollapsed && <Text ml={3} fontSize="sm">Collapse</Text>}
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent={isSidebarCollapsed ? 'center' : 'flex-start'}
                            onClick={logout}
                            color="red.400"
                            _hover={{ bg: 'red.400', color: 'white' }}
                            bg="transparent" // explicit transparent default to override ghost hover default if needed, though ghost is fine
                            sx={{ '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }} // Custom hover for red tint
                            h="auto"
                            py={3}
                            px={4}
                        >
                            <MaterialSymbol icon="logout" />
                            {!isSidebarCollapsed && <Text ml={3} fontSize="sm">Log out</Text>}
                        </Button>
                    </VStack>
                </VStack>
            </Box>

            {/* Main Content */}
            <Flex flex="1" direction="column" overflow="hidden" pos="relative" zIndex={10}>
                {/* Top Bar */}
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    px={8}
                    py={5}
                    position="sticky"
                    top={0}
                    zIndex={40}
                    bg={useColorModeValue('rgba(255,255,255,0.8)', 'rgba(19, 17, 33, 0.3)')}
                    backdropFilter="blur(16px)"
                >
                    <Box w="full" maxW="md">
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <MaterialSymbol icon="search" color="gray" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search lessons..."
                                bg="whiteAlpha.50"
                                border="none"
                                borderRadius="xl"
                                color="white"
                                _placeholder={{ color: 'gray.500' }}
                                _focus={{ ring: 1, ringColor: 'brand.500', bg: 'whiteAlpha.100' }}
                            />
                        </InputGroup>
                    </Box>

                    <HStack spacing={6}>
                        <IconButton
                            variant="ghost"
                            icon={<MaterialSymbol icon="notifications" />}
                            color={useColorModeValue('gray.600', 'gray.400')}
                            _hover={{ color: useColorModeValue('gray.900', 'white'), bg: useColorModeValue('gray.100', 'whiteAlpha.100') }}
                            borderRadius="xl"
                            aria-label="Notifications"
                            position="relative"
                        >
                            <Box pos="absolute" top={2} right={2} boxSize="8px" bg="red.500" borderRadius="full" border="2px solid" borderColor={useColorModeValue('white', 'gray.900')} />
                        </IconButton>

                        <Box h="24px" w="1px" bg={useColorModeValue('gray.200', 'whiteAlpha.100')} />

                        <HStack spacing={3}>
                            <VStack spacing={0} align="flex-end" display={{ base: 'none', md: 'flex' }}>
                                <Text fontSize="sm" fontWeight="bold" lineHeight="none" color={useColorModeValue('gray.800', 'white')}>
                                    {user?.name || "Alex Rivera"}
                                </Text>
                                <Text fontSize="10px" fontWeight="bold" color="brand.500" textTransform="uppercase" letterSpacing="tight">
                                    Premium Member
                                </Text>
                            </VStack>
                            <Box pos="relative">
                                <Image
                                    src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Nt5kMW_7Tco5Td_4BEjfnlk9S8T8kM80B21f9HORCjCABHXb56qDQxxjtYIgZoIISFLHuGQh1Wur5m2wXe79eJmz5nFe4NXuycPet-lEfQIGh1-giFMY6CRNpluMxGO6hgJdA_LBXp1PYW8YPCX29hIFVRC6pDg1hLkJ3NyzuznUxPmaxeZrUBBgbP7hP6kJ7YAAZvadvwEEyUbyHIaxSKTrS4PrbdsmsvDuDTc1IOVFHGHRKyYO-SLLB6POYFOThKK2A3Jzk9Bx"}
                                    boxSize="40px"
                                    borderRadius="xl"
                                    objectFit="cover"
                                    border="2px solid"
                                    borderColor="brand.500"
                                    opacity={0.8}
                                />
                                <Box pos="absolute" bottom={0} right={0} boxSize="12px" bg="green.500" borderRadius="full" border="2px solid" borderColor={useColorModeValue('white', 'gray.900')} />
                            </Box>
                        </HStack>
                    </HStack>
                </Flex>

                <Box flex="1" p={{ base: 6, md: 10 }} maxW="1400px" mx="auto" w="full">
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
};

export default AppLayout;
