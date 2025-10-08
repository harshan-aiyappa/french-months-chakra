import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VStack, Heading, Text, Center, CircularProgress, HStack, Box, useToken } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const NUM_BARS = 7;
const CALIBRATION_TIME = 2000;
const CALIBRATION_SPEECH_THRESHOLD = 40;

const MotionBar = ({ height }) => (
  <Box
    as={motion.div}
    animate={{ height: `${height}%` }}
    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
    w="6px"
    minH="5px"
    bg="slate.200"
    borderRadius="full"
  />
);

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

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream; // Store the stream to clean it up
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        showToastOnce('success', 'Microphone Connected! (M-1)', 'Ready to listen.');
        calibrate();
      } catch (err) {
        let errorDetails = { id: 'M-3', title: 'No Microphone Found', desc: 'Please connect a mic.' };
        if (err.name === 'NotAllowedError') {
          errorDetails = { id: 'M-2', title: 'Access Denied', desc: 'Please allow mic access.' };
        }
        showToastOnce('error', `${errorDetails.title} (${errorDetails.id})`, errorDetails.desc);
      }
    };

    const calibrate = () => {
      showToast('info', 'Calibrating...', 'Please stay quiet.');
      let calibrationStart = Date.now();
      const noiseSamples = [];

      const calibrationLoop = () => {
        const elapsed = Date.now() - calibrationStart;
        setCalibrationProgress((elapsed / CALIBRATION_TIME) * 100);

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;

        if (average > CALIBRATION_SPEECH_THRESHOLD) {
          showToast('warning', 'Noise Detected!', 'Restarting calibration.');
          clearTimeout(calibrationTimerRef.current);
          noiseSamples.length = 0;
          calibrationStart = Date.now();
          calibrationTimerRef.current = setTimeout(finishCalibration, CALIBRATION_TIME);
        }
        
        noiseSamples.push(average);
        
        const newHeights = [];
        const sliceWidth = Math.floor(dataArray.length / NUM_BARS);
        for (let i = 0; i < NUM_BARS; i++) {
          newHeights.push(10 + (dataArray[i * sliceWidth] / 255) * 50);
        }
        setBarHeights(newHeights);
        
        animationFrameRef.current = requestAnimationFrame(calibrationLoop);
      };

      const finishCalibration = () => {
        cancelAnimationFrame(animationFrameRef.current);
        const averageNoise = noiseSamples.length > 0 ? noiseSamples.reduce((sum, val) => sum + val, 0) / noiseSamples.length : 10;
        const newThreshold = Math.max(20, averageNoise + 15);
        showToast('success', 'Calibration Complete!', `Threshold set to ${newThreshold.toFixed(0)}.`);
        onCalibrationComplete(newThreshold);
      };
      
      calibrationTimerRef.current = setTimeout(finishCalibration, CALIBRATION_TIME);
      calibrationLoop();
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(calibrationTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing audio context", e));
      }
    };
  }, [onCalibrationComplete, showToast, showToastOnce]);

  return (
    <VStack h={{ base: "200px", md: "220px" }} justify="center" spacing={4} p={6}>
      <Heading size="md" color="slate.600">Preparing Microphone...</Heading>
      <Center position="relative" h="100px" w="100px">
        <CircularProgress
          value={calibrationProgress}
          size="100px"
          thickness="4px"
          color="brand.400"
          trackColor="slate.100"
        />
        <HStack spacing={1.5} h="60px" w="100px" align="center" justify="center" position="absolute">
          {barHeights.map((height, i) => (
            <MotionBar key={i} height={height} />
          ))}
        </HStack>
      </Center>
      <Text color="slate.500" fontSize="sm">Calibrating...</Text>
    </VStack>
  );
};

export default CalibrationScreen;