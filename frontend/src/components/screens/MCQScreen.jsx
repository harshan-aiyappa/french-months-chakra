import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  Icon,
  VStack,
  HStack,
  IconButton // NEW
} from '@chakra-ui/react';

// Material Symbol Helper
const MaterialSymbol = ({ icon, className, fontSize = "24px", ...props }) => (
  <Box as="span" className={`material-symbols-outlined ${className || ''}`} fontSize={fontSize} {...props}>
    {icon}
  </Box>
);

const MCQScreen = ({ activity, onAnswer, onExit, currentIndex, total }) => {
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
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const cardBg = cardBgColor; // Fallback for HMR safety/caching issues
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    // In a real app, you might show feedback before moving on
    // For now, passing the result up
    // const isCorrect = selectedOption === correctAnswer;
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
        : { borderColor: useColorModeValue('gray.200', 'transparent'), bg: cardBgColor };
    }

    if (option === correctAnswer) {
      return { borderColor: 'green.400', bg: useColorModeValue('green.50', 'green.900'), color: useColorModeValue('green.700', 'green.200') };
    }
    if (selectedOption === option && selectedOption !== correctAnswer) {
      return { borderColor: 'red.400', bg: useColorModeValue('red.50', 'red.900'), color: useColorModeValue('red.700', 'red.200') };
    }
    return { borderColor: 'transparent', opacity: 0.5 };
  };

  // Rededigned Unified Layout
  return (
    <Flex direction="column" align="center" justify="center" minH="80vh" w="full" px={4}>

      {/* Unified Main Card */}
      <Box
        w="full"
        maxW="640px"
        bg={cardBgColor}
        borderRadius="3xl"
        p={{ base: 6, md: 8 }} // Tighter padding like GameScreen
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
        position="relative"
        overflow="hidden"
      >
        <VStack spacing={6} w="full">

          {/* Integrated Header: Exit & Progress */}
          <Flex w="full" justify="space-between" align="center" mb={2}>
            <IconButton
              icon={<MaterialSymbol icon="close" fontSize="24px" />}
              onClick={onExit}
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'red.500', bg: 'red.50' }}
              rounded="full"
              aria-label="Exit Practice"
            />

            <Text
              fontSize="sm"
              fontWeight="bold"
              color="gray.400"
              letterSpacing="wide"
            >
              {currentIndex + 1} / {total}
            </Text>
          </Flex>


          {/* Header Section */}
          <VStack spacing={4} textAlign="center">
            <Flex boxSize="12" bg="brand.50" borderRadius="full" align="center" justify="center" color="brand.500">
              <MaterialSymbol icon="quiz" fontSize="28px" />
            </Flex>
            <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={headingColor} lineHeight="1.2">
              Which IPA matches <br />
              <Text as="span" color="brand.500" fontStyle="italic">'{word}'</Text>?
            </Heading>
            <Text fontSize="md" color={textColor}>
              Select the correct phonetic notation.
            </Text>
          </VStack>

          {/* Audio Playback Controls */}
          <HStack spacing={4}>
            <Button
              leftIcon={<MaterialSymbol icon="volume_up" fontSize="22px" />}
              size="md"
              bg="brand.500"
              color="white"
              borderRadius="full"
              px={6}
              _hover={{ bg: 'brand.600', transform: 'translateY(-2px)', boxShadow: 'lg' }}
              _active={{ transform: 'translateY(0)' }}
              boxShadow="md"
              onClick={() => {
                const u = new SpeechSynthesisUtterance(word);
                u.lang = "en-US"; // Or dynamic language if available
                window.speechSynthesis.speak(u);
              }}
            >
              Play Sound
            </Button>
          </HStack>

          {/* Options List */}
          <VStack w="full" spacing={3}>
            {options.map((option, idx) => {
              const style = getOptionStyle(option);
              return (
                <Button
                  key={idx}
                  w="full"
                  h="auto"
                  py={4}
                  px={6}
                  justifyContent="space-between"
                  bg={style.bg || "transparent"} // Explicit fallback
                  border="2px solid"
                  borderColor={style.borderColor}
                  borderRadius="xl"
                  _hover={{ borderColor: 'brand.400', bg: useColorModeValue('brand.50', 'whiteAlpha.100') }}
                  onClick={() => !isSubmitted && setSelectedOption(option)}
                  transition="all 0.2s"
                  position="relative"
                >
                  <HStack>
                    <Box
                      boxSize="8"
                      borderRadius="full"
                      border="2px solid"
                      color="gray.400"
                      fontSize="xs"
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={selectedOption === option ? "brand.500" : "transparent"}
                      borderColor={selectedOption === option ? "brand.500" : "gray.200"}
                    >
                      {selectedOption === option ? <MaterialSymbol icon="check" color="white" fontSize="16px" /> : String.fromCharCode(65 + idx)}
                    </Box>
                    <Text fontSize="lg" fontWeight="semibold" color={headingColor} ml={2}>
                      {option}
                    </Text>
                  </HStack>

                  {/* Result Icon */}
                  {isSubmitted && (
                    <Box>
                      {option === correctAnswer ? (
                        <MaterialSymbol icon="check_circle" color="green.500" fontSize="24px" />
                      ) : selectedOption === option ? (
                        <MaterialSymbol icon="cancel" color="red.500" fontSize="24px" />
                      ) : null}
                    </Box>
                  )}
                </Button>
              );
            })}
          </VStack>

          {/* Footer Actions */}
          <Box w="full" pt={6} borderTop="1px solid" borderColor={borderColor}>
            <Flex justify="space-between" align="center" w="full">
              <Button variant="ghost" color="gray.400" fontSize="sm" onClick={() => onAnswer(false)}>
                Skip
              </Button>

              <Button
                size="lg"
                bg="brand.500"
                color="white"
                px={8}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
                isLoading={false}
                rightIcon={<MaterialSymbol icon={isSubmitted ? "arrow_forward" : "check"} />}
                onClick={isSubmitted ? handleNext : handleCheck}
                isDisabled={!selectedOption && !isSubmitted}
              >
                {isSubmitted ? "Continue" : "Check Answer"}
              </Button>
            </Flex>
          </Box>

        </VStack>
      </Box>

      {/* Hint Text outside card */}
      <Flex align="center" gap={2} mt={6} color="gray.400" fontSize="xs">
        <MaterialSymbol icon="info" fontSize="16px" />
        <Text>Tip: Select the option that best matches the audio.</Text>
      </Flex>

    </Flex>
  );
};

export default MCQScreen;