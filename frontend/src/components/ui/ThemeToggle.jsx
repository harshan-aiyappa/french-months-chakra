import React from 'react';
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';

// Material Symbol Helper
const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
    <span className="material-symbols-outlined" style={{ fontSize, ...props }}>
        {icon}
    </span>
);

const ThemeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const icon = useColorModeValue('dark_mode', 'light_mode');

    return (
        <IconButton
            aria-label="Toggle theme"
            icon={<MaterialSymbol icon={icon} />}
            onClick={toggleColorMode}
            variant="ghost"
            color={useColorModeValue('gray.600', 'gray.400')}
            _hover={{
                bg: useColorModeValue('gray.100', 'whiteAlpha.100'),
                color: useColorModeValue('gray.900', 'white')
            }}
            borderRadius="full"
            size="md"
        />
    );
};

export default ThemeToggle;
