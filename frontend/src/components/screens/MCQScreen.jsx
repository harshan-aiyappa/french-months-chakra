import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';

// Material Symbol Helper
const MaterialSymbol = ({ icon, className, fontSize = "24px", ...props }) => (
  <Box as="span" className={`material-symbols-outlined ${className || ''}`} fontSize={fontSize} {...props}>
    {icon}
  </Box>
);

const MCQScreen = ({ activity, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Activity Data
  const question = activity.question || "Identify the correct phonetic transcription for: 'Ambition'";
  const word = activity.word || "Ambition";
  const options = activity.options || ["/æmˈbɪʃ.ən/", "/æmˈbi.ʃən/", "/ɑːmˈbɪʃ.ən/", "/æmˈbiː.ʒən/"];
  const correctAnswer = activity.answer || "/æmˈbɪʃ.ən/";

  // Theme colors
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'whiteAlpha.50');

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    // In a real app, you might show feedback before moving on
    // For now, passing the result up
    const isCorrect = selectedOption === correctAnswer;
    // setTimeout(() => onAnswer(isCorrect), 1000); 
    // Or wait for user to click "Next"
  };

  const handleNext = () => {
    const isCorrect = selectedOption === correctAnswer;
    onAnswer(isCorrect);
  };

  const getOptionStyle = (option) => {
    if (!isSubmitted) {
      return selectedOption === option
        ? { borderColor: 'brand.500', bg: useColorModeValue('brand.50', 'whiteAlpha.100'), shadow: 'md' }
        : { borderColor: useColorModeValue('gray.200', 'transparent'), bg: cardBg };
    }

    if (option === correctAnswer) {
      return { borderColor: 'green.400', bg: useColorModeValue('green.50', 'green.900'), color: useColorModeValue('green.700', 'green.200') };
    }
    if (selectedOption === option && selectedOption !== correctAnswer) {
      return { borderColor: 'red.400', bg: useColorModeValue('red.50', 'red.900'), color: useColorModeValue('red.700', 'red.200') };
    }
    return { borderColor: 'transparent', opacity: 0.5 };
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="80vh" w="full" maxW="840px" mx="auto" px={{ base: 4, md: 6 }}>
      {/* Header / Progress */}
      <Box w="full" mb={8}>
        <Flex justify="space-between" align="end" mb={3}>
          <Box>
            <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={headingColor}>Phonetic Matching Unit</Heading>
            <Text fontSize="sm" color={textColor}>Advanced Pronunciation Course</Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="lg" fontWeight="bold" color="brand.500">65%</Text>
            <Text fontSize="xs" color="gray.400">Question {activity.index !== undefined ? activity.index + 1 : 1} of 12</Text>
          </Box>
        </Flex>
        <Box h="2.5" w="full" bg="gray.200" borderRadius="full" overflow="hidden">
          <Box h="full" bg="brand.500" w="65%" boxShadow="0 0 10px rgba(89,76,230,0.3)" />
        </Box>
      </Box>

      {/* Question Card */}
      <Box
        w="full"
        borderRadius="2xl"
        overflow="hidden"
        p={1}
        boxShadow="xl"
        bg={glassBg}
        backdropFilter="blur(16px)"
        mb={6}
      >
        <Box
          bgImage="linear-gradient(0deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBv3f5KyfeDGzf_SYIIdPVaOLxYuo61TdKye5OhBeKHgiSLzSLFK5Yq6uLXdgwevXnYYTfEDm7OXoR5gaJYdXxOF_PMWxoECpcbAtNWGf3xIUm8-nHPQvBbi2zD0gtgkhN5cr3fgYk4VTRh0zlBhsjUKdEC1kf0aQjI5w3TBMl5gcasQTAwSp_Qift9PhD67V4q0nPXjBIZkE8i0r0GPq2aBh6p_nWWMf7OW6aOyKE5oSQcEAXXRY8uBUTYUZqzLE8-K9tjhMhPC1Mg')"
          bgSize="cover"
          bgPos="center"
          minH="260px"
          borderRadius="xl"
          p={8}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Flex align="center" gap={3} mb={5}>
            <Flex boxSize="10" bg="indigo.50" borderRadius="full" align="center" justify="center">
              <MaterialSymbol icon="graphic_eq" color="#594ce6" fontSize="20px" />
            </Flex>
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" color="brand.600">
              Listening Challenge
            </Text>
          </Flex>

          <Box>
            <Heading fontSize="3xl" fontWeight="bold" lineHeight="tight" color="slate.900">
              Identify the correct phonetic transcription for: <Text as="span" color="brand.600" fontStyle="italic">'{word}'</Text>
            </Heading>
            <Text fontSize="lg" fontWeight="medium" color="slate.600" mt={2}>
              Listen to the native pronunciation and select the matching IPA symbols.
            </Text>
          </Box>

          <Flex gap={4} mt={6}>
            <Button
              leftIcon={<MaterialSymbol icon="play_circle" />}
              bg="brand.500"
              color="white"
              borderRadius="full"
              px={6}
              _hover={{ bg: 'brand.600' }}
              shadow="lg"
            >
              Listen Again
            </Button>
            <Button
              leftIcon={<MaterialSymbol icon="slow_motion_video" />}
              bg="white"
              color="slate.700"
              borderRadius="full"
              px={6}
              border="1px solid"
              borderColor="indigo.100"
              _hover={{ bg: 'gray.50' }}
            >
              0.5x Speed
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* Options Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
        {options.map((option, idx) => (
          <Button
            key={idx}
            h="auto"
            py={6}
            px={6}
            justifyContent="space-between"
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="indigo.50"
            _hover={{ transform: 'translateY(-2px)', shadow: 'md', borderColor: 'brand.200' }}
            onClick={() => !isSubmitted && setSelectedOption(option)}
            sx={{ ...getOptionStyle(option), transition: 'all 0.3s' }}
          >
            <Flex direction="column" align="flex-start" gap={1}>
              <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" color="gray.400">
                Option {String.fromCharCode(65 + idx)}
              </Text>
              <Text fontSize="2xl" fontWeight="semibold" color="slate.800">
                {option}
              </Text>
            </Flex>

            <Flex
              boxSize="8"
              borderRadius="full"
              border="2px solid"
              borderColor={isSubmitted && option === correctAnswer ? 'green.400' : 'indigo.50'}
              bg="white"
              align="center"
              justify="center"
            >
              {isSubmitted ? (
                option === correctAnswer ? <MaterialSymbol icon="check" color="green.500" fontSize="16px" /> :
                  (selectedOption === option ? <MaterialSymbol icon="close" color="red.500" fontSize="16px" /> : null)
              ) : (
                selectedOption === option && <Box boxSize="3" bg="brand.500" borderRadius="full" />
              )}
            </Flex>
          </Button>
        ))}
      </SimpleGrid>

      {/* Actions */}
      <Flex mt={8} w="full" justify="center" gap={4}>
        {!isSubmitted ? (
          <>
            <Button variant="ghost" color="gray.500" fontWeight="bold" onClick={() => onAnswer(false)}>Skip Question</Button>
            <Button
              bg="brand.500"
              color="white"
              size="lg"
              px={10}
              borderRadius="xl"
              boxShadow="xl"
              _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
              onClick={handleCheck}
              isDisabled={!selectedOption}
            >
              Check Answer
            </Button>
          </>
        ) : (
          <Button
            bg="brand.500"
            color="white"
            size="lg"
            px={10}
            borderRadius="xl"
            boxShadow="xl"
            _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
            onClick={handleNext}
            rightIcon={<MaterialSymbol icon="arrow_forward" />}
          >
            Continue
          </Button>
        )}
      </Flex>

      <Flex align="center" gap={2} mt={6} color="gray.400" fontSize="sm">
        <MaterialSymbol icon="lightbulb" fontSize="18px" color="brand.400" />
        <Text>Tip: The symbol /ʃ/ represents the 'sh' sound in English.</Text>
      </Flex>
    </Flex>
  );
};

export default MCQScreen;