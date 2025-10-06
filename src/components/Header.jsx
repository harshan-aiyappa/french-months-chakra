import React from 'react';
import { Box, Flex, Heading, Text, Progress, Image } from '@chakra-ui/react';
// THE FIX (Part 1): The logo imports are REMOVED from here.

const Header = ({ score, total, progress }) => {
  // THE FIX (Part 2): We now use a direct, absolute path to the image in the 'public' folder.
  // This path works for both development and the final Vercel build.
  const logoSrc = '/assets/favicon1.png';

  return (
    <Box as="header" textAlign="center" w="100%">
      <Flex justify="center" align="center" mb={4}>
        <Image src={logoSrc} alt="Lingotran Logo" boxSize="40px" mr={3} />
        <Box textAlign="left">
          <Heading as="h1" size="md" color="slate.800">French Months Unit</Heading>
          <Text fontSize="xs" color="slate.500">
            Powered by <Text as="span" color="brand.500" fontWeight="bold">Lingotran</Text>
          </Text>
        </Box>
      </Flex>
      <Text color="slate.600" mb={4} fontSize="sm">Complete all activities in the unit.</Text>
      <Progress value={progress} size="sm" colorScheme="brand" borderRadius="full" mb={2} />
      <Text fontWeight="bold" color="brand.500" fontSize="sm">Score: {score}/{total}</Text>
    </Box>
  );
};

export default Header;