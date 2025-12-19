import React from 'react';
import { Box, Flex, Heading, Text, Progress, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

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
      p={4}
      bg="whiteAlpha.100"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      border="1px solid"
      borderColor="whiteAlpha.300"
      boxShadow="glass"
      mb={6}
    >
      <Flex justify="center" align="center" mb={4}>
        <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
          <Image src={logoSrc} alt="Lingotran Logo" boxSize="45px" mr={4} borderRadius="xl" />
        </motion.div>
        <Box textAlign="left">
          <Heading as="h1" size={{ base: "sm", md: "md" }} color="slate.800" letterSpacing="tight">French Months Unit</Heading>
          <Text fontSize={{ base: "2xs", md: "xs" }} color="slate.500" fontWeight="medium">
            Powered by <Text as="span" color="brand.500" fontWeight="bold">Lingotran</Text>
          </Text>
        </Box>
      </Flex>
      <Progress
        value={progress}
        size="xs"
        colorScheme="brand"
        borderRadius="full"
        mb={3}
        hasStripe
        isAnimated
      />
      <Flex justify="space-between" align="center">
        <Text color="slate.500" fontSize={{ base: "2xs", md: "xs" }} fontWeight="semibold">Progress</Text>
        <Text fontWeight="bold" color="brand.600" fontSize={{ base: "xs", md: "sm" }}>Accuracy: {score}/{total}</Text>
      </Flex>
    </Box>
  );
};

export default Header;