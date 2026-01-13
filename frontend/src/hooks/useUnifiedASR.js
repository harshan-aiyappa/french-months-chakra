import { useState, useCallback, useEffect, useRef } from 'react';
import useSpeechRecognition from './useSpeechRecognition';
import useLiveKit from './useLiveKit';
import { detectBestASRMode, ASR_ENGINE_TYPES } from '../utils/asrService';

/**
 * useUnifiedASR - The "Master Hook"
 * 
 * Abstraction layer that handles Native, Hybrid, and Auto ASR modes.
 * Provides a consistent API for components to start/stop listening and receive transcripts.
 */
const useUnifiedASR = ({ onResult, onError, onStart, onStatusChange, selectedMode = 'native' }) => {
    const [activeEngine, setActiveEngine] = useState(null); // 'native' | 'hybrid'
    const [isThinking, setIsThinking] = useState(false); // For "Auto" mode detection phase

    // --- NATIVE ENGINE ---
    const nativeEngine = useSpeechRecognition({
        onResult: (text) => {
            if (activeEngine === ASR_ENGINE_TYPES.NATIVE) onResult(text);
        },
        onError: (err) => {
            if (activeEngine === ASR_ENGINE_TYPES.NATIVE) onError(err);
        },
        onStart: () => {
            if (activeEngine === ASR_ENGINE_TYPES.NATIVE) {
                if (onStart) onStart();
                if (onStatusChange) onStatusChange('listening', 'Microphone Active (Native)');
            }
        }
    });

    const nativeEngineRef = useRef(nativeEngine);
    useEffect(() => {
        nativeEngineRef.current = nativeEngine;
    }, [nativeEngine]);

    // --- HYBRID ENGINE ---
    const hybridEngine = useLiveKit({
        onResult: (text) => {
            if (activeEngine === ASR_ENGINE_TYPES.HYBRID) onResult(text);
        },
        onError: (err) => {
            if (activeEngine === ASR_ENGINE_TYPES.HYBRID) onError(err);
        },
        onStart: () => {
            if (activeEngine === ASR_ENGINE_TYPES.HYBRID && onStart) onStart();
        },
        onStatusChange: (status, message) => {
            if (activeEngine === ASR_ENGINE_TYPES.HYBRID && onStatusChange) {
                onStatusChange(status, message);
            }
        }
    });

    const hybridEngineRef = useRef(hybridEngine);
    useEffect(() => {
        hybridEngineRef.current = hybridEngine;
    }, [hybridEngine]);

    /**
     * Start Listening Logic
     * Handles the selection logic (especially for 'auto' mode)
     */
    const startListening = useCallback(async (options = {}) => {
        const { url, token } = options;

        // 1. Determine which engine to use
        let engineToUse = selectedMode;

        if (selectedMode === 'auto') {
            setIsThinking(true);
            engineToUse = await detectBestASRMode();
            setIsThinking(false);

            if (!engineToUse) {
                onError('no-asr-supported');
                return;
            }
        }

        setActiveEngine(engineToUse);

        // 2. Start the selected engine
        if (engineToUse === ASR_ENGINE_TYPES.HYBRID) {
            if (!url || !token) {
                console.warn("[Unified ASR] Hybrid selected but no credentials provided. Falling back to Native.");
                setActiveEngine(ASR_ENGINE_TYPES.NATIVE);
                nativeEngine.startListening();
            } else {
                await hybridEngine.startHybridASR(url, token);
            }
        } else {
            nativeEngine.startListening();
        }
    }, [selectedMode, hybridEngine, nativeEngine, onError]);

    /**
     * Stop Listening Logic
     */
    const activeEngineRef = useRef(null);

    useEffect(() => {
        activeEngineRef.current = activeEngine;
    }, [activeEngine]);

    // ...

    /**
     * Stop Listening Logic
     */
    const stopListening = useCallback(async () => {
        // Using ref to avoid dependency on activeEngine or engine instances
        const currentEngine = activeEngineRef.current;

        if (currentEngine === ASR_ENGINE_TYPES.HYBRID) {
            const engine = hybridEngineRef.current;
            if (engine && engine.stopHybridASR) await engine.stopHybridASR();
        }

        // Always try to stop native just in case
        const nEngine = nativeEngineRef.current;
        if (nEngine && nEngine.stopListening) nEngine.stopListening();

        setActiveEngine(null);
    }, []);

    const isListening = activeEngine === ASR_ENGINE_TYPES.HYBRID
        ? hybridEngine.isTranscribing
        : nativeEngine.isListening;

    const error = activeEngine === ASR_ENGINE_TYPES.HYBRID
        ? hybridEngine.error
        : nativeEngine.error;

    return {
        startListening,
        stopListening,
        isListening,
        isConnecting: hybridEngine.isConnecting || isThinking,
        activeEngine,
        error,
        liveKitRoom: hybridEngine.room,
        liveKitTrack: hybridEngine.localTrack
    };
};

export default useUnifiedASR;
