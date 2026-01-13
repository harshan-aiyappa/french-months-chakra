import React from 'react';
import { Box, Flex, Heading, Text, Progress, Image, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header = ({ score, total, progress, onExit }) => {
  const logoSrc = '/assets/favicon1.png';
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Minimal Header - Navigation Only
  return (
    <Box
      as={motion.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      w="full"
      maxW="1200px"
      mx="auto"
      mt={{ base: 2, md: 4 }}
      mb={{ base: 2, md: 4 }}
      px={{ base: 2, md: 4 }}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      {/* Left: Exit/Back */}
      {onExit ? (
        <Box
          as="button"
          onClick={onExit}
          p={2}
          borderRadius="full"
          transition="all 0.2s"
          _hover={{ bg: 'blackAlpha.100' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.500"
        >
          <Box as="span" className="material-symbols-outlined" fontSize="24px">
            arrow_back
          </Box>
        </Box>
      ) : <Box w="40px" />}

      {/* Right: Empty for now (Removed ThemeToggle as requested to keep minimal) */}
      <Box w="40px" />
    </Box>
  );
};

export default Header;