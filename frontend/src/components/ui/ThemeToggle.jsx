import React from 'react';
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);

    return (
        <motion.div whileTap={{ scale: 0.9 }}>
            <IconButton
                size="sm"
                fontSize="lg"
                aria-label={`Switch to ${text} mode`}
                variant="ghost"
                color="current"
                onClick={toggleColorMode}
                icon={<SwitchIcon />}
                borderRadius="full"
                _hover={{
                    bg: useColorModeValue('blackAlpha.100', 'whiteAlpha.200'),
                }}
            />
        </motion.div>
    );
};

export default ThemeToggle;
