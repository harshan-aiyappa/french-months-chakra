import React from 'react';
import { Box, Text, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTerminal } from 'react-icons/fa';

const DeveloperAttribution = () => {
    const bg = useColorModeValue('whiteAlpha.800', 'blackAlpha.700');
    const borderColor = useColorModeValue('slate.200', 'whiteAlpha.300');

    return (
        <Box
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            position="fixed"
            bottom={{ base: "12px", md: "24px" }}
            right={{ base: "12px", md: "24px" }}
            zIndex={100}
        >
            <HStack
                bg={bg}
                backdropFilter="blur(12px) saturate(180%)"
                px={5}
                py={2.5}
                borderRadius="2xl"
                border="1px solid"
                borderColor={borderColor}
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                spacing={3}
                cursor="default"
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 12px 40px 0 rgba(99, 102, 241, 0.25)",
                    borderColor: "brand.300"
                }}
                transition="0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                as={motion.div}
            >
                <Box
                    p={1.5}
                    bg="brand.500"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    as={motion.div}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                    <Icon as={FaTerminal} color="white" boxSize={3} />
                </Box>
                <Box>
                    <Text
                        fontSize="10px"
                        fontWeight="black"
                        color="slate.400"
                        letterSpacing="2px"
                        textTransform="uppercase"
                        mb={-0.5}
                    >
                        Digital Architecture by
                    </Text>
                    <Text
                        fontSize="sm"
                        fontWeight="900"
                        bgGradient="linear(to-r, brand.600, accent.500)"
                        bgClip="text"
                        letterSpacing="tight"
                    >
                        Harshan Aiyappa
                    </Text>
                </Box>
            </HStack>
        </Box>
    );
};

export default DeveloperAttribution;
