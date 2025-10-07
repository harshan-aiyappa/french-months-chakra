import React, { useEffect, useRef, useCallback, useState } from 'react';
import { HStack, Box, useToken, Center, CircularProgress } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const NUM_BARS = 11;
const CALIBRATION_TIME = 2000;
const CALIBRATION_SPEECH_THRESHOLD = 40;

const MotionBar = ({ height, background, boxShadow, delay, isCalibrating }) => {
  const spring = isCalibrating
    ? { type: 'tween', ease: 'linear', duration: 0.1 }
    : { type: 'spring', stiffness: 500, damping: 25, delay };

  return (
    <Box
      as={motion.div}
      animate={{ height: `${height}%`, background, boxShadow }}
      transition={spring}
      w={isCalibrating ? '6px' : '8px'}
      minH="5px"
      borderRadius="full"
    />
  );
};

const MicVisualizer = ({ 
  isListening, 
  setIsSpeaking, 
  setMicError, 
  showToast, 
  onCalibrationComplete, 
  dynamicThreshold 
}) => {
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const calibrationTimerRef = useRef(null);

  const [barHeights, setBarHeights] = useState(Array(NUM_BARS).fill(5));
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isVisuallySpeaking, setIsVisuallySpeaking] = useState(false);
  const [isMicReady, setIsMicReady] = useState(false);

  const isCalibrationMode = !!onCalibrationComplete;

  const [inactiveColor, readyColor, activeColor1, activeColor2, indicatorColor] = useToken('colors', [
    'slate.200', 'brand.300', 'brand.400', 'accent.400', 'accent.500',
  ]);
  const activeGradient = `linear-gradient(to top, ${activeColor1}, ${activeColor2})`;
  const showToastOnce = useCallback((...args) => { showToast && showToast(...args) }, [showToast]);

  useEffect(() => {
    let analyser;
    let dataArray;

    const setupAudio = async () => {
      if (window.micStream) {
        streamRef.current = window.micStream;
      } else {
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          window.micStream = streamRef.current;
        } catch (err) {
          let errorDetails = { id: 'E-X', title: 'Microphone Error', desc: 'Could not access the microphone.' };
          if (err.name === 'NotFoundError') { errorDetails = { id: 'M-3', title: 'No Microphone Found', desc: 'Please connect a mic.' }; }
          else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { errorDetails = { id: 'M-2', title: 'Access Denied', desc: 'Please allow mic access.' }; }
          if (setMicError) setMicError(errorDetails.desc);
          showToastOnce('error', `${errorDetails.title} (${errorDetails.id})`, errorDetails.desc);
          return;
        }
      }
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        const source = audioContext.createMediaStreamSource(streamRef.current);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        showToastOnce('success', 'Microphone Connected! (M-1)', 'Ready to listen.');
        
        if (isCalibrationMode) {
          calibrate();
        } else {
          setIsMicReady(true);
          visualize(dynamicThreshold);
        }
      } catch (e) {
        console.error("Audio context error", e);
        if (setMicError) setMicError("Audio context failed to start.");
      }
    };
    
    const calibrate = () => {
      showToast('info', 'Calibrating...', 'Please stay quiet.');
      let calibrationStart = Date.now();
      const noiseSamples = [];

      const calibrationLoop = () => {
        if (!isCalibrationMode) return;
        
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
          const height = 10 + (dataArray[i * sliceWidth] / 255) * 50;
          newHeights.push(height);
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

    const visualize = (threshold) => {
      const update = () => {
        if (!analyser || isCalibrationMode) return;
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        const isCurrentlySpeaking = average > threshold;
        if(setIsSpeaking) setIsSpeaking(isCurrentlySpeaking && isListening);
        setIsVisuallySpeaking(isCurrentlySpeaking);
        const newHeights = [];
        const sliceWidth = Math.floor(dataArray.length / NUM_BARS);
        for (let i = 0; i < NUM_BARS; i++) {
          const baseHeight = (dataArray[i * sliceWidth] / 255) * 80;
          const finalHeight = 5 + baseHeight + (isCurrentlySpeaking && isListening ? 15 : 0);
          newHeights.push(Math.min(100, finalHeight));
        }
        setBarHeights(newHeights);
        animationFrameRef.current = requestAnimationFrame(update);
      };
      update();
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(calibrationTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing audio context", e));
      }
    };
  }, [onCalibrationComplete, setMicError, setIsSpeaking, isListening, showToast, showToastOnce, dynamicThreshold, activeGradient, indicatorColor, inactiveColor, readyColor]);

  if (isCalibrationMode) {
    return (
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
            <MotionBar key={i} height={height} background={inactiveColor} isCalibrating={true} />
          ))}
        </HStack>
      </Center>
    );
  }

  return (
    <HStack spacing={1.5} h="60px" w="120px" mx="auto" align="flex-end" justify="center">
      <AnimatePresence>
        {barHeights.map((height, i) => {
          let background = inactiveColor;
          let boxShadow = 'none';
          if (isMicReady) {
            const isThresholdMet = height > (dynamicThreshold * 2.5);
            if (isListening && isVisuallySpeaking) { background = activeGradient; } 
            else { background = readyColor; }
            if (isThresholdMet) { boxShadow = `inset 0 6px 8px -2px ${indicatorColor}`; }
          }
          return ( <MotionBar key={i} height={height} background={background} boxShadow={boxShadow} delay={`${i * 15}ms`} isCalibrating={false} /> );
        })}
      </AnimatePresence>
    </HStack>
  );
};

export default MicVisualizer;