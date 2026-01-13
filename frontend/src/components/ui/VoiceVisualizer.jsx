import React, { useEffect, useRef, useState } from 'react';
import { HStack, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const NUM_BARS = 24;

const VoiceVisualizer = ({ isListening }) => {
    const [audioData, setAudioData] = useState(new Array(NUM_BARS).fill(10));
    const [isRealAudio, setIsRealAudio] = useState(true);

    // Refs for audio processing
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        // Reset state when listening toggles
        if (!isListening) {
            cleanupAudio();
            if (isMounted) setAudioData(new Array(NUM_BARS).fill(4)); // Idle state (small dots)
            return;
        }

        const initAudio = async () => {
            try {
                // Attempt to grab audio stream for visualization
                // Note: In some browsers, running this alongside WebSpeechAPI might cause issues.
                // We wrap in try/catch to fall back to simulated visualization if needed.
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // CRITICAL: Check if mounted before using the stream
                if (!isMounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;

                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 64; // Low resolution for bars
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                if (isMounted) {
                    setIsRealAudio(true);
                    animate();
                }
            } catch (err) {
                console.warn("[VoiceVisualizer] Could not initialize real audio visualization (likely concurrent mic usage). Falling back to simulation.", err);
                if (isMounted) setIsRealAudio(false);
            }
        };

        const animate = () => {
            if (!analyserRef.current || !isMounted) return;

            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            // Map frequency data to our bars
            // We'll take a subset or average to fit NUM_BARS
            // fftSize 64 gives 32 bins. We have 24 bars.
            // Let's just grab the first 24 relevant bins
            const newHeights = Array.from(dataArray).slice(0, NUM_BARS).map(val => {
                // Value is 0-255. Map to percentage height 10%-100%
                const percent = (val / 255) * 100;
                return Math.max(percent, 10); // Min height 10%
            });

            if (isMounted) {
                setAudioData(newHeights);
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        initAudio();

        return () => {
            isMounted = false;
            cleanupAudio();
        };
    }, [isListening]);

    const cleanupAudio = () => {
        // Stop all media tracks explicitly
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            streamRef.current = null;
        }

        // Close Audio Context
        if (audioContextRef.current) {
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(e => console.warn("Error closing AudioContext:", e));
            }
            audioContextRef.current = null;
        }

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    // Render Logic
    return (
        <HStack spacing={1} h="100%" align="center" justify="center" w="full">
            {isListening ? (
                isRealAudio ? (
                    // Real Audio Visualization
                    audioData.map((height, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.05, ease: "linear" }}
                            style={{
                                width: '6px',
                                backgroundColor: '#6366F1', // Indigo/Brand
                                borderRadius: '4px',
                            }}
                        />
                    ))
                ) : (
                    // Fallback Simulated Visualization (Random)
                    Array.from({ length: NUM_BARS }).map((_, i) => (
                        <motion.div
                            key={`sim-${i}`}
                            animate={{
                                height: [
                                    `${Math.random() * 30 + 10}%`,
                                    `${Math.random() * 80 + 20}%`,
                                    `${Math.random() * 30 + 10}%`
                                ],
                            }}
                            transition={{
                                duration: 0.2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.05,
                            }}
                            style={{
                                width: '6px',
                                backgroundColor: '#6366F1',
                                borderRadius: '4px',
                            }}
                        />
                    ))
                )
            ) : (
                // Idle State
                Array.from({ length: NUM_BARS }).map((_, i) => (
                    <Box
                        key={`idle-${i}`}
                        w="6px"
                        h="4px"
                        bg="gray.300"
                        borderRadius="full"
                    />
                ))
            )}
        </HStack>
    );
};

export default VoiceVisualizer;
