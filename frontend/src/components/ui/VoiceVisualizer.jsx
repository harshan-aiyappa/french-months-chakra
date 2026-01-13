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

    // Dedicated Unmount Cleanup
    useEffect(() => {
        return () => {
            // Force cleanup on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(e => console.warn(e));
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        let localStream = null;
        let localAudioContext = null;
        let localAnimationId = null;

        // Reset state when listening toggles
        if (!isListening) {
            cleanupAudio();
            if (isMounted) setAudioData(new Array(NUM_BARS).fill(4)); // Idle state (small dots)
            return;
        }

        const initAudio = async () => {
            // ... (rest of logic)
            try {
                // Attempt to grab audio stream for visualization
                // Note: In some browsers, running this alongside WebSpeechAPI might cause issues.
                // We wrap in try/catch to fall back to simulated visualization if needed.
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // CRITICAL: Strict check immediately after acquisition
                if (!isMounted) {
                    stream.getTracks().forEach(track => {
                        track.stop();
                        track.enabled = false;
                    });
                    return;
                }

                localStream = stream;
                streamRef.current = stream; // Keep ref for external access if needed

                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                localAudioContext = audioContext;
                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 64; // Low resolution for bars
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                const animate = () => {
                    if (!analyser || !isMounted) return;

                    const dataArray = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(dataArray);

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
                        localAnimationId = requestAnimationFrame(animate);
                        animationRef.current = localAnimationId;
                    }
                };

                if (isMounted) {
                    setIsRealAudio(true);
                    animate();
                }
            } catch (err) {
                console.warn("[VoiceVisualizer] Could not initialize real audio visualization (likely concurrent mic usage). Falling back to simulation.", err);
                if (isMounted) setIsRealAudio(false);
            }
        };

        initAudio();

        // CLOSURE-SAFE CLEANUP
        // This runs when isListening changes OR component unmounts
        return () => {
            isMounted = false;

            if (localStream) {
                localStream.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
            }
            if (localAudioContext) {
                localAudioContext.close().catch(e => console.warn(e));
            }
            if (localAnimationId) {
                cancelAnimationFrame(localAnimationId);
            }
            // Also clear refs to be safe
            streamRef.current = null;
            audioContextRef.current = null;
        };
    }, [isListening]);

    const cleanupAudio = async () => {
        // Stop all media tracks explicitly
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            streamRef.current = null;
        }

        // Close Audio Context Aggressively
        if (audioContextRef.current) {
            try {
                if (audioContextRef.current.state !== 'closed') {
                    await audioContextRef.current.close();
                }
            } catch (e) {
                console.warn("Error closing AudioContext:", e);
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
                // Idle State - Pulsing low bars
                Array.from({ length: NUM_BARS }).map((_, i) => (
                    <motion.div
                        key={`idle-${i}`}
                        animate={{ height: ["10%", "15%", "10%"] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '6px',
                            background: 'linear-gradient(to top, #a78bfa, #22d3ee)',
                            borderRadius: '4px',
                            opacity: 0.3
                        }}
                    />
                ))
            )}
        </HStack>
    );
};

export default VoiceVisualizer;
