import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { HStack, Box, useToken } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const NUM_BARS = 11;
const VOICE_THRESHOLD = 30; // Increased base threshold
const SPEAKING_DEBOUNCE = 100; // ms

const MotionBar = React.memo(({ height, backgroundColor, backgroundImage, boxShadow, delay }) => (
  <Box
    as={motion.div}
    animate={{ height: `${height}%`, backgroundColor, boxShadow }}
    style={{ backgroundImage }}
    transition={{ type: 'spring', stiffness: 500, damping: 25, delay }}
    w="8px"
    minH="5px"
    borderRadius="full"
  />
));

const MicVisualizer = ({
  isListening,
  setIsSpeaking,
  setMicError,
  dynamicThreshold = VOICE_THRESHOLD,
  onSilence
}) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const hasSpokenRef = useRef(false);
  const speakingDebounceRef = useRef(null);
  const speechStartTimeRef = useRef(null);

  const [barHeights, setBarHeights] = useState(Array(NUM_BARS).fill(5));
  const [isVisuallySpeaking, setIsVisuallySpeaking] = useState(false);
  const [isMicReady, setIsMicReady] = useState(false);

  const [inactiveColor, readyColor, activeColor1, activeColor2, indicatorColor] = useToken('colors', [
    'slate.200', 'brand.300', 'brand.400', 'accent.400', 'accent.500',
  ]);
  const activeGradient = useMemo(() => `linear-gradient(to top, ${activeColor1}, ${activeColor2})`, [activeColor1, activeColor2]);

  // Clean up function to prevent overlapping audio nodes
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speakingDebounceRef.current) {
      clearTimeout(speakingDebounceRef.current);
      speakingDebounceRef.current = null;
    }
    // We don't close the Context here, but we disconnect the source
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
  }, []);

  useEffect(() => {
    const setupAudio = async () => {
      if (!window.micStream) {
        try {
          window.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log("[MicVisualizer] Microphone access granted.");
        } catch (err) {
          console.error("[MicVisualizer] Mic access error:", err);
          if (setMicError) {
            let errorDetails = { desc: 'Could not access the microphone.' };
            if (err.name === 'NotFoundError') { errorDetails = { desc: 'Please connect a mic.' }; }
            else if (err.name === 'NotAllowedError') { errorDetails = { desc: 'Please allow mic access.' }; }
            setMicError(errorDetails.desc);
          }
          return;
        }
      }

      if (!audioContextRef.current) {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;
        } catch (e) {
          console.error("[MicVisualizer] AudioContext error:", e);
          if (setMicError) setMicError("Audio context failed to start.");
          return;
        }
      }

      if (audioContextRef.current.state === 'suspended') {
        console.log("[MicVisualizer] Resuming suspended AudioContext...");
        await audioContextRef.current.resume();
      }

      // Re-create analyzer chain ONLY if it doesn't exist
      if (!analyserRef.current) {
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContextRef.current.createMediaStreamSource(window.micStream);
        source.connect(analyser);

        analyserRef.current = analyser;
        sourceRef.current = source;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        setIsMicReady(true);
      }

      visualize();
    };

    const visualize = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      const sliceWidth = Math.floor(dataArrayRef.current.length / NUM_BARS);

      const update = () => {
        if (!analyserRef.current) return;

        const dataArray = dataArrayRef.current;
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        const currentSpeaking = average > Math.max(VOICE_THRESHOLD, dynamicThreshold);

        // Update visual state immediately for bars
        setIsVisuallySpeaking(currentSpeaking);

        // Debounce the parent notification to prevent "flickering" or overlapping alerts
        if (currentSpeaking !== isVisuallySpeaking) {
          console.log(`[VAD] Transition: ${currentSpeaking ? "Speaking" : "Quiet"}`);
          if (speakingDebounceRef.current) clearTimeout(speakingDebounceRef.current);
          speakingDebounceRef.current = setTimeout(() => {
            if (setIsSpeaking) setIsSpeaking(currentSpeaking && isListening);
          }, 50);
        }

        if (isListening) {
          if (currentSpeaking) {
            if (!hasSpokenRef.current) {
              // Track when speech FIRST started to avoid micro-spikes
              if (!speechStartTimeRef.current) speechStartTimeRef.current = Date.now();
              if (Date.now() - speechStartTimeRef.current > 200) { // MIN_SPEECH_DURATION
                hasSpokenRef.current = true;
                console.log("[VAD] Valid speech duration reached (200ms).");
              }
            }
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
          } else if (hasSpokenRef.current && !silenceTimerRef.current) {
            console.log("[VAD] Silence detected while listening, starting timeout...");
            silenceTimerRef.current = setTimeout(() => {
              console.log("[VAD] Silence timeout reached (1400ms), stopping capture.");
              if (onSilence) onSilence();
              hasSpokenRef.current = false;
              speechStartTimeRef.current = null;
              silenceTimerRef.current = null;
            }, 1400); // Optimized silence timeout
          } else if (!currentSpeaking) {
            // Reset start time if we were just seeing noise
            speechStartTimeRef.current = null;
          }
        } else {
          hasSpokenRef.current = false;
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }

        const newHeights = [];
        for (let i = 0; i < NUM_BARS; i++) {
          const baseHeight = (dataArray[i * sliceWidth] / 255) * 80;
          const finalHeight = 5 + baseHeight + (currentSpeaking && isListening ? 15 : 0);
          newHeights.push(Math.min(100, finalHeight));
        }
        setBarHeights(newHeights);
        animationFrameRef.current = requestAnimationFrame(update);
      };

      update();
    };

    setupAudio();

    return () => {
      cleanupAudio();
    };
  }, [isListening, dynamicThreshold, onSilence, cleanupAudio, setIsSpeaking, setMicError, isVisuallySpeaking]);

  return (
    <HStack spacing={1.5} h="60px" w="120px" mx="auto" align="flex-end" justify="center" position="relative">
      <AnimatePresence>
        {barHeights.map((height, i) => {
          let backgroundColor = inactiveColor;
          let backgroundImage = 'none';
          let boxShadow = 'none';
          if (isMicReady) {
            const isThresholdMet = isVisuallySpeaking && isListening;
            if (isListening && isVisuallySpeaking) {
              backgroundColor = activeColor1;
              backgroundImage = activeGradient;
            } else {
              backgroundColor = readyColor;
            }
            if (isThresholdMet) { boxShadow = `0 0 15px 2px ${indicatorColor}`; }
          }
          return (<MotionBar key={i} height={height} backgroundColor={backgroundColor} backgroundImage={backgroundImage} boxShadow={boxShadow} delay={`${i * 15}ms`} />);
        })}
      </AnimatePresence>
    </HStack>
  );
};

export default MicVisualizer;