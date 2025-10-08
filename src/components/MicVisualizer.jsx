import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HStack, Box, useToken } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const NUM_BARS = 11;
const VOICE_THRESHOLD = 25; // Default threshold used for visual cues

const MotionBar = ({ height, background, boxShadow, delay }) => (
  <Box
    as={motion.div}
    animate={{ height: `${height}%`, background, boxShadow }}
    transition={{ type: 'spring', stiffness: 500, damping: 25, delay }}
    w="8px"
    minH="5px"
    borderRadius="full"
  />
);

const MicVisualizer = ({ isListening, setIsSpeaking, setMicError, dynamicThreshold = VOICE_THRESHOLD }) => {
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  const [barHeights, setBarHeights] = useState(Array(NUM_BARS).fill(5));
  const [isVisuallySpeaking, setIsVisuallySpeaking] = useState(false);
  const [isMicReady, setIsMicReady] = useState(false);

  const [inactiveColor, readyColor, activeColor1, activeColor2, indicatorColor] = useToken('colors', [
    'slate.200', 'brand.300', 'brand.400', 'accent.400', 'accent.500',
  ]);
  const activeGradient = `linear-gradient(to top, ${activeColor1}, ${activeColor2})`;

  useEffect(() => {
    let analyser;
    let dataArray;

    const setupAudio = async () => {
      // This robust logic ensures the mic stream is requested only if needed.
      if (!window.micStream) {
        try {
          window.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          if (setMicError) {
             let errorDetails = { desc: 'Could not access the microphone.' };
             if (err.name === 'NotFoundError') { errorDetails = { desc: 'Please connect a mic.' }; }
             else if (err.name === 'NotAllowedError') { errorDetails = { desc: 'Please allow mic access.' }; }
             setMicError(errorDetails.desc);
          }
          return;
        }
      }
      streamRef.current = window.micStream;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        const source = audioContext.createMediaStreamSource(streamRef.current);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        setIsMicReady(true);
        visualize(dynamicThreshold);
      } catch (e) {
        console.error("Audio context error", e);
        if(setMicError) setMicError("Audio context failed to start.");
      }
    };
    
    const visualize = (threshold) => {
      const update = () => {
        if (!analyser) return;
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
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing audio context", e));
      }
    };
  }, [setMicError, setIsSpeaking, isListening, dynamicThreshold]);

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