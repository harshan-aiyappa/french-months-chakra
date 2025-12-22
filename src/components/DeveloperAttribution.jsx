import React from 'react';
import { Box, Text, HStack, Icon, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCode } from 'react-icons/fa';

const DeveloperAttribution = () => {
    return (
        <Box
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            position="fixed"
            bottom={{ base: "10px", md: "20px" }}
            right={{ base: "10px", md: "20px" }}
            zIndex={100}
        >
            <HStack
                bg="whiteAlpha.700"
                backdropFilter="blur(10px)"
                px={4}
                py={2}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.400"
                boxShadow="glass"
                spacing={2}
                cursor="default"
                whileHover={{ scale: 1.05, bg: "whiteAlpha.900" }}
                transition="0.3s ease-in-out"
                as={motion.div}
            >
                <Icon as={FaCode} color="brand.500" boxSize={3} />
                <Text fontSize="xs" fontWeight="bold" color="slate.600" letterSpacing="wider">
                    CRAFTED BY{" "}
                    <Text
                        as="span"
                        color="brand.600"
                        bgGradient="linear(to-r, brand.600, accent.500)"
                        bgClip="text"
                        fontWeight="black"
                    >
                        HARSHAN AIYAPPA
                    </Text>
                </Text>
            </HStack>
        </Box>
    );
};

export default DeveloperAttribution;
