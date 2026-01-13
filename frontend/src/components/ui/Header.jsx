import React from 'react';
import { Box, Flex, Heading, Text, Progress, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header = ({ score, total, progress }) => {
  const logoSrc = '/assets/favicon1.png';

  return (
    <Box
      as={motion.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      textAlign="center"
      w="100%"
      p={{ base: 3, md: 4 }}
      bg="whiteAlpha.100"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      border="1px solid"
      borderColor="whiteAlpha.300"
      boxShadow="glass"
      mb={{ base: 2, md: 4 }}
      position="relative"
    >
      <Box position="absolute" top={{ base: 2, md: 4 }} right={{ base: 2, md: 4 }} zIndex="docked">
        <ThemeToggle />
      </Box>

      <Flex justify="center" align="center" mb={{ base: 2, md: 3 }}>
        <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
          <Image src={logoSrc} alt="Lingotran Logo" boxSize={{ base: "30px", md: "40px" }} mr={3} borderRadius="xl" />
        </motion.div>
        <Box textAlign="left">
          <Heading as="h1" size={{ base: "sm", md: "md" }} color="text" letterSpacing="tight">French Months Unit</Heading>
          <Text fontSize={{ base: "2xs", md: "xs" }} color="textMuted" fontWeight="medium">
            Powered by <Text as="span" color="brand.500" fontWeight="bold">Lingotran</Text>
          </Text>
        </Box>
      </Flex>
      <Progress
        value={progress}
        size="xs"
        colorScheme="brand"
        borderRadius="full"
        mb={2}
        hasStripe
        isAnimated
      />
      <Flex justify="space-between" align="center">
        <Text color="textMuted" fontSize={{ base: "2xs", md: "xs" }} fontWeight="semibold">Progress</Text>
        <Text fontWeight="bold" color="brand.600" fontSize={{ base: "xs", md: "sm" }}>Accuracy: {score}/{total}</Text>
      </Flex>
    </Box>
  );
};

export default Header;