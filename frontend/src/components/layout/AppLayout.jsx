
import React from 'react';
import {
    Box,
    Flex,
    VStack,
    Icon,
    Text,
    HStack,
    Avatar,
    IconButton,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    Image,
    Tooltip
} from '@chakra-ui/react';
import {
    Home,
    BookOpen,
    BarChart2,
    Settings,
    LogOut,
    Bell,
    Menu as MenuIcon,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon, label, isActive, onClick, isCollapsed }) => {
    const activeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
    const activeColor = useColorModeValue('brand.600', 'brand.200');
    const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');

    return (
        <Tooltip label={isCollapsed ? label : ''} placement="right" hasArrow>
            <HStack
                as="button"
                onClick={onClick}
                w="full"
                px={isCollapsed ? 2 : 4}
                py={3}
                borderRadius="xl"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : 'textMuted'}
                _hover={{ bg: isActive ? activeBg : hoverBg, color: isActive ? activeColor : 'text' }}
                transition="all 0.2s"
                justifyContent={isCollapsed ? 'center' : 'flex-start'}
                spacing={3}
            >
                <Icon as={icon} boxSize={5} strokeWidth={isActive ? 2.5 : 2} />
                {!isCollapsed && (
                    <Text fontSize="sm" fontWeight={isActive ? 'bold' : 'medium'}>
                        {label}
                    </Text>
                )}
            </HStack>
        </Tooltip>
    );
};

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = React.useState('practice');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    // Responsive values
    const sidebarWidth = isSidebarCollapsed ? "80px" : "260px";
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const bg = useColorModeValue('gray.50', 'gray.900');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'practice', label: 'Practice Unit', icon: BookOpen },
        { id: 'stats', label: 'Performance', icon: BarChart2 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <Flex h="100vh" bg="bg" overflow="hidden">

            {/* Desktop Sidebar */}
            <Box
                display={{ base: 'none', md: 'block' }}
                w={sidebarWidth}
                h="full"
                bg="card"
                borderRight="1px solid"
                borderColor="border"
                transition="width 0.3s ease"
                py={6}
                px={isSidebarCollapsed ? 2 : 4}
                position="relative"
                zIndex={20}
            >
                {/* Logo Area */}
                <Flex align="center" mb={10} justify={isSidebarCollapsed ? 'center' : 'space-between'} px={2}>
                    {isSidebarCollapsed ? (
                        <Image src="/assets/favicon1.png" boxSize="32px" />
                    ) : (
                        <HStack spacing={3}>
                            <Box p={1.5} bg="brand.500" borderRadius="lg">
                                <Image src="/assets/favicon1.png" boxSize="24px" filter="brightness(0) invert(1)" />
                            </Box>
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="black" fontSize="lg" lineHeight="1">VOCALIS</Text>
                                <Text fontSize="2xs" color="textMuted" fontWeight="bold" letterSpacing="wider">BY LINGOTRAN</Text>
                            </VStack>
                        </HStack>
                    )}
                </Flex>

                {/* Navigation */}
                <VStack spacing={1} align="stretch" flex={1}>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                            isCollapsed={isSidebarCollapsed}
                        />
                    ))}
                </VStack>

                {/* User Profile at Bottom */}
                <Box mt="auto" pt={6} borderTop="1px solid" borderColor="border">
                    <Menu>
                        <MenuButton w="full">
                            <HStack spacing={3} p={2} borderRadius="xl" _hover={{ bg: 'bg' }} justify={isSidebarCollapsed ? 'center' : 'flex-start'}>
                                <Avatar size="sm" name={user?.name} src={user?.avatar} />
                                {!isSidebarCollapsed && (
                                    <Box textAlign="left" flex={1} minW={0}>
                                        <Text fontSize="sm" fontWeight="bold" noOfLines={1}>{user?.name}</Text>
                                        <Text fontSize="xs" color="textMuted" noOfLines={1}>Pro Member</Text>
                                    </Box>
                                )}
                            </HStack>
                        </MenuButton>
                        <MenuList borderRadius="xl" boxShadow="lg" p={2}>
                            <MenuItem fontSize="sm" icon={<LogOut size={16} />} onClick={logout} borderRadius="md" color="red.500">
                                Sign Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Flex flex={1} direction="column" h="full" position="relative" w="full" overflow="hidden">

                {/* Mobile Header */}
                <Flex
                    display={{ base: 'flex', md: 'none' }}
                    h="64px"
                    align="center"
                    justify="space-between"
                    px={4}
                    bg="card"
                    borderBottom="1px solid"
                    borderColor="border"
                >
                    <Image src="/assets/favicon1.png" boxSize="32px" />
                    <IconButton
                        icon={isMobileMenuOpen ? <X /> : <MenuIcon />}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        variant="ghost"
                    />
                </Flex>

                {/* Top Header (Desktop) */}
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    h="70px"
                    px={8}
                    align="center"
                    justify="space-between"
                    borderBottom="1px solid"
                    borderColor="transparent"
                >
                    <Text fontSize="xl" fontWeight="bold" color="text">
                        {navItems.find(i => i.id === activeTab)?.label}
                    </Text>

                    <HStack spacing={4}>
                        <IconButton
                            icon={<Bell size={20} />}
                            variant="ghost"
                            borderRadius="full"
                            color="textMuted"
                        />
                        <ThemeToggle />
                    </HStack>
                </Flex>

                {/* Content Scroll Area */}
                <Box flex={1} overflowY="auto" p={{ base: 0, md: 6 }} position="relative">
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
};

export default AppLayout;
