import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VStack, Heading, Text, Center, HStack, Box, Button, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const NUM_BARS = 24;
const CALIBRATION_TIME = 2500; // 2.5s calibration window
const SILENCE_THRESHOLD = 50;  // Threshold for "too loud" during calibration

// Material Symbol Helper
const MaterialSymbol = ({ icon, fontSize = "24px", ...props }) => (
  <Box as="span" className={`material-symbols-outlined`} fontSize={fontSize} {...props}>
    {icon}
  </Box>
);

const CalibrationScreen = ({ onCalibrationComplete, showToast }) => {
  const [dbLevel, setDbLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTooLoud, setIsTooLoud] = useState(false);

  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Theme colors
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    let isMounted = true;
    let localStream = null;
    let localContext = null;
    let localAnimationId = null;

    let calibrationStart = Date.now();
    let noiseSamples = [];

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = stream;
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        localContext = audioContext;
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        processAudio();
      } catch (err) {
        console.error("Audio init error:", err);
        if (isMounted) {
          showToast('error', 'Mic Check Failed', 'Could not access microphone. Verify permissions.');
        }
      }
    };

    const processAudio = () => {
      if (!analyserRef.current || !isMounted) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      if (isMounted) setDbLevel(average);

      const elapsed = Date.now() - calibrationStart;
      const progressPercent = Math.min((elapsed / CALIBRATION_TIME) * 100, 100);
      if (isMounted) setProgress(progressPercent);

      if (average > SILENCE_THRESHOLD) {
        if (isMounted) setIsTooLoud(true);
        calibrationStart = Date.now();
        noiseSamples = [];
      } else {
        if (isMounted) setIsTooLoud(false);
        noiseSamples.push(average);
      }

      if (elapsed < CALIBRATION_TIME) {
        localAnimationId = requestAnimationFrame(processAudio);
        animationRef.current = localAnimationId;
      } else {
        finishCalibration(noiseSamples);
      }
    };

    const finishCalibration = (samples) => {
      // Logic handled by main cleanup or transition, but we can stop tracks here too if we want
      // Actually, standard behavior is to just notify parent. 
      // Parent will unmount us, triggering cleanup.

      const avgNoise = samples.reduce((a, b) => a + b, 0) / samples.length;
      const threshold = Math.max(avgNoise * 2.5, 30);

      console.log(`[Calibration] Avg Noise: ${avgNoise.toFixed(2)}, Threshold: ${threshold.toFixed(2)}`);
      onCalibrationComplete(threshold);
    };

    initAudio();

    return () => {
      isMounted = false;
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      if (localContext) {
        localContext.close().catch(e => console.warn(e));
      }
      if (localAnimationId) {
        cancelAnimationFrame(localAnimationId);
      }
      // Clear refs suitable
      streamRef.current = null;
      audioContextRef.current = null;
    };
  }, [onCalibrationComplete, showToast]);

  return (
    <Center h="full" w="full" p={6}>
      <Box
        p={{ base: 6, md: 10 }}
        borderRadius="3xl"
        textAlign="center"
        maxW="640px" // Matched to GameScreen
        w="full"
        position="relative"
        overflow="hidden"
        bg={cardBg}
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <Box
          position="absolute"
          top="50%" left="50%"
          transform="translate(-50%, -50%)"
          w="300px" h="300px"
          bg={isTooLoud ? "red.500" : "brand.500"}
          opacity="0.15"
          filter="blur(60px)"
          borderRadius="full"
          pointerEvents="none"
          transition="background-color 0.3s"
        />

        <VStack spacing={6} position="relative" zIndex={2}>
          <Box
            boxSize="20"
            borderRadius="full"
            bg={isTooLoud ? "red.500" : "brand.500"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={`0 0 ${dbLevel}px ${isTooLoud ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`}
            transition="all 0.1s"
          >
            <MaterialSymbol
              icon={isTooLoud ? "graphic_eq" : "mic"}
              fontSize="40px"
              color="white"
            />
          </Box>

          <Box>
            <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={headingColor} mb={2}>
              {isTooLoud ? "Too Noisy!" : "Calibrating Environment"}
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }} color={textColor}>
              {isTooLoud
                ? "Please stay silent. Adjusting for background noise..."
                : "Please remain silent while we calibrate to your environment."}
            </Text>
          </Box>

          <HStack spacing={1} h="60px" align="flex-end" w="full" justify="center">
            {Array.from({ length: NUM_BARS }).map((_, i) => {
              const barHeight = Math.random() * dbLevel * 0.8 + 10;
              return (
                <motion.div
                  key={i}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.1 }}
                  style={{
                    width: `${100 / NUM_BARS}%`,
                    backgroundColor: isTooLoud ? '#EF4444' : '#6366F1',
                    borderRadius: '4px',
                    opacity: 0.7,
                  }}
                />
              );
            })}
          </HStack>

          <Box w="full" h="2" bg={useColorModeValue('gray.100', 'whiteAlpha.200')} borderRadius="full" overflow="hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              style={{
                height: '100%',
                backgroundColor: isTooLoud ? '#EF4444' : '#6366F1',
                borderRadius: '9999px',
              }}
            />
          </Box>

          <Text fontSize="xs" color={textColor} fontWeight="medium">
            {Math.round(progress)}% Complete
          </Text>
        </VStack>
      </Box>
    </Center>
  );
};

export default CalibrationScreen;