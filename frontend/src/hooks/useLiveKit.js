import { useState, useCallback, useRef, useEffect } from 'react';
import {
    Room,
    RoomEvent,
    VideoPresets,
    Track,
    createLocalAudioTrack
} from 'livekit-client';

/**
 * useLiveKit - Hybrid ASR Hook
 * Manages WebRTC connection to LiveKit and receives Whisper transcripts.
 */
const useLiveKit = ({ onResult, onError, onStart, onStatusChange }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState(null);

    const roomRef = useRef(null);
    const audioTrackRef = useRef(null);

    // Callback refs to prevent re-initialization
    const callbacks = useRef({ onResult, onError, onStart, onStatusChange });
    useEffect(() => {
        callbacks.current = { onResult, onError, onStart, onStatusChange };
    }, [onResult, onError, onStart, onStatusChange]);

    /**
     * Connect to LiveKit Room and start publishing audio
     */
    const startHybridASR = useCallback(async (url, token) => {
        if (!url || !token) {
            console.error("[Hybrid ASR] Missing URL or Token");
            setError('missing-auth');
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);
            if (callbacks.current.onStatusChange) callbacks.current.onStatusChange('connecting', 'Establishing secure link...');

            // ... (rest of logic) ...

            // 1. Initialize Room
            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
            });
            roomRef.current = room;

            // 2. Setup Event Listeners
            room.on(RoomEvent.DataReceived, (payload) => {
                // ... handled ...
                const decoder = new TextDecoder();
                const data = JSON.parse(decoder.decode(payload));
                if (data.type === 'transcript' && data.is_final && callbacks.current.onResult) {
                    callbacks.current.onResult(data.text.toLowerCase().trim());
                }
            });

            room.on(RoomEvent.Disconnected, () => {
                console.log("[Hybrid ASR] Disconnected from room");
                setIsConnected(false);
                setIsTranscribing(false);
                if (callbacks.current.onStatusChange) callbacks.current.onStatusChange('disconnected', 'Link Terminated');
            });

            // 3. Connect to Room
            await room.connect(url, token);
            setIsConnected(true);
            if (callbacks.current.onStatusChange) callbacks.current.onStatusChange('connected', 'Connected to LiveKit Neural Grid');
            console.log("[Hybrid ASR] Connected to LiveKit Room:", room.name);

            // 4. Capture and Publish Mic Track (WebRTC Stream)
            const audioTrack = await createLocalAudioTrack({
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            });

            await room.localParticipant.publishTrack(audioTrack);
            audioTrackRef.current = audioTrack;

            setIsTranscribing(true);
            if (callbacks.current.onStart) callbacks.current.onStart();

        } catch (err) {
            console.error("[Hybrid ASR] Connection failed:", err);
            setError(err.message);
            setIsConnecting(false);
            if (callbacks.current.onError) callbacks.current.onError(err.message);
            if (callbacks.current.onStatusChange) callbacks.current.onStatusChange('error', 'Connection Failed');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    /**
     * Stop publishing and disconnect
     */
    const stopHybridASR = useCallback(async () => {
        if (audioTrackRef.current) {
            audioTrackRef.current.stop();
            audioTrackRef.current = null;
        }
        if (roomRef.current) {
            await roomRef.current.disconnect();
            roomRef.current = null;
        }
        setIsConnected(false);
        setIsTranscribing(false);
    }, []);

    return {
        startHybridASR,
        stopHybridASR,
        isConnecting,
        isConnected,
        isTranscribing,
        error
    };
};

export default useLiveKit;
