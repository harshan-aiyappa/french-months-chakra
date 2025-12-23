import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VStack, Heading, Text, Center, CircularProgress, HStack, Box, useToken } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const NUM_BARS = 7;
const CALIBRATION_TIME = 2000; // Industry standard for threshold sampling
const CALIBRATION_SPEECH_THRESHOLD = 50; // Higher threshold during calibration

const MotionBar = React.memo(({ height }) => (
  <Box
    as={motion.div}
    animate={{ height: `${height}%` }}
    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
    w="6px"
    minH="5px"
    bg="textMuted"
    borderRadius="full"
  />
));

const CalibrationScreen = ({ onCalibrationComplete, showToast }) => {
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const calibrationTimerRef = useRef(null);

  const [barHeights, setBarHeights] = useState(Array(NUM_BARS).fill(5));
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const showToastOnce = useCallback((...args) => { showToast(...args) }, [showToast]);

  useEffect(() => {
    let analyser;
    let dataArray;
    let animationId;

    const setupAudio = async () => {
      if (window.isSecureContext === false) {
        showToastOnce('error', 'Insecure Context (M-5)', 'Microphone access is disabled on non-secure (HTTP) pages.');
        return;
      }

      try {
        const stream = window.micStream || await navigator.mediaDevices.getUserMedia({ audio: true });
        window.micStream = stream;
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        audioContextRef.current = audioContext;
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        showToastOnce('success', 'Microphone Ready (M-1)', 'Starting background noise calibration.');
        calibrate();
      } catch (err) {
        console.error("[Calibration] Error:", err);
        showToastOnce('error', 'Mic Error (M-3)', 'Could not access microphone.');
      }
    };

    const calibrate = () => {
      let calibrationStart = Date.now();
      const noiseSamples = [];
      const sliceWidth = Math.floor(dataArray.length / NUM_BARS);

      const calibrationLoop = () => {
        const elapsed = Date.now() - calibrationStart;
        setCalibrationProgress(Math.min(100, (elapsed / CALIBRATION_TIME) * 100));

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;

        // Reset if it's too noisy
        if (average > CALIBRATION_SPEECH_THRESHOLD) {
          showToast('warning', 'Noise Detected!', 'Please stay quiet during calibration.');
          noiseSamples.length = 0;
          calibrationStart = Date.now();
        }

        noiseSamples.push(average);

        const newHeights = [];
        for (let i = 0; i < NUM_BARS; i++) {
          newHeights.push(10 + (dataArray[i * sliceWidth] / 255) * 50);
        }
        setBarHeights(newHeights);

        if (elapsed < CALIBRATION_TIME) {
          animationId = requestAnimationFrame(calibrationLoop);
        } else {
          finishCalibration();
        }
      };

      const finishCalibration = () => {
        cancelAnimationFrame(animationId);
        const averageNoise = noiseSamples.length > 0
          ? noiseSamples.reduce((sum, val) => sum + val, 0) / noiseSamples.length
          : 15;
        // Ensure a healthy noise floor with a standard +10 margin
        const newThreshold = Math.max(30, averageNoise + 10);
        showToast('success', 'Optimized!', `Background noise filtered. Threshold set to ${newThreshold.toFixed(0)}.`);
        onCalibrationComplete(newThreshold);
      };

      calibrationLoop();
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationId);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.log(e));
      }
    };
  }, [onCalibrationComplete, showToast, showToastOnce]);

  return (
    <VStack h={{ base: "200px", md: "220px" }} justify="center" spacing={4} p={6}>
      <Heading size={{ base: "sm", md: "md" }} color="text">Calibrating Audio...</Heading>
      <Center position="relative" h="100px" w="100px">
        <CircularProgress
          value={calibrationProgress}
          size="100px"
          thickness="4px"
          color="brand.400"
          trackColor="border"
          opacity={0.3}
        />
        <HStack spacing={1.5} h="60px" w="100px" align="center" justify="center" position="absolute">
          {barHeights.map((height, i) => (
            <MotionBar key={i} height={height} />
          ))}
        </HStack>
      </Center>
      <Text color="textMuted" fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" letterSpacing="widest">SILENCE REQUIRED</Text>
    </VStack>
  );
};

export default CalibrationScreen;